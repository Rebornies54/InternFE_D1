import React from 'react';
import { ChevronDown } from 'lucide-react';
import { COMMENT } from '../../constants';
import './SortComments.css';

const SortComments = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { value: COMMENT.SORT.NEWEST, label: COMMENT.SORT.LABELS.NEWEST },
    { value: COMMENT.SORT.MOST_LIKED, label: COMMENT.SORT.LABELS.MOST_LIKED }
  ];

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