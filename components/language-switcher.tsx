'use client';

// import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

const locales = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' }
];

// Manual translations
const translations = {
  zh: { switch: '切换语言' },
  en: { switch: 'Switch language' }
};

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract locale from pathname
  const locale = pathname.startsWith('/zh') ? 'zh' : 'en';
  const t = (key: keyof typeof translations.zh) => translations[locale][key];

  const handleLocaleChange = (newLocale: string) => {
    // Replace the current locale in the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  const currentLocale = locales.find(l => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title={t('switch')}>
          <Languages className="h-5 w-5" />
          <span className="sr-only">{t('switch')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((localeItem) => (
          <DropdownMenuItem
            key={localeItem.code}
            onClick={() => handleLocaleChange(localeItem.code)}
            className={locale === localeItem.code ? 'bg-accent' : ''}
          >
            {localeItem.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}