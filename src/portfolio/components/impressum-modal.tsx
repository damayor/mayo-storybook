import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ImpressumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImpressumModal({ isOpen, onClose }: ImpressumModalProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto">
          <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-xl font-semibold text-gray-100">{t('impressum.title')}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-400 hover:text-gray-100"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="px-6 py-6 space-y-6 text-sm text-gray-300">
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              {t('impressum.legalBasis')}
            </p>

            {/* Owner */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-camelot-500 mb-2">
                {t('impressum.ownerLabel')}
              </h3>
              <p className="leading-7">
                {t('impressum.name')}
                <br />
                {t('impressum.addressLine1')}
                <br />
                {t('impressum.addressLine2')}
                <br />
                {t('impressum.addressLine3')}
              </p>
            </section>

            {/* Contact */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-camelot-500 mb-2">
                {t('impressum.contactLabel')}
              </h3>
              <p className="leading-7">
                E-Mail:{' '}
                <a
                  href={`mailto:${t('impressum.email')}`}
                  className="text-camelot-400 hover:text-camelot-300 underline underline-offset-2"
                >
                  {t('impressum.email')}
                </a>
                <br />
                {t('impressum.phone')}
              </p>
            </section>

            {/* Profession */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-camelot-500 mb-2">
                {t('impressum.professionLabel')}
              </h3>
              <p>{t('impressum.profession')}</p>
            </section>

            {/* Disclaimer */}
            <section className="border-t border-slate-700 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-camelot-500 mb-2">
                {t('impressum.disclaimerTitle')}
              </h3>
              <p className="text-gray-500 leading-6 text-xs">{t('impressum.disclaimerText')}</p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
