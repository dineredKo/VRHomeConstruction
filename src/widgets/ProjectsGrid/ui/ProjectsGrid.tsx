/**
 * Сетка проектов на главной странице.
 * @module widgets/ProjectsGrid/ui/ProjectsGrid
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CreateProjectFeature } from '@/features/create-project';
import { SearchFeature } from '@/features/search';
import { foldersActions, foldersSelectors } from '@/features/folders';
import { ProjectCard } from './ProjectCard';
import { ProjectMenu } from '@/features/project-menu';
import type { Project } from '@/features/create-project/types';
import styles from './ProjectsGrid.module.scss';

export const ProjectsGrid = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const projects = useSelector(CreateProjectFeature.selectors.selectProjects);
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
      const element = document.getElementById(`project-${firstId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [highlightedIds]);

  const handleMenuToggle = (id: string) => {
    setActiveMenuId(prev => (prev === id ? null : id));
  };

  const handleRemoveProject = (projectId: string) => {
    dispatch(CreateProjectFeature.actions.removeProject(projectId));
    folders.forEach(folder => {
      if (folder.projectIds.includes(projectId)) {
        dispatch(foldersActions.removeProjectFromFolder({ folderId: folder.id, projectId }));
      }
    });
    setActiveMenuId(null);
  };

  return (
    <div className={styles.projectsGrid}>
      {projects.map((project: Project) => (
        <div key={project.id} id={`project-${project.id}`} style={{ position: 'relative' }}>
          <ProjectCard
            project={project}
            isActive={visibleIds.includes(project.id)}
            onClick={() => navigate(`/project/${project.id}`)}
            onMenuToggle={handleMenuToggle}
            activeMenuId={activeMenuId}
          />
          {activeMenuId === project.id && (
            <ProjectMenu
              projectId={project.id}
              onClose={() => setActiveMenuId(null)}
              onRemove={() => handleRemoveProject(project.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
};