'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Copy, RefreshCw, Key } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

interface TokenOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  customCharset: string
  format: 'plain' | 'hex' | 'base64' | 'base64url'
}

// 生成随机十六进制字符串
const generateRandomHex = (length: number): string => {
  const chars = '0123456789abcdef'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// 生成随机Base64字符串
const generateRandomBase64 = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// 生成随机Base64 URL安全字符串
const generateRandomBase64Url = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export default function TokenGeneratorPage() {
  const [generatedTokens, setGeneratedTokens] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [options, setOptions] = useState<TokenOptions>({
    length: 32,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
    customCharset: '',
    format: 'plain'
  })

  const generateTokens = () => {
    const tokens: string[] = []
    
    for (let i = 0; i < count; i++) {
      let token: string
      
      if (options.format === 'hex') {
        token = generateRandomHex(options.length)
      } else if (options.format === 'base64') {
        token = generateRandomBase64(options.length)
      } else if (options.format === 'base64url') {
        token = generateRandomBase64Url(options.length)
      } else {
        // Plain format with custom character set
        let charset = options.customCharset
        
        if (!charset) {
          charset = ''
          if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
          if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
          if (options.includeNumbers) charset += '0123456789'
          if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
        }
        
        if (!charset) {
          toast.error('请选择至少一种字符类型或提供自定义字符集')
          return
        }
        
        token = ''
        for (let j = 0; j < options.length; j++) {
          const randomIndex = Math.floor(Math.random() * charset.length)
          token += charset[randomIndex]
        }
      }
      
      tokens.push(token)
    }
    
    setGeneratedTokens(tokens)
    toast.success(`成功生成 ${tokens.length} 个Token`)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (err) {
      toast.error('复制失败')
    }
  }

  const copyAllToClipboard = async () => {
    const allTokens = generatedTokens.join('\\n')
    await copyToClipboard(allTokens)
  }

  const updateOptions = (key: keyof TokenOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  return (
    <MainLayout>
      <ToolLayout
        title="Token生成器"
        description="生成安全的随机访问令牌和API密钥"
        icon="Key"
      >
        <div className="space-y-6">
          {/* Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">配置选项</h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="length">长度</Label>
                <Input
                  id="length"
                  type="number"
                  value={options.length}
                  onChange={(e) => updateOptions('length', Math.max(1, Math.min(256, parseInt(e.target.value) || 32)))}
                  min={1}
                  max={256}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="count">数量</Label>
                <Input
                  id="count"
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  min={1}
                  max={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">格式</Label>
                <Select value={options.format} onValueChange={(value: any) => updateOptions('format', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plain">自定义字符集</SelectItem>
                    <SelectItem value="hex">十六进制</SelectItem>
                    <SelectItem value="base64">Base64</SelectItem>
                    <SelectItem value="base64url">Base64 URL安全</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {options.format === 'plain' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label>字符类型</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="uppercase"
                        checked={options.includeUppercase}
                        onCheckedChange={(checked) => updateOptions('includeUppercase', checked)}
                      />
                      <Label htmlFor="uppercase" className="text-sm">大写字母 (A-Z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lowercase"
                        checked={options.includeLowercase}
                        onCheckedChange={(checked) => updateOptions('includeLowercase', checked)}
                      />
                      <Label htmlFor="lowercase" className="text-sm">小写字母 (a-z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="numbers"
                        checked={options.includeNumbers}
                        onCheckedChange={(checked) => updateOptions('includeNumbers', checked)}
                      />
                      <Label htmlFor="numbers" className="text-sm">数字 (0-9)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="symbols"
                        checked={options.includeSymbols}
                        onCheckedChange={(checked) => updateOptions('includeSymbols', checked)}
                      />
                      <Label htmlFor="symbols" className="text-sm">特殊符号</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-charset">自定义字符集（可选）</Label>
                  <Input
                    id="custom-charset"
                    value={options.customCharset}
                    onChange={(e) => updateOptions('customCharset', e.target.value)}
                    placeholder="如果提供则忽略上面的字符类型选择"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="flex gap-2">
            <Button onClick={generateTokens} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              生成Token
            </Button>
            {generatedTokens.length > 0 && (
              <Button variant="outline" onClick={copyAllToClipboard} className="flex items-center gap-2">
                <Copy className="h-4 w-4" />
                复制全部
              </Button>
            )}
          </div>

          {/* Results */}
          {generatedTokens.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">生成的Token</h3>
                <Badge variant="secondary">{generatedTokens.length} 个</Badge>
              </div>
              
              <div className="space-y-2">
                {generatedTokens.map((token, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="flex-1 font-mono text-sm break-all">{token}</div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {token.length} 字符
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(token)}
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Token格式说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Badge>自定义字符集</Badge>
                <span className="text-sm text-muted-foreground">根据选择的字符类型生成，适合大多数应用</span>
              </div>
              <div className="flex gap-3">
                <Badge>十六进制</Badge>
                <span className="text-sm text-muted-foreground">仅包含0-9和a-f字符，适合API密钥</span>
              </div>
              <div className="flex gap-3">
                <Badge>Base64</Badge>
                <span className="text-sm text-muted-foreground">标准Base64编码，包含+和/字符</span>
              </div>
              <div className="flex gap-3">
                <Badge>Base64 URL安全</Badge>
                <span className="text-sm text-muted-foreground">URL安全的Base64编码，用-和_替换+和/</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}