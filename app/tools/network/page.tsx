'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Network as NetworkIcon, Globe, Wifi } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function NetworkToolsPage() {
  const [userIP, setUserIP] = useState('')
  const [targetIP, setTargetIP] = useState('')
  const [pingResult, setPingResult] = useState('')
  const [networkInfo, setNetworkInfo] = useState<any>(null)

  useEffect(() => {
    // 获取用户IP和网络信息
    getUserNetworkInfo()
  }, [])

  const getUserNetworkInfo = async () => {
    try {
      // 获取基本网络信息
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
      
      setNetworkInfo({
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        connection: connection ? {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        } : null
      })

      // 模拟获取外网IP (实际项目中需要调用真正的IP服务)
      setUserIP('192.168.1.100')
    } catch (error) {
      console.error('获取网络信息失败:', error)
    }
  }

  const pingHost = () => {
    if (!targetIP) {
      toast.error('请输入要测试的IP或域名')
      return
    }

    // 模拟ping测试 (浏览器中无法真正ping)
    setPingResult('正在测试连接...')
    
    setTimeout(() => {
      const randomLatency = Math.floor(Math.random() * 100) + 10
      setPingResult(`${targetIP} 的连接测试:\n响应时间: ${randomLatency}ms\n状态: 连接正常\n注意: 这是模拟结果`)
      toast.success('连接测试完成')
    }, 2000)
  }

  const checkPort = () => {
    toast.info('端口检测功能需要服务器端支持')
  }

  return (
    <MainLayout>
      <ToolLayout
        title="网络工具"
        description="IP查询、连接测试等网络诊断工具"
        icon="Network"
      >
        <div className="space-y-6">
          {/* Current Network Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                当前网络信息
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">本机IP地址</Label>
                  <div className="font-mono text-sm bg-muted p-2 rounded mt-1">
                    {userIP || '获取中...'}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">连接状态</Label>
                  <div className="mt-1">
                    <Badge variant={networkInfo?.onLine ? "default" : "destructive"}>
                      {networkInfo?.onLine ? '在线' : '离线'}
                    </Badge>
                  </div>
                </div>

                {networkInfo?.connection && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">网络类型</Label>
                      <div className="text-sm mt-1">
                        {networkInfo.connection.effectiveType || '未知'}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">连接速度</Label>
                      <div className="text-sm mt-1">
                        {networkInfo.connection.downlink ? `${networkInfo.connection.downlink} Mbps` : '未知'}
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label className="text-sm font-medium">浏览器</Label>
                  <div className="text-sm mt-1 truncate">
                    {navigator.userAgent.split(' ')[0]}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">语言设置</Label>
                  <div className="text-sm mt-1">
                    {networkInfo?.language || navigator.language}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ping Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                连接测试
              </CardTitle>
              <CardDescription>测试到指定主机的连接</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="输入IP地址或域名，如: google.com"
                  value={targetIP}
                  onChange={(e) => setTargetIP(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={pingHost}>
                  测试连接
                </Button>
              </div>

              {pingResult && (
                <div className="bg-muted p-3 rounded font-mono text-sm whitespace-pre-line">
                  {pingResult}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Tests */}
          <Card>
            <CardHeader>
              <CardTitle>快速测试</CardTitle>
              <CardDescription>常用网络连接测试</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setTargetIP('8.8.8.8')
                    setTimeout(pingHost, 100)
                  }}
                >
                  Google DNS
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setTargetIP('1.1.1.1')
                    setTimeout(pingHost, 100)
                  }}
                >
                  Cloudflare DNS
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setTargetIP('baidu.com')
                    setTimeout(pingHost, 100)
                  }}
                >
                  百度
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setTargetIP('github.com')
                    setTimeout(pingHost, 100)
                  }}
                >
                  GitHub
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>使用说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded text-sm">
                <strong>注意:</strong> 由于浏览器安全限制，某些网络功能(如真实的ping测试)无法在网页中实现。
                显示的结果为模拟数据，仅供参考。
              </div>
              
              <div className="space-y-2">
                <div><strong>可用功能:</strong></div>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• 查看当前网络连接状态</li>
                  <li>• 显示基本设备信息</li>
                  <li>• 模拟连接测试</li>
                  <li>• 网络类型检测(支持的浏览器)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}