'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { describeCronExpression, parseCronExpression } from '@/lib/cron-parser'
import { toast } from 'sonner'

interface CronDescriptionProps {
  expression: string
  locale?: 'en' | 'zh'
  translations: {
    currentExpression: string
    readableDescription: string
    copyExpression: string
    copied: string
    copyFailed: string
  }
}

export function CronDescription({ 
  expression, 
  locale = 'en', 
  translations 
}: CronDescriptionProps) {
  const [description, setDescription] = useState<{ text: string; type: string }>({
    text: '',
    type: 'custom'
  })
  const [isValid, setIsValid] = useState(true)
  const [nextRuns, setNextRuns] = useState<string[]>([])

  useEffect(() => {
    const generateNextRuns = (expr: string): string[] => {
      // This is a simplified implementation for demo purposes
      // In a real application, you'd use a proper cron parser library
      const now = new Date()
      const runs: string[] = []
      
      // Generate some mock next run times based on common patterns
      if (expr === '* * * * *') {
        // Every minute
        for (let i = 1; i <= 5; i++) {
          const next = new Date(now.getTime() + i * 60000)
          runs.push(next.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US'))
        }
      } else if (expr === '0 * * * *') {
        // Every hour
        for (let i = 1; i <= 5; i++) {
          const next = new Date(now.getTime() + i * 3600000)
          next.setMinutes(0, 0, 0)
          runs.push(next.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US'))
        }
      } else if (expr === '0 0 * * *') {
        // Every day at midnight
        for (let i = 1; i <= 5; i++) {
          const next = new Date(now.getTime() + i * 86400000)
          next.setHours(0, 0, 0, 0)
          runs.push(next.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US'))
        }
      } else {
        // Generic mock for other expressions
        for (let i = 1; i <= 3; i++) {
          const next = new Date(now.getTime() + i * 3600000 * 6) // Every 6 hours as fallback
          runs.push(next.toLocaleString(locale === 'zh' ? 'zh-CN' : 'en-US'))
        }
      }
      
      return runs
    }

    try {
      // Validate and describe the expression
      const desc = describeCronExpression(expression, locale)
      setDescription({ text: desc.text, type: desc.type })
      
      // Parse the expression to check validity
      parseCronExpression(expression)
      setIsValid(true)
      
      // Calculate next run times (simplified for demo)
      const mockNextRuns = generateNextRuns(expression)
      setNextRuns(mockNextRuns)
    } catch {
      setIsValid(false)
      setDescription({
        text: locale === 'zh' ? '无效的 Cron 表达式' : 'Invalid cron expression',
        type: 'error'
      })
      setNextRuns([])
    }
  }, [expression, locale])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(expression)
      toast.success(translations.copied)
    } catch {
      toast.error(translations.copyFailed)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'everyMinute':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'everyHour':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'everyDay':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'everyWeek':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'everyMonth':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeLabel = (type: string) => {
    if (type === 'error') return locale === 'zh' ? '错误' : 'Error'
    if (type === 'custom') return locale === 'zh' ? '自定义' : 'Custom'
    return locale === 'zh' ? '预设' : 'Preset'
  }

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Current Expression Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-base sm:text-lg truncate">{translations.currentExpression}</h3>
              <Badge variant="outline" className={getTypeColor(description.type)}>
                {getTypeLabel(description.type)}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2 whitespace-nowrap flex-shrink-0"
            >
              <Copy className="h-4 w-4" />
              {translations.copyExpression}
            </Button>
          </div>

          {/* Expression Display */}
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <code className="text-lg sm:text-2xl font-mono font-bold text-primary break-all">
                {expression}
              </code>
              {isValid ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <AlertCircle className="h-6 w-6 text-red-500" />
              )}
            </div>
          </div>

          {/* Human Readable Description */}
          <div className="space-y-2">
            <h4 className="font-medium text-md flex items-center gap-2">
              {translations.readableDescription}
            </h4>
            <div className={`p-4 rounded-lg border-l-4 ${
              isValid 
                ? 'bg-green-50 border-l-green-500 dark:bg-green-950' 
                : 'bg-red-50 border-l-red-500 dark:bg-red-950'
            }`}>
              <p className={`text-lg ${
                isValid ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
              }`}>
                {description.text}
              </p>
            </div>
          </div>

          {/* Next Run Times */} 
          {isValid && nextRuns.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-md">
                {locale === 'zh' ? '下次执行时间' : 'Next Run Times'}
              </h4>
              <div className="grid gap-2">
                {nextRuns.slice(0, 3).map((run, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted/50 rounded text-sm"
                  >
                    <Badge variant="outline" className="w-6">{index + 1}</Badge>
                    <span className="font-mono">{run}</span>
                  </div>
                ))}
              </div>
              
              {nextRuns.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  {locale === 'zh' 
                    ? `还有 ${nextRuns.length - 3} 个执行时间...` 
                    : `${nextRuns.length - 3} more execution times...`
                  }
                </p>
              )}
            </div>
          )}

          {/* Expression Breakdown */}
          {isValid && (
            <div className="space-y-2">
              <h4 className="font-medium text-md">
                {locale === 'zh' ? '表达式分解' : 'Expression Breakdown'}
              </h4>
              <div className="grid grid-cols-5 gap-1 sm:gap-2 text-xs sm:text-sm">
                {expression.split(' ').map((part, index) => {
                  const labels = locale === 'zh' 
                    ? ['分钟', '小时', '日', '月', '星期']
                    : ['Minute', 'Hour', 'Day', 'Month', 'Weekday']
                  
                  return (
                    <div key={index} className="text-center">
                      <div className="font-mono text-sm sm:text-lg font-bold text-primary p-1 sm:p-2 bg-muted rounded">
                        {part}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {labels[index]}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}