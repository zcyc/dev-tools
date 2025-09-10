'use client'

import { useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
// import { useTranslations } from 'next-intl'
import { Copy, Info, Eye, EyeOff, Download, RefreshCw } from 'lucide-react'

// Import translations
import zhMessages from '@/messages/zh.json'
import enMessages from '@/messages/en.json'

type Messages = typeof zhMessages
type Locale = 'zh' | 'en'

const messages: Record<Locale, Messages> = {
  zh: zhMessages,
  en: enMessages
}

// Helper function to get nested translation value
function getTranslation(messages: Messages, key: string): string {
  const result = key.split('.').reduce((current: unknown, k) => (current as Record<string, unknown>)?.[k], messages)
  return (result as string) || key
}
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MainLayout } from '@/components/layout/main-layout'
import { toast } from 'sonner'
import { v1 as uuidv1, v4 as uuidv4, v5 as uuidv5, v6 as uuidv6, v7 as uuidv7 } from 'uuid'
import { ulid } from 'ulid'
import KSUID from 'ksuid'
import { nanoid, customAlphabet } from 'nanoid'
import { Snowflake } from '@sapphire/snowflake'
import { Sonyflake } from 'sonyflake'
import Sqids from 'sqids'
import ShortUniqueId from 'short-unique-id'
import { createId as createCuid2 } from '@paralleldrive/cuid2'

// ID Generator Types
type IDType = 
  | 'uuid-v1' | 'uuid-v4' | 'uuid-v5' | 'uuid-v6' | 'uuid-v7'
  | 'uuid-nil' | 'uuid-max'
  | 'uuid-short' | 'uuid-base64'
  | 'ulid' | 'ksuid' | 'nanoid' | 'nanoid-custom'
  | 'snowflake' | 'sonyflake' | 'sqlds'
  | 'cuid2' | 'short-uuid'
  | 'timestamp' | 'timestamp-ms' | 'timestamp-us' | 'timestamp-ns'
  | 'objectid' | 'hex-hash'

// Type definitions for ID formats
interface IDFormat {
  id: IDType
  name: string
  description: string
  category: string
  example: string
  features: string[]
}

const ID_FORMATS: IDFormat[] = [
  // UUID Family
  {
    id: 'uuid-v1',
    name: 'UUID v1',
    description: '基于时间戳和MAC地址的UUID',
    category: 'UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
    features: ['时间排序', '唯一性保证', '可追溯']
  },
  {
    id: 'uuid-v4',
    name: 'UUID v4',
    description: '随机生成的UUID',
    category: 'UUID',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    features: ['完全随机', '高熵值', '标准格式']
  },
  {
    id: 'uuid-v5',
    name: 'UUID v5',
    description: '基于SHA-1哈希的UUID',
    category: 'UUID',
    example: '886313e1-3b8a-5372-9b90-0c9aee199e5d',
    features: ['确定性', '命名空间', '可重现']
  },
  {
    id: 'uuid-v6',
    name: 'UUID v6',
    description: '重新排序的时间戳UUID',
    category: 'UUID',
    example: '1ec9414c-232a-6b00-b3c8-9e6bdeced846',
    features: ['时间排序', '兼容性', '高效索引']
  },
  {
    id: 'uuid-v7',
    name: 'UUID v7',
    description: '基于Unix时间戳的UUID',
    category: 'UUID',
    example: '017f22e2-79b0-7cc3-98c4-dc0c0c07398f',
    features: ['时间排序', '随机性', '现代标准']
  },
  
  // Modern ID Formats
  {
    id: 'ulid',
    name: 'ULID',
    description: '按时间排序的唯一标识符',
    category: 'Modern',
    example: '01H4BCXQ2NNWG1ZKV4NZPXV123',
    features: ['时间排序', '大小写不敏感', '26字符']
  },
  {
    id: 'ksuid',
    name: 'KSUID',
    description: 'K-Sortable唯一标识符',
    category: 'Modern',
    example: '1srOrx2ZWZBpBUvZwXKQmoEYga2',
    features: ['时间排序', '27字符', '高性能']
  },
  {
    id: 'nanoid',
    name: 'Nano ID',
    description: '小巧的URL安全唯一ID生成器',
    category: 'Modern',
    example: 'V1StGXR8_Z5jdHi6B-myT',
    features: ['URL安全', '可定制长度', '高性能']
  },
  {
    id: 'cuid2',
    name: 'CUID2',
    description: '防碰撞的唯一标识符v2',
    category: 'Modern',
    example: 'clhqxzm4r0000l308r5zx7q5k',
    features: ['防碰撞', '可读性', '安全性']
  },
  {
    id: 'snowflake',
    name: 'Snowflake ID',
    description: 'Twitter雪花ID，64位时间排序唯一标识符',
    category: 'Modern',
    example: '1234567890123456789',
    features: ['时间排序', '64位数字', '高性能', '分布式']
  },
  {
    id: 'sonyflake',
    name: 'Sony Flake',
    description: 'Sony雪花ID，优化的Snowflake算法',
    category: 'Modern',
    example: '12345678901234567',
    features: ['时间排序', '优化算法', '低碰撞', '分布式']
  },
  
  // Encoded Formats
  {
    id: 'sqlds',
    name: 'Sqids',
    description: 'Hashids的现代替代品',
    category: 'Encoded',
    example: 'B4aaB',
    features: ['现代设计', '更好性能', '安全性']
  },
  
  // Timestamp Formats
  {
    id: 'timestamp',
    name: 'Unix Timestamp',
    description: 'Unix时间戳（秒）',
    category: 'Timestamp',
    example: '1698765432',
    features: ['时间表示', '简单格式', '广泛支持']
  },
  {
    id: 'timestamp-ms',
    name: 'Timestamp (ms)',
    description: 'Unix时间戳（毫秒）',
    category: 'Timestamp',
    example: '1698765432123',
    features: ['高精度', '毫秒级', 'JavaScript标准']
  }
]

export default function IDGeneratorPage() {
  const pathname = usePathname()
  const locale: Locale = pathname.startsWith('/zh') ? 'zh' : 'en'
  const currentMessages = messages[locale]
  const t = (key: string): string => getTranslation(currentMessages, key)
  
  const [selectedType, setSelectedType] = useState<IDType>('uuid-v4')
  const [quantity, setQuantity] = useState(1)
  const [generatedIds, setGeneratedIds] = useState<string[]>([])
  const [customNamespace, setCustomNamespace] = useState('')
  const [customName, setCustomName] = useState('')
  const [customLength, setCustomLength] = useState(21)
  const [customAlphabetStr, setCustomAlphabetStr] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  
  // Parser state
  const [parserInput, setParserInput] = useState('')
  const [parserResult, setParserResult] = useState<{
    input: string
    detectedType: string
    properties: Record<string, string>
  } | null>(null)

  const generateSingleId = useCallback((type: IDType): string => {
    switch (type) {
      case 'uuid-v1':
        return uuidv1()
      case 'uuid-v4':
        return uuidv4()
      case 'uuid-v5':
        return uuidv5(customName || 'test', customNamespace || uuidv4())
      case 'uuid-v6':
        return uuidv6()
      case 'uuid-v7':
        return uuidv7()
      case 'uuid-nil':
        return '00000000-0000-0000-0000-000000000000'
      case 'uuid-max':
        return 'ffffffff-ffff-ffff-ffff-ffffffffffff'
      case 'ulid':
        return ulid()
      case 'ksuid':
        return KSUID.randomSync().string
      case 'nanoid':
        return nanoid()
      case 'nanoid-custom':
        if (customAlphabetStr) {
          const customNanoid = customAlphabet(customAlphabetStr, customLength)
          return customNanoid()
        }
        return nanoid(customLength)
      case 'snowflake':
        const snowflake = new Snowflake(1420070400000n) // Twitter epoch (2010-11-04)
        return snowflake.generate().toString()
      case 'sonyflake':
        const sonyflake = new Sonyflake()
        return sonyflake.nextId().toString()
      case 'sqlds':
        const sqids = new Sqids()
        return sqids.encode([Date.now()])
      case 'cuid2':
        return createCuid2()
      case 'short-uuid':
        const uid = new ShortUniqueId({ length: 10 })
        return uid.rnd()
      case 'timestamp':
        return Math.floor(Date.now() / 1000).toString()
      case 'timestamp-ms':
        return Date.now().toString()
      case 'timestamp-us':
        return (Date.now() * 1000).toString()
      case 'timestamp-ns':
        return (Date.now() * 1000000).toString()
      case 'objectid':
        // Simple ObjectId-like generation
        const timestamp = Math.floor(Date.now() / 1000).toString(16)
        const random = Math.random().toString(16).substr(2, 16)
        return (timestamp + random).padEnd(24, '0').substr(0, 24)
      case 'hex-hash':
        return Array(32).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
      default:
        return uuidv4()
    }
  }, [customNamespace, customName, customLength, customAlphabetStr])

  const generateIds = useCallback(() => {
    const ids = Array(quantity).fill(0).map(() => generateSingleId(selectedType))
    setGeneratedIds(ids)
    toast.success(`成功生成 ${ids.length} 个 ${ID_FORMATS.find(f => f.id === selectedType)?.name} ID`)
  }, [selectedType, quantity, generateSingleId])

  const parseId = useCallback((input: string) => {
    const id = input.trim()
    if (!id) {
      setParserResult(null)
      return
    }

    const result: {
      input: string
      detectedType: string
      properties: Record<string, string>
    } = {
      input: id,
      detectedType: 'Unknown',
      properties: {}
    }

    // UUID patterns
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (uuidPattern.test(id)) {
      result.detectedType = 'UUID'
      const version = parseInt(id.charAt(14), 16)
      result.properties.version = version.toString()
      result.properties.variant = 'RFC 4122'
      
      if (version === 1) {
        // Extract timestamp from UUID v1
        const timeLow = parseInt(id.substr(0, 8), 16)
        const timeMid = parseInt(id.substr(9, 4), 16)
        const timeHigh = parseInt(id.substr(14, 4), 16) & 0x0fff
        const timestamp = ((timeHigh << 32) | (timeMid << 16) | timeLow) - 0x01b21dd213814000
        result.properties.timestamp = new Date(timestamp / 10000).toISOString()
      }
      
      if (version === 7) {
        // Extract timestamp from UUID v7
        const timestampHex = id.substr(0, 12).replace('-', '')
        const timestamp = parseInt(timestampHex, 16)
        result.properties.timestamp = new Date(timestamp).toISOString()
      }
    }
    
    // ULID pattern
    else if (/^[0-9A-HJKMNP-TV-Z]{26}$/i.test(id)) {
      result.detectedType = 'ULID'
      try {
        const timestampPart = id.substr(0, 10)
        const randomPart = id.substr(10)
        result.properties.timestampPart = timestampPart
        result.properties.randomPart = randomPart
        
        // Decode timestamp
        const chars = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
        let timestamp = 0
        for (let i = 0; i < timestampPart.length; i++) {
          timestamp = timestamp * 32 + chars.indexOf(timestampPart[i].toUpperCase())
        }
        result.properties.timestamp = new Date(timestamp).toISOString()
      } catch (error) {
        result.properties.error = 'Invalid ULID format'
      }
    }
    
    // KSUID pattern
    else if (/^[0-9A-Za-z]{27}$/.test(id)) {
      result.detectedType = 'KSUID'
      try {
        const ksuid = KSUID.parse(id)
        result.properties.timestamp = ksuid.date.toISOString()
        result.properties.payload = ksuid.payload.toString('hex')
      } catch (error) {
        result.properties.error = 'Invalid KSUID format'
      }
    }
    
    // Nano ID pattern (URL-safe base64)
    else if (/^[A-Za-z0-9_-]+$/.test(id) && id.length >= 10 && id.length <= 25) {
      result.detectedType = 'Nano ID'
      result.properties.length = id.length.toString()
      result.properties.charset = 'URL-safe base64'
    }
    
    // CUID2 pattern
    else if (/^c[0-9a-z]{24}$/.test(id)) {
      result.detectedType = 'CUID2'
      result.properties.length = id.length.toString()
      result.properties.prefix = id.charAt(0)
    }
    
    // Snowflake ID pattern (64-bit number as string)
    else if (/^\d{15,20}$/.test(id)) {
      const idNum = BigInt(id)
      // Try to parse as Snowflake (Twitter epoch: 1288834974657)
      const twitterEpoch = 1288834974657n
      const timestamp = (idNum >> 22n) + twitterEpoch
      const machineId = (idNum >> 12n) & 0x3ffn
      const sequence = idNum & 0xfffn
      
      if (timestamp > 0 && timestamp < Date.now() + 86400000) { // Within reasonable time range
        result.detectedType = 'Snowflake ID'
        result.properties.timestamp = new Date(Number(timestamp)).toISOString()
        result.properties.machineId = machineId.toString()
        result.properties.sequence = sequence.toString()
        result.properties.bits = '64-bit'
      } else {
        // Try Sony Flake format (different bit layout)
        result.detectedType = 'Sony Flake ID (Probable)'
        result.properties.length = id.length.toString()
        result.properties.note = 'Large numeric ID, possibly Sony Flake format'
      }
    }
    
    // Timestamp patterns
    else if (/^\d{10}$/.test(id)) {
      result.detectedType = 'Unix Timestamp (seconds)'
      result.properties.timestamp = new Date(parseInt(id) * 1000).toISOString()
    }
    else if (/^\d{13}$/.test(id)) {
      result.detectedType = 'Unix Timestamp (milliseconds)'
      result.properties.timestamp = new Date(parseInt(id)).toISOString()
    }
    
    // ObjectId pattern
    else if (/^[0-9a-f]{24}$/i.test(id)) {
      result.detectedType = 'ObjectId'
      const timestamp = parseInt(id.substr(0, 8), 16)
      result.properties.timestamp = new Date(timestamp * 1000).toISOString()
      result.properties.machineId = id.substr(8, 6)
      result.properties.processId = id.substr(14, 4)
      result.properties.counter = id.substr(18, 6)
    }
    
    // Hex hash pattern
    else if (/^[0-9a-f]{32,64}$/i.test(id)) {
      result.detectedType = 'Hex Hash'
      result.properties.length = id.length.toString()
      result.properties.bits = (id.length * 4).toString()
    }

    setParserResult(result)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('已复制到剪贴板')
  }

  const exportIds = () => {
    const content = generatedIds.join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedType}-ids.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const currentFormat = ID_FORMATS.find(f => f.id === selectedType)
  const categories = [...new Set(ID_FORMATS.map(f => f.category))]

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('tools.idGenerator.pageTitle')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('tools.idGenerator.pageDescription')}
          </p>
        </div>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">{t('tools.idGenerator.generation')}</TabsTrigger>
            <TabsTrigger value="parse">{t('tools.idGenerator.parsing')}</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  {t('tools.idGenerator.generateConfig')}
                </CardTitle>
                <CardDescription>
                  {t('tools.idGenerator.generateConfigDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id-type">{t('tools.idGenerator.idType')}</Label>
                    <Select value={selectedType} onValueChange={(value: IDType) => setSelectedType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('tools.idGenerator.selectIdType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <div key={category}>
                            <div className="px-2 py-1 text-sm font-medium text-muted-foreground">
                              {category}
                            </div>
                            {ID_FORMATS.filter(f => f.category === category).map(format => (
                              <SelectItem key={format.id} value={format.id}>
                                <div className="flex flex-col">
                                  <span>{format.name}</span>
                                  <span className="text-xs text-muted-foreground">{format.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">{t('tools.idGenerator.generateCount')}</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      max={100}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                    />
                  </div>
                </div>

                {/* Custom parameters for specific ID types */}
                {(selectedType === 'uuid-v5') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="namespace">{t('tools.idGenerator.namespace')}</Label>
                      <Input
                        id="namespace"
                        placeholder={t('tools.idGenerator.namespacePlaceholder')}
                        value={customNamespace}
                        onChange={(e) => setCustomNamespace(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('tools.idGenerator.nameField')}</Label>
                      <Input
                        id="name"
                        placeholder={t('tools.idGenerator.namePlaceholder')}
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {(selectedType === 'nanoid-custom') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length">{t('tools.idGenerator.length')}</Label>
                      <Input
                        id="length"
                        type="number"
                        min={1}
                        max={100}
                        value={customLength}
                        onChange={(e) => setCustomLength(parseInt(e.target.value) || 21)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alphabet">{t('tools.idGenerator.alphabet')}</Label>
                      <Input
                        id="alphabet"
                        placeholder={t('tools.idGenerator.alphabetPlaceholder')}
                        value={customAlphabetStr}
                        onChange={(e) => setCustomAlphabetStr(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={generateIds} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('tools.idGenerator.generateButton')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Format Information */}
            {currentFormat && showDetails && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    格式信息 - {currentFormat.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{currentFormat.description}</p>
                    <div>
                      <div className="text-sm font-medium mb-2">示例格式:</div>
                      <code className="px-2 py-1 bg-muted rounded text-sm">{currentFormat.example}</code>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">特性:</div>
                      <div className="flex flex-wrap gap-2">
                        {currentFormat.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generated Results */}
            {generatedIds.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>生成结果</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={exportIds}>
                        <Download className="h-4 w-4 mr-2" />
                        导出
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedIds.join('\n'))}>
                        <Copy className="h-4 w-4 mr-2" />
                        复制全部
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedIds.map((id, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <code className="flex-1 text-sm font-mono">{id}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="parse" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  ID解析器
                </CardTitle>
                <CardDescription>
                  输入任意ID进行格式识别和信息提取
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parser-input">ID字符串</Label>
                  <Textarea
                    id="parser-input"
                    placeholder="输入要解析的ID..."
                    value={parserInput}
                    onChange={(e) => {
                      setParserInput(e.target.value)
                      parseId(e.target.value)
                    }}
                    rows={3}
                  />
                </div>

                {parserResult && (
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">检测类型</div>
                        <Badge variant="default" className="mt-1">{parserResult.detectedType}</Badge>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground">输入内容</div>
                        <code className="block mt-1 p-2 bg-background rounded text-sm">{parserResult.input}</code>
                      </div>

                      {Object.keys(parserResult.properties).length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-2">属性信息</div>
                          <div className="space-y-2">
                            {Object.entries(parserResult.properties).map(([key, value]) => (
                              <div key={key} className="flex justify-between items-center p-2 bg-background rounded">
                                <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <code className="text-sm">{String(value)}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}