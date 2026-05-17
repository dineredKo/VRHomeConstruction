/**
 * Карточка макета.
 * @module widgets/LayoutsGrid/ui/LayoutCard
 */

import React from 'react';
import classNames from 'classnames';
import styles from './LayoutCard.module.scss';
import OptionsIcon from '@/shared/ui/icons/options.svg'

interface LayoutCardProps {
  id: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
  onMenuClick?: (id: string) => void;
}

export const LayoutCard: React.FC<LayoutCardProps> = ({ id, name, isActive, onClick, onMenuClick }) => {
  return (
    <div 
      className={classNames(styles.layoutCard, {
        [styles.highlighted]: isActive,
      })}
      onClick={onClick}
    >
      <div className={styles.layoutTop} />
      <div className={styles.layoutBottom}>
        <div className={styles.layoutInfo}>
          <div className={styles.layoutName}>{name}</div>
          <div className={styles.layoutDescription}>Макет</div>
        </div>
        <button 
          className={styles.menuButton} 
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(id);
          }}
        >
          <OptionsIcon className={styles.menuIcon} />
        </button>
      </div>
    </div>
  );
};