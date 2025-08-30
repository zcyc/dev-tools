import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Dev Tools - 开发者工具集合',
  description: '免费的在线开发者工具集合，包含30+种ID生成与解析、加密解密、格式转换、Web工具等多种实用工具',
  keywords: ['开发者工具', 'Dev Tools', 'UUID生成器', 'ID生成器', '加密工具', '格式转换', 'Base64', 'JSON格式化', 'ULID', 'KSUID'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
