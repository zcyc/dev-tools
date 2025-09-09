'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HelpCircle } from 'lucide-react'
import { validateCronComponent } from '@/lib/cron-parser'

export type FieldType = 'minute' | 'hour' | 'day' | 'month' | 'weekday'

interface CrontabFieldProps {
  type: FieldType
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  weekdays?: Record<string, string>
  months?: Record<string, string>
  locale?: 'en' | 'zh'
}

interface FieldOption {
  value: string
  label: string
  description?: string
}

export function CrontabField({
  type,
  value,
  onChange,
  label,
  placeholder,
  weekdays = {},
  months = {},
  locale = 'en'
}: CrontabFieldProps) {
  const [inputMode, setInputMode] = useState<'simple' | 'advanced'>('simple')
  const [isValid, setIsValid] = useState(true)

  // Validate input on change
  useEffect(() => {
    const valid = validateCronComponent(value, type)
    setIsValid(valid)
  }, [value, type])

  // Generate options based on field type
  const getFieldOptions = (): FieldOption[] => {
    const options: FieldOption[] = [
      { value: '*', label: locale === 'zh' ? '每' : 'Every', description: placeholder }
    ]

    switch (type) {
      case 'minute':
        // Add common minute options
        for (let i = 0; i < 60; i += 5) {
          options.push({
            value: i.toString(),
            label: `${i}`,
            description: locale === 'zh' ? `第${i}分钟` : `Minute ${i}`
          })
        }
        // Add interval options
        options.push(
          { value: '*/5', label: locale === 'zh' ? '每5分钟' : 'Every 5 minutes' },
          { value: '*/10', label: locale === 'zh' ? '每10分钟' : 'Every 10 minutes' },
          { value: '*/15', label: locale === 'zh' ? '每15分钟' : 'Every 15 minutes' },
          { value: '*/30', label: locale === 'zh' ? '每30分钟' : 'Every 30 minutes' }
        )
        break

      case 'hour':
        // Add hour options
        for (let i = 0; i < 24; i++) {
          const hourStr = i.toString().padStart(2, '0')
          options.push({
            value: i.toString(),
            label: `${hourStr}:00`,
            description: locale === 'zh' ? `${i}点` : `Hour ${i}`
          })
        }
        // Add interval options
        options.push(
          { value: '*/2', label: locale === 'zh' ? '每2小时' : 'Every 2 hours' },
          { value: '*/4', label: locale === 'zh' ? '每4小时' : 'Every 4 hours' },
          { value: '*/6', label: locale === 'zh' ? '每6小时' : 'Every 6 hours' },
          { value: '*/12', label: locale === 'zh' ? '每12小时' : 'Every 12 hours' }
        )
        break

      case 'day':
        // Add day options
        for (let i = 1; i <= 31; i++) {
          options.push({
            value: i.toString(),
            label: i.toString(),
            description: locale === 'zh' ? `${i}日` : `Day ${i}`
          })
        }
        // Add special options
        options.push(
          { value: 'L', label: locale === 'zh' ? '月末' : 'Last day' }
        )
        break

      case 'month':
        // Add month options
        Object.entries(months).forEach(([key, name]) => {
          options.push({
            value: key,
            label: name,
            description: locale === 'zh' ? `${name}份` : name
          })
        })
        break

      case 'weekday':
        // Add weekday options
        Object.entries(weekdays).forEach(([key, name]) => {
          if (key !== '7') { // Avoid duplicate Sunday
            options.push({
              value: key,
              label: name,
              description: locale === 'zh' ? name : name
            })
          }
        })
        // Add special options
        options.push(
          { value: '1-5', label: locale === 'zh' ? '工作日' : 'Weekdays' },
          { value: '6,0', label: locale === 'zh' ? '周末' : 'Weekends' }
        )
        break
    }

    return options
  }

  const fieldOptions = getFieldOptions()

  const getFieldRange = () => {
    switch (type) {
      case 'minute': return '0-59'
      case 'hour': return '0-23'
      case 'day': return '1-31'
      case 'month': return '1-12'
      case 'weekday': return '0-7'
      default: return ''
    }
  }

  const getFieldExamples = () => {
    switch (type) {
      case 'minute':
        return locale === 'zh' 
          ? ['0 (每小时整点)', '15 (每小时第15分钟)', '*/5 (每5分钟)', '0,30 (整点和半点)']
          : ['0 (every hour)', '15 (minute 15)', '*/5 (every 5 min)', '0,30 (hourly twice)']
      case 'hour':
        return locale === 'zh'
          ? ['0 (午夜)', '9 (上午9点)', '*/6 (每6小时)', '9-17 (工作时间)']
          : ['0 (midnight)', '9 (9 AM)', '*/6 (every 6h)', '9-17 (work hours)']
      case 'day':
        return locale === 'zh'
          ? ['1 (每月1日)', '15 (每月15日)', '*/2 (每隔一天)', '1,15 (月初和月中)']
          : ['1 (1st day)', '15 (15th day)', '*/2 (every 2 days)', '1,15 (twice monthly)']
      case 'month':
        return locale === 'zh'
          ? ['1 (1月)', '6 (6月)', '1,7 (1月和7月)', '3-5 (春季)']
          : ['1 (January)', '6 (June)', '1,7 (Jan & Jul)', '3-5 (Spring)']
      case 'weekday':
        return locale === 'zh'
          ? ['0 (周日)', '1 (周一)', '1-5 (工作日)', '6,0 (周末)']
          : ['0 (Sunday)', '1 (Monday)', '1-5 (weekdays)', '6,0 (weekends)']
      default:
        return []
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Label className="text-xs sm:text-sm font-medium truncate">{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <HelpCircle className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" side="right">
            <div className="space-y-2">
              <div className="font-medium text-sm">
                {locale === 'zh' ? '取值范围' : 'Valid Range'}: {getFieldRange()}
              </div>
              <div className="text-sm text-muted-foreground">
                {locale === 'zh' ? '示例：' : 'Examples:'}
              </div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                {getFieldExamples().map((example, idx) => (
                  <li key={idx}>• {example}</li>
                ))}
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          {inputMode === 'simple' && fieldOptions.length > 1 ? (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className={`${!isValid ? 'border-red-500' : ''}`}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {fieldOptions.map((option, index) => (
                  <SelectItem key={`${option.value}-${index}`} value={option.value}>
                    <div className="flex flex-col">
                      <span className="truncate">{option.label}</span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground truncate">
                          {option.description}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`${!isValid ? 'border-red-500' : ''}`}
            />
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setInputMode(inputMode === 'simple' ? 'advanced' : 'simple')}
          className="px-2 sm:px-3 text-xs whitespace-nowrap flex-shrink-0"
        >
          {inputMode === 'simple' ? 
            (locale === 'zh' ? '高级' : 'Adv') : 
            (locale === 'zh' ? '简单' : 'Simple')
          }
        </Button>
      </div>

      {!isValid && (
        <div className="text-xs text-red-500">
          {locale === 'zh' 
            ? `无效值，请输入 ${getFieldRange()} 范围内的值` 
            : `Invalid value. Please enter a value in range ${getFieldRange()}`
          }
        </div>
      )}
    </div>
  )
}