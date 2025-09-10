'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
// import { useLocale } from 'next-intl'
import { cn } from '@/lib/utils'
import { useLocalizedTools } from '@/lib/i18n-tools'
import { ScrollArea } from '@/components/ui/scroll-area'
// Badge import removed - not used
import * as Icons from 'lucide-react'

// Map icon names to actual icon components
const getIcon = (iconName: string) => {
  const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName]
  return IconComponent || Icons.Settings
}

export function Sidebar() {
  const pathname = usePathname()
  // Extract locale from pathname
  const locale = pathname.startsWith('/zh') ? 'zh' : 'en'
  const toolCategories = useLocalizedTools()

  return (
    <div className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 top-16 z-40">
      <div className="flex-1 bg-background border-r">
        <ScrollArea className="h-[calc(100vh-4rem)] py-6 px-4">
          <nav className="space-y-8">
            {toolCategories.map((category) => {
              const CategoryIcon = getIcon(category.icon)
              return (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <CategoryIcon className="h-4 w-4 text-primary" />
                    <h3 className="font-medium text-sm text-foreground">
                      {category.name}
                    </h3>
                  </div>
                  <ul className="space-y-1 ml-2">
                    {category.tools.map((tool) => {
                      const ToolIcon = getIcon(tool.icon)
                      const toolPath = `/${locale}${tool.path}`
                      const isActive = pathname === toolPath
                      return (
                        <li key={tool.id}>
                          <Link
                            href={toolPath}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors hover:bg-muted/50',
                              isActive && 'bg-primary/10 text-primary font-medium border-r-2 border-primary'
                            )}
                          >
                            <ToolIcon className={cn(
                              'h-4 w-4',
                              isActive ? 'text-primary' : 'text-muted-foreground'
                            )} />
                            <span className="flex-1">{tool.name}</span>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}