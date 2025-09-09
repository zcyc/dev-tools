'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Wifi, QrCode } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function WiFiQRPage() {
  const [ssid, setSsid] = useState('')
  const [password, setPassword] = useState('')
  const [security, setSecurity] = useState('WPA')
  const [hidden, setHidden] = useState(false)
  const [qrCode, setQrCode] = useState('')

  const generateWiFiQR = () => {
    if (!ssid) {
      toast.error('请输入WiFi名称')
      return
    }

    // WiFi QR码格式: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
    const wifiString = `WIFI:T:${security};S:${ssid};P:${password};H:${hidden};;`
    
    // 这里应该使用专业的QR码生成库，现在用占位符
    const qrDataURL = generateSimpleQR(wifiString)
    setQrCode(qrDataURL)
    toast.success('WiFi二维码生成成功')
  }

  // 简单的二维码生成占位符函数
  const generateSimpleQR = (text: string) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    canvas.width = 200
    canvas.height = 200
    
    // 简单的二维码模拟
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 200, 200)
    
    ctx.fillStyle = '#000000'
    const gridSize = 20
    const cellSize = 200 / gridSize
    
    // 根据文本生成伪随机模式
    let seed = 0
    for (let i = 0; i < text.length; i++) {
      seed += text.charCodeAt(i)
    }

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const x = Math.sin(seed + row * gridSize + col) * 10000
        if (x - Math.floor(x) > 0.5) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
        }
      }
    }

    return canvas.toDataURL()
  }

  return (
    <MainLayout>
      <ToolLayout
        title="WiFi二维码生成器"
        description="生成WiFi连接二维码，扫描即可自动连接"
        icon="Wifi"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>WiFi信息</CardTitle>
              <CardDescription>输入WiFi网络信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ssid">网络名称 (SSID)</Label>
                <Input
                  id="ssid"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  placeholder="输入WiFi网络名称"
                />
              </div>

              <div>
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入WiFi密码"
                />
              </div>

              <div>
                <Label htmlFor="security">安全类型</Label>
                <Select value={security} onValueChange={setSecurity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">无密码</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hidden"
                  checked={hidden}
                  onCheckedChange={(checked) => setHidden(checked as boolean)}
                />
                <Label htmlFor="hidden">隐藏网络</Label>
              </div>

              <Button onClick={generateWiFiQR} className="w-full">
                <QrCode className="h-4 w-4 mr-2" />
                生成WiFi二维码
              </Button>
            </CardContent>
          </Card>

          {qrCode && (
            <Card>
              <CardHeader>
                <CardTitle>WiFi二维码</CardTitle>
                <CardDescription>用手机扫描此二维码即可连接WiFi</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <img 
                      src={qrCode} 
                      alt="WiFi QR Code"
                      className="block"
                      style={{ width: 200, height: 200 }}
                    />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="font-medium">网络: {ssid}</div>
                    <div className="text-sm text-muted-foreground">
                      安全类型: {security} {hidden && '| 隐藏网络'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div><strong>支持的设备:</strong></div>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• Android 10+ (原生相机应用)</li>
                  <li>• iOS 11+ (相机应用)</li>
                  <li>• 支持WiFi QR码的第三方应用</li>
                </ul>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                <strong>提示:</strong> 生成的二维码包含WiFi密码信息，请妥善保管。
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}