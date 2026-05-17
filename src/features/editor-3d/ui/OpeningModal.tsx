/**
 * Модальное окно редактирования проёма (окна или двери).
 * Позволяет изменять тип, размеры и позицию проёма с мгновенным применением через ползунки.
 * @module editor-3d/ui/OpeningModal
 */

import React, { useState, useEffect } from 'react';
import { Opening } from '../types';

interface OpeningModalProps {
  opening: Opening;
  wallId: string;
  wallWidth: number;
  wallHeight: number;
  onSave: (updated: Opening) => void;
  onDelete: (openingId: string) => void;
  onClose: () => void;
}

/**
 * Компонент модального окна для редактирования параметров проёма.
 * Изменения применяются мгновенно через эффект.
 */
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
    onSave({
      ...opening,
      width,
      height,
      position: [posX, posY],
      type,
    });
  }, [width, height, posX, posY, type]);

  const handlePercentX = (val: number) => {
    const x = (val / 100) * wallWidth - halfW;
    const clampedX = Math.max(-halfW + width / 2, Math.min(halfW - width / 2, x));
    setPosX(Math.round(clampedX * 100) / 100);
  };

  const handlePercentY = (val: number) => {
    const y = (val / 100) * wallHeight - halfH;
    const clampedY = Math.max(-halfH + height / 2, Math.min(halfH - height / 2, y));
    setPosY(Math.round(clampedY * 100) / 100);
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
        <h3>Редактировать {type === 'window' ? 'окно' : 'дверь'}</h3>
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
          <input type="range" min="0" max="100" value={percentX} onChange={e => handlePercentX(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Позиция Y (вверх): {percentY}%</label>
          <input type="range" min="0" max="100" value={percentY} onChange={e => handlePercentY(Number(e.target.value))} style={{ width: '100%' }} />
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
          <button onClick={() => onDelete(opening.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6 }}>
            🗑️ Удалить
          </button>
          <button onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
};