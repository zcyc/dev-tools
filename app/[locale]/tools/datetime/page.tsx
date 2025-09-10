'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Calendar, Clock, RefreshCw } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

const timezones = [
  { value: 'UTC', name: 'UTC', offset: '+00:00' },
  { value: 'Asia/Shanghai', name: '北京时间 (CST)', offset: '+08:00' },
  { value: 'America/New_York', name: '纽约时间 (EST/EDT)', offset: '-05:00/-04:00' },
  { value: 'America/Los_Angeles', name: '洛杉矶时间 (PST/PDT)', offset: '-08:00/-07:00' },
  { value: 'Europe/London', name: '伦敦时间 (GMT/BST)', offset: '+00:00/+01:00' },
  { value: 'Europe/Paris', name: '巴黎时间 (CET/CEST)', offset: '+01:00/+02:00' },
  { value: 'Asia/Tokyo', name: '东京时间 (JST)', offset: '+09:00' },
  { value: 'Asia/Dubai', name: '迪拜时间 (GST)', offset: '+04:00' }
]

const dateFormats = [
  { value: 'iso', name: 'ISO 8601', example: '2024-01-15T10:30:00Z' },
  { value: 'rfc', name: 'RFC 2822', example: 'Mon, 15 Jan 2024 10:30:00 GMT' },
  { value: 'locale-cn', name: '中文格式', example: '2024年1月15日 10:30:00' },
  { value: 'locale-us', name: '美式格式', example: '01/15/2024, 10:30:00 AM' },
  { value: 'locale-eu', name: '欧式格式', example: '15/01/2024, 10:30:00' },
  { value: 'custom', name: '自定义格式', example: 'YYYY-MM-DD HH:mm:ss' }
]

export default function DateTimeConverterPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timestamp, setTimestamp] = useState('')
  const [timestampUnit, setTimestampUnit] = useState<'seconds' | 'milliseconds'>('milliseconds')
  const [dateTimeInput, setDateTimeInput] = useState('')
  const [timezone, setTimezone] = useState('Asia/Shanghai')
  const [outputFormat, setOutputFormat] = useState('iso')
  const [customFormat, setCustomFormat] = useState('YYYY-MM-DD HH:mm:ss')
  
  const [convertedResults, setConvertedResults] = useState<{
    timestamp: number
    formatted: string
    timezone: string
    utc: string
    relative: string
  } | null>(null)

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getCurrentTimestamp = (unit: 'seconds' | 'milliseconds' = 'milliseconds') => {
    const now = Date.now()
    return unit === 'seconds' ? Math.floor(now / 1000) : now
  }

  const timestampToDate = () => {
    if (!timestamp.trim()) {
      toast.error('请输入时间戳')
      return
    }

    try {
      let ts = parseInt(timestamp)
      if (isNaN(ts)) {
        throw new Error('无效的时间戳格式')
      }

      // Convert to milliseconds if needed
      if (timestampUnit === 'seconds') {
        ts = ts * 1000
      }

      const date = new Date(ts)
      if (!isValidDate(date)) {
        throw new Error('无效的时间戳值')
      }

      const formatted = formatDate(date, outputFormat, timezone)
      const utc = date.toISOString()
      const relative = getRelativeTime(date)

      setConvertedResults({
        timestamp: ts,
        formatted,
        timezone,
        utc,
        relative
      })

      toast.success('时间戳转换成功')
    } catch (error) {
      toast.error('转换失败: ' + (error as Error).message)
    }
  }

  const dateToTimestamp = () => {
    if (!dateTimeInput.trim()) {
      toast.error('请输入日期时间')
      return
    }

    try {
      const date = new Date(dateTimeInput)
      if (!isValidDate(date)) {
        throw new Error('无效的日期时间格式')
      }

      const ts = date.getTime()
      const formatted = formatDate(date, outputFormat, timezone)
      const utc = date.toISOString()
      const relative = getRelativeTime(date)

      setConvertedResults({
        timestamp: ts,
        formatted,
        timezone,
        utc,
        relative
      })

      toast.success('日期时间转换成功')
    } catch (error) {
      toast.error('转换失败: ' + (error as Error).message)
    }
  }

  const isValidDate = (date: Date): boolean => {
    return date instanceof Date && !isNaN(date.getTime())
  }

  const formatDate = (date: Date, format: string, tz: string): string => {
    try {
      switch (format) {
        case 'iso':
          return date.toISOString()
        case 'rfc':
          return date.toUTCString()
        case 'locale-cn':
          return date.toLocaleString('zh-CN', { timeZone: tz })
        case 'locale-us':
          return date.toLocaleString('en-US', { timeZone: tz })
        case 'locale-eu':
          return date.toLocaleString('en-GB', { timeZone: tz })
        case 'custom':
          // Simple custom format implementation
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const hour = String(date.getHours()).padStart(2, '0')
          const minute = String(date.getMinutes()).padStart(2, '0')
          const second = String(date.getSeconds()).padStart(2, '0')
          
          return customFormat
            .replace('YYYY', year.toString())
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second)
        default:
          return date.toString()
      }
    } catch (error) {
      return date.toString()
    }
  }

  const getRelativeTime = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const absDiff = Math.abs(diff)
    const isFuture = diff < 0

    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour
    const week = 7 * day
    const month = 30 * day
    const year = 365 * day

    let unit: string
    let value: number

    if (absDiff < minute) {
      return '刚刚'
    } else if (absDiff < hour) {
      value = Math.floor(absDiff / minute)
      unit = '分钟'
    } else if (absDiff < day) {
      value = Math.floor(absDiff / hour)
      unit = '小时'
    } else if (absDiff < week) {
      value = Math.floor(absDiff / day)
      unit = '天'
    } else if (absDiff < month) {
      value = Math.floor(absDiff / week)
      unit = '周'
    } else if (absDiff < year) {
      value = Math.floor(absDiff / month)
      unit = '个月'
    } else {
      value = Math.floor(absDiff / year)
      unit = '年'
    }

    return isFuture ? `${value}${unit}后` : `${value}${unit}前`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const useCurrentTime = () => {
    const now = Date.now()
    setTimestamp(timestampUnit === 'seconds' ? Math.floor(now / 1000).toString() : now.toString())
  }

  const clearResults = () => {
    setConvertedResults(null)
    setTimestamp('')
    setDateTimeInput('')
  }

  return (
    <MainLayout>
      <ToolLayout
        title="日期时间转换"
        description="时间戳和日期格式相互转换工具"
        icon="Calendar"
      >
        <div className="space-y-6">
          {/* Current Time Display */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                当前时间
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">本地时间</Label>
                  <div className="font-mono text-sm bg-muted p-2 rounded">
                    {currentTime.toLocaleString('zh-CN')}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">UTC时间</Label>
                  <div className="font-mono text-sm bg-muted p-2 rounded">
                    {currentTime.toISOString()}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">时间戳 (毫秒)</Label>
                  <div className="font-mono text-sm bg-muted p-2 rounded">
                    {getCurrentTimestamp('milliseconds')}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium">时间戳 (秒)</Label>
                  <div className="font-mono text-sm bg-muted p-2 rounded">
                    {getCurrentTimestamp('seconds')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="timestamp-to-date" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="timestamp-to-date" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                时间戳转日期
              </TabsTrigger>
              <TabsTrigger value="date-to-timestamp" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                日期转时间戳
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timestamp-to-date" className="space-y-4">
              <h3 className="text-lg font-semibold">时间戳转换为日期</h3>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="timestamp">时间戳</Label>
                  <div className="flex gap-2">
                    <Input
                      id="timestamp"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      placeholder="输入时间戳"
                      className="font-mono"
                    />
                    <Button variant="outline" onClick={useCurrentTime} size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timestamp-unit">单位</Label>
                  <Select value={timestampUnit} onValueChange={(value: string) => setTimestampUnit(value as 'seconds' | 'milliseconds')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="milliseconds">毫秒 (JavaScript)</SelectItem>
                      <SelectItem value="seconds">秒 (Unix)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">时区</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          <div>
                            <div className="font-medium">{tz.name}</div>
                            <div className="text-xs text-muted-foreground">{tz.offset}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={timestampToDate} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                转换为日期
              </Button>
            </TabsContent>

            <TabsContent value="date-to-timestamp" className="space-y-4">
              <h3 className="text-lg font-semibold">日期转换为时间戳</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="datetime-input">日期时间</Label>
                  <Input
                    id="datetime-input"
                    type="datetime-local"
                    value={dateTimeInput}
                    onChange={(e) => setDateTimeInput(e.target.value)}
                  />
                  <div className="text-sm text-muted-foreground">
                    也可以输入: &apos;2024-01-15&apos;, &apos;2024-01-15 10:30:00&apos;, &apos;January 15, 2024&apos; 等格式
                  </div>
                </div>

                <Button onClick={dateToTimestamp} className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  转换为时间戳
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Output Format Configuration */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="output-format">输出格式</Label>
              <Select value={outputFormat} onValueChange={setOutputFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div>
                        <div className="font-medium">{format.name}</div>
                        <div className="text-xs text-muted-foreground">{format.example}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {outputFormat === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="custom-format">自定义格式</Label>
                <Input
                  id="custom-format"
                  value={customFormat}
                  onChange={(e) => setCustomFormat(e.target.value)}
                  placeholder="YYYY-MM-DD HH:mm:ss"
                />
              </div>
            )}
          </div>

          {/* Results */}
          {convertedResults && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">转换结果</CardTitle>
                  <Button variant="outline" onClick={clearResults} size="sm">
                    清除结果
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">时间戳 (毫秒)</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(convertedResults.timestamp.toString())}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-mono text-sm bg-muted p-2 rounded">
                        {convertedResults.timestamp}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">时间戳 (秒)</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(Math.floor(convertedResults.timestamp / 1000).toString())}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-mono text-sm bg-muted p-2 rounded">
                        {Math.floor(convertedResults.timestamp / 1000)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">格式化日期</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(convertedResults.formatted)}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-mono text-sm bg-muted p-2 rounded">
                        {convertedResults.formatted}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">UTC时间</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(convertedResults.utc)}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="font-mono text-sm bg-muted p-2 rounded">
                        {convertedResults.utc}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline">相对时间</Badge>
                    <span className="text-sm font-medium">{convertedResults.relative}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">时间戳说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Badge>Unix时间戳</Badge>
                <span className="text-sm text-muted-foreground">从1970-01-01 00:00:00 UTC开始的秒数</span>
              </div>
              <div className="flex gap-3">
                <Badge>JavaScript时间戳</Badge>
                <span className="text-sm text-muted-foreground">从1970-01-01 00:00:00 UTC开始的毫秒数</span>
              </div>
              <div className="flex gap-3">
                <Badge>时区转换</Badge>
                <span className="text-sm text-muted-foreground">同一时间戳在不同时区显示不同的本地时间</span>
              </div>
              <div className="flex gap-3">
                <Badge>ISO 8601</Badge>
                <span className="text-sm text-muted-foreground">国际标准日期时间格式</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}