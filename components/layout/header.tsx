'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import { useLocale, useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'
import { Search, Moon, Sun, Menu, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLocalizedTools } from '@/lib/i18n-tools'

// Manual translations for common UI elements
const translations = {
  zh: {
    search: '搜索工具...',
    noResults: '未找到相关工具',
    toggleTheme: '切换主题',
    openMenu: '打开菜单'
  },
  en: {
    search: 'Search tools...',
    noResults: 'No tools found',
    toggleTheme: 'Toggle theme',
    openMenu: 'Open menu'
  }
}

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  
  // Extract locale from pathname
  const locale = pathname.startsWith('/zh') ? 'zh' : 'en'
  const t = (key: keyof typeof translations.zh) => translations[locale][key]
  const toolCategories = useLocalizedTools()

  // Filter tools based on search query
  const filteredTools = toolCategories.flatMap(category =>
    category.tools.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(tool => ({ ...tool, path: `/${locale}${tool.path}` }))
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-3">
            <div className="flex flex-col">
              <h1 className="font-bold text-xl text-primary">DEV TOOLS</h1>
              <p className="text-xs text-muted-foreground -mt-1">
                {locale === 'zh' ? '开发者实用工具集合' : 'Handy tools for developers'}
              </p>
            </div>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center max-w-md w-full mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder={t('search')}
                className="pl-10 pr-16 bg-muted/50 border-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs bg-muted-foreground/20 text-muted-foreground rounded border">
                  Ctrl
                </kbd>
                <span className="text-muted-foreground text-xs">+</span>
                <kbd className="px-1.5 py-0.5 text-xs bg-muted-foreground/20 text-muted-foreground rounded border">
                  K
                </kbd>
              </div>
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                    {filteredTools.length > 0 ? (
                      filteredTools.map((tool) => (
                        <Link
                          key={tool.id}
                          href={tool.path}
                          className="block px-4 py-3 hover:bg-accent transition-colors"
                          onClick={() => setSearchQuery('')}
                        >
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-sm text-muted-foreground">{tool.description}</div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-muted-foreground">{t('noResults')}</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <LanguageSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">{t('toggleTheme')}</span>
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">{t('openMenu')}</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="mt-6 space-y-6">
                    {/* Mobile Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        type="search"
                        placeholder={t('search')}
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* GitHub Link */}
                    <Link
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" className="w-full justify-start">
                        <Github className="h-5 w-5 mr-2" />
                        GitHub
                      </Button>
                    </Link>

                    {/* Language Switcher */}
                    <div className="flex justify-center">
                      <LanguageSwitcher />
                    </div>

                    {/* Theme Toggle */}
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    >
                      <Sun className="h-5 w-5 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-5 w-5 ml-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      {t('toggleTheme')}
                    </Button>

                    {/* Navigation */}
                    <nav className="space-y-4">
                      {toolCategories.map((category) => (
                        <div key={category.id}>
                          <h3 className="font-medium text-sm text-muted-foreground mb-2">
                            {category.name}
                          </h3>
                          <div className="space-y-1">
                            {category.tools.map((tool) => (
                              <Link
                                key={tool.id}
                                href={`/${locale}${tool.path}`}
                                className="block px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                {tool.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
      </div>
    </header>
  )
}