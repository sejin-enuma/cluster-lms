import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="h-[113px] bg-bg flex flex-col justify-center px-[68px]">
      <div className="flex items-center gap-[14px] mb-[8px]">
        <img src={`${import.meta.env.BASE_URL}logo_english.png`} alt="Enuma" style={{ width: 80 }} />
        <span className="text-gray-300">|</span>
        <a
          href="https://enuma.com/terms/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-medium text-gray-800 no-underline hover:underline"
        >
          {t('footer.terms')}
        </a>
        <span className="text-gray-300">|</span>
        <a
          href="https://enuma.com/privacy/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] font-medium text-gray-800 no-underline hover:underline"
        >
          {t('footer.privacy')}
        </a>
      </div>
      <a
        href="https://enuma.com/en/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[14px] text-gray-600 no-underline hover:underline"
      >
        {t('footer.learnMore')}
      </a>
    </footer>
  );
}
