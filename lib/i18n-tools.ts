// import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

// Import translations directly from JSON files
import zhMessages from '@/messages/zh.json';
import enMessages from '@/messages/en.json';

type Messages = typeof zhMessages;
type Locale = 'zh' | 'en';

const messages: Record<Locale, Messages> = {
  zh: zhMessages,
  en: enMessages
};

export interface I18nTool {
  id: string
  nameKey: string
  descriptionKey: string
  icon: string
  path: string
  category: string
}

export interface I18nToolCategory {
  id: string
  nameKey: string
  icon: string
  tools: I18nTool[]
}

export const i18nToolCategories: I18nToolCategory[] = [
  {
    id: 'id-generators',
    nameKey: 'categories.idGenerators',
    icon: 'Hash',
    tools: [
      { id: 'id-generator', nameKey: 'tools.idGenerator.name', descriptionKey: 'tools.idGenerator.description', icon: 'Hash', path: '/tools/id-generator', category: 'id-generators' },
      { id: 'token', nameKey: 'tools.token.name', descriptionKey: 'tools.token.description', icon: 'Key', path: '/tools/token', category: 'id-generators' },
    ]
  },
  {
    id: 'crypto',
    nameKey: 'categories.crypto',
    icon: 'Shield',
    tools: [
      { id: 'hash', nameKey: 'tools.hash.name', descriptionKey: 'tools.hash.description', icon: 'Lock', path: '/tools/hash', category: 'crypto' },
      { id: 'bcrypt', nameKey: 'tools.bcrypt.name', descriptionKey: 'tools.bcrypt.description', icon: 'KeyRound', path: '/tools/bcrypt', category: 'crypto' },
      { id: 'encrypt', nameKey: 'tools.encrypt.name', descriptionKey: 'tools.encrypt.description', icon: 'ShieldCheck', path: '/tools/encrypt', category: 'crypto' },
      { id: 'hmac', nameKey: 'tools.hmac.name', descriptionKey: 'tools.hmac.description', icon: 'Fingerprint', path: '/tools/hmac', category: 'crypto' },
      { id: 'rsa', nameKey: 'tools.rsa.name', descriptionKey: 'tools.rsa.description', icon: 'KeySquare', path: '/tools/rsa', category: 'crypto' },
    ]
  },
  {
    id: 'converters',
    nameKey: 'categories.converters',
    icon: 'ArrowLeftRight',
    tools: [
      { id: 'base64', nameKey: 'tools.base64.name', descriptionKey: 'tools.base64.description', icon: 'Binary', path: '/tools/base64', category: 'converters' },
      { id: 'datetime', nameKey: 'tools.datetime.name', descriptionKey: 'tools.datetime.description', icon: 'Calendar', path: '/tools/datetime', category: 'converters' },
      { id: 'number-base', nameKey: 'tools.numberBase.name', descriptionKey: 'tools.numberBase.description', icon: 'Calculator', path: '/tools/number-base', category: 'converters' },
      { id: 'color', nameKey: 'tools.color.name', descriptionKey: 'tools.color.description', icon: 'Palette', path: '/tools/color', category: 'converters' },
      { id: 'format', nameKey: 'tools.format.name', descriptionKey: 'tools.format.description', icon: 'FileCode', path: '/tools/format', category: 'converters' },
    ]
  },
  {
    id: 'web',
    nameKey: 'categories.web',
    icon: 'Globe',
    tools: [
      { id: 'url', nameKey: 'tools.url.name', descriptionKey: 'tools.url.description', icon: 'Link', path: '/tools/url', category: 'web' },
      { id: 'jwt', nameKey: 'tools.jwt.name', descriptionKey: 'tools.jwt.description', icon: 'Shield', path: '/tools/jwt', category: 'web' },
      { id: 'html-entities', nameKey: 'tools.htmlEntities.name', descriptionKey: 'tools.htmlEntities.description', icon: 'Code', path: '/tools/html-entities', category: 'web' },
      { id: 'otp', nameKey: 'tools.otp.name', descriptionKey: 'tools.otp.description', icon: 'Smartphone', path: '/tools/otp', category: 'web' },
      { id: 'user-agent', nameKey: 'tools.userAgent.name', descriptionKey: 'tools.userAgent.description', icon: 'Monitor', path: '/tools/user-agent', category: 'web' },
    ]
  },
  {
    id: 'dev',
    nameKey: 'categories.dev',
    icon: 'Code2',
    tools: [
      { id: 'json-formatter', nameKey: 'tools.jsonFormatter.name', descriptionKey: 'tools.jsonFormatter.description', icon: 'Braces', path: '/tools/json-formatter', category: 'dev' },
      { id: 'regex', nameKey: 'tools.regex.name', descriptionKey: 'tools.regex.description', icon: 'SearchCheck', path: '/tools/regex', category: 'dev' },
      { id: 'sql-formatter', nameKey: 'tools.sqlFormatter.name', descriptionKey: 'tools.sqlFormatter.description', icon: 'Database', path: '/tools/sql-formatter', category: 'dev' },
      { id: 'crontab', nameKey: 'tools.crontab.name', descriptionKey: 'tools.crontab.description', icon: 'Clock', path: '/tools/crontab', category: 'dev' },
      { id: 'git-cheatsheet', nameKey: 'tools.gitCheatsheet.name', descriptionKey: 'tools.gitCheatsheet.description', icon: 'GitBranch', path: '/tools/git-cheatsheet', category: 'dev' },
    ]
  },
  {
    id: 'text',
    nameKey: 'categories.text',
    icon: 'Type',
    tools: [
      { id: 'lorem-ipsum', nameKey: 'tools.loremIpsum.name', descriptionKey: 'tools.loremIpsum.description', icon: 'FileText', path: '/tools/lorem-ipsum', category: 'text' },
      { id: 'text-stats', nameKey: 'tools.textStats.name', descriptionKey: 'tools.textStats.description', icon: 'BarChart3', path: '/tools/text-stats', category: 'text' },
      { id: 'text-diff', nameKey: 'tools.textDiff.name', descriptionKey: 'tools.textDiff.description', icon: 'Diff', path: '/tools/text-diff', category: 'text' },
      { id: 'case-converter', nameKey: 'tools.caseConverter.name', descriptionKey: 'tools.caseConverter.description', icon: 'CaseSensitive', path: '/tools/case-converter', category: 'text' },
    ]
  },
  {
    id: 'utilities',
    nameKey: 'categories.utilities',
    icon: 'Wrench',
    tools: [
      { id: 'qr-code', nameKey: 'tools.qrCode.name', descriptionKey: 'tools.qrCode.description', icon: 'QrCode', path: '/tools/qr-code', category: 'utilities' },
      { id: 'wifi-qr', nameKey: 'tools.wifiQr.name', descriptionKey: 'tools.wifiQr.description', icon: 'Wifi', path: '/tools/wifi-qr', category: 'utilities' },
      { id: 'calculator', nameKey: 'tools.calculator.name', descriptionKey: 'tools.calculator.description', icon: 'Calculator', path: '/tools/calculator', category: 'utilities' },
      { id: 'network', nameKey: 'tools.network.name', descriptionKey: 'tools.network.description', icon: 'Network', path: '/tools/network', category: 'utilities' },
    ]
  },
];

// Helper function to get nested object value by key path
function getNestedValue(obj: any, keyPath: string): string {
  return keyPath.split('.').reduce((current, key) => current?.[key], obj) || keyPath;
}

// Hook to get localized tools data
export function useLocalizedTools() {
  const pathname = usePathname();
  const locale: Locale = pathname.startsWith('/zh') ? 'zh' : 'en';
  const currentMessages = messages[locale];
  
  const t = (key: string): string => getNestedValue(currentMessages, key);
  
  return i18nToolCategories.map(category => ({
    ...category,
    name: t(category.nameKey),
    tools: category.tools.map(tool => ({
      ...tool,
      name: t(tool.nameKey),
      description: t(tool.descriptionKey),
      path: tool.path // This will be updated by components to include locale
    }))
  }));
}