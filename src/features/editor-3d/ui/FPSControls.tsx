import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import {
  CAMERA_MARGIN,
  CAMERA_HEIGHT_FIXED,
  MOVEMENT_SPEED,
  SPRINT_SPEED,
  MOUSE_SENSITIVITY,
  PITCH_LIMIT,
  FORWARD_VECTOR,
  RIGHT_VECTOR,
  KEY_W,
  KEY_S,
  KEY_A,
  KEY_D,
  KEY_SHIFT_LEFT,
  KEY_SHIFT_RIGHT,
} from '../constants';

interface FPSControlsProps {
  roomWidth: number;
  roomDepth: number;
  wallThickness?: number;
}

/**
 * Управление камерой от первого лица:
 * - Зажатая левая кнопка мыши вращает камеру
 * - WASD перемещает по комнате
 * - Shift ускоряет движение
 * Ограничивает камеру внутри комнаты.
 */
export const FPSControls: React.FC<FPSControlsProps> = ({
  roomWidth,
  roomDepth,
  wallThickness = 0.2,
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

    const onMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        mouseDown.current = true;
        prevMouse.current = { x: e.clientX, y: e.clientY };
      }
    };
    const onMouseUp = (e: MouseEvent) => {
      if (e.button === 0) mouseDown.current = false;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!mouseDown.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      prevMouse.current = { x: e.clientX, y: e.clientY };

      yaw.current -= dx * MOUSE_SENSITIVITY;
      pitch.current -= dy * MOUSE_SENSITIVITY;
      pitch.current = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, pitch.current));
    };
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
  }, [gl, minX, maxX, minZ, maxZ]);

  useFrame((_, delta) => {
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;

    const speed = keys.current.has(KEY_SHIFT_LEFT) || keys.current.has(KEY_SHIFT_RIGHT)
      ? SPRINT_SPEED
      : MOVEMENT_SPEED;

    const move = new Vector3();
    if (keys.current.has(KEY_W)) move.z -= 1;
    if (keys.current.has(KEY_S)) move.z += 1;
    if (keys.current.has(KEY_A)) move.x -= 1;
    if (keys.current.has(KEY_D)) move.x += 1;

    if (move.length() > 0) {
      move.normalize().multiplyScalar(speed * delta);
      const forward = new Vector3(...FORWARD_VECTOR).applyQuaternion(camera.quaternion);
      const right = new Vector3(...RIGHT_VECTOR).applyQuaternion(camera.quaternion);
      forward.y = 0; right.y = 0;
      forward.normalize(); right.normalize();

      camera.position.addScaledVector(forward, -move.z);
      camera.position.addScaledVector(right, move.x);
    }

    camera.position.x = Math.max(minX, Math.min(maxX, camera.position.x));
    camera.position.z = Math.max(minZ, Math.min(maxZ, camera.position.z));
    camera.position.y = CAMERA_HEIGHT_FIXED;
  });

  return null;
};