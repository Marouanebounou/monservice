import React from 'react';
import './PageLoader.css';

const PageLoader = () => {
  return (
    <div className="page-loader-overlay">
      <div className="page-loader"></div>
    </div>
  );
};

export default PageLoader;