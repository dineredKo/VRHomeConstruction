import React, { useState, useEffect } from 'react';
import { Partition } from '../types';
import { WALL_THICKNESS } from '../constants';

interface PartitionModalProps {
  partition: Partition;
  roomWidth: number;
  roomDepth: number;
  roomHeight: number;
  onUpdate: (updated: Partition) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export const PartitionModal: React.FC<PartitionModalProps> = ({
  partition,
  roomWidth,
  roomDepth,
  roomHeight,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const [width, setWidth] = useState(partition.size[0]);
  const [height, setHeight] = useState(partition.size[1]);
  const [thickness, setThickness] = useState(partition.size[2]);
  const [posX, setPosX] = useState(partition.position[0]);
  const [posY, setPosY] = useState(partition.position[1]);
  const [posZ, setPosZ] = useState(partition.position[2]);
  const [rotY, setRotY] = useState(() => {
    let deg = partition.rotation[1] * (180 / Math.PI);
    deg = ((deg % 360) + 360) % 360;
    return deg;
  });
  const [color, setColor] = useState(partition.color || '#c0b0a0');

  useEffect(() => {
    setColor(partition.color || '#c0b0a0');
  }, [partition.color]);

  const innerHalfWidth = roomWidth / 2 - WALL_THICKNESS;
  const innerHalfDepth = roomDepth / 2 - WALL_THICKNESS;

  useEffect(() => {
    let clampedX = posX;
    let clampedZ = posZ;

    if (Math.abs(rotY % 180) < 1 || Math.abs(rotY % 180) > 179) {
      const halfW = width / 2;
      clampedX = Math.min(innerHalfWidth - halfW, Math.max(-innerHalfWidth + halfW, posX));
      const halfD = thickness / 2;
      clampedZ = Math.min(innerHalfDepth - halfD, Math.max(-innerHalfDepth + halfD, posZ));
    } else {
      const halfW = width / 2;
      clampedZ = Math.min(innerHalfDepth - halfW, Math.max(-innerHalfDepth + halfW, posZ));
      const halfD = thickness / 2;
      clampedX = Math.min(innerHalfWidth - halfD, Math.max(-innerHalfWidth + halfD, posX));
    }

    if (clampedX !== posX || clampedZ !== posZ) {
      setPosX(clampedX);
      setPosZ(clampedZ);
    }
  }, [posX, posZ, width, thickness, rotY, innerHalfWidth, innerHalfDepth]);

  useEffect(() => {
    onUpdate({
      ...partition,
      size: [width, height, thickness],
      position: [posX, posY, posZ],
      rotation: [0, rotY * Math.PI / 180, 0],
      color,
    });
  }, [width, height, thickness, posX, posY, posZ, rotY, color]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
      <div style={{ background: 'white', borderRadius: 12, padding: 24, minWidth: 360, maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <h3>Редактировать перегородку</h3>
        <div><label>Ширина (м)</label><input type="number" step="0.1" min={0.1} max={Math.max(roomWidth, roomDepth)} value={width} onChange={e => setWidth(parseFloat(e.target.value))} /></div>
        <div><label>Высота (м)</label><input type="number" step="0.1" min={0.1} max={roomHeight} value={height} onChange={e => setHeight(parseFloat(e.target.value))} /></div>
        <div><label>Толщина (м)</label><input type="number" step="0.01" min={0.05} value={thickness} onChange={e => setThickness(parseFloat(e.target.value))} /></div>
        <div><label>Позиция X</label><input type="range" min={-roomWidth/2} max={roomWidth/2} step="0.1" value={posX} onChange={e => setPosX(parseFloat(e.target.value))} /></div>
        <div><label>Позиция Y</label><input type="range" min={0} max={roomHeight} step="0.1" value={posY} onChange={e => setPosY(parseFloat(e.target.value))} /></div>
        <div><label>Позиция Z</label><input type="range" min={-roomDepth/2} max={roomDepth/2} step="0.1" value={posZ} onChange={e => setPosZ(parseFloat(e.target.value))} /></div>
        <div><label>Поворот Y (градусы)</label><input type="range" min={0} max={360} value={rotY} onChange={e => setRotY(parseFloat(e.target.value))} /></div>
        <div>
          <label>Цвет</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} />
          <button onClick={() => setColor('#c0b0a0')} style={{ marginLeft: 8 }}>🎨 Выбрать цвет стены</button>
        </div>
        <button onClick={() => onDelete(partition.id)}>Удалить перегородку</button>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};