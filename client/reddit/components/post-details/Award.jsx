import React from 'react';

export default function Award({ type, emoji }) {
  
  // Optional: Fallback icons if the community didn't provide one
  const defaultIcons = {
    gold: '🏆',
    silver: '🥈',
    platinum: '💎',
    wholesome: '🦭',
    fire: '🔥',
    heart: '❤️',
    mindblown: '🤯'
  };

  // Use the passed emoji, or lookup default, or fallback to Gold trophy
  const iconToRender = emoji || defaultIcons[type?.toLowerCase()] || '🏆';
  const labelText = type || 'Award';

  const containerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#ffffff',
    borderRadius: '50px',
    padding: '4px 12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    margin: '2px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    width: 'fit-content',
    cursor: 'default',
    userSelect: 'none'
  };

  const iconStyle = {
    fontSize: '16px',
    lineHeight: '1',
  };

  const textStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#333',
    lineHeight: '1',
    textTransform: 'capitalize'
  };

  return (
    <div style={containerStyle} title={labelText}>
      <span role="img" aria-label={labelText} style={iconStyle}>
        {iconToRender}
      </span>
      <span style={textStyle}>
        {labelText}
      </span>
    </div>
  );
}