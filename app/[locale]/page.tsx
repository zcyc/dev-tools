import { MainLayout } from '@/components/layout/main-layout'

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">
          Dev Tools - {locale === 'zh' ? '开发者工具集合' : 'Developer Tools Collection'}
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          {locale === 'zh' 
            ? '免费的在线开发者工具集合，包含30+种ID生成与解析、加密解密、格式轮换、Web工具等多种实用工具'
            : 'Free online developer tools collection with 30+ ID generation and parsing, encryption, format conversion, web tools and more'
          }
        </p>
        <div className="text-sm text-muted-foreground">
          Current locale: {locale}
        </div>
      </div>
    </MainLayout>
  )
}