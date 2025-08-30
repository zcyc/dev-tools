'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Search, Moon, Sun, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { toolCategories } from '@/types/tools'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  // Filter tools based on search query
  const filteredTools = toolCategories.flatMap(category =>
    category.tools.filter(tool =>
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DT</span>
            </div>
            <span className="font-bold text-xl">Dev Tools</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center max-w-sm w-full mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="搜索工具..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                    <div className="px-4 py-3 text-muted-foreground">未找到相关工具</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">切换主题</span>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">打开菜单</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="mt-6 space-y-6">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="搜索工具..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Theme Toggle */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  >
                    <Sun className="h-5 w-5 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 ml-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    切换主题
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
                              href={tool.path}
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