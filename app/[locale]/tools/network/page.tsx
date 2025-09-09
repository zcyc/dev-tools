'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Network as NetworkIcon } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'

export default function NetworkToolsPage() {
  useEffect(() => {
    // 检查是否已经跳转过，避免重复打开标签页
    const hasRedirected = sessionStorage.getItem('network-tool-redirected')
    
    if (!hasRedirected) {
      // 页面加载后直接跳转到专业的IP查询网站
      window.open('https://ip.skk.moe/', '_blank')
      // 标记已经跳转过
      sessionStorage.setItem('network-tool-redirected', 'true')
    }
  }, [])



  return (
    <MainLayout>
      <ToolLayout
        title="网络工具"
        description="专业的IP查询和网络诊断工具"
        icon="Network"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <NetworkIcon className="h-5 w-5" />
                网络诊断工具
              </CardTitle>
              <CardDescription>
                正在为您跳转到专业的网络诊断平台...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <div className="mb-4">
                  <p className="text-lg mb-2">🌐 正在跳转到专业网络工具</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    我们将为您打开 ip.skk.moe，这是一个功能完善的网络诊断平台
                  </p>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                  页面已自动为您打开网络诊断工具
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}