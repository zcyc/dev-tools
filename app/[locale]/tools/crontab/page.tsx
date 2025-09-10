'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { Clock, RotateCcw, Sparkles } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { CrontabField } from '@/components/crontab-field'
import { CrontabPresets } from '@/components/crontab-presets'
import { CronDescription } from '@/components/cron-description'
import { toast } from 'sonner'

type Props = {
  params: Promise<{ locale: string }>;
};

export default function CrontabGeneratorPage({ params }: Props) {
  const [locale, setLocale] = useState<'en' | 'zh'>('zh')
  const [minute, setMinute] = useState('*')
  const [hour, setHour] = useState('*')
  const [day, setDay] = useState('*')
  const [month, setMonth] = useState('*')
  const [weekday, setWeekday] = useState('*')
  const [cronExpression, setCronExpression] = useState('* * * * *')

  // Initialize locale
  useEffect(() => {
    const initializeLocale = async () => {
      try {
        const resolvedParams = await params
        setLocale(resolvedParams.locale as 'en' | 'zh')
      } catch (error) {
        setLocale('zh') // fallback
      }
    }
    initializeLocale()
  }, [params])

  // Update cron expression when individual fields change
  useEffect(() => {
    const expression = `${minute} ${hour} ${day} ${month} ${weekday}`
    setCronExpression(expression)
  }, [minute, hour, day, month, weekday])

  // Translations object
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      zh: {
        // Page level
        title: 'Crontab 生成器',
        pageDescription: '生成和自定义 Cron 定时任务表达式',
        
        // Description component
        currentExpression: '当前表达式',
        readableDescription: '可读描述',
        copyExpression: '复制表达式',
        copied: '已复制到剪贴板',
        copyFailed: '复制失败',
        
        // Time settings
        timeSettings: '时间设置',
        timeSettingsDesc: '配置定时任务的执行时间',
        
        // Field labels
        'fields.minute': '分钟 (0-59)',
        'fields.hour': '小时 (0-23)',
        'fields.day': '日 (1-31)',
        'fields.month': '月 (1-12)',
        'fields.weekday': '星期 (0-7)',
        
        // Placeholders
        'placeholders.minute': '每分钟',
        'placeholders.hour': '每小时',
        'placeholders.day': '每天',
        'placeholders.month': '每月',
        'placeholders.weekday': '每星期',
        
        // Presets
        'presets.title': '常用预设',
        'presets.everyMinute': '每分钟',
        'presets.everyHour': '每小时',
        'presets.everyDay': '每天午夜',
        'presets.everyWeek': '每周日午夜',
        'presets.everyMonth': '每月1日午夜',
        'presets.everyYear': '每年1月1日午夜',
        'presets.workdaysAt9': '工作日上午9点',
        'presets.every6Hours': '每6小时',
        'presets.twiceDaily': '每日两次 (上午6点和下午6点)',
        'presets.weeklyBackup': '每周备份 (周日凌晨2点)',
        'presets.copied': '已复制到剪贴板',
        
        // Actions
        'actions.generate': '生成表达式',
        'actions.reset': '重置',
        'actions.usePreset': '使用预设',
        
        // Messages
        'messages.generated': 'Cron 表达式生成成功',
        'messages.presetApplied': '预设应用成功',
        'messages.reset': '已重置为默认值'
      },
      en: {
        // Page level
        title: 'Crontab Generator',
        pageDescription: 'Generate and customize Cron scheduled task expressions',
        
        // Description component
        currentExpression: 'Current Expression',
        readableDescription: 'Description',
        copyExpression: 'Copy Expression',
        copied: 'Copied to clipboard',
        copyFailed: 'Copy failed',
        
        // Time settings
        timeSettings: 'Time Settings',
        timeSettingsDesc: 'Configure scheduled task execution time',
        
        // Field labels
        'fields.minute': 'Minute (0-59)',
        'fields.hour': 'Hour (0-23)',
        'fields.day': 'Day (1-31)',
        'fields.month': 'Month (1-12)',
        'fields.weekday': 'Weekday (0-7)',
        
        // Placeholders
        'placeholders.minute': 'Every minute',
        'placeholders.hour': 'Every hour',
        'placeholders.day': 'Every day',
        'placeholders.month': 'Every month',
        'placeholders.weekday': 'Every day of week',
        
        // Presets
        'presets.title': 'Common Presets',
        'presets.everyMinute': 'Every minute',
        'presets.everyHour': 'Every hour',
        'presets.everyDay': 'Every day at midnight',
        'presets.everyWeek': 'Every Sunday at midnight',
        'presets.everyMonth': 'Every 1st of month at midnight',
        'presets.everyYear': 'Every January 1st at midnight',
        'presets.workdaysAt9': 'Weekdays at 9 AM',
        'presets.every6Hours': 'Every 6 hours',
        'presets.twiceDaily': 'Twice daily (6 AM and 6 PM)',
        'presets.weeklyBackup': 'Weekly backup (Sunday 2 AM)',
        'presets.copied': 'Copied to clipboard',
        
        // Actions
        'actions.generate': 'Generate Expression',
        'actions.reset': 'Reset',
        'actions.usePreset': 'Use Preset',
        
        // Messages
        'messages.generated': 'Cron expression generated successfully',
        'messages.presetApplied': 'Preset applied successfully',
        'messages.reset': 'Reset to default values'
      }
    }
    return translations[locale]?.[key] || key
  }

  // Weekdays mapping
  const weekdays = locale === 'zh' ? {
    '0': '星期日', '1': '星期一', '2': '星期二', '3': '星期三',
    '4': '星期四', '5': '星期五', '6': '星期六', '7': '星期日'
  } : {
    '0': 'Sunday', '1': 'Monday', '2': 'Tuesday', '3': 'Wednesday',
    '4': 'Thursday', '5': 'Friday', '6': 'Saturday', '7': 'Sunday'
  }

  // Months mapping
  const months = locale === 'zh' ? {
    '1': '1月', '2': '2月', '3': '3月', '4': '4月', '5': '5月', '6': '6月',
    '7': '7月', '8': '8月', '9': '9月', '10': '10月', '11': '11月', '12': '12月'
  } : {
    '1': 'January', '2': 'February', '3': 'March', '4': 'April', '5': 'May', '6': 'June',
    '7': 'July', '8': 'August', '9': 'September', '10': 'October', '11': 'November', '12': 'December'
  }

  const handlePresetSelect = (expression: string) => {
    const parts = expression.split(' ')
    if (parts.length === 5) {
      setMinute(parts[0])
      setHour(parts[1])
      setDay(parts[2])
      setMonth(parts[3])
      setWeekday(parts[4])
      toast.success(t('messages.presetApplied'))
    }
  }

  const handleReset = () => {
    setMinute('*')
    setHour('*')
    setDay('*')
    setMonth('*')
    setWeekday('*')
    toast.success(t('messages.reset'))
  }

  const handleGenerate = () => {
    toast.success(t('messages.generated'))
  }

  // Preset translations
  const presetTranslations = {
    title: t('presets.title'),
    everyMinute: t('presets.everyMinute'),
    everyHour: t('presets.everyHour'),
    everyDay: t('presets.everyDay'),
    everyWeek: t('presets.everyWeek'),
    everyMonth: t('presets.everyMonth'),
    everyYear: t('presets.everyYear'),
    workdaysAt9: t('presets.workdaysAt9'),
    every6Hours: t('presets.every6Hours'),
    twiceDaily: t('presets.twiceDaily'),
    weeklyBackup: t('presets.weeklyBackup'),
    copied: t('presets.copied')
  }

  // Description translations
  const descriptionTranslations = {
    currentExpression: t('currentExpression'),
    readableDescription: t('readableDescription'),
    copyExpression: t('copyExpression'),
    copied: t('copied'),
    copyFailed: t('copyFailed')
  }

  return (
    <MainLayout>
      <ToolLayout
        title={t('title')}
        description={t('pageDescription')}
        icon="Clock"
      >
        <div className="space-y-8">
          {/* Real-time Expression Description */}
          <CronDescription
            expression={cronExpression}
            locale={locale}
            translations={descriptionTranslations}
          />

          <div className="space-y-6">
              {/* Time Settings Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        {t('timeSettings')}
                      </CardTitle>
                      <CardDescription>{t('timeSettingsDesc')}</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      {t('actions.reset')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Time Fields Grid */}
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <CrontabField
                      type="minute"
                      value={minute}
                      onChange={setMinute}
                      label={t('fields.minute')}
                      placeholder={t('placeholders.minute')}
                      locale={locale}
                    />
                    
                    <CrontabField
                      type="hour"
                      value={hour}
                      onChange={setHour}
                      label={t('fields.hour')}
                      placeholder={t('placeholders.hour')}
                      locale={locale}
                    />
                    
                    <CrontabField
                      type="day"
                      value={day}
                      onChange={setDay}
                      label={t('fields.day')}
                      placeholder={t('placeholders.day')}
                      locale={locale}
                    />
                    
                    <CrontabField
                      type="month"
                      value={month}
                      onChange={setMonth}
                      label={t('fields.month')}
                      placeholder={t('placeholders.month')}
                      months={months}
                      locale={locale}
                    />
                    
                    <CrontabField
                      type="weekday"
                      value={weekday}
                      onChange={setWeekday}
                      label={t('fields.weekday')}
                      placeholder={t('placeholders.weekday')}
                      weekdays={weekdays}
                      locale={locale}
                    />
                  </div>

                  <Separator />

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button onClick={handleGenerate} className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {t('actions.generate')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Common Presets */}
              <CrontabPresets
                onSelectPreset={handlePresetSelect}
                locale={locale}
                translations={presetTranslations}
              />
            </div>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}