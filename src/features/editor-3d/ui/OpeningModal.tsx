import React, { useState, useEffect } from 'react';
import type { Opening } from '../types';

interface OpeningModalProps {
  opening: Opening;
  wallId: string;
  wallWidth: number;   
  wallHeight: number;  
  onSave: (updated: Opening) => void;
  onDelete: (openingId: string) => void;
  onClose: () => void;
}

export const OpeningModal: React.FC<OpeningModalProps> = ({
  opening,
  wallId,
  wallWidth,
  wallHeight,
  onSave,
  onDelete,
  onClose,
}) => {
  const [width, setWidth] = useState(opening.width);
  const [height, setHeight] = useState(opening.height);
  const [posX, setPosX] = useState(opening.position[0]);
  const [posY, setPosY] = useState(opening.position[1]);
  const [type, setType] = useState(opening.type);

  const halfW = wallWidth / 2;
  const halfH = wallHeight / 2;
  const percentX = Math.round(((posX + halfW) / wallWidth) * 100);
  const percentY = Math.round(((posY + halfH) / wallHeight) * 100);

  useEffect(() => {
    onSave({ ...opening, width, height, position: [posX, posY], type });
  }, [width, height, posX, posY, type]);

  const handlePercentX = (value: number) => {
    const newX = (value / 100) * wallWidth - halfW;
    setPosX(Math.round(newX * 100) / 100);
  };

  const handlePercentY = (value: number) => {
    const newY = (value / 100) * wallHeight - halfH;
    setPosY(Math.round(newY * 100) / 100);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 12, padding: 24, minWidth: 320, maxWidth: 400,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Редактировать {type === 'window' ? 'окно' : 'дверь'}</h3>
        <p>Стена: {wallId}</p>
        
        <div style={{ marginBottom: 12 }}>
          <label>Тип: </label>
          <select value={type} onChange={e => setType(e.target.value as 'window' | 'door')}>
            <option value="window">Окно</option>
            <option value="door">Дверь</option>
          </select>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Позиция X (вдоль стены): {percentX}%</label>
          <input
            type="range" min="0" max="100" value={percentX}
            onChange={e => handlePercentX(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Позиция Y (вверх): {percentY}%</label>
          <input
            type="range" min="0" max="100" value={percentY}
            onChange={e => handlePercentY(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Ширина (м): </label>
          <input type="number" value={width} onChange={e => setWidth(parseFloat(e.target.value))} step="0.05" min="0.1" style={{ width: 80 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Высота (м): </label>
          <input type="number" value={height} onChange={e => setHeight(parseFloat(e.target.value))} step="0.05" min="0.1" style={{ width: 80 }} />
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
          <button onClick={() => onDelete(opening.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>
            🗑️ Удалить
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose}>Отмена</button>
            <button onClick={onClose}>Готово</button>
          </div>
        </div>
      </div>
    </div>
  );
};