'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, Zap, Calendar, Briefcase, Moon, Sun, RotateCcw, Copy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { CRON_PRESETS } from '@/lib/cron-parser'

interface PresetOption {
  key: keyof typeof CRON_PRESETS
  name: string
  description: string
  expression: string
  icon: React.ReactNode
  category: 'basic' | 'work' | 'system'
}

interface CrontabPresetsProps {
  onSelectPreset: (expression: string) => void
  locale?: 'en' | 'zh'
  translations: {
    title: string
    everyMinute: string
    everyHour: string
    everyDay: string
    everyWeek: string
    everyMonth: string
    everyYear: string
    workdaysAt9: string
    every6Hours: string
    twiceDaily: string
    weeklyBackup: string
    copied: string
  }
}

export function CrontabPresets({ onSelectPreset, locale = 'en', translations }: CrontabPresetsProps) {
  const { toast } = useToast()
  
  const presetOptions: PresetOption[] = [
    {
      key: 'everyMinute',
      name: translations.everyMinute,
      description: '',  // Remove duplicate description
      expression: CRON_PRESETS.everyMinute,
      icon: <Zap className="h-4 w-4" />,
      category: 'basic'
    },
    {
      key: 'everyHour',
      name: translations.everyHour,
      description: '',  // Remove duplicate description
      expression: CRON_PRESETS.everyHour,
      icon: <Clock className="h-4 w-4" />,
      category: 'basic'
    },
    {
      key: 'everyDay',
      name: translations.everyDay,
      description: '',  // Remove duplicate description
      expression: CRON_PRESETS.everyDay,
      icon: <Sun className="h-4 w-4" />,
      category: 'basic'
    },
    {
      key: 'everyWeek',
      name: translations.everyWeek,
      description: '',  // Remove duplicate description
      expression: CRON_PRESETS.everyWeek,
      icon: <Calendar className="h-4 w-4" />,
      category: 'basic'
    },
    {
      key: 'everyMonth',
      name: translations.everyMonth,
      description: '',  // Remove duplicate description
      expression: CRON_PRESETS.everyMonth,
      icon: <Calendar className="h-4 w-4" />,
      category: 'basic'
    },
    {
      key: 'everyYear',
      name: translations.everyYear,
      description: '',  // Remove duplicate description
      expression: CRON_PRESETS.everyYear,
      icon: <Calendar className="h-4 w-4" />,
      category: 'basic'
    },
    {
      key: 'workdaysAt9',
      name: translations.workdaysAt9,
      description: '',  // Remove duplicate description
      expression: CRON_PRESETS.workdaysAt9,
      icon: <Briefcase className="h-4 w-4" />,
      category: 'work'
    },
    {
      key: 'every6Hours',
      name: translations.every6Hours,
      description: '',  // Remove duplicate description
      expression: CRON_PRESETS.every6Hours,
      icon: <RotateCcw className="h-4 w-4" />,
      category: 'system'
    },
    {
      key: 'twiceDaily',
      name: translations.twiceDaily,
      description: '',  // Remove duplicate description
      expression: CRON_PRESETS.twiceDaily,
      icon: <Sun className="h-4 w-4" />,
      category: 'work'
    },
    {
      key: 'weeklyBackup',
      name: translations.weeklyBackup,
      description: '',  // Remove duplicate description
      expression: CRON_PRESETS.weeklyBackup,
      icon: <Moon className="h-4 w-4" />,
      category: 'system'
    }
  ]

  const getCategoryTitle = (category: PresetOption['category']) => {
    switch (category) {
      case 'basic':
        return locale === 'zh' ? '基础计划' : 'Basic Schedules'
      case 'work':
        return locale === 'zh' ? '工作计划' : 'Work Schedules'
      case 'system':
        return locale === 'zh' ? '系统计划' : 'System Schedules'
      default:
        return ''
    }
  }

  const getCategoryColor = (category: PresetOption['category']) => {
    switch (category) {
      case 'basic':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'work':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'system':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const categories = Array.from(new Set(presetOptions.map(preset => preset.category)))

  const copyToClipboard = async (text: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: translations.copied,
        description: text
      })
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          {translations.title}
        </CardTitle>
        <CardDescription>
          {locale === 'zh' 
            ? '快速选择常用的定时任务模式' 
            : 'Quick selection for common scheduling patterns'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map(category => (
          <div key={category} className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={getCategoryColor(category)}>
                {getCategoryTitle(category)}
              </Badge>
            </div>
            
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {presetOptions
                .filter(preset => preset.category === category)
                .map((preset) => (
                  <Card 
                    key={preset.key} 
                    className="cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border-l-4 border-l-transparent hover:border-l-primary"
                    onClick={() => onSelectPreset(preset.expression)}
                  >
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {preset.icon}
                          <h4 className="font-medium text-sm truncate">{preset.name}</h4>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono truncate flex-1">
                            {preset.expression}
                          </code>
                          <Copy 
                            className="h-3 w-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
                            onClick={(e: React.MouseEvent) => copyToClipboard(preset.expression, e)}
                            data-title={locale === 'zh' ? '点击复制' : 'Click to copy'}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}


      </CardContent>
    </Card>
  )
}