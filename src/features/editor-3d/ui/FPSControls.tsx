/**
 * Управление камерой от первого лица:
 * - Зажатая левая кнопка мыши вращает камеру
 * - WASD перемещает по комнате
 * - Shift ускоряет движение
 * - Ограничивает камеру внутри комнаты и не позволяет проходить сквозь перегородки.
 * @module editor-3d/ui/FPSControls
 */

import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3, Box3, Matrix4, Euler, Quaternion } from 'three';
import {
  CAMERA_MARGIN,
  CAMERA_HEIGHT_FIXED,
  MOVEMENT_SPEED,
  SPRINT_SPEED,
  MOUSE_SENSITIVITY,
  PITCH_LIMIT,
  KEY_W,
  KEY_S,
  KEY_A,
  KEY_D,
  KEY_SHIFT_LEFT,
  KEY_SHIFT_RIGHT,
} from '../constants';
import type { Partition } from '../types';

interface FPSControlsProps {
  roomWidth: number;
  roomDepth: number;
  wallThickness?: number;
  partitions?: Partition[];
}

/**
 * Компонент управления камерой от первого лица.
 * Использует хуки useThree и useFrame для управления камерой в реальном времени.
 */
export const FPSControls: React.FC<FPSControlsProps> = ({
  roomWidth,
  roomDepth,
  wallThickness = 0.2,
  partitions = [],
}) => {
  const { camera, gl } = useThree();
  const mouseDown = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const yaw = useRef(0);
  const pitch = useRef(0);
  const keys = useRef<Set<string>>(new Set());

  const minX = -roomWidth / 2 + wallThickness / 2 + CAMERA_MARGIN;
  const maxX = roomWidth / 2 - wallThickness / 2 - CAMERA_MARGIN;
  const minZ = -roomDepth / 2 + wallThickness / 2 + CAMERA_MARGIN;
  const maxZ = roomDepth / 2 - wallThickness / 2 - CAMERA_MARGIN;

  useEffect(() => {
    const canvas = gl.domElement;

    /** Запоминаем положение мыши при нажатии левой кнопки */
    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        mouseDown.current = true;
        prevMouse.current = { x: e.clientX, y: e.clientY };
      }
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) mouseDown.current = false;
    };
    /** Поворачиваем камеру на основе смещения мыши */
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDown.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      prevMouse.current = { x: e.clientX, y: e.clientY };
      yaw.current -= dx * MOUSE_SENSITIVITY;
      pitch.current -= dy * MOUSE_SENSITIVITY;
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
    };
    /** Регистрируем нажатия клавиш */
    const onKeyDown = (e: KeyboardEvent) => keys.current.add(e.code);
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.code);

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [gl]);

  useFrame((_, delta) => {
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;

    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();

    const worldUp = new Vector3(0, 1, 0);
    const right = new Vector3().crossVectors(forward, worldUp).normalize();

    const speed = keys.current.has(KEY_SHIFT_LEFT) || keys.current.has(KEY_SHIFT_RIGHT)
      ? SPRINT_SPEED
      : MOVEMENT_SPEED;

    const move = new Vector3(0, 0, 0);
    if (keys.current.has(KEY_W)) move.add(forward);
    if (keys.current.has(KEY_S)) move.add(forward.clone().negate());
    if (keys.current.has(KEY_A)) move.add(right.clone().negate());
    if (keys.current.has(KEY_D)) move.add(right);

    if (move.length() > 0) {
      move.normalize().multiplyScalar(speed * delta);

      const steps = 3;
      const stepMove = move.clone().divideScalar(steps);

      for (let s = 0; s < steps; s++) {
        const newPos = camera.position.clone().add(stepMove);
        let collision = false;

        const playerHalfSize = new Vector3(0.15, 0.8, 0.15);
        const playerBox = new Box3(
          newPos.clone().sub(playerHalfSize),
          newPos.clone().add(playerHalfSize)
        );

        for (const p of partitions) {
          const quat = new Quaternion().setFromEuler(new Euler(p.rotation[0], p.rotation[1], p.rotation[2]));
          const pMatrix = new Matrix4().compose(
            new Vector3(p.position[0], p.position[1], p.position[2]),
            quat,
            new Vector3(1, 1, 1)
          );
          const invMatrix = pMatrix.clone().invert();

          const localPlayerCenter = newPos.clone().applyMatrix4(invMatrix);
          const localPlayerBox = new Box3(
            localPlayerCenter.clone().sub(playerHalfSize),
            localPlayerCenter.clone().add(playerHalfSize)
          );

          const halfExtents = new Vector3(p.size[0] / 2, p.size[1] / 2, p.size[2] / 2);
          const partitionLocalBox = new Box3(
            new Vector3().sub(halfExtents),
            new Vector3().add(halfExtents)
          );

          if (localPlayerBox.intersectsBox(partitionLocalBox)) {
            collision = true;
            break;
          }
        }

        if (collision) break;
        else camera.position.copy(newPos);
      }
    }

    camera.position.x = Math.max(minX, Math.min(maxX, camera.position.x));
    camera.position.z = Math.max(minZ, Math.min(maxZ, camera.position.z));
    camera.position.y = CAMERA_HEIGHT_FIXED;
  });

  return null;
};