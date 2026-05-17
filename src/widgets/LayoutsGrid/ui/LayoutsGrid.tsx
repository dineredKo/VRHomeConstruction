import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CreateLayoutFeature } from '@/features/create-layout';
import { SearchFeature } from '@/features/search';
import { foldersActions, foldersSelectors } from '@/features/folders';
import { LayoutCard } from './LayoutCard';
import { FolderPicker } from '@/features/folders/ui/FolderPicker';
import type { Layout } from '@/features/create-layout/types';
import styles from './LayoutsGrid.module.scss';

export const LayoutsGrid = () => {
  const dispatch = useDispatch();
  const layouts = useSelector(CreateLayoutFeature.selectors.selectLayouts);
  const folders = useSelector(foldersSelectors.selectFolders);
  const highlightedIds = useSelector(SearchFeature.selectors.selectHighlightedIds);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<string[]>([]);

  useEffect(() => {
    if (highlightedIds.length === 0) {
      setVisibleIds([]);
      return;
    }
    setVisibleIds([]);
    const timer = setTimeout(() => {
      setVisibleIds(highlightedIds);
      const firstId = highlightedIds[0];
      const element = document.getElementById(`layout-${firstId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [highlightedIds]);

  const handleMenuClick = (id: string) => {
    setActiveMenuId(prev => (prev === id ? null : id));
  };

  const handleRemoveLayout = (layoutId: string) => {
    dispatch(CreateLayoutFeature.actions.removeLayout(layoutId));
    folders.forEach(folder => {
      if (folder.layoutIds.includes(layoutId)) {
        dispatch(foldersActions.removeLayoutFromFolder({ folderId: folder.id, layoutId }));
      }
    });
    setActiveMenuId(null);
  };

  const handleAddToFolder = (folderId: string) => {
    if (activeMenuId) {
      dispatch(foldersActions.addLayoutToFolder({ folderId, layoutId: activeMenuId }));
    }
    setActiveMenuId(null);
  };

  return (
    <div className={styles.layoutsGrid}>
      {layouts.map((layout: Layout) => (
        <div key={layout.id} id={`layout-${layout.id}`} style={{ position: 'relative' }}>
          <LayoutCard
            id={layout.id}
            name={layout.name}
            isActive={visibleIds.includes(layout.id)}
            onClick={() => {}}
            onMenuClick={handleMenuClick}
          />
          {activeMenuId === layout.id && (
            <div className={styles.layoutMenu}>
              <button className={styles.menuItem} onClick={() => handleRemoveLayout(layout.id)}>
                🗑️ Удалить
              </button>
              <div className={styles.folderDropdown}>
                <button className={styles.menuItem}>📁 Добавить в папку</button>
                <div className={styles.folderList}>
                  <FolderPicker onSelect={handleAddToFolder} />
                </div>
              </div>
              <button
                className={styles.menuItem}
                onClick={() => {
                  console.log('Присвоить тег макету', layout.id);
                  setActiveMenuId(null);
                }}
              >
                🏷️ Присвоить тег
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};