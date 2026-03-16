import React, { useEffect, useMemo, useState } from 'react';

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

const MondialRelayPicker: React.FC<MondialRelayPickerProps> = ({
  address,
  postalCode,
  country = 'FR',
  limit = 15,
  onSelect,
  selectedPoint,
}) => {
  const [points, setPoints] = useState<PickupPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const normalizedCountry = useMemo(() => (country || 'FR').toUpperCase(), [country]);
  const canInit = postalCode.trim().length >= 4;

  useEffect(() => {
    let cancelled = false;

    async function loadPoints() {
      if (!canInit) {
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
  }, [address, canInit, limit, normalizedCountry, postalCode]);

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
          {isLoading && <div className="mr-picker-status">Chargement des points relais proches...</div>}
          {error && <div className="mr-picker-status text-red-600">{error}</div>}
          {!isLoading && !error && points.length === 0 && (
            <div className="mr-picker-status">Aucun point relais trouvé pour ce secteur.</div>
          )}

          {points.length > 0 && (
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
