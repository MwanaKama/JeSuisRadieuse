import React, { useEffect, useMemo, useRef, useState } from 'react';

import { fetchPickupPoints } from '../services/storeApi';
import type { MondialRelayPoint, PickupPoint } from '../types/shop';
import './MondialRelayPicker.css';

interface MondialRelayPickerProps {
  address: string;
  postalCode: string;
  country?: string;
  limit?: number;
  onSelect: (point: MondialRelayPoint) => void;
  selectedPoint?: MondialRelayPoint | null;
}

declare global {
  interface Window {
    $?: any;
    jQuery?: any;
  }
}

const JQUERY_CDN = 'https://code.jquery.com/jquery-3.7.1.min.js';
const MONDIAL_RELAY_WIDGET_URL =
  'https://widget.mondialrelay.com/parcelshop-picker/v4_0/scripts/jquery.plugin.mondialrelay.parcelshoppicker.min.js';

function loadScriptOnce(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`Impossible de charger: ${src}`)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Impossible de charger: ${src}`));
    document.head.appendChild(script);
  });
}

function mapWidgetDataToPoint(data: any, fallbackCountry: string): MondialRelayPoint {
  return {
    id: String(data?.Num || data?.ID || ''),
    name: String(data?.LgAdr1 || data?.Name || 'Point relais'),
    address: String([data?.LgAdr2, data?.LgAdr3, data?.LgAdr4].filter(Boolean).join(' ').trim() || data?.Address || ''),
    postalCode: String(data?.CP || data?.PostCode || ''),
    city: String(data?.Ville || data?.City || ''),
    country: String(data?.Pays || data?.Country || fallbackCountry),
    latitude: data?.Latitude ? Number(data.Latitude) : undefined,
    longitude: data?.Longitude ? Number(data.Longitude) : undefined,
  };
}

const MondialRelayPicker: React.FC<MondialRelayPickerProps> = ({
  address,
  postalCode,
  country = 'FR',
  limit = 15,
  onSelect,
  selectedPoint,
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [widgetReady, setWidgetReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const normalizedCountry = useMemo(() => (country || 'FR').toUpperCase(), [country]);
  const canInit = postalCode.trim().length >= 4;
  const widgetBrand = (import.meta as any).env?.VITE_MONDIAL_RELAY_BRAND || 'CC20GQ7Y';

  useEffect(() => {
    let cancelled = false;

    async function initWidget() {
      if (!canInit || !widgetRef.current) {
        return;
      }

      try {
        await loadScriptOnce(JQUERY_CDN);
        await loadScriptOnce(MONDIAL_RELAY_WIDGET_URL);

        if (cancelled || !widgetRef.current) {
          return;
        }

        const $ = window.jQuery || window.$;
        if (!$ || !$.fn || !$.fn.MR_ParcelShopPicker) {
          throw new Error('Widget Mondial Relay indisponible.');
        }

        $(widgetRef.current).empty();

        $(widgetRef.current).MR_ParcelShopPicker({
          Brand: widgetBrand,
          Country: normalizedCountry,
          PostCode: postalCode,
          ColLivMod: '24R',
          NbResults: Math.min(limit, 30),
          Responsive: true,
          ShowResultsOnMap: true,
          OnParcelShopSelected: (data: any) => {
            onSelect(mapWidgetDataToPoint(data, normalizedCountry));
          },
        });

        if (!cancelled) {
          setWidgetReady(true);
          setError('');
        }
      } catch {
        if (!cancelled) {
          setWidgetReady(false);
        }
      }
    }

    initWidget();

    return () => {
      cancelled = true;
    };
  }, [canInit, limit, normalizedCountry, onSelect, postalCode, widgetBrand]);

  useEffect(() => {
    let cancelled = false;

    async function loadPoints() {
      if (!canInit || widgetReady) {
        setPoints([]);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const result = await fetchPickupPoints(postalCode, normalizedCountry, address, limit);
        if (!cancelled) {
          setPoints(result);
        }
      } catch (apiError) {
        if (!cancelled) {
          setError(apiError instanceof Error ? apiError.message : 'Impossible de charger les points relais.');
          setPoints([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPoints();

    return () => {
      cancelled = true;
    };
  }, [address, canInit, limit, normalizedCountry, postalCode, widgetReady]);

  function handleSelect(point: PickupPoint) {
    const selected: MondialRelayPoint = {
      id: point.id,
      name: point.name,
      address: point.address,
      postalCode: point.postalCode,
      city: point.city,
      country: point.country,
      latitude: point.latitude,
      longitude: point.longitude,
    };

    onSelect(selected);
  }

  return (
    <div className="mr-picker-wrap">
      <div className="mr-picker-header">
        <p className="text-sm font-semibold text-purple-900">Choisir un point Mondial Relay</p>
        <p className="text-xs text-gray-500">Code postal: {postalCode || 'Non renseigné'} · Adresse: {address || 'Non renseignée'}</p>
      </div>

      {!canInit && (
        <div className="mr-picker-status">
          Entrez un code postal valide pour afficher les points relais proches.
        </div>
      )}

      {canInit && (
        <>
          {!widgetReady && isLoading && <div className="mr-picker-status">Chargement des points relais proches...</div>}
          {widgetReady && <div className="mr-picker-status">Widget officiel Mondial Relay chargé.</div>}
          {error && !widgetReady && <div className="mr-picker-status text-red-600">{error}</div>}

          <div ref={widgetRef} className="mr-widget-host" />

          {!widgetReady && !isLoading && !error && points.length === 0 && (
            <div className="mr-picker-status">Aucun point relais trouvé pour ce secteur.</div>
          )}

          {!widgetReady && points.length > 0 && (
            <div className="mr-points-list">
              {points.map((point) => {
                const isSelected = selectedPoint?.id === point.id;
                return (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => handleSelect(point)}
                    className={`mr-point-card ${isSelected ? 'is-selected' : ''}`}
                  >
                    <div className="mr-point-main">
                      <p className="mr-point-name">{point.name}</p>
                      <p className="mr-point-line">{point.address}</p>
                      <p className="mr-point-line">{point.postalCode} {point.city}</p>
                    </div>
                    <div className="mr-point-side">
                      <span className="mr-point-id">#{point.id}</span>
                      {point.latitude && point.longitude && (
                        <a
                          href={`https://www.google.com/maps?q=${point.latitude},${point.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mr-point-map-link"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Voir carte
                        </a>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}

      {selectedPoint && (
        <div className="mr-selected-point">
          <p className="mr-selected-point-title">Point relais sélectionné</p>
          <p className="mr-selected-point-line">{selectedPoint.name}</p>
          <p className="mr-selected-point-line">
            {selectedPoint.address} {selectedPoint.postalCode} {selectedPoint.city}
          </p>
          {selectedPoint.latitude && selectedPoint.longitude && (
            <p className="mr-selected-point-line">
              GPS: {selectedPoint.latitude}, {selectedPoint.longitude}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MondialRelayPicker;
