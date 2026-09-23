import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Users, Mail, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function NewsletterAdmin() {
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ subject: '', body: '' });
  const [activeTab, setActiveTab] = useState('compose');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [subs, camps] = await Promise.all([
          api.get('/newsletter/subscribers'),
          api.get('/newsletter/campaigns'),
        ]);
        setSubscribers(subs.data.subscribers);
        setCampaigns(camps.data);
      } catch { toast.error('Failed to load newsletter data.'); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.subject || !form.body) return toast.error('Subject and body are required.');
    if (subscribers.length === 0) return toast.error('No subscribers to send to.');
    if (!window.confirm(`Send this newsletter to ${subscribers.length} subscriber(s)?`)) return;

    setSending(true);
    try {
      const res = await api.post('/newsletter/send', form);
      toast.success(res.data.message);
      setForm({ subject: '', body: '' });
      // Refresh campaigns
      const camps = await api.get('/newsletter/campaigns');
      setCampaigns(camps.data);
      setActiveTab('history');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send newsletter.');
    } finally {
      setSending(false);
    }
  };

  const tabs = [
    { id: 'compose', label: 'Compose', icon: Mail },
    { id: 'subscribers', label: `Subscribers (${subscribers.length})`, icon: Users },
    { id: 'history', label: 'History', icon: Clock },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-gray-900">Newsletter</h1>
        <p className="text-gray-500 text-sm">{subscribers.length} active subscribers</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Compose */}
      {activeTab === 'compose' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-5">Compose Newsletter</h2>
                <form onSubmit={handleSend} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject Line <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.subject}
                      onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                      className="input"
                      placeholder="e.g., Your Monthly Tax Update — September 2026"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Email Body <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-400 mb-2">You can use HTML for formatting.</p>
                    <textarea
                      value={form.body}
                      onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                      rows={16}
                      className="input resize-y font-mono text-sm"
                      placeholder={`<h2>Hello!</h2>\n<p>Here's your monthly tax update...</p>`}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending || subscribers.length === 0}
                    className="btn-primary w-full justify-center py-3"
                  >
                    {sending ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : <Send size={16} />}
                    {sending ? 'Sending...' : `Send to ${subscribers.length} Subscriber${subscribers.length !== 1 ? 's' : ''}`}
                  </button>
                </form>
              </div>
            </div>

            {/* Tips */}
            <div className="space-y-4">
              <div className="bg-brand-green/5 border border-brand-green/20 rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Email Tips</h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  {[
                    'Keep subject lines under 50 characters',
                    'Start with a personal greeting',
                    'Include one clear call-to-action',
                    'Keep it under 500 words',
                    'Always include value for the reader',
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <CheckCircle2 size={12} className="text-brand-green mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <p className="text-xs text-gray-400">
                  Emails are sent via Gmail SMTP. An unsubscribe link is automatically added to every email.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Subscribers */}
      {activeTab === 'subscribers' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : subscribers.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No subscribers yet.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Subscribed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscribers.map((sub, i) => (
                    <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 text-xs text-gray-400">{i + 1}</td>
                      <td className="px-5 py-3 text-sm text-gray-900">{sub.email}</td>
                      <td className="px-5 py-3 text-sm text-gray-500 hidden sm:table-cell">{sub.name || '—'}</td>
                      <td className="px-5 py-3 text-xs text-gray-400 hidden md:table-cell">
                        {new Date(sub.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      )}

      {/* History */}
      {activeTab === 'history' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {campaigns.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No campaigns sent yet.</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Subject</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Recipients</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Sent At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {campaigns.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50">
                      <td className="px-5 py-4 text-sm font-medium text-gray-900 line-clamp-1">{c.subject}</td>
                      <td className="px-5 py-4 text-sm text-gray-500 hidden sm:table-cell">{c.recipientCount}</td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          c.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {c.status === 'sent' ? 'Sent' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400 hidden lg:table-cell">
                        {c.sentAt ? new Date(c.sentAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
