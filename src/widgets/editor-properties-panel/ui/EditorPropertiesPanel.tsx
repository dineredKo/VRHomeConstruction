import React from 'react';
import styles from './EditorPropertiesPanel.module.scss';
import { RoomDimensions } from '@/features/editor-3d/ui/EditorScene';
import type { RoomColors } from '@/features/editor-3d/types';

interface EditorPropertiesPanelProps {
  dimensions: RoomDimensions;
  onChangeDimensions: (dims: RoomDimensions) => void;
  colors: RoomColors;
  onChangeColors: (colors: RoomColors) => void;
}

export const EditorPropertiesPanel: React.FC<EditorPropertiesPanelProps> = ({
  dimensions,
  onChangeDimensions,
  colors,
  onChangeColors,
}) => {
  const handleDimChange = (field: keyof RoomDimensions) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) onChangeDimensions({ ...dimensions, [field]: val });
  };

  const handleColorChange = (field: keyof RoomColors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeColors({ ...colors, [field]: e.target.value });
  };

  return (
    <aside className={styles.panel}>
      <h3 className={styles.title}>Размеры</h3>
      <div className={styles.field}>
        <label>Ширина (м)</label>
        <input type="number" value={dimensions.width} onChange={handleDimChange('width')} step="0.1" min="1" />
      </div>
      <div className={styles.field}>
        <label>Высота (м)</label>
        <input type="number" value={dimensions.height} onChange={handleDimChange('height')} step="0.1" min="1" />
      </div>
      <div className={styles.field}>
        <label>Глубина (м)</label>
        <input type="number" value={dimensions.depth} onChange={handleDimChange('depth')} step="0.1" min="1" />
      </div>

      <h3 className={styles.title}>Цвета</h3>
      <div className={styles.field}>
        <label>Стены</label>
        <input type="color" value={colors.walls} onChange={handleColorChange('walls')} />
      </div>
      <div className={styles.field}>
        <label>Пол</label>
        <input type="color" value={colors.floor} onChange={handleColorChange('floor')} />
      </div>
      <div className={styles.field}>
        <label>Потолок</label>
        <input type="color" value={colors.ceiling} onChange={handleColorChange('ceiling')} />
      </div>
    </aside>
  );
};