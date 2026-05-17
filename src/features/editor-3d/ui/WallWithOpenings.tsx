/**
 * Компонент стены с проёмами (окнами/дверями).
 * Автоматически разбивает стену на сегменты, исключая области проёмов, и отображает кнопки для их редактирования.
 * @module editor-3d/ui/WallWithOpenings
 */

import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { DoubleSide } from 'three';
import type { Opening } from '../types';

interface WallWithOpeningsProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number]; 
  thickness: number;
  openings: Opening[];
  onClick?: (e: any) => void;
  color?: string;
  onOpeningClick?: (openingId: string) => void;
}

/**
 * Компонент стены, мемоизирован для производительности.
 * Строит геометрию стены с вырезанными проёмами и рендерит HTML-кнопки для каждого проёма.
 */
export const WallWithOpenings: React.FC<WallWithOpeningsProps> = React.memo(({
  position,
  rotation,
  size,
  thickness,
  openings,
  onClick,
  color = '#c0b0a0',
  onOpeningClick,
}) => {
  const [wallWidth, wallHeight] = size;

  const parts = useMemo(() => {
    const result: { pos: [number, number, number]; size: [number, number, number] }[] = [];
    
    if (openings.length === 0) {
      result.push({ pos: [0, 0, 0], size: [wallWidth, wallHeight, thickness] });
      return result;
    }

    const sorted = [...openings].sort((a, b) => a.position[0] - b.position[0]);
    
    let currentX = -wallWidth / 2;
    
    for (const op of sorted) {
      const opLeft = op.position[0] - op.width / 2;
      const opRight = op.position[0] + op.width / 2;
      
      if (opLeft > currentX) {
        result.push({
          pos: [(currentX + opLeft) / 2, 0, 0],
          size: [opLeft - currentX, wallHeight, thickness]
        });
      }
      
      const opBottom = op.position[1] - op.height / 2;
      const opTop = op.position[1] + op.height / 2;
      
      const bottomHeight = opBottom - (-wallHeight / 2);
      if (bottomHeight > 0.01) {
        result.push({
          pos: [(opLeft + opRight) / 2, -wallHeight / 2 + bottomHeight / 2, 0],
          size: [op.width, bottomHeight, thickness]
        });
      }
      
      const topHeight = (wallHeight / 2) - opTop;
      if (topHeight > 0.01) {
        result.push({
          pos: [(opLeft + opRight) / 2, wallHeight / 2 - topHeight / 2, 0],
          size: [op.width, topHeight, thickness]
        });
      }
      
      currentX = opRight;
    }
    
    if (currentX < wallWidth / 2) {
      result.push({
        pos: [(currentX + wallWidth / 2) / 2, 0, 0],
        size: [wallWidth / 2 - currentX, wallHeight, thickness]
      });
    }
    
    return result;
  }, [wallWidth, wallHeight, thickness, openings]);

  return (
    <group>
      <group position={position} rotation={rotation}>
        {parts.map((part, i) => (
          <mesh key={i} position={part.pos} castShadow={false} receiveShadow onClick={onClick}>
            <boxGeometry args={part.size} />
            <meshStandardMaterial color={color} side={DoubleSide} />
          </mesh>
        ))}
        {openings.map((op) => (
          <Html
            key={op.id}
            position={[op.position[0], op.position[1], thickness / 2 + 0.06]}
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
                width: 18, height: 18, borderRadius: '50%', background: '#667eea',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 10, fontWeight: 'bold', boxShadow: '0 0 4px rgba(0,0,0,0.5)',
                userSelect: 'none'
              }}
              title="Редактировать"
            >
              ⚙
            </div>
          </Html>
        ))}
      </group>
    </group>
  );
});