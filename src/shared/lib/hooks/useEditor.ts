import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { actions } from '@/features/editor-3d/slice';
import { selectors } from '@/features/editor-3d/selectors';
import { WALL_THICKNESS } from '@/features/editor-3d/constants';
import type { RoomDimensions } from '@/features/editor-3d/ui/EditorScene';
import type { RoomColors, ViewMode, Tool, Opening, Partition, LightConfig } from '@/features/editor-3d/types';

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

  const setDimensions = useCallback((dims: RoomDimensions) => dispatch(actions.setDimensions(dims)), [dispatch]);
  const setColors = useCallback((cols: RoomColors) => dispatch(actions.setColors(cols)), [dispatch]);
  const setLight = useCallback((config: LightConfig) => dispatch(actions.setLight(config)), [dispatch]);
  const setViewMode = useCallback((mode: ViewMode) => dispatch(actions.setViewMode(mode)), [dispatch]);
  const setActiveTool = useCallback((tool: Tool) => dispatch(actions.setActiveTool(tool)), [dispatch]);
  const setViewedWallId = useCallback((id: string) => dispatch(actions.setViewedWallId(id)), [dispatch]);

  const createOpening = useCallback((wallId: string, point: { x: number; y: number }) => {
    dispatch(actions.createOpeningRequested({ wallId, point }));
  }, [dispatch]);

  const selectOpening = useCallback((wallId: string, openingId: string, wallWidth: number, wallHeight: number) => {
    const opening = openings[wallId]?.find((o: Opening) => o.id === openingId);
    if (opening) {
      dispatch(actions.setSelectedOpening({ wallId, opening, wallWidth, wallHeight }));
    }
  }, [dispatch, openings]);

  const updateOpening = useCallback((updated: Opening) => {
    if (selectedOpening) {
      dispatch(actions.updateOpening({ wallId: selectedOpening.wallId, opening: updated }));
    }
  }, [dispatch, selectedOpening]);

  const deleteOpening = useCallback((openingId: string) => {
    dispatch(actions.deleteOpeningRequested({ openingId }));
  }, [dispatch]);

  const clearSelectedOpening = useCallback(() => {
    dispatch(actions.setSelectedOpening(null));
  }, [dispatch]);

  const addPartition = useCallback((point: { x: number; z: number }, wallId?: string) => {
    const id = `part_${Date.now()}`;
    const maxWidth = Math.min(dimensions.width, dimensions.depth);
    // размеры по умолчанию: ширина 1 м (или меньше, если комната мала), высота = высоте комнаты, толщина 0.1
    const defaultSize: [number, number, number] = [Math.min(1.0, maxWidth), dimensions.height, 0.1];
    let position: [number, number, number] = [point.x, dimensions.height / 2, point.z];
    let rotation: [number, number, number] = [0, 0, 0];

    if (wallId) {
      const halfW = defaultSize[0] / 2;
      const innerX = dimensions.width / 2 - WALL_THICKNESS; // внутренняя граница по X
      const innerZ = dimensions.depth / 2 - WALL_THICKNESS; // внутренняя граница по Z

      switch (wallId) {
        case 'front':
          // перегородка перпендикулярна передней стене, её ширина направлена внутрь (по Z)
          position = [point.x, dimensions.height / 2, innerZ - halfW];
          rotation = [0, Math.PI / 2, 0];
          break;
        case 'back':
          position = [point.x, dimensions.height / 2, -innerZ + halfW];
          rotation = [0, Math.PI / 2, 0];
          break;
        case 'left':
          // перегородка параллельна левой стене, её ширина направлена внутрь (по X)
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
      color: colors.walls,
    }));
    return id;
  }, [dispatch, dimensions, colors]);

  // ... остальные функции (updatePartition, deletePartition и т.д.) без изменений

  const updatePartition = useCallback((partition: Partition) => {
    dispatch(actions.updatePartition(partition));
  }, [dispatch]);

  const deletePartition = useCallback((id: string) => {
    dispatch(actions.removePartition(id));
  }, [dispatch]);

  const selectPartition = useCallback((partition: Partition) => {
    dispatch(actions.setSelectedPartition(partition));
  }, [dispatch]);

  const clearSelectedPartition = useCallback(() => {
    dispatch(actions.setSelectedPartition(null));
  }, [dispatch]);

  const addOpeningToPartition = useCallback((partitionId: string, opening: Opening) => {
    dispatch(actions.addOpeningToPartition({ partitionId, opening }));
  }, [dispatch]);

  const removeOpeningFromPartition = useCallback((partitionId: string, openingId: string) => {
    dispatch(actions.removeOpeningFromPartition({ partitionId, openingId }));
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
  };
}