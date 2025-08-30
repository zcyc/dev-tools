'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Copy, Smartphone, RefreshCw } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function OTPGeneratorPage() {
  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(30)
  const [secret, setSecret] = useState('YOUR_SECRET_KEY')

  // 简单的OTP生成函数
  const generateOTP = () => {
    const timeWindow = Math.floor(Date.now() / 30000)
    const hash = (secret + timeWindow).split('').reduce((acc, char) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) & 0xffffffff
    }, 0)
    
    const otpCode = Math.abs(hash).toString().slice(-6).padStart(6, '0')
    setOtp(otpCode)
  }

  useEffect(() => {
    generateOTP()
    const interval = setInterval(() => {
      const now = Date.now()
      const secondsInWindow = Math.floor((now % 30000) / 1000)
      setTimeLeft(30 - secondsInWindow)
      
      if (secondsInWindow === 0) {
        generateOTP()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [secret])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('OTP已复制到剪贴板')
    } catch (err) {
      toast.error('复制失败')
    }
  }

  return (
    <MainLayout>
      <ToolLayout
        title="OTP代码生成器"
        description="生成基于时间的一次性密码(TOTP)"
        icon="Smartphone"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>密钥设置</CardTitle>
              <CardDescription>输入共享密钥来生成OTP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="secret">共享密钥</Label>
                <Input
                  id="secret"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="输入共享密钥"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>当前OTP码</CardTitle>
                  <CardDescription>6位数字验证码</CardDescription>
                </div>
                <Badge variant={timeLeft > 10 ? "default" : "destructive"}>
                  {timeLeft}秒
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-mono font-bold tracking-wider bg-muted px-6 py-4 rounded-lg flex-1 text-center">
                  {otp}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(otp)}
                  className="h-12 w-12"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>OTP说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                基于时间的一次性密码(TOTP)是一种双因素认证方法，每30秒生成一个新的6位验证码。
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded text-sm">
                <strong>注意:</strong> 这是一个演示工具。实际应用中请使用专业的认证器应用如Google Authenticator。
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}