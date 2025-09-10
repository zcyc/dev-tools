'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Copy, RefreshCw } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

interface ColorFormats {
  hex: string
  rgb: string
  hsl: string
  hsv: string
  cmyk: string
}

export default function ColorConverterPage() {
  const [inputColor, setInputColor] = useState('#ff5733')
  const [colorFormats, setColorFormats] = useState<ColorFormats>({
    hex: '#ff5733',
    rgb: 'rgb(255, 87, 51)',
    hsl: 'hsl(11, 100%, 60%)',
    hsv: 'hsv(11, 80%, 100%)',
    cmyk: 'cmyk(0%, 66%, 80%, 0%)'
  })

  // HEX转RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  // RGB转HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0
    const l = (max + min) / 2
    let s

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  // RGB转HSV
  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0
    const v = max
    let s

    const d = max - min
    s = max === 0 ? 0 : d / max

    if (max === min) {
      h = 0
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    }
  }

  // RGB转CMYK
  const rgbToCmyk = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const k = 1 - Math.max(r, Math.max(g, b))
    const c = (1 - r - k) / (1 - k) || 0
    const m = (1 - g - k) / (1 - k) || 0
    const y = (1 - b - k) / (1 - k) || 0

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    }
  }

  const convertColor = (input: string) => {
    let hex = input
    
    // 如果输入不是HEX格式，尝试解析其他格式
    if (!input.startsWith('#')) {
      if (input.startsWith('rgb')) {
        const matches = input.match(/\d+/g)
        if (matches && matches.length >= 3) {
          const r = parseInt(matches[0])
          const g = parseInt(matches[1])
          const b = parseInt(matches[2])
          hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
        }
      }
      // 可以添加更多格式解析...
    }

    const rgb = hexToRgb(hex)
    if (!rgb) {
      toast.error('无效的颜色格式')
      return
    }

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b)

    setColorFormats({
      hex: hex.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
      cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
    })
  }

  const generateRandomColor = () => {
    const randomHex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')
    setInputColor(randomHex)
    convertColor(randomHex)
  }

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${format}格式已复制到剪贴板`)
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const handleInputChange = (value: string) => {
    setInputColor(value)
    if (value) {
      convertColor(value)
    }
  }

  return (
    <MainLayout>
      <ToolLayout
        title="颜色转换器"
        description="在HEX、RGB、HSL、HSV、CMYK等颜色格式之间进行转换"
        icon="Palette"
      >
        <div className="space-y-6">
          {/* Color Input */}
          <Card>
            <CardHeader>
              <CardTitle>颜色输入</CardTitle>
              <CardDescription>输入颜色值或使用颜色选择器</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="color-input">颜色值</Label>
                  <Input
                    id="color-input"
                    value={inputColor}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="#ff5733 或 rgb(255,87,51)"
                  />
                </div>
                <div>
                  <Label htmlFor="color-picker">颜色选择器</Label>
                  <Input
                    id="color-picker"
                    type="color"
                    value={inputColor.startsWith('#') ? inputColor : '#ff5733'}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                </div>
                <Button onClick={generateRandomColor} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  随机
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Color Preview */}
          <Card>
            <CardHeader>
              <CardTitle>颜色预览</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="w-full h-32 rounded-lg border"
                style={{ backgroundColor: colorFormats.hex }}
              />
            </CardContent>
          </Card>

          {/* Color Formats */}
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(colorFormats).map(([format, value]) => (
              <Card key={format}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {format.toUpperCase()}
                      <Badge variant="outline" className="ml-2">
                        {format === 'hex' ? '十六进制' : 
                         format === 'rgb' ? 'RGB' :
                         format === 'hsl' ? 'HSL' :
                         format === 'hsv' ? 'HSV' : 'CMYK'}
                      </Badge>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(value, format.toUpperCase())}
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm bg-muted p-3 rounded">
                    {value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>颜色格式说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex gap-3">
                  <Badge>HEX</Badge>
                  <span className="text-sm">十六进制颜色代码，Web开发中最常用</span>
                </div>
                <div className="flex gap-3">
                  <Badge>RGB</Badge>
                  <span className="text-sm">红绿蓝三原色值，取值范围0-255</span>
                </div>
                <div className="flex gap-3">
                  <Badge>HSL</Badge>
                  <span className="text-sm">色相、饱和度、明度，设计师友好的格式</span>
                </div>
                <div className="flex gap-3">
                  <Badge>HSV</Badge>
                  <span className="text-sm">色相、饱和度、明度值，图像处理常用</span>
                </div>
                <div className="flex gap-3">
                  <Badge>CMYK</Badge>
                  <span className="text-sm">青品黄黑，印刷行业标准颜色模式</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}