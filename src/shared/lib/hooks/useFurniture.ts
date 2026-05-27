/**
 * Хук useFurniture.
 * Предоставляет доступ к состоянию мебели и действиям по её управлению.
 * @module shared/lib/hooks/useFurniture
 */

import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { actions } from '@/features/furniture/slice';
import { selectors } from '@/features/furniture/selectors';
import { getModelName } from '@/shared/utils/getModelName';
import type { FurnitureItem } from '@/features/furniture/types';

export function useFurniture() {
  const dispatch = useDispatch();

  const items = useSelector(selectors.selectFurnitureItems);
  const selectedFurniture = useSelector(selectors.selectSelectedFurniture);
  const showModal = useSelector(selectors.selectShowFurnitureModal);
  const selectedPath = useSelector(selectors.selectSelectedFurniturePath);

  /** Установить путь к выбранной модели */
  const setSelectedPath = useCallback((path: string | undefined) => {
    dispatch(actions.setSelectedFurniturePath(path));
  }, [dispatch]);

  /** Добавить новый предмет мебели на сцену */
  const addFurniture = useCallback((point: { x: number; z: number }, toolActive: boolean) => {
    if (!toolActive || !selectedPath) return false;
    dispatch(actions.addFurniture({
      id: `furn_${Date.now()}`,
      name: getModelName(selectedPath),
      modelPath: selectedPath,
      position: [point.x, 0, point.z],
      scale: 1,
      rotation: [0, 0, 0],
    }));
    return true;
  }, [dispatch, selectedPath]);

  /** Выделить предмет мебели */
  const selectFurniture = useCallback((id: string) => {
    dispatch(actions.selectFurniture(id));
  }, [dispatch]);

  /** Обновить предмет мебели */
  const updateFurniture = useCallback((item: FurnitureItem) => {
    dispatch(actions.updateFurniture(item));
  }, [dispatch]);

  /** Удалить предмет мебели */
  const deleteFurniture = useCallback((id: string) => {
    dispatch(actions.removeFurniture(id));
  }, [dispatch]);

  /** Закрыть модальное окно мебели */
  const closeModal = useCallback(() => {
    dispatch(actions.hideFurnitureModal());
  }, [dispatch]);

  /** Обработчик готовности модели (измерены размеры) */
  const onReady = useCallback((itemId: string, info: { halfWidth: number; halfDepth: number; height: number }) => {
    dispatch(actions.setFurnitureReady({
      itemId,
      sizes: {
        halfWidth: info.halfWidth,
        halfDepth: info.halfDepth,
        height: info.height,
      },
    }));
  }, [dispatch]);

  return {
    items,
    selectedFurniture,
    showModal,
    selectedPath,
    setSelectedPath,
    addFurniture,
    selectFurniture,
    updateFurniture,
    deleteFurniture,
    closeModal,
    onReady,
  };
}