import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import api from '../utils/api';

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Invalid unsubscribe link.');
      return;
    }
    api.get(`/newsletter/unsubscribe?token=${token}`)
      .then((res) => { setStatus('success'); setMessage(res.data.message); })
      .catch((err) => { setStatus('error'); setMessage(err.response?.data?.message || 'Something went wrong.'); });
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full mx-4 text-center">
        {status === 'loading' && (
          <div className="w-10 h-10 border-4 border-brand-green border-t-transparent rounded-full animate-spin mx-auto" />
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 size={48} className="text-brand-green mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-2">Unsubscribed</h2>
            <p className="text-gray-500 text-sm">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle size={48} className="text-red-400 mx-auto mb-4" />
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 text-sm">{message}</p>
          </>
        )}
        <Link to="/" className="btn-outline mt-6 inline-flex">Go to Homepage</Link>
      </div>
    </div>
  );
}
