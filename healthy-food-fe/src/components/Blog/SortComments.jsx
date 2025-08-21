import React from 'react';
import { ChevronDown } from 'lucide-react';
import { SORT_OPTIONS } from '../../constants';
import './SortComments.css';

const SortComments = ({ currentSort, onSortChange }) => {
  const sortOptions = SORT_OPTIONS;

  return (
    <div className="sort-comments">
      <div className="sort-dropdown">
        <select 
          value={currentSort} 
          onChange={(e) => onSortChange(e.target.value)}
          className="sort-select"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="sort-icon" />
      </div>
    </div>
  );
};

export default SortComments; 