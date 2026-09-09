import React from 'react';
import { getStatusVariant } from '../utils/formatters';

const StatusBadge = ({ status }) => {
  const variant = getStatusVariant(status);

  return (
    <span
      className="status-badge"
      style={{
        backgroundColor: variant.bg,
        color: variant.text,
        border: `1px solid ${variant.border}`,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: variant.text,
          display: 'inline-block',
        }}
      />
      {variant.label}
    </span>
  );
};

export default StatusBadge;
