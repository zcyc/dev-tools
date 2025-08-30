'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Copy, Calculator, RefreshCw } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

const bases = [
  { value: 2, name: '二进制 (Binary)', chars: '01', example: '1010' },
  { value: 8, name: '八进制 (Octal)', chars: '01234567', example: '755' },
  { value: 10, name: '十进制 (Decimal)', chars: '0123456789', example: '123' },
  { value: 16, name: '十六进制 (Hexadecimal)', chars: '0123456789ABCDEF', example: 'FF' },
  { value: 36, name: '36进制 (Base36)', chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', example: 'ZZ' }
]

interface ConversionResult {
  decimal: number
  binary: string
  octal: string
  hexadecimal: string
  base36: string
}

export default function NumberBaseConverterPage() {
  const [inputValue, setInputValue] = useState('')
  const [inputBase, setInputBase] = useState(10)
  const [result, setResult] = useState<ConversionResult | null>(null)

  const convertNumber = () => {
    if (!inputValue.trim()) {
      toast.error('请输入要转换的数字')
      return
    }

    try {
      // Validate input based on selected base
      const baseInfo = bases.find(b => b.value === inputBase)
      if (baseInfo) {
        const validChars = baseInfo.chars.toLowerCase()
        const inputChars = inputValue.toLowerCase()
        
        for (const char of inputChars) {
          if (!validChars.includes(char)) {
            throw new Error(`输入包含无效字符 "${char}"，${baseInfo.name}只支持字符: ${baseInfo.chars}`)
          }
        }
      }

      // Convert to decimal first
      const decimal = parseInt(inputValue, inputBase)
      
      if (isNaN(decimal)) {
        throw new Error('无效的数字格式')
      }

      if (decimal < 0) {
        throw new Error('暂不支持负数转换')
      }

      // Convert to all bases
      const newResult: ConversionResult = {
        decimal: decimal,
        binary: decimal.toString(2),
        octal: decimal.toString(8),
        hexadecimal: decimal.toString(16).toUpperCase(),
        base36: decimal.toString(36).toUpperCase()
      }

      setResult(newResult)
      toast.success('数字转换成功')
    } catch (error) {
      toast.error('转换失败: ' + (error as Error).message)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (err) {
      toast.error('复制失败')
    }
  }

  const clearAll = () => {
    setInputValue('')
    setResult(null)
  }

  const loadExample = (base: number) => {
    const baseInfo = bases.find(b => b.value === base)
    if (baseInfo) {
      setInputValue(baseInfo.example)
      setInputBase(base)
    }
  }

  const loadFromResult = (value: string, base: number) => {
    setInputValue(value)
    setInputBase(base)
  }

  // Calculate some interesting information
  const getNumberInfo = (decimal: number) => {
    const info = []
    
    if (decimal === 0) {
      info.push('零')
    } else if (decimal === 1) {
      info.push('一')
    } else {
      // Check if power of 2
      if ((decimal & (decimal - 1)) === 0) {
        const power = Math.log2(decimal)
        info.push(`2的${power}次方`)
      }
      
      // Check if prime (simple check for small numbers)
      if (decimal < 1000 && isPrime(decimal)) {
        info.push('质数')
      }
      
      // Check if perfect square
      const sqrt = Math.sqrt(decimal)
      if (Number.isInteger(sqrt)) {
        info.push(`${sqrt}的平方`)
      }
    }
    
    return info
  }

  const isPrime = (n: number): boolean => {
    if (n < 2) return false
    if (n === 2) return true
    if (n % 2 === 0) return false
    
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false
    }
    return true
  }

  return (
    <MainLayout>
      <ToolLayout
        title="进制转换"
        description="二进制、八进制、十进制、十六进制等数字进制转换"
        icon="Calculator"
      >
        <div className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">数字转换</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="input-value">输入数字</Label>
                <Input
                  id="input-value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.replace(/\\s/g, ''))}
                  placeholder="输入要转换的数字"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="input-base">输入进制</Label>
                <Select value={inputBase.toString()} onValueChange={(value) => setInputBase(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.map((base) => (
                      <SelectItem key={base.value} value={base.value.toString()}>
                        <div>
                          <div className="font-medium">{base.name}</div>
                          <div className="text-xs text-muted-foreground">
                            字符: {base.chars} (示例: {base.example})
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Example buttons */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">快速示例</Label>
              <div className="flex flex-wrap gap-2">
                {bases.map((base) => (
                  <Button
                    key={base.value}
                    variant="outline"
                    size="sm"
                    onClick={() => loadExample(base.value)}
                    className="text-xs"
                  >
                    {base.name.split(' ')[0]} {base.example}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={convertNumber} className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                转换
              </Button>
              {result && (
                <Button variant="outline" onClick={clearAll}>
                  清除结果
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">转换结果</h3>
                <div className="flex gap-2">
                  {getNumberInfo(result.decimal).map((info, index) => (
                    <Badge key={index} variant="secondary">{info}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">二进制 (Base 2)</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => loadFromResult(result.binary, 2)}
                          className="h-6 w-6"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(result.binary)}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="font-mono text-sm bg-muted p-3 rounded break-all">
                      {result.binary}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {result.binary.length} 位
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">八进制 (Base 8)</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => loadFromResult(result.octal, 8)}
                          className="h-6 w-6"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(result.octal)}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="font-mono text-sm bg-muted p-3 rounded break-all">
                      {result.octal}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      0{result.octal} (八进制前缀)
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">十进制 (Base 10)</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => loadFromResult(result.decimal.toString(), 10)}
                          className="h-6 w-6"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(result.decimal.toString())}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="font-mono text-sm bg-muted p-3 rounded break-all">
                      {result.decimal.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      标准数字表示
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">十六进制 (Base 16)</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => loadFromResult(result.hexadecimal, 16)}
                          className="h-6 w-6"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(result.hexadecimal)}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="font-mono text-sm bg-muted p-3 rounded break-all">
                      {result.hexadecimal}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      0x{result.hexadecimal} (十六进制前缀)
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional bases */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">其他进制</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center justify-between p-3 bg-muted rounded">
                      <div>
                        <div className="font-medium text-sm">36进制 (Base 36)</div>
                        <div className="font-mono text-xs">{result.base36}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => loadFromResult(result.base36, 36)}
                          className="h-6 w-6"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(result.base36)}
                          className="h-6 w-6"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">进制说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-3">
                <Badge>二进制</Badge>
                <span className="text-sm text-muted-foreground">计算机内部使用，只有0和1</span>
              </div>
              <div className="flex gap-3">
                <Badge>八进制</Badge>
                <span className="text-sm text-muted-foreground">使用0-7，常用于Unix文件权限</span>
              </div>
              <div className="flex gap-3">
                <Badge>十进制</Badge>
                <span className="text-sm text-muted-foreground">日常使用的数字系统</span>
              </div>
              <div className="flex gap-3">
                <Badge>十六进制</Badge>
                <span className="text-sm text-muted-foreground">使用0-9和A-F，常用于颜色代码和内存地址</span>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <div className="text-sm">
                  <div className="font-medium mb-1">转换规则:</div>
                  <div className="text-xs space-y-1">
                    <div>• 所有进制最终都通过十进制进行转换</div>
                    <div>• 大写字母A-Z代表数值10-35</div>
                    <div>• 输入时不区分大小写</div>
                    <div>• 支持最大值受JavaScript数字精度限制</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}