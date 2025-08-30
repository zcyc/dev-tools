'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Copy, Type } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function CaseConverterPage() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState({
    lowercase: '',
    uppercase: '',
    titleCase: '',
    camelCase: '',
    pascalCase: '',
    snakeCase: '',
    kebabCase: '',
    constantCase: '',
    dotCase: '',
    pathCase: '',
    sentenceCase: '',
    alternatingCase: ''
  })

  const convertText = (text: string) => {
    if (!text) {
      setResults({
        lowercase: '',
        uppercase: '',
        titleCase: '',
        camelCase: '',
        pascalCase: '',
        snakeCase: '',
        kebabCase: '',
        constantCase: '',
        dotCase: '',
        pathCase: '',
        sentenceCase: '',
        alternatingCase: ''
      })
      return
    }

    // 基础转换
    const lowercase = text.toLowerCase()
    const uppercase = text.toUpperCase()
    
    // Title Case
    const titleCase = text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )

    // 句子大小写
    const sentenceCase = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()

    // 交替大小写
    const alternatingCase = text.split('').map((char, index) => 
      index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
    ).join('')

    // 分词函数
    const words = text.match(/[A-Z][a-z]+|[a-z]+|[A-Z]+(?=[A-Z][a-z]|\b)|[0-9]+/g) || 
                  text.split(/[\s\-_\.\/]+/).filter(word => word.length > 0)

    // camelCase
    const camelCase = words.map((word, index) => 
      index === 0 ? word.toLowerCase() : 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('')

    // PascalCase
    const pascalCase = words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join('')

    // snake_case
    const snakeCase = words.map(word => word.toLowerCase()).join('_')

    // kebab-case
    const kebabCase = words.map(word => word.toLowerCase()).join('-')

    // CONSTANT_CASE
    const constantCase = words.map(word => word.toUpperCase()).join('_')

    // dot.case
    const dotCase = words.map(word => word.toLowerCase()).join('.')

    // path/case
    const pathCase = words.map(word => word.toLowerCase()).join('/')

    setResults({
      lowercase,
      uppercase,
      titleCase,
      camelCase,
      pascalCase,
      snakeCase,
      kebabCase,
      constantCase,
      dotCase,
      pathCase,
      sentenceCase,
      alternatingCase
    })
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    convertText(value)
  }

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${format}已复制到剪贴板`)
    } catch (err) {
      toast.error('复制失败')
    }
  }

  const cases = [
    { key: 'lowercase', label: '小写', description: '所有字母转换为小写', example: 'hello world' },
    { key: 'uppercase', label: '大写', description: '所有字母转换为大写', example: 'HELLO WORLD' },
    { key: 'titleCase', label: '标题大小写', description: '每个单词首字母大写', example: 'Hello World' },
    { key: 'sentenceCase', label: '句子大小写', description: '只有第一个字母大写', example: 'Hello world' },
    { key: 'camelCase', label: '驼峰命名', description: '第一个单词小写，其余单词首字母大写', example: 'helloWorld' },
    { key: 'pascalCase', label: '帕斯卡命名', description: '所有单词首字母大写', example: 'HelloWorld' },
    { key: 'snakeCase', label: '蛇形命名', description: '单词用下划线连接', example: 'hello_world' },
    { key: 'kebabCase', label: '短横线命名', description: '单词用短横线连接', example: 'hello-world' },
    { key: 'constantCase', label: '常量命名', description: '大写字母和下划线', example: 'HELLO_WORLD' },
    { key: 'dotCase', label: '点分命名', description: '单词用点号连接', example: 'hello.world' },
    { key: 'pathCase', label: '路径命名', description: '单词用斜杠连接', example: 'hello/world' },
    { key: 'alternatingCase', label: '交替大小写', description: '字母交替大小写', example: 'hElLo WoRlD' }
  ]

  const sampleText = "Hello World Example Text"

  return (
    <MainLayout>
      <ToolLayout
        title="大小写转换器"
        description="转换文本为各种大小写格式"
        icon="CaseSensitive"
      >
        <div className="space-y-6">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle>文本输入</CardTitle>
              <CardDescription>输入需要转换大小写的文本</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="text-input">文本内容</Label>
                <Textarea
                  id="text-input"
                  placeholder="输入文本内容..."
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  rows={4}
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleInputChange(sampleText)}
                >
                  使用示例
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleInputChange('')}
                >
                  清空
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {input && (
            <div className="grid gap-4 md:grid-cols-2">
              {cases.map((caseType) => (
                <Card key={caseType.key}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {caseType.label}
                          <Badge variant="outline" className="text-xs">
                            {caseType.key}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {caseType.description}
                        </CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(results[caseType.key as keyof typeof results], caseType.label)}
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-mono text-sm bg-muted p-3 rounded min-h-[2.5rem] break-all">
                        {results[caseType.key as keyof typeof results] || '(空)'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        示例: {caseType.example}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>使用场景</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">编程相关</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>camelCase:</strong> JavaScript变量名</li>
                    <li><strong>PascalCase:</strong> 类名、组件名</li>
                    <li><strong>snake_case:</strong> Python变量名</li>
                    <li><strong>CONSTANT_CASE:</strong> 常量定义</li>
                    <li><strong>kebab-case:</strong> CSS类名、URL</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">文档相关</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>Title Case:</strong> 标题、标题栏</li>
                    <li><strong>Sentence case:</strong> 普通句子</li>
                    <li><strong>UPPERCASE:</strong> 强调文本</li>
                    <li><strong>lowercase:</strong> 标签、关键词</li>
                  </ul>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                <strong>提示:</strong> 转换结果会自动识别单词边界，支持空格、短横线、下划线等分隔符。
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}