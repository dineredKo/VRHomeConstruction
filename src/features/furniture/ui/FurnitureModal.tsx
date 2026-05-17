import React, { useState, useEffect } from 'react';
import type { FurnitureItem } from '../types';
import {
  FURNITURE_MARGIN_XZ,
  FURNITURE_MARGIN_Y,
  DEFAULT_MODEL_HALF_WIDTH,
  DEFAULT_MODEL_HALF_DEPTH,
  DEFAULT_MODEL_HEIGHT,
} from '@/features/editor-3d/constants';

interface FurnitureModalProps {
  item: FurnitureItem;
  roomWidth: number;
  roomDepth: number;
  roomHeight: number;
  onUpdate: (updated: FurnitureItem) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

/**
 * Модальное окно для редактирования мебели (позиция, масштаб, поворот).
 * Принимает реальные размеры комнаты и модели, автоматически ограничивает диапазоны ползунков.
 */
export const FurnitureModal: React.FC<FurnitureModalProps> = ({
  item,
  roomWidth,
  roomDepth,
  roomHeight,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const [posX, setPosX] = useState(item.position[0]);
  const [posY, setPosY] = useState(item.position[1]);
  const [posZ, setPosZ] = useState(item.position[2]);
  const [scale, setScale] = useState(item.scale);
  const [rotX, setRotX] = useState(item.rotation[0] * (180 / Math.PI));
  const [rotY, setRotY] = useState(item.rotation[1] * (180 / Math.PI));
  const [rotZ, setRotZ] = useState(item.rotation[2] * (180 / Math.PI));

  // Синхронизируем локальное состояние с item при каждом изменении item
  useEffect(() => {
    setPosX(item.position[0]);
    setPosY(item.position[1]);
    setPosZ(item.position[2]);
    setScale(item.scale);
    setRotX(item.rotation[0] * (180 / Math.PI));
    setRotY(item.rotation[1] * (180 / Math.PI));
    setRotZ(item.rotation[2] * (180 / Math.PI));
  }, [item]);

  // Реальная высота модели
  const modelHeight = item.height ?? DEFAULT_MODEL_HEIGHT;
  const halfW = (item.halfWidth ?? DEFAULT_MODEL_HALF_WIDTH) * scale;
  const halfD = (item.halfDepth ?? DEFAULT_MODEL_HALF_DEPTH) * scale;
  const h = modelHeight * scale;

  // Границы с учётом отступов
  const marginX = (roomWidth * FURNITURE_MARGIN_XZ) / 100;
  const marginZ = (roomDepth * FURNITURE_MARGIN_XZ) / 100;
  const marginY = (roomHeight * FURNITURE_MARGIN_Y) / 100;

  const minX = -roomWidth / 2 + halfW + marginX;
  const maxX = roomWidth / 2 - halfW - marginX;
  const minZ = -roomDepth / 2 + halfD + marginZ;
  const maxZ = roomDepth / 2 - halfD - marginZ;
  const minY = h / 2 + marginY;
  const maxY = roomHeight - h / 2 - marginY;

  const rangeX = maxX - minX;
  const rangeZ = maxZ - minZ;
  const rangeY = maxY - minY;

  const percentX = rangeX > 0 ? Math.round(((posX - minX) / rangeX) * 100) : 0;
  const percentZ = rangeZ > 0 ? Math.round(((posZ - minZ) / rangeZ) * 100) : 0;
  const percentY = rangeY > 0 ? Math.round(((posY - minY) / rangeY) * 100) : 0;

  const createUpdatedItem = (overrides: Partial<FurnitureItem>): FurnitureItem => ({
    ...item,
    position: [posX, posY, posZ],
    scale,
    rotation: [rotX * Math.PI / 180, rotY * Math.PI / 180, rotZ * Math.PI / 180],
    ...overrides,
  });

  const handlePercentX = (val: number) => {
    const x = minX + (val / 100) * rangeX;
    setPosX(x);
    onUpdate(createUpdatedItem({ position: [x, posY, posZ] }));
  };
  const handlePercentY = (val: number) => {
    const y = minY + (val / 100) * rangeY;
    setPosY(y);
    onUpdate(createUpdatedItem({ position: [posX, y, posZ] }));
  };
  const handlePercentZ = (val: number) => {
    const z = minZ + (val / 100) * rangeZ;
    setPosZ(z);
    onUpdate(createUpdatedItem({ position: [posX, posY, z] }));
  };
  const handleScale = (val: number) => {
    setScale(val);
    onUpdate(createUpdatedItem({ scale: val }));
  };
  const handleRotX = (val: number) => { setRotX(val); onUpdate(createUpdatedItem({ rotation: [val * Math.PI / 180, rotY * Math.PI / 180, rotZ * Math.PI / 180] })); };
  const handleRotY = (val: number) => { setRotY(val); onUpdate(createUpdatedItem({ rotation: [rotX * Math.PI / 180, val * Math.PI / 180, rotZ * Math.PI / 180] })); };
  const handleRotZ = (val: number) => { setRotZ(val); onUpdate(createUpdatedItem({ rotation: [rotX * Math.PI / 180, rotY * Math.PI / 180, val * Math.PI / 180] })); };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: 12, padding: 24, minWidth: 340, maxWidth: 420,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }} onClick={e => e.stopPropagation()}>
        <h3>{item.name}</h3>

        <label>Позиция X: {percentX}%</label>
        <input type="range" min="0" max="100" value={percentX} onChange={e => handlePercentX(Number(e.target.value))} style={{ width: '100%' }} />
        <label>Позиция Y (высота): {percentY}%</label>
        <input type="range" min="0" max="100" value={percentY} onChange={e => handlePercentY(Number(e.target.value))} style={{ width: '100%' }} />
        <label>Позиция Z: {percentZ}%</label>
        <input type="range" min="0" max="100" value={percentZ} onChange={e => handlePercentZ(Number(e.target.value))} style={{ width: '100%' }} />
        <label>Масштаб: {scale.toFixed(2)}</label>
        <input type="range" min="0.1" max="3" step="0.01" value={scale} onChange={e => handleScale(parseFloat(e.target.value))} style={{ width: '100%' }} />
        <label>Поворот X: {rotX.toFixed(0)}°</label>
        <input type="range" min="0" max="360" value={rotX} onChange={e => handleRotX(Number(e.target.value))} style={{ width: '100%' }} />
        <label>Поворот Y: {rotY.toFixed(0)}°</label>
        <input type="range" min="0" max="360" value={rotY} onChange={e => handleRotY(Number(e.target.value))} style={{ width: '100%' }} />
        <label>Поворот Z: {rotZ.toFixed(0)}°</label>
        <input type="range" min="0" max="360" value={rotZ} onChange={e => handleRotZ(Number(e.target.value))} style={{ width: '100%' }} />

        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginTop: 16 }}>
          <button onClick={() => onDelete(item.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6 }}>🗑️ Удалить</button>
          <button onClick={onClose}>Готово</button>
        </div>
      </div>
    </div>
  );
};