'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, Code } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function HTMLEntitiesPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const htmlEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    ' ': '&nbsp;'
  }

  const encodeHTML = (text: string) => {
    return text.replace(/[&<>"' ]/g, (match) => htmlEntities[match] || match)
  }

  const decodeHTML = (text: string) => {
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
  }

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error('请输入要转换的内容')
      return
    }

    const result = mode === 'encode' ? encodeHTML(input) : decodeHTML(input)
    setOutput(result)
    toast.success(`HTML实体${mode === 'encode' ? '编码' : '解码'}完成`)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  return (
    <MainLayout>
      <ToolLayout
        title="HTML实体转义"
        description="HTML特殊字符编码和解码"
        icon="Code"
      >
        <div className="space-y-6">
          <Tabs value={mode} onValueChange={(value: string) => setMode(value as 'encode' | 'decode')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">编码</TabsTrigger>
              <TabsTrigger value="decode">解码</TabsTrigger>
            </TabsList>

            <TabsContent value="encode" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>HTML实体编码</CardTitle>
                  <CardDescription>将特殊字符转换为HTML实体</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="input">原始文本</Label>
                    <Textarea
                      id="input"
                      placeholder='输入包含特殊字符的文本，如：<div class="example">Hello & Welcome</div>'
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      rows={6}
                    />
                  </div>
                  
                  <Button onClick={handleConvert}>
                    <Code className="h-4 w-4 mr-2" />
                    编码
                  </Button>

                  {output && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>编码结果</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(output)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={output}
                        readOnly
                        rows={6}
                        className="bg-muted font-mono text-sm"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decode" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>HTML实体解码</CardTitle>
                  <CardDescription>将HTML实体转换回特殊字符</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="input">HTML实体文本</Label>
                    <Textarea
                      id="input"
                      placeholder="输入包含HTML实体的文本，如：&lt;div class=&quot;example&quot;&gt;Hello &amp; Welcome&lt;/div&gt;"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      rows={6}
                    />
                  </div>
                  
                  <Button onClick={handleConvert}>
                    <Code className="h-4 w-4 mr-2" />
                    解码
                  </Button>

                  {output && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>解码结果</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(output)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={output}
                        readOnly
                        rows={6}
                        className="bg-muted"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>常用HTML实体</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm font-mono">
                <div className="grid grid-cols-3 gap-4 font-semibold border-b pb-2">
                  <div>字符</div>
                  <div>HTML实体</div>
                  <div>描述</div>
                </div>
                {Object.entries(htmlEntities).map(([char, entity]) => (
                  <div key={char} className="grid grid-cols-3 gap-4">
                    <div>{char}</div>
                    <div>{entity}</div>
                    <div className="text-muted-foreground">
                      {char === '&' ? '和符号' :
                       char === '<' ? '小于号' :
                       char === '>' ? '大于号' :
                       char === '"' ? '双引号' :
                       char === "'" ? '单引号' : '空格'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}