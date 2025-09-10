'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Copy, ArrowRight, ArrowLeft } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function URLEncoderPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [mode, setMode] = useState<'encode' | 'decode'>('encode')

  const encodeURL = () => {
    try {
      const encoded = encodeURIComponent(input)
      setOutput(encoded)
      toast.success('URL编码完成')
    } catch (error) {
      toast.error('编码失败')
    }
  }

  const decodeURL = () => {
    try {
      const decoded = decodeURIComponent(input)
      setOutput(decoded)
      toast.success('URL解码完成')
    } catch (error) {
      toast.error('解码失败，请检查输入格式')
    }
  }

  const handleConvert = () => {
    if (!input.trim()) {
      toast.error('请输入要转换的内容')
      return
    }

    if (mode === 'encode') {
      encodeURL()
    } else {
      decodeURL()
    }
  }

  const swapInputOutput = () => {
    setInput(output)
    setOutput(input)
    setMode(mode === 'encode' ? 'decode' : 'encode')
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

  const examples = {
    encode: [
      'https://example.com/search?q=hello world',
      'user@example.com',
      'Hello, 世界! #test',
      'path/to/file with spaces.txt'
    ],
    decode: [
      'https%3A//example.com/search%3Fq%3Dhello%20world',
      'user%40example.com',
      'Hello%2C%20%E4%B8%96%E7%95%8C%21%20%23test',
      'path/to/file%20with%20spaces.txt'
    ]
  }

  return (
    <MainLayout>
      <ToolLayout
        title="URL编码/解码器"
        description="对URL进行百分号编码(Percent Encoding)和解码"
        icon="Link"
      >
        <div className="space-y-6">
          {/* Mode Selection */}
          <Tabs value={mode} onValueChange={(value: string) => setMode(value as 'encode' | 'decode')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode">URL编码</TabsTrigger>
              <TabsTrigger value="decode">URL解码</TabsTrigger>
            </TabsList>

            <TabsContent value="encode" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>URL编码</CardTitle>
                  <CardDescription>将特殊字符转换为百分号编码格式</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="input-text">原始文本</Label>
                    <Textarea
                      id="input-text"
                      placeholder="输入需要编码的URL或文本..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleConvert} className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      编码
                    </Button>
                    <Button variant="outline" onClick={swapInputOutput} className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      交换
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      清空
                    </Button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="output-text">编码结果</Label>
                      {output && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(output)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Textarea
                      id="output-text"
                      value={output}
                      readOnly
                      rows={4}
                      className="bg-muted"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decode" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>URL解码</CardTitle>
                  <CardDescription>将百分号编码转换回原始字符</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="input-text">编码文本</Label>
                    <Textarea
                      id="input-text"
                      placeholder="输入需要解码的URL编码文本..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleConvert} className="flex items-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      解码
                    </Button>
                    <Button variant="outline" onClick={swapInputOutput} className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4" />
                      交换
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      清空
                    </Button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="output-text">解码结果</Label>
                      {output && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(output)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Textarea
                      id="output-text"
                      value={output}
                      readOnly
                      rows={4}
                      className="bg-muted"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle>示例</CardTitle>
              <CardDescription>点击示例快速填入</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">
                    {mode === 'encode' ? '编码示例' : '解码示例'}
                  </Label>
                  <div className="grid gap-2 mt-2">
                    {examples[mode].map((example, index) => (
                      <div
                        key={index}
                        onClick={() => setInput(example)}
                        className="p-3 text-sm font-mono bg-muted rounded cursor-pointer hover:bg-accent transition-colors"
                      >
                        {example}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>URL编码说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                URL编码(百分号编码)是一种将特殊字符转换为安全格式的方法，确保URL在网络传输中的正确性。
              </p>
              <div className="space-y-2">
                <div><strong>常见编码字符：</strong></div>
                <div className="grid gap-2 text-sm font-mono">
                  <div>空格: %20</div>
                  <div>@: %40</div>
                  <div>#: %23</div>
                  <div>%: %25</div>
                  <div>?: %3F</div>
                  <div>&: %26</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}