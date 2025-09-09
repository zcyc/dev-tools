'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Diff } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function TextDiffPage() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [diff, setDiff] = useState<any[]>([])

  const compareTexts = () => {
    // 简单的文本对比算法
    const lines1 = text1.split('\n')
    const lines2 = text2.split('\n')
    const maxLines = Math.max(lines1.length, lines2.length)
    const result = []

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || ''
      const line2 = lines2[i] || ''
      
      if (line1 === line2) {
        result.push({ type: 'equal', line: line1, lineNum: i + 1 })
      } else if (!line1) {
        result.push({ type: 'added', line: line2, lineNum: i + 1 })
      } else if (!line2) {
        result.push({ type: 'removed', line: line1, lineNum: i + 1 })
      } else {
        result.push({ type: 'changed', line1, line2, lineNum: i + 1 })
      }
    }

    setDiff(result)
    toast.success('文本对比完成')
  }

  return (
    <MainLayout>
      <ToolLayout
        title="文本对比"
        description="比较两段文本的差异"
        icon="Diff"
      >
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>文本1</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="输入第一段文本..."
                  value={text1}
                  onChange={(e) => setText1(e.target.value)}
                  rows={8}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>文本2</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="输入第二段文本..."
                  value={text2}
                  onChange={(e) => setText2(e.target.value)}
                  rows={8}
                />
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button onClick={compareTexts}>
              <Diff className="h-4 w-4 mr-2" />
              对比文本
            </Button>
          </div>

          {diff.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>对比结果</CardTitle>
                <CardDescription>绿色表示新增，红色表示删除，黄色表示修改</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 font-mono text-sm max-h-96 overflow-y-auto">
                  {diff.map((item, index) => (
                    <div key={index} className={`p-2 rounded ${
                      item.type === 'equal' ? 'bg-gray-50 dark:bg-gray-800' :
                      item.type === 'added' ? 'bg-green-50 dark:bg-green-900' :
                      item.type === 'removed' ? 'bg-red-50 dark:bg-red-900' :
                      'bg-yellow-50 dark:bg-yellow-900'
                    }`}>
                      <span className="text-gray-400 mr-4">{item.lineNum}</span>
                      {item.type === 'changed' ? (
                        <div>
                          <div className="text-red-600">- {item.line1}</div>
                          <div className="text-green-600">+ {item.line2}</div>
                        </div>
                      ) : (
                        <span className={
                          item.type === 'added' ? 'text-green-600' :
                          item.type === 'removed' ? 'text-red-600' : ''
                        }>
                          {item.type === 'added' ? '+ ' : item.type === 'removed' ? '- ' : '  '}
                          {item.line}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ToolLayout>
    </MainLayout>
  )
}