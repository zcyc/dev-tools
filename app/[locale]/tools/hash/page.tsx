'use client'

import { useState } from 'react'
import crypto from 'crypto'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Copy, Hash, Lock } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

const hashAlgorithms = [
  { value: 'md5', name: 'MD5', description: '128位哈希值' },
  { value: 'sha1', name: 'SHA-1', description: '160位哈希值' },
  { value: 'sha256', name: 'SHA-256', description: '256位哈希值（推荐）' },
  { value: 'sha512', name: 'SHA-512', description: '512位哈希值' },
  { value: 'sha3-256', name: 'SHA3-256', description: 'SHA-3 256位哈希值' },
  { value: 'sha3-512', name: 'SHA3-512', description: 'SHA-3 512位哈希值' },
  { value: 'blake2b512', name: 'BLAKE2b', description: 'BLAKE2b 512位哈希值' },
  { value: 'shake256', name: 'SHAKE256', description: '可变长度哈希值' }
]

export default function HashGeneratorPage() {
  const [inputText, setInputText] = useState('')
  const [algorithm, setAlgorithm] = useState<string>('sha256')
  const [results, setResults] = useState<Array<{ algorithm: string; hash: string; name: string }>>([])

  const generateHash = () => {
    if (!inputText.trim()) {
      toast.error('请输入要哈希的文本')
      return
    }

    try {
      const hash = crypto.createHash(algorithm).update(inputText, 'utf8').digest('hex')
      const algorithmInfo = hashAlgorithms.find(a => a.value === algorithm)
      
      const newResult = {
        algorithm,
        hash,
        name: algorithmInfo?.name || algorithm.toUpperCase()
      }

      setResults([newResult])
      toast.success('哈希值生成成功')
    } catch (error) {
      toast.error('哈希生成失败: ' + (error as Error).message)
    }
  }

  const generateAllHashes = () => {
    if (!inputText.trim()) {
      toast.error('请输入要哈希的文本')
      return
    }

    const newResults: Array<{ algorithm: string; hash: string; name: string }> = []

    // Generate commonly used hashes
    const commonAlgorithms = ['md5', 'sha1', 'sha256', 'sha512']
    
    commonAlgorithms.forEach(alg => {
      try {
        const hash = crypto.createHash(alg).update(inputText, 'utf8').digest('hex')
        const algorithmInfo = hashAlgorithms.find(a => a.value === alg)
        
        newResults.push({
          algorithm: alg,
          hash,
          name: algorithmInfo?.name || alg.toUpperCase()
        })
      } catch (error) {
        console.warn(`Failed to generate ${alg} hash:`, error)
      }
    })

    setResults(newResults)
    toast.success(`成功生成 ${newResults.length} 种哈希值`)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const copyAllHashes = async () => {
    const allHashes = results.map(r => `${r.name}: ${r.hash}`).join('\\n')
    await copyToClipboard(allHashes)
  }

  return (
    <MainLayout>
      <ToolLayout
        title="Hash文本生成"
        description="生成文本的MD5、SHA-1、SHA-256等哈希值"
        icon="Lock"
      >
        <div className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-text">输入文本</Label>
              <Textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="输入要生成哈希值的文本..."
                className="min-h-[120px]"
              />
            </div>

            <div className="flex gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="algorithm">哈希算法</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hashAlgorithms.map((alg) => (
                      <SelectItem key={alg.value} value={alg.value}>
                        <div>
                          <div className="font-medium">{alg.name}</div>
                          <div className="text-xs text-muted-foreground">{alg.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={generateHash} className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  生成哈希
                </Button>
                <Button variant="outline" onClick={generateAllHashes} className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  生成常用哈希
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">哈希结果</h3>
                <div className="flex gap-2">
                  <Badge variant="secondary">{results.length} 个</Badge>
                  {results.length > 1 && (
                    <Button variant="outline" size="sm" onClick={copyAllHashes} className="flex items-center gap-2">
                      <Copy className="h-3 w-3" />
                      复制全部
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                {results.map((result, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{result.name}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {result.hash.length * 4} 位
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(result.hash)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="font-mono text-sm bg-muted p-3 rounded break-all">
                        {result.hash}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">哈希算法说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Badge variant="destructive">MD5</Badge>
                <span className="text-sm text-muted-foreground">已不安全，仅用于校验数据完整性</span>
              </div>
              <div className="flex gap-3">
                <Badge variant="secondary">SHA-1</Badge>
                <span className="text-sm text-muted-foreground">已不推荐用于安全目的</span>
              </div>
              <div className="flex gap-3">
                <Badge variant="default">SHA-256</Badge>
                <span className="text-sm text-muted-foreground">目前最常用的安全哈希算法</span>
              </div>
              <div className="flex gap-3">
                <Badge variant="default">SHA-512</Badge>
                <span className="text-sm text-muted-foreground">更高安全性的哈希算法</span>
              </div>
              <div className="flex gap-3">
                <Badge variant="outline">SHA-3</Badge>
                <span className="text-sm text-muted-foreground">最新的安全哈希标准</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}