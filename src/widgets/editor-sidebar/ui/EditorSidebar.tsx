/**
 * Боковая панель редактора с вкладками: окна/двери, мебель, освещение.
 * @module widgets/editor-sidebar/ui/EditorSidebar
 */

import React from 'react';
import styles from './EditorSidebar.module.scss';
import { modelPaths, getModelName } from '@/features/furniture/modelList';
import type { Tool } from '@/features/editor-3d/types';

import DoorIcon from '@/shared/ui/icons/door.svg'
import InterierIcon from '@/shared/ui/icons/interier.svg';
import SettingsIcon from '@/shared/ui/icons/settings.svg';

interface EditorSidebarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  selectedFurniturePath?: string;
  onSelectFurniture?: (path: string) => void;
  onLightingClick?: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  activeTool,
  onToolChange,
  selectedFurniturePath,
  onSelectFurniture,
  onLightingClick,
}) => {
  const [tab, setTab] = React.useState<'doors' | 'furniture' | 'lighting'>('doors');

  return (
    <aside className={styles.sidebar}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'doors' ? styles.active : ''}`} onClick={() => setTab('doors')}>
          <DoorIcon className={styles.toolIcon} /> Окна/двери
        </button>
        <button className={`${styles.tab} ${tab === 'furniture' ? styles.active : ''}`} onClick={() => setTab('furniture')}>
          <InterierIcon className={styles.toolIcon} /> Мебель
        </button>
        <button className={`${styles.tab} ${tab === 'lighting' ? styles.active : ''}`} onClick={() => setTab('lighting')}>
          <SettingsIcon className={styles.toolIcon} /> Освещение
        </button>
      </div>

      {tab === 'doors' && (
        <div className={styles.section}>
          <h3>Добавить проём</h3>
          <button className={`${styles.toolBtn} ${activeTool === 'window' ? styles.active : ''}`} onClick={() => onToolChange('window')}>
            <DoorIcon className={styles.toolIcon} /> Окно
          </button>
          <button className={`${styles.toolBtn} ${activeTool === 'door' ? styles.active : ''}`} onClick={() => onToolChange('door')}>
            <DoorIcon className={styles.toolIcon} /> Дверь
          </button>
          <p className={styles.hint}>Выберите инструмент и кликните по стене</p>
        </div>
      )}

      {tab === 'furniture' && (
        <div className={styles.section}>
          <h3>Мебель</h3>
          <div className={styles.furnitureList}>
            {modelPaths.map(path => (
              <button
                key={path}
                className={`${styles.furnitureBtn} ${activeTool === 'furniture' && selectedFurniturePath === path ? styles.active : ''}`}
                onClick={() => {
                  onToolChange('furniture');
                  onSelectFurniture?.(path);
                }}
              >
                {getModelName(path)}
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'lighting' && (
        <div className={styles.section}>
          <h3>Освещение</h3>
          <p className={styles.hint}>Настройте интенсивность и яркость света в комнате</p>
          <button className={styles.toolBtn} onClick={onLightingClick}>
            <SettingsIcon className={styles.toolIcon} /> Настройки освещения
          </button>
        </div>
      )}
    </aside>
  );
};