import React, { useState } from 'react';

interface LightingModalProps {
  intensity: number;
  onApply: (intensity: number) => void;
  onClose: () => void;
}

export const LightingModal: React.FC<LightingModalProps> = ({ intensity, onApply, onClose }) => {
  const [localIntensity, setIntensity] = useState(intensity);

  const handleApply = () => {
    onApply(localIntensity);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 12, padding: 24, minWidth: 300 }} onClick={e => e.stopPropagation()}>
        <h3>Освещение</h3>
        <div>
          <label>Интенсивность</label>
          <input type="range" min={0} max={3} step={0.1} value={localIntensity} onChange={e => setIntensity(parseFloat(e.target.value))} />
          <span>{localIntensity.toFixed(1)}</span>
        </div>
        <button onClick={handleApply}>Применить</button>
        <button onClick={onClose}>Отмена</button>
      </div>
    </div>
  );
};