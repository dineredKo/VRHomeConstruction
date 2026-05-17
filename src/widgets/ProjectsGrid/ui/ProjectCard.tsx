import React from 'react';
import { Project } from '@/features/create-project/types';
import classNames from 'classnames';
import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  project: Project;
  isActive: boolean;
  onClick: () => void;
  onMenuToggle: (id: string) => void;
  activeMenuId: string | null;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  isActive, 
  onClick, 
  onMenuToggle, 
  activeMenuId 
}) => {
  return (
    <div 
      className={classNames(styles.projectCard, {
        [styles.highlighted]: isActive,
      })}
      onClick={onClick}
    >
      <div className={styles.cardTop} />
      <div className={styles.cardBottom}>
        <div className={styles.cardInfo}>
          <div className={styles.projectName}>{project.name}</div>
          <div className={styles.projectDescription}>
            {project.template} #{project.number}
          </div>
        </div>
        <button 
          className={styles.menuButton}
          onClick={(e) => {
            e.stopPropagation();
            onMenuToggle(project.id);
          }}
        >
          ⋮
        </button>
      </div>
    </div>
  );
};