import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { foldersSelectors, foldersActions } from '@/features/folders';
import { SearchFeature } from '@/features/search';
import { FolderCard } from './FolderCard';
import { FolderMenu } from '@/features/folder-menu';
import { FolderContentsModal } from '@/features/folders/ui/FolderContentsModal';
import type { Folder } from '@/features/folders/types';
import styles from './FoldersGrid.module.scss';

export const FoldersGrid = () => {
  const dispatch = useDispatch();
  const folders = useSelector(foldersSelectors.selectFolders);
  const highlightedFolderIds = useSelector(SearchFeature.selectors.selectHighlightedFolderIds);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [viewFolderId, setViewFolderId] = useState<string | null>(null);
  const [visibleIds, setVisibleIds] = useState<string[]>([]);

  useEffect(() => {
    if (highlightedFolderIds.length === 0) {
      setVisibleIds([]);
      return;
    }
    setVisibleIds([]);
    const timer = setTimeout(() => {
      setVisibleIds(highlightedFolderIds);
      const firstId = highlightedFolderIds[0];
      const element = document.getElementById(`folder-${firstId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [highlightedFolderIds]);

  const handleMenuToggle = (id: string) => {
    setActiveMenuId(prev => (prev === id ? null : id));
  };

  const handleRemoveFolder = (folderId: string) => {
    dispatch(foldersActions.removeFolder(folderId));
    folders.forEach(f => {
      if (f.childFolderIds.includes(folderId)) {
        dispatch(foldersActions.removeFolderFromFolder({ parentFolderId: f.id, childFolderId: folderId }));
      }
    });
    setActiveMenuId(null);
  };

  return (
    <div className={styles.foldersGrid}>
      {folders.map((folder: Folder) => (
        <div key={folder.id} id={`folder-${folder.id}`} style={{ position: 'relative' }}>
          <FolderCard
            folder={folder}
            isActive={visibleIds.includes(folder.id)}
            onClick={() => setViewFolderId(folder.id)}
            onMenuToggle={handleMenuToggle}
            activeMenuId={activeMenuId}
          />
          {activeMenuId === folder.id && (
            <FolderMenu
              folderId={folder.id}
              onClose={() => setActiveMenuId(null)}
              onRemove={() => handleRemoveFolder(folder.id)}
            />
          )}
        </div>
      ))}
      {viewFolderId && (
        <FolderContentsModal
          folderId={viewFolderId}
          onClose={() => setViewFolderId(null)}
        />
      )}
    </div>
  );
};