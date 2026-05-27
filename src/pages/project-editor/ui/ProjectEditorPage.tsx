import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CreateProjectFeature } from '@/features/create-project';
import { EditorHeader } from '@/widgets/editor-header';
import { EditorSidebar } from '@/widgets/editor-sidebar';
import { EditorScene } from '@/features/editor-3d/ui/EditorScene';
import { EditorPropertiesPanel } from '@/widgets/editor-properties-panel';
import { OpeningModal } from '@/features/editor-3d/ui/OpeningModal';
import { FurnitureModal } from '@/features/furniture/ui/FurnitureModal';
import { LightingModal } from '@/features/editor-3d/ui/LightingModal';
import { useEditor } from '@/shared/lib/hooks/useEditor';
import { useFurniture } from '@/shared/lib/hooks/useFurniture';
import { actions as editorActions } from '@/features/editor-3d/slice';
import { selectors as editorSelectors } from '@/features/editor-3d/selectors';
import { selectors as furnitureSelectors } from '@/features/furniture/selectors';
import { projectsApi } from '@/app/api';
import type { Project } from '@/features/create-project/types';
import type { RootState } from '@/app/store';
import type { Opening, Partition } from '@/features/editor-3d/types';
import type { FurnitureItem } from '@/features/furniture/types';
import styles from './ProjectEditorPage.module.scss';

function flattenOpenings(openings: { [wallId: string]: Opening[] }): Opening[] {
  return Object.entries(openings).flatMap(([wallId, wallOpenings]) =>
    wallOpenings.map(o => ({ ...o, wallId }))
  );
}

function groupOpenings(openings: Opening[]): { [wallId: string]: Opening[] } {
  const grouped: { [wallId: string]: Opening[] } = {};
  for (const o of openings) {
    if (!grouped[o.wallId]) grouped[o.wallId] = [];
    grouped[o.wallId].push(o);
  }
  return grouped;
}

export const ProjectEditorPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useDispatch();
  const project = useSelector((state: RootState) =>
    CreateProjectFeature.selectors.selectProjects(state).find((p: Project) => p.id === projectId)
  );

  const editor = useEditor();
  const furniture = useFurniture();
  const [showLighting, setShowLighting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fullEditorState = useSelector(editorSelectors.selectEditor);
  const furnitureItems = useSelector(furnitureSelectors.selectFurnitureItems);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!projectId) return;

    dispatch(editorActions.setCurrentProjectId(projectId));

    projectsApi.fetchProject(projectId).then(data => {
      if (data && data.roomData) {
        const rd = data.roomData;
        dispatch(editorActions.loadRoomData({
          dimensions: rd.dimensions || { width: 4, height: 3, depth: 4 },
          colors: rd.colors || { walls: '#c0b0a0', floor: '#e8e0d0', ceiling: '#ffffff' },
          light: rd.light || { intensity: 1.2, ambientIntensity: 0.4, color: '#ffffff' },
          openings: groupOpenings(rd.openings || []),
          partitions: rd.partitions || [],
          partitionColors: (rd.partitions || []).reduce((acc: any, p: any) => {
            if (p.color) acc[p.id] = p.color;
            return acc;
          }, {}),
        }));
      }
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load project:', err);
      setLoading(false);
    });

    return () => {
      dispatch(editorActions.resetEditor());
    };
  }, [projectId, dispatch]);

  const save = useCallback(() => {
    if (!projectId || !project) return;

    const roomData = {
      dimensions: fullEditorState.dimensions,
      colors: fullEditorState.colors,
      light: fullEditorState.light,
      openings: flattenOpenings(fullEditorState.openings),
      partitions: fullEditorState.partitions.map(p => ({
        ...p,
        color: fullEditorState.partitionColors[p.id] || null,
      })),
      furniture: furnitureItems,
    };

    projectsApi.updateProject(projectId, {
      name: project.name,
      status: project.status || 'active',
      roomData,
    }).catch(err => console.error('Auto-save failed:', err));
  }, [projectId, project, fullEditorState, furnitureItems]);

  useEffect(() => {
    if (loading) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(save, 3000);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [save, loading]);

  if (loading) return <div className={styles.loading}>Загрузка проекта...</div>;
  if (!project) return <div className={styles.error}>Проект не найден</div>;

  return (
    <div className={styles.editor}>
      <EditorHeader
        projectName={project.name}
        viewMode={editor.viewMode}
        onChangeViewMode={editor.setViewMode}
        viewedWallId={editor.viewedWallId}
        onChangeViewedWall={editor.setViewedWallId}
      />
      <div className={styles.body}>
        <EditorSidebar
          activeTool={editor.activeTool}
          onToolChange={editor.setActiveTool}
          selectedFurniturePath={furniture.selectedPath}
          onSelectFurniture={furniture.setSelectedPath}
          onLightingClick={() => setShowLighting(true)}
        />
        <div className={styles.canvasArea}>
          <EditorScene
            dimensions={editor.dimensions}
            colors={editor.colors}
            light={editor.light}
            viewMode={editor.viewMode}
            openings={editor.openings}
            onWallClick={(wallId, point) => {
              if (editor.activeTool === 'window' || editor.activeTool === 'door') {
                editor.createOpening(wallId, point);
              }
            }}
            activeTool={editor.activeTool}
            viewedWallId={editor.viewMode === '2d' ? editor.viewedWallId : undefined}
            onOpeningClick={editor.selectOpening}
            furnitureItems={furniture.items}
            onFloorClick={(point) => {
              if (editor.activeTool === 'furniture') {
                const added = furniture.addFurniture(point, true);
                if (added) editor.setActiveTool('select');
              }
            }}
            onFurnitureClick={(item) => furniture.selectFurniture(item.id)}
            onFurnitureReady={furniture.onReady}
          />
        </div>
        <EditorPropertiesPanel
          dimensions={editor.dimensions}
          onChangeDimensions={editor.setDimensions}
          colors={editor.colors}
          onChangeColors={editor.setColors}
        />
      </div>
      {editor.selectedOpening && (
        <OpeningModal
          opening={editor.selectedOpening.opening}
          wallId={editor.selectedOpening.wallId}
          wallWidth={editor.selectedOpening.wallWidth}
          wallHeight={editor.selectedOpening.wallHeight}
          onSave={editor.updateOpening}
          onDelete={(id) => editor.deleteOpening(id)}
          onClose={editor.clearSelectedOpening}
        />
      )}
      {furniture.showModal && furniture.selectedFurniture && (
        <FurnitureModal
          item={furniture.selectedFurniture}
          roomWidth={editor.dimensions.width}
          roomDepth={editor.dimensions.depth}
          roomHeight={editor.dimensions.height}
          onUpdate={furniture.updateFurniture}
          onDelete={furniture.deleteFurniture}
          onClose={furniture.closeModal}
        />
      )}
      {showLighting && (
        <LightingModal
          intensity={editor.light.intensity}
          ambientIntensity={editor.light.ambientIntensity}
          onApply={(intensity, ambientIntensity) => {
            editor.setLight({ intensity, ambientIntensity, color: '#ffffff' });
          }}
          onClose={() => setShowLighting(false)}
        />
      )}
    </div>
  );
};
