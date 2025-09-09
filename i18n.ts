import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Static imports
import zhMessages from './messages/zh.json';
import enMessages from './messages/en.json';

// Can be imported from a shared config
const locales = ['zh', 'en'];

const messages = {
  zh: zhMessages,
  en: enMessages
};

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: messages[locale as keyof typeof messages]
  };
});