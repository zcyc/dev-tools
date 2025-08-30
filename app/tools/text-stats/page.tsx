'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { BarChart3 } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'

export default function TextStatsPage() {
  const [text, setText] = useState('')

  const stats = useMemo(() => {
    if (!text) return null

    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, '').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const lines = text.split('\n').length
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).length : 0
    const sentences = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0

    return {
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      sentences,
      avgWordsPerSentence: sentences > 0 ? Math.round(words / sentences * 10) / 10 : 0,
      avgCharsPerWord: words > 0 ? Math.round(charactersNoSpaces / words * 10) / 10 : 0
    }
  }, [text])

  return (
    <MainLayout>
      <ToolLayout
        title="文本统计"
        description="统计文本的字符、单词、行数等信息"
        icon="BarChart3"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>文本内容</CardTitle>
              <CardDescription>输入要统计的文本</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="输入或粘贴文本内容..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
              />
            </CardContent>
          </Card>

          {stats && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">字符数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.characters.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    不含空格: {stats.charactersNoSpaces.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">单词数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.words.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    平均每词 {stats.avgCharsPerWord} 字符
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">行数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.lines.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.paragraphs} 个段落
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">句子数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.sentences.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">
                    平均每句 {stats.avgWordsPerSentence} 词
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </ToolLayout>
    </MainLayout>
  )
}