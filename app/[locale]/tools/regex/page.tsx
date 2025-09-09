'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { SearchCheck } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('')
  const [matches, setMatches] = useState<string[]>([])
  const [isValid, setIsValid] = useState(true)

  const testRegex = () => {
    if (!pattern) {
      toast.error('请输入正则表达式')
      return
    }

    try {
      const regex = new RegExp(pattern, flags)
      const foundMatches = testString.match(regex) || []
      setMatches(foundMatches)
      setIsValid(true)
      toast.success(`找到 ${foundMatches.length} 个匹配`)
    } catch (error) {
      setIsValid(false)
      setMatches([])
      toast.error('正则表达式语法错误')
    }
  }

  return (
    <MainLayout>
      <ToolLayout
        title="正则表达式测试器"
        description="测试和验证正则表达式模式"
        icon="SearchCheck"
      >
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>正则表达式</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Label htmlFor="pattern">模式</Label>
                  <Input
                    id="pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="输入正则表达式，如: \d+"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="flags">标志</Label>
                  <Input
                    id="flags"
                    value={flags}
                    onChange={(e) => setFlags(e.target.value)}
                    placeholder="g, i, m"
                    className="font-mono"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="test-string">测试字符串</Label>
                <Textarea
                  id="test-string"
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="输入要测试的文本..."
                  rows={4}
                />
              </div>
              
              <Button onClick={testRegex}>
                <SearchCheck className="h-4 w-4 mr-2" />
                测试
              </Button>
            </CardContent>
          </Card>

          {(matches.length > 0 || !isValid) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  匹配结果
                  {isValid && <Badge className="ml-2">{matches.length} 个匹配</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isValid ? (
                  <div className="space-y-2">
                    {matches.map((match, index) => (
                      <div key={index} className="font-mono text-sm bg-muted p-2 rounded">
                        {match}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-destructive">正则表达式无效</div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>常用正则表达式</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-mono">\d+</div>
                  <div>匹配数字</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-mono">[a-zA-Z]+</div>
                  <div>匹配字母</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-mono">\w+@\w+\.\w+</div>
                  <div>匹配邮箱</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}