import { useTranslation } from 'react-i18next';
import { contactData } from 'Data/contact';

// wa.me link with a pre-filled, localized opening message.
export function useWhatsappLink() {
  const { t } = useTranslation();
  return `${contactData.whatsapp}?text=${encodeURIComponent(t('contact.whatsappMessage'))}`;
}
