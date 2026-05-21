import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { actions } from '@/features/editor-3d/slice';
import { selectors } from '@/features/editor-3d/selectors';
import { WALL_THICKNESS } from '@/features/editor-3d/constants';
import type { RoomDimensions } from '@/features/editor-3d/ui/EditorScene';
import type { RoomColors, ViewMode, Tool, Opening, Partition, LightConfig, EditorState } from '@/features/editor-3d/types';
/**
 * Хук useEditor.
 * Предоставляет доступ ко всем состояниям и действиям редактора 3D-сцены, включая загрузку данных проекта и сброс.
 * @module shared/lib/hooks/useEditor
 */
export function useEditor() {
  const dispatch = useDispatch();

  const dimensions = useSelector(selectors.selectDimensions);
  const colors = useSelector(selectors.selectColors);
  const light = useSelector(selectors.selectLight);
  const viewMode = useSelector(selectors.selectViewMode);
  const activeTool = useSelector(selectors.selectActiveTool);
  const openings = useSelector(selectors.selectOpenings);
  const viewedWallId = useSelector(selectors.selectViewedWallId);
  const selectedOpening = useSelector(selectors.selectSelectedOpening);
  const partitions = useSelector(selectors.selectPartitions);
  const selectedPartition = useSelector(selectors.selectSelectedPartition);
  const partitionColors = useSelector(selectors.selectPartitionColors);

  /** Установить размеры комнаты */
  const setDimensions = useCallback((dims: RoomDimensions) => dispatch(actions.setDimensions(dims)), [dispatch]);
  /** Установить цвета */
  const setColors = useCallback((cols: RoomColors) => dispatch(actions.setColors(cols)), [dispatch]);
  /** Установить освещение */
  const setLight = useCallback((config: LightConfig) => dispatch(actions.setLight(config)), [dispatch]);
  /** Установить режим просмотра */
  const setViewMode = useCallback((mode: ViewMode) => dispatch(actions.setViewMode(mode)), [dispatch]);
  /** Установить активный инструмент */
  const setActiveTool = useCallback((tool: Tool) => dispatch(actions.setActiveTool(tool)), [dispatch]);
  /** Установить просматриваемую стену */
  const setViewedWallId = useCallback((id: string) => dispatch(actions.setViewedWallId(id)), [dispatch]);

  /** Запросить создание проёма */
  const createOpening = useCallback((wallId: string, point: { x: number; y: number }) => {
    dispatch(actions.createOpeningRequested({ wallId, point }));
  }, [dispatch]);

  /** Выбрать проём для редактирования */
  const selectOpening = useCallback((wallId: string, openingId: string, wallWidth: number, wallHeight: number) => {
    const opening = openings[wallId]?.find((o: Opening) => o.id === openingId);
    if (opening) {
      dispatch(actions.setSelectedOpening({ wallId, opening, wallWidth, wallHeight }));
    }
  }, [dispatch, openings]);

  /** Обновить проём */
  const updateOpening = useCallback((updated: Opening) => {
    if (selectedOpening) {
      dispatch(actions.updateOpening({ wallId: selectedOpening.wallId, opening: updated }));
    }
  }, [dispatch, selectedOpening]);

  /** Удалить проём */
  const deleteOpening = useCallback((openingId: string) => {
    if (selectedOpening) {
      dispatch(actions.removeOpening({ wallId: selectedOpening.wallId, openingId }));
      dispatch(actions.setSelectedOpening(null));
    }
  }, [dispatch, selectedOpening]);

  /** Снять выделение с проёма */
  const clearSelectedOpening = useCallback(() => {
    dispatch(actions.setSelectedOpening(null));
  }, [dispatch]);

  /** Добавить перегородку */
  const addPartition = useCallback((point: { x: number; z: number }, wallId?: string) => {
    const id = `part_${Date.now()}`;
    const maxWidth = Math.min(dimensions.width, dimensions.depth);
    const defaultSize: [number, number, number] = [Math.min(1.0, maxWidth), dimensions.height, 0.1];
    let position: [number, number, number] = [point.x, dimensions.height / 2, point.z];
    let rotation: [number, number, number] = [0, 0, 0];

    if (wallId) {
      const halfW = defaultSize[0] / 2;
      const innerX = dimensions.width / 2 - WALL_THICKNESS;
      const innerZ = dimensions.depth / 2 - WALL_THICKNESS;

      switch (wallId) {
        case 'front':
          position = [point.x, dimensions.height / 2, innerZ - halfW];
          rotation = [0, Math.PI / 2, 0];
          break;
        case 'back':
          position = [point.x, dimensions.height / 2, -innerZ + halfW];
          rotation = [0, Math.PI / 2, 0];
          break;
        case 'left':
          position = [-innerX + halfW, dimensions.height / 2, point.z];
          rotation = [0, 0, 0];
          break;
        case 'right':
          position = [innerX - halfW, dimensions.height / 2, point.z];
          rotation = [0, 0, 0];
          break;
        default: break;
      }
    }

    dispatch(actions.addPartition({
      id,
      position,
      rotation,
      size: defaultSize,
      openings: [],
    }));
    return id;
  }, [dispatch, dimensions]);

  /** Обновить перегородку */
  const updatePartition = useCallback((partition: Partition) => {
    dispatch(actions.updatePartition(partition));
  }, [dispatch]);

  /** Удалить перегородку */
  const deletePartition = useCallback((id: string) => {
    dispatch(actions.removePartition(id));
  }, [dispatch]);

  /** Выбрать перегородку */
  const selectPartition = useCallback((partition: Partition) => {
    dispatch(actions.setSelectedPartition(partition));
  }, [dispatch]);

  /** Снять выделение с перегородки */
  const clearSelectedPartition = useCallback(() => {
    dispatch(actions.setSelectedPartition(null));
  }, [dispatch]);

  /** Добавить проём в перегородку */
  const addOpeningToPartition = useCallback((partitionId: string, opening: Opening) => {
    dispatch(actions.addOpeningToPartition({ partitionId, opening }));
  }, [dispatch]);

  /** Удалить проём из перегородки */
  const removeOpeningFromPartition = useCallback((partitionId: string, openingId: string) => {
    dispatch(actions.removeOpeningFromPartition({ partitionId, openingId }));
  }, [dispatch]);

  /** Загрузить состояние редактора из данных проекта */
  const loadProjectData = useCallback((data: Partial<EditorState>) => {
    dispatch(actions.loadProjectData(data));
  }, [dispatch]);

  /** Сбросить редактор в начальное состояние */
  const resetEditor = useCallback(() => {
    dispatch(actions.resetEditor());
  }, [dispatch]);

  return {
    dimensions,
    colors,
    light,
    viewMode,
    activeTool,
    openings,
    viewedWallId,
    selectedOpening,
    partitions,
    partitionColors,
    selectedPartition,
    setDimensions,
    setColors,
    setLight,
    setViewMode,
    setActiveTool,
    setViewedWallId,
    createOpening,
    selectOpening,
    updateOpening,
    deleteOpening,
    clearSelectedOpening,
    addPartition,
    updatePartition,
    deletePartition,
    selectPartition,
    clearSelectedPartition,
    addOpeningToPartition,
    removeOpeningFromPartition,
    loadProjectData,
    resetEditor,
  };
}