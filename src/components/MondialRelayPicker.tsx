import React, { useEffect, useMemo, useRef, useState } from 'react';

import type { MondialRelayPoint } from '../types/shop';
import './MondialRelayPicker.css';

interface MondialRelayPickerProps {
  postalCode: string;
  country?: string;
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

const MondialRelayPicker: React.FC<MondialRelayPickerProps> = ({
  postalCode,
  country = 'FR',
  onSelect,
  selectedPoint,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const normalizedCountry = useMemo(() => (country || 'FR').toUpperCase(), [country]);
  const canInit = postalCode.trim().length >= 4;

  useEffect(() => {
    let cancelled = false;

    async function initWidget() {
      if (!canInit || !hostRef.current) {
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        await loadScriptOnce(JQUERY_CDN);
        await loadScriptOnce(MONDIAL_RELAY_WIDGET_URL);

        if (cancelled || !hostRef.current) {
          return;
        }

        const $ = window.jQuery || window.$;
        if (!$ || !$.fn || !$.fn.MR_ParcelShopPicker) {
          throw new Error('Widget Mondial Relay indisponible pour le moment.');
        }

        $(hostRef.current).empty();

        // Initialisation du widget officiel Mondial Relay
        $(hostRef.current).MR_ParcelShopPicker({
          Brand: 'CC20GQ7Y',
          Country: normalizedCountry,
          PostCode: postalCode,
          ColLivMod: '24R',
          NbResults: 7,
          Responsive: true,
          ShowResultsOnMap: true,
          OnParcelShopSelected: (data: any) => {
            const point: MondialRelayPoint = {
              id: String(data?.Num || data?.ID || ''),
              name: String(data?.LgAdr1 || data?.Name || 'Point relais'),
              address: String(
                [data?.LgAdr2, data?.LgAdr3, data?.LgAdr4]
                  .filter(Boolean)
                  .join(' ')
                  .trim() || data?.Address || ''
              ),
              postalCode: String(data?.CP || data?.PostCode || ''),
              city: String(data?.Ville || data?.City || ''),
              country: String(data?.Pays || data?.Country || normalizedCountry),
              latitude: data?.Latitude ? Number(data.Latitude) : undefined,
              longitude: data?.Longitude ? Number(data.Longitude) : undefined,
            };

            onSelect(point);
          },
        });
      } catch (widgetError) {
        if (!cancelled) {
          setError(widgetError instanceof Error ? widgetError.message : 'Erreur widget Mondial Relay.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    initWidget();

    return () => {
      cancelled = true;
    };
  }, [canInit, normalizedCountry, onSelect, postalCode]);

  return (
    <div className="mr-picker-wrap">
      <div className="mr-picker-header">
        <p className="text-sm font-semibold text-purple-900">Choisir un point Mondial Relay</p>
        <p className="text-xs text-gray-500">Code postal: {postalCode || 'Non renseigné'}</p>
      </div>

      {!canInit && (
        <div className="mr-picker-status">
          Entrez un code postal valide pour afficher les points relais proches.
        </div>
      )}

      {canInit && (
        <>
          {isLoading && <div className="mr-picker-status">Chargement du widget Mondial Relay...</div>}
          {error && <div className="mr-picker-status text-red-600">{error}</div>}
          <div ref={hostRef} className="mr-widget-host" />
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
