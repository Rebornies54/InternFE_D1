import React from 'react';
import { ChevronDown } from 'lucide-react';
import './SortComments.css';

const SortComments = ({ currentSort, onSortChange }) => {
  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'most_liked', label: 'Nhiều like nhất' }
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