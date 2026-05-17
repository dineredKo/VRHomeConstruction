import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CreateProjectFeature } from '@/features/create-project';
import { EditorHeader } from '@/widgets/editor-header';
import { EditorSidebar } from '@/widgets/editor-sidebar';
import { EditorScene } from '@/features/editor-3d/ui/EditorScene';
import { EditorPropertiesPanel } from '@/widgets/editor-properties-panel';
import { OpeningModal } from '@/features/editor-3d/ui/OpeningModal';
import { PartitionModal } from '@/features/editor-3d/ui/PartitionModal';
import { FurnitureModal } from '@/features/furniture/ui/FurnitureModal';
import { LightingModal } from '@/features/editor-3d/ui/LightingModal';
import { useEditor } from '@/shared/lib/hooks/useEditor';
import { useFurniture } from '@/shared/lib/hooks/useFurniture';
import type { Project } from '@/features/create-project/types';
import type { RootState } from '@/app/store';
import styles from './ProjectEditorPage.module.scss';

export const ProjectEditorPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useSelector((state: RootState) =>
    CreateProjectFeature.selectors.selectProjects(state).find((p: Project) => p.id === projectId)
  );

  const editor = useEditor();
  const furniture = useFurniture();
  const [showLighting, setShowLighting] = useState(false);

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
            partitions={editor.partitions}
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
              if (editor.activeTool === 'partition') {
                const id = editor.addPartition(point);
                const newPartition = editor.partitions.find(p => p.id === id);
                if (newPartition) editor.selectPartition(newPartition);
                editor.setActiveTool('select');
              } else if (editor.activeTool === 'furniture') {
                const added = furniture.addFurniture(point, true);
                if (added) editor.setActiveTool('select');
              }
            }}
            onFurnitureClick={(item) => furniture.selectFurniture(item.id)}
            onFurnitureReady={furniture.onReady}
            onPartitionClick={(partition) => editor.selectPartition(partition)}
            onPartitionOpeningClick={(partitionId, openingId) => {}}
            onPartitionCreateOnWall={(wallId, x, z) => {
              const id = editor.addPartition({ x, z }, wallId);
              const newPartition = editor.partitions.find(p => p.id === id);
              if (newPartition) editor.selectPartition(newPartition);
              editor.setActiveTool('select');
            }}
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
      {editor.selectedPartition && (
        <PartitionModal
          partition={editor.selectedPartition}
          roomWidth={editor.dimensions.width}
          roomDepth={editor.dimensions.depth}
          roomHeight={editor.dimensions.height}
          onUpdate={(updated) => {
            editor.updatePartition(updated);
          }}
          onDelete={(id) => {
            editor.deletePartition(id);
            editor.clearSelectedPartition();
          }}
          onClose={editor.clearSelectedPartition}
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
          onApply={(intensity) => {
            editor.setLight({ intensity, color: '#ffffff' });
            setShowLighting(false);
          }}
          onClose={() => setShowLighting(false)}
        />
      )}
    </div>
  );
};