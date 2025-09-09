'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Copy, Clock } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function CrontabGeneratorPage() {
  const [minute, setMinute] = useState('*')
  const [hour, setHour] = useState('*')
  const [day, setDay] = useState('*')
  const [month, setMonth] = useState('*')
  const [weekday, setWeekday] = useState('*')
  const [cronExpression, setCronExpression] = useState('* * * * *')

  const generateCron = () => {
    const expression = `${minute} ${hour} ${day} ${month} ${weekday}`
    setCronExpression(expression)
    toast.success('Cron表达式生成完成')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (err) {
      toast.error('复制失败')
    }
  }

  return (
    <MainLayout>
      <ToolLayout
        title="Crontab生成器"
        description="生成Cron定时任务表达式"
        icon="Clock"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>时间设置</CardTitle>
              <CardDescription>配置定时任务的执行时间</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-5">
                <div>
                  <Label>分钟 (0-59)</Label>
                  <Input
                    value={minute}
                    onChange={(e) => setMinute(e.target.value)}
                    placeholder="*"
                  />
                </div>
                <div>
                  <Label>小时 (0-23)</Label>
                  <Input
                    value={hour}
                    onChange={(e) => setHour(e.target.value)}
                    placeholder="*"
                  />
                </div>
                <div>
                  <Label>日 (1-31)</Label>
                  <Input
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="*"
                  />
                </div>
                <div>
                  <Label>月 (1-12)</Label>
                  <Input
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="*"
                  />
                </div>
                <div>
                  <Label>星期 (0-7)</Label>
                  <Input
                    value={weekday}
                    onChange={(e) => setWeekday(e.target.value)}
                    placeholder="*"
                  />
                </div>
              </div>
              
              <Button onClick={generateCron}>
                <Clock className="h-4 w-4 mr-2" />
                生成表达式
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Cron表达式</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(cronExpression)}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-2xl bg-muted p-4 rounded text-center">
                {cronExpression}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>常用表达式</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-mono">0 0 * * *</div>
                  <div>每天午夜</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-mono">0 */6 * * *</div>
                  <div>每6小时</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-mono">0 9 * * 1-5</div>
                  <div>工作日上午9点</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}