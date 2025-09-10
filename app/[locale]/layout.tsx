import type { Metadata } from 'next'
// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const locales = ['zh', 'en'] as const;
type Locale = typeof locales[number];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  const titles = {
    zh: 'Dev Tools - 开发者工具集合',
    en: 'Dev Tools - Developer Tools Collection'
  };
  
  const descriptions = {
    zh: '免费的在线开发者工具集合，包含30+种ID生成与解析、加密解密、格式转换、Web工具等多种实用工具',
    en: 'Free online developer tools collection with 30+ ID generation and parsing, encryption, format conversion, web tools and more'
  };
  
  const keywords = {
    zh: ['开发者工具', 'Dev Tools', 'UUID 生成器', 'ID 生成器', '加密工具', '格式转换', 'Base64', 'JSON 格式化', 'ULID', 'KSUID'],
    en: ['developer tools', 'dev tools', 'UUID generator', 'ID generator', 'encryption tools', 'format converter', 'Base64', 'JSON formatter', 'ULID', 'KSUID']
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.zh,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.zh,
    keywords: keywords[locale as keyof typeof keywords] || keywords.zh,
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  // const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* <NextIntlClientProvider messages={messages}> */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        {/* </NextIntlClientProvider> */}
      </body>
    </html>
  )
}