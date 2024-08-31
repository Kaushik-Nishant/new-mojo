// Card.js
import React from 'react';

// Card Component with inline styling
const Card = ({ title, children }) => {
  return (
    <div style={cardStyle}>
      {title && <h3 style={titleStyle}>{title}</h3>}
      <div>{children}</div>
    </div>
  );
};

// Inline styles for the card
const cardStyle = {
  width: '250px',
  padding: '20px',
  margin: '10px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
  textAlign: 'center',
};

const titleStyle = {
  marginBottom: '10px',
  color: '#333',
};

export default Card;
