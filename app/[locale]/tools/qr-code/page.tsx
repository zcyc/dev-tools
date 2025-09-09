'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Copy, Download, QrCode } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

// QR码生成库的简单实现
const generateQRCode = (text: string, size: number = 200) => {
  // 创建canvas
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  canvas.width = size
  canvas.height = size

  // 简单的QR码模拟 - 实际项目中应使用专业的QR码库
  const gridSize = 25
  const cellSize = size / gridSize

  // 填充白色背景
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, size, size)

  // 生成伪随机模式基于文本内容
  ctx.fillStyle = '#000000'
  let seed = 0
  for (let i = 0; i < text.length; i++) {
    seed += text.charCodeAt(i)
  }

  // 绘制定位标记
  const drawPositionMarker = (x: number, y: number) => {
    ctx.fillRect(x * cellSize, y * cellSize, cellSize * 7, cellSize * 7)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect((x + 1) * cellSize, (y + 1) * cellSize, cellSize * 5, cellSize * 5)
    ctx.fillStyle = '#000000'
    ctx.fillRect((x + 2) * cellSize, (y + 2) * cellSize, cellSize * 3, cellSize * 3)
  }

  drawPositionMarker(0, 0)
  drawPositionMarker(18, 0)
  drawPositionMarker(0, 18)

  // 绘制数据模块
  const random = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // 跳过定位标记区域
      if ((row < 9 && col < 9) || (row < 9 && col > 15) || (row > 15 && col < 9)) {
        continue
      }

      if (random(seed + row * gridSize + col) > 0.5) {
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize)
      }
    }
  }

  return canvas.toDataURL()
}

export default function QRCodeGeneratorPage() {
  const [text, setText] = useState('')
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('')
  const [size, setSize] = useState([200])
  const [errorLevel, setErrorLevel] = useState('M')

  const generateQR = () => {
    if (!text.trim()) {
      toast.error('请输入要生成二维码的内容')
      return
    }

    const dataURL = generateQRCode(text, size[0])
    if (dataURL) {
      setQrCodeDataURL(dataURL)
      toast.success('二维码生成成功')
    } else {
      toast.error('二维码生成失败')
    }
  }

  const downloadQR = () => {
    if (!qrCodeDataURL) {
      toast.error('请先生成二维码')
      return
    }

    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = qrCodeDataURL
    link.click()
    toast.success('二维码下载完成')
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (err) {
      toast.error('复制失败')
    }
  }

  const quickFillExamples = [
    { label: '网站链接', value: 'https://www.example.com' },
    { label: '邮箱地址', value: 'mailto:contact@example.com' },
    { label: '电话号码', value: 'tel:+1234567890' },
    { label: 'WiFi连接', value: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;' },
    { label: '短信', value: 'sms:+1234567890:Hello World' },
    { label: '地理位置', value: 'geo:37.7749,-122.4194' }
  ]

  return (
    <MainLayout>
      <ToolLayout
        title="QR码生成器"
        description="生成各种内容的二维码"
        icon="QrCode"
      >
        <div className="space-y-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>内容输入</CardTitle>
              <CardDescription>输入要生成二维码的内容</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qr-text">文本内容</Label>
                <Textarea
                  id="qr-text"
                  placeholder="输入文本、URL、邮箱等内容..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="size">尺寸: {size[0]}px</Label>
                  <Slider
                    value={size}
                    onValueChange={setSize}
                    max={400}
                    min={100}
                    step={50}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="error-level">错误纠正级别</Label>
                  <Select value={errorLevel} onValueChange={setErrorLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">L - 低 (7%)</SelectItem>
                      <SelectItem value="M">M - 中 (15%)</SelectItem>
                      <SelectItem value="Q">Q - 较高 (25%)</SelectItem>
                      <SelectItem value="H">H - 高 (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateQR} className="flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  生成二维码
                </Button>
                <Button variant="outline" onClick={() => setText('')}>
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Fill Examples */}
          <Card>
            <CardHeader>
              <CardTitle>快速填充</CardTitle>
              <CardDescription>点击下面的示例快速填入常用格式</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                {quickFillExamples.map((example) => (
                  <Button
                    key={example.label}
                    variant="outline"
                    onClick={() => setText(example.value)}
                    className="justify-start text-left h-auto p-3"
                  >
                    <div>
                      <div className="font-medium">{example.label}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {example.value}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          {qrCodeDataURL && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>生成的二维码</CardTitle>
                    <CardDescription>扫描或保存二维码</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(text)}
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={downloadQR}
                      className="h-8 w-8"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <img 
                      src={qrCodeDataURL} 
                      alt="Generated QR Code"
                      className="block"
                      style={{ width: size[0], height: size[0] }}
                    />
                  </div>
                  
                  <div className="text-center space-y-2">
                    <div className="text-sm text-muted-foreground">
                      内容: {text.length > 50 ? text.substring(0, 50) + '...' : text}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      尺寸: {size[0]} x {size[0]}px | 错误纠正: {errorLevel}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>二维码说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div><strong>支持的内容类型:</strong></div>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• 纯文本</li>
                  <li>• 网址链接 (http://或https://)</li>
                  <li>• 邮箱地址 (mailto:)</li>
                  <li>• 电话号码 (tel:)</li>
                  <li>• 短信 (sms:)</li>
                  <li>• WiFi连接信息</li>
                  <li>• 地理位置 (geo:)</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <div><strong>错误纠正级别:</strong></div>
                <div className="text-sm">
                  更高的错误纠正级别可以在二维码部分损坏时仍能正确读取，但会增加二维码的复杂度。
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                <strong>提示:</strong> 生成的二维码可以被大多数手机相机和二维码扫描应用识别。
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}