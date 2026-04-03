import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'es', label: 'Español' },
];

export default function GNB() {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLang(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('cluster-lms-lang', code);
    setShowLang(false);
  };

  return (
    <header className="h-[54px] bg-primary-green flex items-center justify-end px-[30px] relative">
      <div className="flex items-center gap-[14px]">
        {/* Globe icon */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setShowLang(!showLang)}
            className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer bg-transparent border-none"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </button>
          {showLang && (
            <div className="absolute right-0 top-[34px] bg-white rounded-[6px] shadow-lg z-50 min-w-[160px] py-[4px]">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full text-left px-[16px] py-[8px] text-[13px] hover:bg-bg cursor-pointer border-none bg-transparent ${
                    i18n.language === lang.code ? 'text-primary-red font-semibold' : 'text-gray-950'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile icon */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-[24px] h-[24px] flex items-center justify-center cursor-pointer bg-transparent border-none"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          {showProfile && (
            <div className="absolute right-0 top-[34px] bg-white rounded-[6px] shadow-lg z-50 min-w-[140px] py-[4px]">
              <button
                onClick={logout}
                className="w-full text-left px-[16px] py-[8px] text-[13px] text-gray-950 hover:bg-bg cursor-pointer border-none bg-transparent"
              >
                {t('gnb.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
