import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const { t } = useTranslation();
  const { login, isAuthenticated, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    if (user?.role === 'enuma_admin') {
      return <Navigate to="/enuma-admin/clusters" replace />;
    }
    return <Navigate to={`/clusters/${user?.clusterId}/student-dashboard`} replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      const errorCode = err?.response?.data?.error;
      if (errorCode === 'USER_NOT_FOUND') {
        setError(t('login.errorNotFound'));
      } else if (errorCode === 'WRONG_PASSWORD') {
        setError(t('login.errorWrongPassword'));
      } else {
        setError(t('login.errorGeneral'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-[400px] bg-white rounded-[8px] shadow-lg p-[40px]">
        {/* Logo */}
        <div className="flex items-center justify-center mb-[8px]">
          <img src={`${import.meta.env.BASE_URL}logo_english.png`} alt="Enuma School" style={{ width: 80 }} />
        </div>

        {/* Title */}
        <h1 className="text-[24px] font-semibold text-gray-950 text-center m-0 mb-[4px]">
          {t('login.title')}
        </h1>
        <p className="text-[14px] text-gray-600 text-center mb-[32px]">
          {t('login.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('login.email')}
            className="h-[44px] px-[14px] border border-btn-border rounded-[6px] text-[14px] text-gray-950 outline-none focus:border-primary-green"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('login.password')}
            className="h-[44px] px-[14px] border border-btn-border rounded-[6px] text-[14px] text-gray-950 outline-none focus:border-primary-green"
            required
          />

          {error && (
            <p className="text-[13px] text-vivid-red m-0">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-[44px] bg-vivid-red text-white text-[14px] font-semibold rounded-[6px] border-none cursor-pointer hover:opacity-90 disabled:opacity-50"
          >
            {loading ? '...' : t('login.button')}
          </button>
        </form>
      </div>
    </div>
  );
}
