import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
// Import specific icons used on the homepage
import { 
  Hash, Binary, Lock, Calendar, Braces, QrCode, 
  Palette, Shield, Link as LinkIcon, SearchCheck, Clock, Settings 
} from 'lucide-react'

// Map icon names to actual icon components
const iconMap = {
  Hash, Binary, Lock, Calendar, Braces, QrCode,
  Palette, Shield, Link: LinkIcon, SearchCheck, Clock, Settings
} as const;

const getIcon = (iconName: string) => {
  return (iconMap as any)[iconName] || Settings
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  // 常用工具列表
  const popularTools = [
    { id: 'id-generator', name: locale === 'zh' ? 'ID 生成器' : 'ID Generator', description: locale === 'zh' ? '支持 30+ 种 ID 格式生成与解析' : 'Support 30+ ID formats generation and parsing', icon: 'Hash', path: '/tools/id-generator', category: locale === 'zh' ? 'ID 生成' : 'ID Generation' },
    { id: 'base64', name: locale === 'zh' ? 'Base64 编码/解码' : 'Base64 Encode/Decode', description: locale === 'zh' ? 'Base64 格式编码和解码' : 'Base64 format encoding and decoding', icon: 'Binary', path: '/tools/base64', category: locale === 'zh' ? '转换工具' : 'Converter' },
    { id: 'hash', name: locale === 'zh' ? 'Hash 文本生成' : 'Hash Generator', description: locale === 'zh' ? '生成 MD5、SHA-1、SHA-256 等哈希值' : 'Generate MD5, SHA-1, SHA-256 hash values', icon: 'Lock', path: '/tools/hash', category: locale === 'zh' ? '加密工具' : 'Crypto' },
    { id: 'datetime', name: locale === 'zh' ? '日期时间转换' : 'Date-time Converter', description: locale === 'zh' ? '时间戳和日期格式转换' : 'Timestamp and date format conversion', icon: 'Calendar', path: '/tools/datetime', category: locale === 'zh' ? '转换工具' : 'Converter' },
    { id: 'json-formatter', name: locale === 'zh' ? 'JSON 格式化' : 'JSON Formatter', description: locale === 'zh' ? '格式化和验证 JSON 数据' : 'Format and validate JSON data', icon: 'Braces', path: '/tools/json-formatter', category: locale === 'zh' ? '开发工具' : 'Developer' },
    { id: 'qr-code', name: locale === 'zh' ? 'QR 码生成' : 'QR Code Generator', description: locale === 'zh' ? '生成二维码' : 'Generate QR codes', icon: 'QrCode', path: '/tools/qr-code', category: locale === 'zh' ? '实用工具' : 'Utilities' },
    { id: 'color', name: locale === 'zh' ? '颜色转换' : 'Color Converter', description: locale === 'zh' ? 'HEX、RGB、HSL 颜色格式转换' : 'HEX, RGB, HSL color format conversion', icon: 'Palette', path: '/tools/color', category: locale === 'zh' ? '转换工具' : 'Converter' },
    { id: 'jwt', name: locale === 'zh' ? 'JWT 解析' : 'JWT Decoder', description: locale === 'zh' ? '解码和验证 JWT 令牌' : 'Decode and verify JWT tokens', icon: 'Shield', path: '/tools/jwt', category: locale === 'zh' ? 'Web 工具' : 'Web Tools' },
    { id: 'bcrypt', name: locale === 'zh' ? 'Bcrypt 加密' : 'Bcrypt', description: locale === 'zh' ? 'Bcrypt 密码哈希和验证' : 'Bcrypt password hashing and verification', icon: 'KeyRound', path: '/tools/bcrypt', category: locale === 'zh' ? '加密工具' : 'Crypto' },
    { id: 'url', name: locale === 'zh' ? 'URL 编码/解码' : 'URL Encode/Decode', description: locale === 'zh' ? 'URL 编码和解码工具' : 'URL encoding and decoding tool', icon: 'Link', path: '/tools/url', category: locale === 'zh' ? 'Web 工具' : 'Web Tools' },
    { id: 'regex', name: locale === 'zh' ? '正则表达式测试' : 'Regex Tester', description: locale === 'zh' ? '测试和匹配正则表达式' : 'Test and match regular expressions', icon: 'SearchCheck', path: '/tools/regex', category: locale === 'zh' ? '开发工具' : 'Developer' },
    { id: 'crontab', name: locale === 'zh' ? 'Crontab 生成器' : 'Crontab Generator', description: locale === 'zh' ? '生成 Cron 定时任务表达式' : 'Generate Cron scheduled task expressions', icon: 'Clock', path: '/tools/crontab', category: locale === 'zh' ? '开发工具' : 'Developer' }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Popular Tools Section */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-muted-foreground">
              {locale === 'zh' ? '常用工具' : 'Popular tools'}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularTools.map((tool) => {
              const IconComponent = getIcon(tool.icon);
              return (
                <Link key={tool.id} href={`/${locale}${tool.path}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {tool.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardTitle className="text-base mb-2 group-hover:text-primary transition-colors">
                        {tool.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}