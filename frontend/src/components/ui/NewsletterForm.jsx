import { useState } from 'react';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function NewsletterForm({ variant = 'default' }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email.');
    setLoading(true);
    try {
      const res = await api.post('/newsletter/subscribe', { email, name });
      toast.success(res.data.message);
      setEmail('');
      setName('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="flex-grow px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-brand-green transition-colors"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary whitespace-nowrap"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send size={16} />
          )}
          Subscribe
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-md">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        className="input"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        className="input"
        required
      />
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Send size={16} />
        )}
        Subscribe to Newsletter
      </button>
    </form>
  );
}
