import React from 'react';
import styles from './EditorSidebar.module.scss';
import { modelPaths, getModelName } from '@/features/furniture/modelList';
import type { Tool } from '@/features/editor-3d/types';

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
  const [tab, setTab] = React.useState<'doors' | 'partitions' | 'furniture' | 'lighting'>('doors');

  return (
    <aside className={styles.sidebar}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab === 'doors' ? styles.active : ''}`} onClick={() => setTab('doors')}>🚪 Окна/двери</button>
        <button className={`${styles.tab} ${tab === 'partitions' ? styles.active : ''}`} onClick={() => setTab('partitions')}>🧱 Перегородки</button>
        <button className={`${styles.tab} ${tab === 'furniture' ? styles.active : ''}`} onClick={() => setTab('furniture')}>🛋️ Мебель</button>
        <button className={`${styles.tab} ${tab === 'lighting' ? styles.active : ''}`} onClick={() => setTab('lighting')}>💡 Освещение</button>
      </div>

      {tab === 'doors' && (
        <div className={styles.section}>
          <h3>Добавить проём</h3>
          <button className={`${styles.toolBtn} ${activeTool === 'window' ? styles.active : ''}`} onClick={() => onToolChange('window')}>Окно</button>
          <button className={`${styles.toolBtn} ${activeTool === 'door' ? styles.active : ''}`} onClick={() => onToolChange('door')}>Дверь</button>
          <p className={styles.hint}>Выберите инструмент и кликните по стене или перегородке</p>
        </div>
      )}

      {tab === 'partitions' && (
        <div className={styles.section}>
          <button className={`${styles.toolBtn} ${activeTool === 'partition' ? styles.active : ''}`} onClick={() => onToolChange('partition')}>Перегородка</button>
          <p className={styles.hint}>Выберите инструмент и кликните по стене, чтобы создать перегородку</p>
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
          <p className={styles.hint}>Настройте интенсивность и цвет света в комнате</p>
          <button className={styles.toolBtn} onClick={onLightingClick}>⚙️ Настройки освещения</button>
        </div>
      )}
    </aside>
  );
};