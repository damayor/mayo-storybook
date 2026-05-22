import { useTranslation } from 'react-i18next';

interface FooterProps {
  onImpressumOpen: () => void;
}

export function Footer({ onImpressumOpen }: FooterProps) {
  const { t } = useTranslation();
  return (
    <footer className="relative z-10 border-t border-slate-800 py-6 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
      <span>© {new Date().getFullYear()} David Mayorga-Herrera · May Interactive</span>
      <div className="flex gap-4">
        <button
          onClick={onImpressumOpen}
          className="hover:text-camelot-400 transition-colors underline underline-offset-2 px-2"
        >
          {t('impressum.footerLink')}
        </button>
        {/* <span className="text-slate-700">|</span> */}
        {/* <span className="text-gray-600 cursor-not-allowed" title="Coming soon">
          {t('impressum.privacyLink')}
        </span> */}
      </div>
    </footer>
  );
}
