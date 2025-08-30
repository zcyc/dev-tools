'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Copy, Monitor } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function UserAgentParserPage() {
  const [userAgent, setUserAgent] = useState('')
  const [parsedInfo, setParsedInfo] = useState<any>(null)

  const parseUserAgent = (ua: string) => {
    // 简单的User-Agent解析
    const browserMatch = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)\/?([\d.]+)?/)
    const osMatch = ua.match(/(Windows|Mac|Linux|Android|iOS)[\s\w]*?([\d._]+)?/)
    const mobileMatch = ua.match(/(Mobile|Tablet|iPad|iPhone|Android)/)

    return {
      browser: browserMatch ? browserMatch[1] : 'Unknown',
      browserVersion: browserMatch ? browserMatch[2] : '',
      os: osMatch ? osMatch[1] : 'Unknown',
      osVersion: osMatch ? osMatch[2] : '',
      isMobile: !!mobileMatch,
      deviceType: mobileMatch ? mobileMatch[1] : 'Desktop'
    }
  }

  useEffect(() => {
    setUserAgent(navigator.userAgent)
  }, [])

  const handleParse = () => {
    if (!userAgent.trim()) {
      toast.error('请输入User-Agent字符串')
      return
    }

    const info = parseUserAgent(userAgent)
    setParsedInfo(info)
    toast.success('User-Agent解析完成')
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
        title="User-Agent解析器"
        description="解析浏览器User-Agent字符串，识别浏览器和设备信息"
        icon="Monitor"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User-Agent输入</CardTitle>
              <CardDescription>输入要解析的User-Agent字符串</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ua-input">User-Agent字符串</Label>
                <Textarea
                  id="ua-input"
                  placeholder="输入User-Agent字符串..."
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleParse}>
                  <Monitor className="h-4 w-4 mr-2" />
                  解析
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setUserAgent(navigator.userAgent)}
                >
                  使用当前浏览器
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setUserAgent('')
                    setParsedInfo(null)
                  }}
                >
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>

          {parsedInfo && (
            <Card>
              <CardHeader>
                <CardTitle>解析结果</CardTitle>
                <CardDescription>从User-Agent中提取的信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">浏览器</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{parsedInfo.browser}</Badge>
                        {parsedInfo.browserVersion && (
                          <span className="text-sm text-muted-foreground">
                            v{parsedInfo.browserVersion}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">操作系统</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{parsedInfo.os}</Badge>
                        {parsedInfo.osVersion && (
                          <span className="text-sm text-muted-foreground">
                            {parsedInfo.osVersion}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">设备类型</Label>
                      <div className="mt-1">
                        <Badge variant={parsedInfo.isMobile ? "default" : "secondary"}>
                          {parsedInfo.deviceType}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">移动设备</Label>
                      <div className="mt-1">
                        <Badge variant={parsedInfo.isMobile ? "default" : "outline"}>
                          {parsedInfo.isMobile ? '是' : '否'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>User-Agent说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                User-Agent字符串包含了浏览器、操作系统和设备的详细信息，常用于网站适配和统计分析。
              </p>
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                <strong>注意:</strong> 现代浏览器可能会限制或修改User-Agent信息以保护用户隐私。
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}