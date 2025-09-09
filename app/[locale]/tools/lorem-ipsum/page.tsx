'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Copy, FileText } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function LoremIpsumPage() {
  const [output, setOutput] = useState('')
  const [count, setCount] = useState(5)
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs')
  const [startWithLorem, setStartWithLorem] = useState(true)

  const loremWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
    'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
    'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ]

  const getRandomWord = () => {
    return loremWords[Math.floor(Math.random() * loremWords.length)]
  }

  const generateSentence = (minWords = 6, maxWords = 16) => {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords
    let sentence = []
    
    for (let i = 0; i < wordCount; i++) {
      sentence.push(getRandomWord())
    }
    
    // 首字母大写
    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1)
    
    return sentence.join(' ') + '.'
  }

  const generateParagraph = (minSentences = 3, maxSentences = 7) => {
    const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences
    let paragraph = []
    
    for (let i = 0; i < sentenceCount; i++) {
      paragraph.push(generateSentence())
    }
    
    return paragraph.join(' ')
  }

  const generateLorem = () => {
    let result = []

    if (type === 'words') {
      let words = []
      if (startWithLorem && count > 0) {
        words.push('Lorem')
        for (let i = 1; i < count; i++) {
          words.push(getRandomWord())
        }
      } else {
        for (let i = 0; i < count; i++) {
          words.push(getRandomWord())
        }
      }
      result = [words.join(' ')]
    } else if (type === 'sentences') {
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          result.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        } else {
          result.push(generateSentence())
        }
      }
    } else { // paragraphs
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          result.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
        } else {
          result.push(generateParagraph())
        }
      }
    }

    const output = type === 'paragraphs' ? result.join('\n\n') : result.join(' ')
    setOutput(output)
    toast.success(`生成了 ${count} ${type === 'paragraphs' ? '段' : type === 'sentences' ? '句' : '个单词'}`)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
      toast.success('已复制到剪贴板')
    } catch (err) {
      toast.error('复制失败')
    }
  }

  return (
    <MainLayout>
      <ToolLayout
        title="Lorem Ipsum生成器"
        description="生成Lorem Ipsum占位文本，用于设计和排版"
        icon="FileText"
      >
        <div className="space-y-6">
          {/* Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>生成设置</CardTitle>
              <CardDescription>配置占位文本的生成参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="type">文本类型</Label>
                  <Select value={type} onValueChange={(value: any) => setType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paragraphs">段落</SelectItem>
                      <SelectItem value="sentences">句子</SelectItem>
                      <SelectItem value="words">单词</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="count">数量</Label>
                  <Input
                    id="count"
                    type="number"
                    min="1"
                    max="100"
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  />
                </div>

                <div className="flex items-end">
                  <Button onClick={generateLorem} className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    生成文本
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="start-lorem"
                  checked={startWithLorem}
                  onChange={(e) => setStartWithLorem(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="start-lorem" className="text-sm">
                  以经典Lorem ipsum开头
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Output */}
          {output && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>生成的文本</CardTitle>
                    <CardDescription>
                      {count} {type === 'paragraphs' ? '段落' : type === 'sentences' ? '句子' : '个单词'}
                      ({output.length} 字符)
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
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
                  rows={Math.min(20, Math.max(8, output.split('\n').length + 2))}
                  className="font-serif bg-muted resize-none"
                />
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>快速生成</CardTitle>
              <CardDescription>点击快速生成常用长度的文本</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                <Button 
                  variant="outline" 
                  onClick={() => { setType('words'); setCount(50); }}
                  className="text-left justify-start"
                >
                  50个单词
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { setType('sentences'); setCount(5); }}
                  className="text-left justify-start"
                >
                  5个句子
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { setType('paragraphs'); setCount(3); }}
                  className="text-left justify-start"
                >
                  3个段落
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { setType('paragraphs'); setCount(10); }}
                  className="text-left justify-start"
                >
                  10个段落
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle>关于Lorem Ipsum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Lorem Ipsum是印刷和排版行业的标准占位文本，自16世纪以来一直被使用。
                它基于西塞罗《de Finibus Bonorum et Malorum》中的拉丁文本。
              </p>
              
              <div className="space-y-2">
                <div><strong>使用场景：</strong></div>
                <ul className="text-sm space-y-1 ml-4">
                  <li>• 网站和应用设计的占位内容</li>
                  <li>• 印刷排版的版面测试</li>
                  <li>• 演示文稿和样机制作</li>
                  <li>• 字体展示和测试</li>
                </ul>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded text-sm">
                <strong>提示:</strong> Lorem Ipsum的优势在于其字母分布接近正常英文，
                但内容无意义，不会分散读者对设计的注意力。
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}