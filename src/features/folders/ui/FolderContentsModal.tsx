import React from 'react';
import { useSelector } from 'react-redux';
import { selectors as folderSelectors } from '../selectors';
import { CreateProjectFeature } from '@/features/create-project';
import { CreateLayoutFeature } from '@/features/create-layout';
import type { Project } from '@/features/create-project/types';
import type { Layout } from '@/features/create-layout/types';
import type { Folder } from '../types';
import styles from './FolderContentsModal.module.scss';

interface FolderContentsModalProps {
  folderId: string;
  onClose: () => void;
}

export const FolderContentsModal: React.FC<FolderContentsModalProps> = ({ folderId, onClose }) => {
  const folder = useSelector((state) => folderSelectors.selectFolderById(state, folderId));
  const allProjects = useSelector(CreateProjectFeature.selectors.selectProjects);
  const allLayouts = useSelector(CreateLayoutFeature.selectors.selectLayouts);
  const allFolders = useSelector(folderSelectors.selectFolders);

  if (!folder) return null;

  const projects = allProjects.filter((p: Project) => folder.projectIds.includes(p.id));
  const layouts = allLayouts.filter((l: Layout) => folder.layoutIds.includes(l.id));
  const childFolders = allFolders.filter((f: Folder) => folder.childFolderIds.includes(f.id));

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{folder.name} – содержимое</h3>

        <div className={styles.section}>
          <span className={styles.sectionTitle}>Проекты:</span>
          <div className={styles.list}>
            {projects.length === 0 && <span className={styles.emptyText}>нет</span>}
            {projects.map((p: Project) => (
              <div className={styles.listItem} key={p.id}>📄 {p.name}</div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <span className={styles.sectionTitle}>Макеты:</span>
          <div className={styles.list}>
            {layouts.length === 0 && <span className={styles.emptyText}>нет</span>}
            {layouts.map((l: Layout) => (
              <div className={styles.listItem} key={l.id}>📐 {l.name}</div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <span className={styles.sectionTitle}>Папки:</span>
          <div className={styles.list}>
            {childFolders.length === 0 && <span className={styles.emptyText}>нет</span>}
            {childFolders.map((f: Folder) => (
              <div className={styles.listItem} key={f.id}>📁 {f.name}</div>
            ))}
          </div>
        </div>

        {projects.length === 0 && layouts.length === 0 && childFolders.length === 0 && (
          <p className={styles.emptyText}>Пока пусто</p>
        )}

        <button className={styles.closeButton} onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};