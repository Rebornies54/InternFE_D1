import React from 'react';
import { BLOG_TABS, BLOG_TAB_LABELS } from '../../../../constants';
import './BlogTabs.css';

const BlogTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="blog-tabs">
      <button 
        className={`tab-button ${activeTab === BLOG_TABS.BLOG ? 'active' : ''}`}
        onClick={() => onTabChange(BLOG_TABS.BLOG)}
      >
        {BLOG_TAB_LABELS.BLOG}
      </button>
      <button 
        className={`tab-button ${activeTab === BLOG_TABS.MENU ? 'active' : ''}`}
        onClick={() => onTabChange(BLOG_TABS.MENU)}
      >
        {BLOG_TAB_LABELS.MENU_LIST}
      </button>
    </div>
  );
};

export default BlogTabs;
