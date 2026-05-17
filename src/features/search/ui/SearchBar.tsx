import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchFeature } from '@/features/search';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  scope?: 'global' | 'projects' | 'folders' | 'layouts';
}

export const SearchBar: React.FC<SearchBarProps> = ({ scope = 'global' }) => {
  const dispatch = useDispatch();
  const inputValue = useSelector(SearchFeature.selectors.selectSearchInputValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(SearchFeature.actions.setSearchInputValue(value));
    dispatch(SearchFeature.actions.setSearchQuery(value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      dispatch(SearchFeature.actions.setSearchQuery(inputValue));
    }
  };

  const handleClear = () => {
    dispatch(SearchFeature.actions.setSearchInputValue(''));
    dispatch(SearchFeature.actions.clearSearch());
  };

  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder={scope === 'global' ? 'Поиск...' : `Поиск по ${scope === 'projects' ? 'проектам' : scope === 'folders' ? 'папкам' : 'макетам'}...`}
        className={styles.searchInput}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={false}
      />
      {inputValue && (
        <button className={styles.clearSearch} onClick={handleClear}>
          ✕
        </button>
      )}
    </div>
  );
};