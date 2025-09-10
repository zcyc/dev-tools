'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Copy, FileCode, Minimize, Maximize } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function JSONFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [indentSize, setIndentSize] = useState('2')

  const formatJSON = () => {
    if (!input.trim()) {
      toast.error('请输入 JSON 数据')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, parseInt(indentSize))
      setOutput(formatted)
      toast.success('JSON 格式化完成')
    } catch (error) {
      toast.error('JSON 格式错误，请检查输入')
    }
  }

  const minifyJSON = () => {
    if (!input.trim()) {
      toast.error('请输入 JSON 数据')
      return
    }

    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      toast.success('JSON 压缩完成')
    } catch (error) {
      toast.error('JSON 格式错误，请检查输入')
    }
  }

  const validateJSON = () => {
    if (!input.trim()) {
      toast.error('请输入JSON数据')
      return
    }

    try {
      JSON.parse(input)
      toast.success('JSON 格式正确')
    } catch (error) {
      toast.error('JSON 格式错误：' + (error as Error).message)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
  }

  const sampleJSON = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "coding", "traveling"],
  "address": {
    "street": "123 Main St",
    "zipcode": "10001"
  },
  "active": true,
  "salary": null
}`

  return (
    <MainLayout>
      <ToolLayout
        title="JSON 格式化/压缩"
        description="格式化、压缩和验证 JSON 数据"
        icon="Braces"
      >
        <div className="space-y-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle>JSON 处理</CardTitle>
              <CardDescription>选择处理方式和缩进设置</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="indent">缩进大小</Label>
                  <Select value={indentSize} onValueChange={setIndentSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 个空格</SelectItem>
                      <SelectItem value="4">4 个空格</SelectItem>
                      <SelectItem value="tab">Tab 制表符</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={formatJSON} className="flex items-center gap-2">
                    <Maximize className="h-4 w-4" />
                    格式化
                  </Button>
                  <Button onClick={minifyJSON} variant="outline" className="flex items-center gap-2">
                    <Minimize className="h-4 w-4" />
                    压缩
                  </Button>
                  <Button onClick={validateJSON} variant="outline">
                    验证
                  </Button>
                  <Button onClick={() => setInput(sampleJSON)} variant="outline">
                    示例
                  </Button>
                  <Button onClick={clearAll} variant="outline">
                    清空
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle>输入 JSON</CardTitle>
              <CardDescription>粘贴或输入需要处理的 JSON 数据</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="输入或粘贴 JSON 数据..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Output */}
          {output && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>处理结果</CardTitle>
                    <CardDescription>格式化或压缩后的 JSON</CardDescription>
                  </div>
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
                  rows={15}
                  className="font-mono text-sm bg-muted"
                />
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>JSON处理说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div><strong>格式化:</strong> 将压缩的JSON转换为易读的格式，添加适当的缩进和换行</div>
                <div><strong>压缩:</strong> 删除所有不必要的空格和换行，减小文件大小</div>
                <div><strong>验证:</strong> 检查JSON语法是否正确</div>
              </div>
              
              <div className="space-y-2">
                <div><strong>常见JSON错误:</strong></div>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• 忘记在对象或数组末尾添加逗号</li>
                  <li>• 使用单引号而不是双引号</li>
                  <li>• 属性名未使用引号包围</li>
                  <li>• 末尾有多余的逗号</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}