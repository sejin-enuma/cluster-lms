import { useState, useEffect, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../api/client';
import type { Account } from '../types';
import Modal from '../components/ui/Modal';

export default function AccountManagementPage() {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [email, setEmail] = useState('');
  const [createError, setCreateError] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Account | null>(null);

  const fetchAccounts = async () => {
    try {
      const res = await client.get('/enuma-admin/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      const res = await client.post('/enuma-admin/accounts', { email });
      setAccounts((prev) => [...prev, res.data]);
      setEmail('');
      setShowCreate(false);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setCreateError(t('account.emailExists'));
      } else {
        setCreateError('Failed to create account.');
      }
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await client.delete(`/enuma-admin/accounts/${deleteTarget.id}`);
      setAccounts((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Failed to delete account:', err);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-[400px] text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-[20px]">
        <h2 className="text-[18px] font-semibold text-gray-950 m-0">
          {t('account.title')}
        </h2>
        <button
          onClick={() => { setShowCreate(!showCreate); setCreateError(''); setEmail(''); }}
          className="h-[36px] px-[16px] bg-vivid-red text-white text-[13px] font-medium rounded-[6px] border-none cursor-pointer hover:opacity-90"
        >
          {t('account.createButton')}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-[6px] p-[20px] mb-[16px] border border-line">
          <h3 className="text-[14px] font-semibold text-gray-950 m-0 mb-[12px]">
            {t('account.create')}
          </h3>
          <form onSubmit={handleCreate} className="flex items-center gap-[12px]">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setCreateError(''); }}
              placeholder={t('account.emailPlaceholder')}
              className="h-[40px] flex-1 px-[12px] border border-btn-border rounded-[6px] text-[14px] text-gray-950 outline-none focus:border-primary-green"
              required
            />
            <button
              type="submit"
              disabled={creating}
              className="h-[40px] px-[20px] bg-vivid-red text-white text-[13px] font-medium rounded-[6px] border-none cursor-pointer hover:opacity-90 disabled:opacity-50"
            >
              Create
            </button>
          </form>
          {createError && (
            <p className="text-[13px] text-vivid-red mt-[8px] m-0">{createError}</p>
          )}
        </div>
      )}

      {/* Accounts table */}
      <div className="bg-white rounded-[6px] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-list border border-line px-[16px] py-[12px] text-[12px] font-normal text-gray-950 text-left">
                {t('account.email')}
              </th>
              <th className="bg-list border border-line px-[16px] py-[12px] text-[12px] font-normal text-gray-950 text-center w-[160px]">
                {t('account.rights')}
              </th>
              <th className="bg-list border border-line px-[16px] py-[12px] text-[12px] font-normal text-gray-950 text-center w-[140px]">
                {t('account.password')}
              </th>
              <th className="bg-list border border-line px-[16px] py-[12px] text-[12px] font-normal text-gray-950 text-center w-[80px]">
                {t('account.delete')}
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-[40px] text-[14px] text-gray-500">
                  {t('common.noData')}
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr key={account.id}>
                  <td className="border-b border-r border-line px-[16px] py-[12px] text-[14px] text-gray-950">
                    {account.email}
                  </td>
                  <td className="border-b border-r border-line px-[16px] py-[12px] text-[14px] text-gray-950 text-center">
                    {account.rights}
                  </td>
                  <td className="border-b border-r border-line px-[16px] py-[12px] text-[14px] text-gray-950 text-center font-mono">
                    {account.password}
                  </td>
                  <td className="border-b border-line px-[16px] py-[12px] text-center">
                    <button
                      onClick={() => setDeleteTarget(account)}
                      className="border-none bg-transparent cursor-pointer text-gray-500 hover:text-vivid-red"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t('account.deleteTitle')}
        actions={
          <>
            <button
              onClick={() => setDeleteTarget(null)}
              className="h-[36px] px-[16px] bg-white text-gray-700 text-[13px] font-medium rounded-[6px] border border-btn-border cursor-pointer hover:bg-bg"
            >
              {t('account.cancel')}
            </button>
            <button
              onClick={handleDelete}
              className="h-[36px] px-[16px] bg-vivid-red text-white text-[13px] font-medium rounded-[6px] border-none cursor-pointer hover:opacity-90"
            >
              {t('account.delete')}
            </button>
          </>
        }
      >
        <p className="m-0 mb-[8px]">{t('account.deleteConfirm')}</p>
        <p className="m-0 font-semibold text-gray-950">{deleteTarget?.email}</p>
      </Modal>
    </div>
  );
}
