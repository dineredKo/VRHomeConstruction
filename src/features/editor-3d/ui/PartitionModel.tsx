import React, { useMemo } from 'react';
import { Box } from '@react-three/drei';
import { DoubleSide } from 'three';
import { Html } from '@react-three/drei';
import type { Partition } from '../types';

interface PartitionModelProps {
  partition: Partition;
  color?: string;
  onClick?: (e: any) => void;
  onOpeningClick?: (openingId: string) => void;
  onWallClick?: (partitionId: string, point: { x: number; y: number }) => void;
}

export const PartitionModel: React.FC<PartitionModelProps> = ({
  partition,
  color = '#c0b0a0',
  onClick,
  onOpeningClick,
  onWallClick,
}) => {
  const parts = useMemo(() => {
    const result: { pos: [number, number, number]; size: [number, number, number] }[] = [];
    const [w, h, d] = partition.size;
    if (partition.openings.length === 0) {
      result.push({ pos: [0, 0, 0], size: [w, h, d] });
      return result;
    }
    const op = partition.openings[0];
    const [ox, oy] = op.position;
    const ohw = op.width / 2, ohh = op.height / 2;
    const bh = oy - ohh + h / 2;
    if (bh > 0.01) result.push({ pos: [0, -h / 2 + bh / 2, 0], size: [w, bh, d] });
    const th = h / 2 - (oy + ohh);
    if (th > 0.01) result.push({ pos: [0, h / 2 - th / 2, 0], size: [w, th, d] });
    const lw = ox - ohw + w / 2;
    if (lw > 0.01) result.push({ pos: [-w / 2 + lw / 2, oy, 0], size: [lw, op.height, d] });
    const rw = w / 2 - (ox + ohw);
    if (rw > 0.01) result.push({ pos: [w / 2 - rw / 2, oy, 0], size: [rw, op.height, d] });
    return result;
  }, [partition]);

  return (
    <group position={partition.position} rotation={partition.rotation}>
      {parts.map((part, i) => (
        <mesh
          key={i}
          position={part.pos}
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            if (onWallClick) {
              onWallClick(partition.id, { x: e.point.x, y: e.point.y });
            } else {
              onClick?.(e);
            }
          }}
        >
          <Box args={part.size} />
          <meshStandardMaterial color={color} side={DoubleSide} />
        </mesh>
      ))}
      {/* Синяя шестерёнка */}
      <Html
        position={[0, 0, partition.size[2] / 2 + 0.06]}
        center
        style={{ pointerEvents: 'auto' }}
        zIndexRange={[10, 20]}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
          }}
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#4A90E2',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 10,
            fontWeight: 'bold',
            boxShadow: '0 0 4px rgba(0,0,0,0.5)',
          }}
        >
          ⚙
        </div>
      </Html>
      {/* Проёмы */}
      {partition.openings.map((op) => (
        <Html
          key={op.id}
          position={[op.position[0], op.position[1], partition.size[2] / 2 + 0.06]}
          center
          style={{ pointerEvents: 'auto' }}
          zIndexRange={[10, 20]}
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              onOpeningClick?.(op.id);
            }}
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#667eea',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 10,
              fontWeight: 'bold',
              boxShadow: '0 0 4px rgba(0,0,0,0.5)',
            }}
          >
            ⚙
          </div>
        </Html>
      ))}
    </group>
  );
};