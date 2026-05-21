import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import type { Project } from '@/features/create-project/types';
import type { RootState } from '@/app/store';
import styles from './ProjectEditorPage.module.scss';

/**
 * Страница редактора проекта.
 * Загружает данные проекта при монтировании, сбрасывает при уходе,
 * и автоматически сохраняет изменения на бэкенд с задержкой 2 секунды.
 * @module pages/project-editor/ui/ProjectEditorPage
 */
export const ProjectEditorPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useSelector((state: RootState) =>
    CreateProjectFeature.selectors.selectProjects(state).find((p: Project) => p.id === projectId)
  );

  const editor = useEditor();
  const furniture = useFurniture();
  const [showLighting, setShowLighting] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ======= АВТОСОХРАНЕНИЕ =======
  // Собираем текущее состояние редактора
  const roomData = {
    dimensions: editor.dimensions,
    colors: editor.colors,
    light: editor.light,
    viewMode: editor.viewMode,
    activeTool: editor.activeTool,
    openings: editor.openings,
    partitions: editor.partitions,
    partitionColors: editor.partitionColors,
    viewedWallId: editor.viewedWallId,
    furnitureItems: furniture.items,
  };

  useEffect(() => {
    if (!project) return;

    // Сбрасываем предыдущий таймер
    if (saveTimer.current) clearTimeout(saveTimer.current);

    // Ставим новый таймер на 2 секунды
    saveTimer.current = setTimeout(() => {
      // Отправляем PUT /api/projects/:id
      fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomData }),
      }).catch(console.error);
    }, 2000);

    // Очистка таймера при размонтировании
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [roomData, project]);

  // ======= ЗАГРУЗКА ДАННЫХ ПРИ СМЕНЕ ПРОЕКТА =======
  useEffect(() => {
    if (project?.roomData) {
      editor.loadProjectData(project.roomData);
      furniture.loadFurniture(project.roomData.furnitureItems ?? []);
    } else {
      editor.resetEditor();
      furniture.resetFurniture();
    }

    return () => {
      editor.resetEditor();
      furniture.resetFurniture();
    };
  }, [project?.id]);

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