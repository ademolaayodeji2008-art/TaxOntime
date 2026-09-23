import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, Check, ChevronDown, ChevronUp, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread | read

  const fetchContacts = async () => {
    try {
      const params = filter === 'all' ? '' : `?read=${filter === 'read'}`;
      const res = await api.get(`/contact${params}`);
      setContacts(res.data.contacts);
    } catch { toast.error('Failed to load messages.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchContacts(); }, [filter]);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`);
      setContacts((prev) => prev.map((c) => c._id === id ? { ...c, read: true } : c));
    } catch { toast.error('Failed to mark as read.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await api.delete(`/contact/${id}`);
      toast.success('Message deleted.');
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (expanded === id) setExpanded(null);
    } catch { toast.error('Failed to delete message.'); }
  };

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Messages</h1>
          <p className="text-gray-500 text-sm">
            {contacts.length} message{contacts.length !== 1 ? 's' : ''}
            {unreadCount > 0 && <span className="ml-1 text-brand-green font-medium">· {unreadCount} unread</span>}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'read', label: 'Read' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => { setFilter(id); setLoading(true); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Mail size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No messages found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                !contact.read ? 'border-brand-green/30 bg-brand-green/[0.02]' : 'border-gray-100'
              }`}
            >
              {/* Header */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => {
                  setExpanded(expanded === contact._id ? null : contact._id);
                  if (!contact.read) handleMarkRead(contact._id);
                }}
              >
                {/* Unread dot */}
                <div className="flex-shrink-0 w-2.5">
                  {!contact.read && (
                    <span className="block w-2.5 h-2.5 bg-brand-green rounded-full" />
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-medium ${!contact.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {contact.name}
                    </span>
                    <span className="text-xs text-gray-400">{contact.email}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {contact.service}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {contact.message}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block">
                    {new Date(contact.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {expanded === contact._id ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
                </div>
              </div>

              {/* Expanded Content */}
              <AnimatePresence>
                {expanded === contact._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden border-t border-gray-100"
                  >
                    <div className="px-5 py-5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5 text-sm">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Email</p>
                          <a href={`mailto:${contact.email}`} className="text-brand-green hover:underline">
                            {contact.email}
                          </a>
                        </div>
                        {contact.phone && (
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Phone</p>
                            <a href={`tel:${contact.phone}`} className="text-gray-700 flex items-center gap-1">
                              <Phone size={12} /> {contact.phone}
                            </a>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">Service</p>
                          <p className="text-gray-700">{contact.service}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-4 mb-5">
                        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-2">Message</p>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={`mailto:${contact.email}?subject=Re: ${contact.service} — TaxonTime.Ng`}
                          className="btn-primary text-sm py-2 px-4"
                        >
                          <Mail size={14} /> Reply via Email
                        </a>
                        {!contact.read && (
                          <button
                            onClick={() => handleMarkRead(contact._id)}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-green transition-colors border border-gray-200 px-4 py-2 rounded-lg hover:border-brand-green"
                          >
                            <Check size={14} /> Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(contact._id)}
                          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-600 transition-colors ml-auto"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
