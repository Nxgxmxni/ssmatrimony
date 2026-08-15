import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import {
  Mail,
  Search,
  Send,
  Trash2,
  CheckCircle,
  AlertOctagon,
  Clock,
  Eye,
  X,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function ContactInboxPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [activeCategory, setActiveCategory] = useState('All'); // All, Unread, Read, Replied, Resolved, Spam
  const [search, setSearch] = useState('');

  // Selected Message View Modal & Reply Modal State
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [actionMsg, setActionMsg] = useState({ type: '', text: '' });

  const fetchContactMessages = async (pageNum = page) => {
    try {
      setLoading(true);
      const params = {
        status: activeCategory,
        search,
        page: pageNum,
        limit,
      };

      const res = await adminAPI.getContacts(params);
      setMessages(res.data?.messages || []);
      setTotal(res.data?.total || 0);
      setUnreadCount(res.data?.unreadCount || 0);
      setPage(res.data?.page || 1);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContactMessages(1);
  }, [activeCategory, search]);

  const showToast = (text, type = 'success') => {
    setActionMsg({ type, text });
    setTimeout(() => setActionMsg({ type: '', text: '' }), 4000);
  };

  const handleUpdateStatus = async (msgId, status) => {
    try {
      await adminAPI.updateContactStatus(msgId, status);
      showToast(`Message marked as ${status}`);
      fetchContactMessages(page);
      if (selectedMessage && selectedMessage._id === msgId) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Delete this contact message permanently?')) return;
    try {
      await adminAPI.deleteContact(msgId);
      showToast('Contact message deleted');
      fetchContactMessages(page);
      if (selectedMessage && selectedMessage._id === msgId) {
        setSelectedMessage(null);
      }
    } catch (err) {
      showToast('Failed to delete message', 'error');
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    try {
      setSendingReply(true);
      await adminAPI.replyContact(selectedMessage._id, replyText);
      showToast(`Reply email sent successfully to ${selectedMessage.email}`);
      setReplyText('');
      fetchContactMessages(page);
      setSelectedMessage((prev) => prev ? { ...prev, status: 'Replied', replyText } : null);
    } catch (err) {
      showToast('Failed to send response email', 'error');
    } finally {
      setSendingReply(false);
    }
  };

  const categories = [
    { label: 'All Messages', value: 'All' },
    { label: `Unread (${unreadCount})`, value: 'Unread' },
    { label: 'Read', value: 'Read' },
    { label: 'Replied', value: 'Replied' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Spam', value: 'Spam' },
  ];

  return (
    <div>
      {/* Toast Notification Banner */}
      {actionMsg.text && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: actionMsg.type === 'error' ? '#EF4444' : '#10B981',
            color: '#FFFFFF',
            padding: '0.85rem 1.4rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 3000,
            fontWeight: '700',
            fontSize: '0.9rem',
          }}
        >
          {actionMsg.text}
        </div>
      )}

      {/* Page Header */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: '#0F172A', letterSpacing: '-0.5px' }}>
            Contact Support Inbox
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.925rem', marginTop: '0.2rem' }}>
            Manage member support enquiries, contact messages, and send official email responses
          </p>
        </div>

        <button
          onClick={() => fetchContactMessages(page)}
          className="btn-primary"
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RotateCcw size={16} /> Refresh Inbox
        </button>
      </div>

      {/* Category Tabs & Search Bar */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '1.25rem', border: '1px solid #E2E8F0', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: '30px',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  backgroundColor: activeCategory === cat.value ? '#0B3B91' : '#F1F5F9',
                  color: activeCategory === cat.value ? '#FFFFFF' : '#475569',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F8FAFC', padding: '0.5rem 0.85rem', borderRadius: '20px', border: '1px solid #CBD5E1', width: '260px' }}>
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search sender, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%', color: '#0F172A' }}
            />
            {search && <X size={14} color="#94A3B8" style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />}
          </div>
        </div>
      </div>

      {/* Inbox Split View Container */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedMessage ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
        {/* Messages List Table */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#0B3B91', fontWeight: '700' }}>
              Loading inbox messages from MongoDB...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#64748B' }}>
              <Mail size={42} color="#94A3B8" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: '#0F172A', fontWeight: '800' }}>No Messages Found</h3>
              <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>There are no contact messages matching category "{activeCategory}".</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0B3B91', color: '#FFFFFF' }}>
                    <th style={{ padding: '0.85rem 1rem' }}>Sender</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Subject &amp; Message</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr
                      key={msg._id}
                      onClick={() => setSelectedMessage(msg)}
                      style={{
                        borderBottom: '1px solid #E2E8F0',
                        backgroundColor: selectedMessage?._id === msg._id ? '#EFF6FF' : msg.status === 'Unread' ? '#F8FAFC' : '#FFFFFF',
                        cursor: 'pointer',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: msg.status === 'Unread' ? '800' : '700', color: '#0F172A' }}>{msg.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{msg.email}</div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ fontWeight: '700', color: '#0B3B91' }}>{msg.subject}</div>
                        <div style={{ fontSize: '0.78rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
                          {msg.message}
                        </div>
                      </td>

                      <td style={{ padding: '0.85rem 1rem' }}>
                        {msg.status === 'Unread' ? (
                          <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '0.2rem 0.55rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800' }}>
                            Unread
                          </span>
                        ) : msg.status === 'Replied' ? (
                          <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.2rem 0.55rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800' }}>
                            Replied
                          </span>
                        ) : msg.status === 'Resolved' ? (
                          <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '0.2rem 0.55rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800' }}>
                            Resolved
                          </span>
                        ) : (
                          <span style={{ backgroundColor: '#F1F5F9', color: '#64748B', padding: '0.2rem 0.55rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '700' }}>
                            {msg.status}
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedMessage(msg)}
                            style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '0.3rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(msg._id)}
                            style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1.25rem', borderTop: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Showing {messages.length} of {total} messages</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1} className="btn-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', borderRadius: '6px' }}>
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', padding: '0.35rem 0.5rem' }}>{page} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page >= totalPages} className="btn-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.8rem', borderRadius: '6px' }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Selected Message Detail & Email Reply Window */}
        {selectedMessage && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.85rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                    {selectedMessage.subject}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.2rem' }}>
                    From: <strong style={{ color: '#0B3B91' }}>{selectedMessage.name}</strong> ({selectedMessage.email})
                  </div>
                  {selectedMessage.phone && (
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Phone: {selectedMessage.phone}</div>
                  )}
                </div>
                <button onClick={() => setSelectedMessage(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Message Content Body */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {selectedMessage.message}
              </div>

              {/* Existing Reply Transcript if already replied */}
              {selectedMessage.replyText && (
                <div style={{ backgroundColor: '#EFF6FF', borderLeft: '4px solid #0B3B91', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0B3B91', marginBottom: '0.35rem' }}>
                    ✓ Admin Response Email (Sent {new Date(selectedMessage.repliedAt).toLocaleString()}):
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#1E293B', whiteSpace: 'pre-line' }}>
                    {selectedMessage.replyText}
                  </div>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem' }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '0.85rem' }}>
                  Send Response Email
                </label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your official reply email to sender..."
                  required
                  style={{ fontSize: '0.875rem', marginBottom: '1rem' }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedMessage._id, 'Resolved')}
                      style={{ backgroundColor: '#DCFCE7', color: '#166534', border: '1px solid #86EFAC', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Mark Resolved
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedMessage._id, 'Spam')}
                      style={{ backgroundColor: '#F1F5F9', color: '#64748B', border: '1px solid #CBD5E1', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Mark Spam
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingReply}
                    className="btn-gold"
                    style={{ padding: '0.55rem 1.4rem', fontSize: '0.85rem', borderRadius: '30px' }}
                  >
                    {sendingReply ? 'Sending...' : 'Send Reply Email'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
