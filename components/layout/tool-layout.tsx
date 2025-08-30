import { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import * as Icons from 'lucide-react'

// Map icon names to actual icon components
const getIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName]
  return IconComponent || Icons.Settings
}

interface ToolLayoutProps {
  title: string
  description: string
  icon: string
  children: ReactNode
}

export function ToolLayout({ title, description, icon, children }: ToolLayoutProps) {
  const IconComponent = getIcon(icon)
  
  return (
    <div className="space-y-6">
      {/* Tool Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-primary/10">
          <IconComponent className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      {/* Tool Content */}
      <Card>
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}