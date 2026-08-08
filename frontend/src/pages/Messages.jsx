import React, { useState, useEffect, useRef } from 'react';
import { messageAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, MessageCircle, User, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activePartner, setActivePartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await messageAPI.getConversationsList();
      setConversations(res.data || []);
      if (res.data?.length > 0 && !activePartner) {
        setActivePartner(res.data[0]);
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchMessages = async (targetUserId) => {
    if (!targetUserId) return;
    try {
      const res = await messageAPI.getConversation(targetUserId);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  useEffect(() => {
    if (activePartner) {
      fetchMessages(activePartner.user._id || activePartner.user);
    }
  }, [activePartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartner) return;

    const targetUserId = activePartner.user._id || activePartner.user;
    try {
      setSending(true);
      const res = await messageAPI.sendMessage(targetUserId, newMessage);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 4rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#800020' }}>Matrimony Messages</h2>
        <p style={{ color: '#6b7280' }}>Private messaging between mutually accepted matches</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Loading conversations...</div>
      ) : conversations.length === 0 ? (
        <div className="glass-card" style={{ padding: '3.5rem', textAlign: 'center', color: '#6b7280' }}>
          <MessageCircle size={48} color="#d4af37" style={{ marginBottom: '1rem' }} />
          <h3>No Active Chat Connections</h3>
          <p style={{ marginTop: '0.5rem' }}>
            Messaging becomes available when an interest request is accepted by both parties.
          </p>
          <Link to="/profiles" className="btn-primary" style={{ marginTop: '1.25rem' }}>
            Explore Profiles
          </Link>
        </div>
      ) : (
        <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', minHeight: '520px', overflow: 'hidden' }}>
          {/* Left: Connections List */}
          <div style={{ borderRight: '1px solid #e5e7eb', backgroundColor: '#faf6f0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb', fontWeight: '700', color: '#800020' }}>
              Connected Partners ({conversations.length})
            </div>
            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
              {conversations.map((item) => {
                const targetUserId = item.user._id || item.user;
                const isSelected = activePartner && (activePartner.user._id || activePartner.user) === targetUserId;
                const p = item.profile;
                return (
                  <div
                    key={targetUserId}
                    onClick={() => setActivePartner(item)}
                    style={{
                      padding: '1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0e8dc',
                      backgroundColor: isSelected ? '#fff0f3' : 'transparent',
                      borderLeft: isSelected ? '4px solid #800020' : '4px solid transparent',
                    }}
                  >
                    <img
                      src={p?.photos?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
                      alt=""
                      style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1f2937' }}>
                        {p?.fullName || 'Partner'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {p?.city} • {p?.age} Yrs
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Active Chat Window */}
          {activePartner ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Chat Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={activePartner.profile?.photos?.[0] || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
                    alt=""
                    style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <Link to={`/profiles/${activePartner.profile?._id}`} style={{ fontWeight: '700', color: '#800020', fontSize: '1.05rem' }}>
                      {activePartner.profile?.fullName}
                    </Link>
                    <div style={{ fontSize: '0.75rem', color: '#137333', fontWeight: '600' }}>
                      Connected Match
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div style={{ flexGrow: 1, padding: '1.5rem', overflowY: 'auto', backgroundColor: '#fcfcfc', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {messages.map((m) => {
                  const isMe = m.sender === user?._id || m.sender?._id === user?._id;
                  return (
                    <div
                      key={m._id}
                      style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        backgroundColor: isMe ? '#800020' : '#ffffff',
                        color: isMe ? '#ffffff' : '#1f2937',
                        padding: '0.75rem 1rem',
                        borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        border: isMe ? 'none' : '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ fontSize: '0.95rem' }}>{m.content}</div>
                      <div style={{ fontSize: '0.68rem', opacity: 0.8, textAlign: 'right', marginTop: '0.25rem' }}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Bar */}
              <form onSubmit={handleSendMessage} style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '0.75rem', backgroundColor: '#ffffff' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" disabled={sending} className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                  <Send size={16} /> Send
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
              Select a connected match to view messages
            </div>
          )}
        </div>
      )}
    </div>
  );
}
