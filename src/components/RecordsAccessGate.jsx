import { useEffect, useState } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getRecordsSession } from '../services/recordsService';

const RecordsAccessGate = ({ children }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const location = useLocation();
  const { slug } = useParams();

  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;

    const normalizedSlug = String(slug || '').trim().toLowerCase();

    if (!/^[a-f0-9]{8}$/.test(normalizedSlug)) {
      setStatus('blocked');
      return () => {
        isMounted = false;
      };
    }

    getRecordsSession(normalizedSlug)
      .then(() => {
        if (isMounted) setStatus('allowed');
      })
      .catch(() => {
        if (isMounted) setStatus('blocked');
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (status === 'loading') {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 ${
        isDark
          ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className={`w-full max-w-md rounded-3xl border px-6 py-8 text-center shadow-2xl ${
          isDark
            ? 'bg-black border-gray-800 text-white'
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
          <h1 className="text-2xl font-extrabold font-display">Verifying access</h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Checking the private records session before loading the page.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'blocked') {
    return <Navigate to="/calculator" replace state={{ from: location }} />;
  }

  return children;
};

export default RecordsAccessGate;
