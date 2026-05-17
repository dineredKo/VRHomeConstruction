/**
 * Модальное окно редактирования мебели.
 * Позволяет изменять позицию, масштаб и поворот с мгновенным применением через ползунки.
 * @module furniture/ui/FurnitureModal
 */

import React, { useState } from 'react';
import type { FurnitureItem } from '../types';

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
 * Компонент модального окна для редактирования параметров мебели.
 * Изменения применяются мгновенно при движении ползунков.
 */
export const FurnitureModal: React.FC<FurnitureModalProps> = React.memo(({
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

  const halfW = roomWidth / 2;
  const halfD = roomDepth / 2;

  const percentX = Math.round(((posX + halfW) / roomWidth) * 100);
  const percentZ = Math.round(((posZ + halfD) / roomDepth) * 100);

  const modelHeight = item.height ?? 0.5;
  const halfH = (modelHeight / 2) * scale;
  const minY = -halfH;                  // низ модели на полу (Y=0), центр на -halfH
  const maxY = roomHeight - halfH;      // верх модели у потолка
  const rangeY = maxY - minY;
  const percentY = rangeY > 0 ? Math.round(((posY - minY) / rangeY) * 100) : 0;

  const update = (
    newX: number, newY: number, newZ: number,
    newScale: number,
    newRot: [number, number, number]
  ) => {
    onUpdate({ ...item, position: [newX, newY, newZ], scale: newScale, rotation: newRot });
  };

  const handlePercentX = (val: number) => {
    const x = (val / 100) * roomWidth - halfW;
    setPosX(x);
    update(x, posY, posZ, scale, [rotX * Math.PI / 180, rotY * Math.PI / 180, rotZ * Math.PI / 180]);
  };
  const handlePercentY = (val: number) => {
    const y = minY + (val / 100) * rangeY;
    setPosY(y);
    update(posX, y, posZ, scale, [rotX * Math.PI / 180, rotY * Math.PI / 180, rotZ * Math.PI / 180]);
  };
  const handlePercentZ = (val: number) => {
    const z = (val / 100) * roomDepth - halfD;
    setPosZ(z);
    update(posX, posY, z, scale, [rotX * Math.PI / 180, rotY * Math.PI / 180, rotZ * Math.PI / 180]);
  };
  const handleScale = (val: number) => {
    setScale(val);
    update(posX, posY, posZ, val, [rotX * Math.PI / 180, rotY * Math.PI / 180, rotZ * Math.PI / 180]);
  };
  const handleRotX = (val: number) => { setRotX(val); update(posX, posY, posZ, scale, [val * Math.PI / 180, rotY * Math.PI / 180, rotZ * Math.PI / 180]); };
  const handleRotY = (val: number) => { setRotY(val); update(posX, posY, posZ, scale, [rotX * Math.PI / 180, val * Math.PI / 180, rotZ * Math.PI / 180]); };
  const handleRotZ = (val: number) => { setRotZ(val); update(posX, posY, posZ, scale, [rotX * Math.PI / 180, rotY * Math.PI / 180, val * Math.PI / 180]); };

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
        <input type="range" min="-50" max="100" value={percentY} onChange={e => handlePercentY(Number(e.target.value))} style={{ width: '100%' }} />
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
});