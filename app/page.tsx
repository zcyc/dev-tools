import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MainLayout } from '@/components/layout/main-layout'
import { toolCategories } from '@/types/tools'
import * as Icons from 'lucide-react'

// Map icon names to actual icon components
const getIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName]
  return IconComponent || Icons.Settings
}

export default function HomePage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Dev Tools - 开发者工具集合
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            免费的在线开发者工具集合，包含30+种ID生成与解析、加密解密、格式转换、Web工具等多种实用工具
          </p>
        </div>

        {/* Tool Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {toolCategories.map((category) => {
            const CategoryIcon = getIcon(category.icon)
            return (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <CategoryIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {category.tools.length} 个工具
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    {category.tools.map((tool) => {
                      const ToolIcon = getIcon(tool.icon)
                      return (
                        <Link
                          key={tool.id}
                          href={tool.path}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <ToolIcon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="font-medium text-sm">{tool.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {tool.description}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-muted-foreground mt-16">
          <p>© 2024 Dev Tools. 所有工具均可免费使用.</p>
        </div>
      </div>
    </MainLayout>
  )
}