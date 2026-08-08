import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ type = 'success', message, onClose }) {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.85rem 1.25rem',
        borderRadius: '12px',
        backgroundColor: isSuccess ? '#ECFDF5' : isError ? '#FEF2F2' : '#EFF6FF',
        color: isSuccess ? '#065F46' : isError ? '#991B1B' : '#1E40AF',
        border: `1.5px solid ${isSuccess ? '#A7F3D0' : isError ? '#FCA5A5' : '#BFDBFE'}`,
        boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
        fontSize: '0.9rem',
        fontWeight: '600',
        maxWidth: '380px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {isSuccess && <CheckCircle2 size={18} color="#059669" />}
      {isError && <AlertCircle size={18} color="#DC2626" />}
      {!isSuccess && !isError && <Info size={18} color="#2563EB" />}
      <span style={{ flexGrow: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', color: 'inherit' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
