'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Database } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function SQLFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const formatSQL = () => {
    if (!input.trim()) {
      toast.error('请输入SQL语句')
      return
    }

    // 简单的SQL格式化
    let formatted = input
      .replace(/\s+/g, ' ')
      .replace(/;\s*/g, ';\n')
      .replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ORDER BY|GROUP BY|HAVING)\b/gi, '\n$1')
      .replace(/\b(INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/gi, '\n$1')
      .replace(/^\s*\n/gm, '')
      .trim()

    setOutput(formatted)
    toast.success('SQL格式化完成')
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
        title="SQL格式化器"
        description="格式化SQL查询语句，提高可读性"
        icon="Database"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SQL输入</CardTitle>
              <CardDescription>输入需要格式化的SQL语句</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="输入SQL语句..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={8}
                className="font-mono text-sm"
              />
              
              <Button onClick={formatSQL}>
                <Database className="h-4 w-4 mr-2" />
                格式化SQL
              </Button>
            </CardContent>
          </Card>

          {output && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>格式化结果</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(output)}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  readOnly
                  rows={12}
                  className="font-mono text-sm bg-muted"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>
    </MainLayout>
  )
}