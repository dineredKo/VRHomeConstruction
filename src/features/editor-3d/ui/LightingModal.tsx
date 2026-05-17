/**
 * Модальное окно настройки освещения.
 * Позволяет изменять интенсивность направленного света и яркость окружающего освещения.
 * @module editor-3d/ui/LightingModal
 */

import React from 'react';

interface LightingModalProps {
  intensity: number;
  ambientIntensity: number;
  onApply: (intensity: number, ambientIntensity: number) => void;
  onClose: () => void;
}

/**
 * Компонент модального окна управления освещением.
 * Изменения применяются мгновенно при движении ползунков.
 */
export const LightingModal: React.FC<LightingModalProps> = ({
  intensity,
  ambientIntensity,
  onApply,
  onClose,
}) => {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 12, padding: 24, minWidth: 300
      }} onClick={e => e.stopPropagation()}>
        <h3>Освещение</h3>
        <div style={{ marginBottom: 16 }}>
          <label>Интенсивность</label>
          <input
            type="range"
            min={0}
            max={3}
            step={0.1}
            value={intensity}
            onChange={e => onApply(parseFloat(e.target.value), ambientIntensity)}
            style={{ width: '100%' }}
          />
          <span>{intensity.toFixed(1)}</span>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Яркость</label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={ambientIntensity}
            onChange={e => onApply(intensity, parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <span>{ambientIntensity.toFixed(1)}</span>
        </div>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};