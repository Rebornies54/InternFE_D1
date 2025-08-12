import React, { useState, useEffect } from 'react';
import { debugImageLoading, getFullImageUrl } from '../utils/imageUtils';

const ImageDebugger = ({ imageUrl, onDebugComplete }) => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [isDebugging, setIsDebugging] = useState(false);

  const runDebug = async () => {
    if (!imageUrl) return;
    
    setIsDebugging(true);
    try {
      const info = await debugImageLoading(imageUrl);
      setDebugInfo(info);
      if (onDebugComplete) {
        onDebugComplete(info);
      }
    } catch (error) {
      console.error('Debug failed:', error);
    } finally {
      setIsDebugging(false);
    }
  };

  useEffect(() => {
    if (imageUrl) {
      runDebug();
    }
  }, [imageUrl]);

  if (!imageUrl) {
    return <div>No image URL provided</div>;
  }

  return (
    <div style={{ 
      padding: '10px', 
      border: '1px solid #ddd', 
      borderRadius: '4px', 
      margin: '10px 0',
      fontSize: '12px'
    }}>
      <h4>Image Debug Info</h4>
      <p><strong>URL:</strong> {imageUrl}</p>
      <p><strong>Full URL:</strong> {getFullImageUrl(imageUrl)}</p>
      
      {isDebugging && <p>🔍 Debugging...</p>}
      
      {debugInfo && (
        <div>
          <p><strong>Valid URL:</strong> {debugInfo.isValidUrl ? '✅' : '❌'}</p>
          <p><strong>Accessible:</strong> {debugInfo.isAccessible ? '✅' : '❌'}</p>
          <p><strong>Preload Success:</strong> {debugInfo.preloadSuccess ? '✅' : '❌'}</p>
        </div>
      )}
      
      <button 
        onClick={runDebug} 
        disabled={isDebugging}
        style={{ 
          padding: '4px 8px', 
          fontSize: '10px',
          marginTop: '5px'
        }}
      >
        {isDebugging ? 'Debugging...' : 'Debug Again'}
      </button>
    </div>
  );
};

export default ImageDebugger;
