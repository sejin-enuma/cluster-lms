import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function LNB() {
  const { t } = useTranslation();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center gap-[4px] py-[14px] w-full ${
      isActive ? 'text-primary-red' : 'text-gray-950'
    }`;

  const textClass = (isActive: boolean) =>
    `text-[12px] text-center leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`;

  return (
    <nav className="w-[104px] min-h-screen bg-white flex flex-col items-center pt-[30px] shrink-0">
      {/* Logo */}
      <div className="w-[80px] h-[41px] mb-[30px] flex items-center justify-center">
        <span className="text-[11px] font-bold text-primary-green leading-tight text-center">
          ENUMA<br />SCHOOL
        </span>
      </div>

      <div className="flex flex-col gap-[20px] w-full px-[12px]">
        <NavLink to="/enuma-admin/clusters" className={linkClass}>
          {({ isActive }) => (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#BD4233' : '#030712'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <span className={textClass(isActive)}>{t('lnb.clusterList')}</span>
            </>
          )}
        </NavLink>

        <NavLink to="/enuma-admin/accounts" className={linkClass}>
          {({ isActive }) => (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#BD4233' : '#030712'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className={textClass(isActive)}>{t('lnb.accountManagement')}</span>
            </>
          )}
        </NavLink>

        <NavLink to="/enuma-admin/downloads" className={linkClass}>
          {({ isActive }) => (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={isActive ? '#BD4233' : '#030712'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span className={textClass(isActive)}>{t('lnb.downloads')}</span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  );
}
