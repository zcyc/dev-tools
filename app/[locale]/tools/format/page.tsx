'use client'

import { useState } from 'react'
import * as yaml from 'js-yaml'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Copy, ArrowRight, RefreshCw } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'
import { toast } from 'sonner'

type DataFormat = 'json' | 'yaml' | 'xml'

const formats = [
  { value: 'json', name: 'JSON', description: 'JavaScript Object Notation' },
  { value: 'yaml', name: 'YAML', description: 'YAML Ain\'t Markup Language' },
  { value: 'xml', name: 'XML', description: 'eXtensible Markup Language' }
]

const sampleData = {
  json: `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "skills": ["JavaScript", "Python", "Go"],
  "address": {
    "street": "123 Main St",
    "zipCode": "10001"
  },
  "active": true
}`,
  yaml: `name: John Doe
age: 30
city: New York
skills:
  - JavaScript
  - Python
  - Go
address:
  street: 123 Main St
  zipCode: "10001"
active: true`,
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>John Doe</name>
  <age>30</age>
  <city>New York</city>
  <skills>
    <skill>JavaScript</skill>
    <skill>Python</skill>
    <skill>Go</skill>
  </skills>
  <address>
    <street>123 Main St</street>
    <zipCode>10001</zipCode>
  </address>
  <active>true</active>
</person>`
}

export default function FormatConverterPage() {
  const [inputText, setInputText] = useState('')
  const [inputFormat, setInputFormat] = useState<DataFormat>('json')
  const [outputFormat, setOutputFormat] = useState<DataFormat>('yaml')
  const [outputText, setOutputText] = useState('')
  const [isConverting, setIsConverting] = useState(false)

  const convertFormat = async () => {
    if (!inputText.trim()) {
      toast.error('请输入要转换的数据')
      return
    }

    if (inputFormat === outputFormat) {
      toast.error('输入格式和输出格式不能相同')
      return
    }

    setIsConverting(true)

    try {
      // Parse input data
      let data

      switch (inputFormat) {
        case 'json':
          data = JSON.parse(inputText)
          break
        case 'yaml':
          data = yaml.load(inputText)
          break
        case 'xml':
          const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            textNodeName: '#text',
            parseAttributeValue: true,
            parseTagValue: true
          })
          data = parser.parse(inputText)
          break
        default:
          throw new Error('不支持的输入格式')
      }

      // Convert to output format
      let output: string

      switch (outputFormat) {
        case 'json':
          output = JSON.stringify(data, null, 2)
          break
        case 'yaml':
          output = yaml.dump(data, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
            sortKeys: false
          })
          break
        case 'xml':
          const builder = new XMLBuilder({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            textNodeName: '#text',
            format: true,
            indentBy: '  ',
            suppressEmptyNode: true
          })
          
          // Add XML declaration if not present
          output = '<?xml version="1.0" encoding="UTF-8"?>\\n' + builder.build(data)
          break
        default:
          throw new Error('不支持的输出格式')
      }

      setOutputText(output)
      toast.success(`成功从 ${inputFormat.toUpperCase()} 转换为 ${outputFormat.toUpperCase()}`)
    } catch (error) {
      toast.error('转换失败: ' + (error as Error).message)
    } finally {
      setIsConverting(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('已复制到剪贴板')
    } catch (error) {
      toast.error('复制失败')
    }
  }

  const loadSample = () => {
    setInputText(sampleData[inputFormat])
  }

  const clearAll = () => {
    setInputText('')
    setOutputText('')
  }

  const swapFormats = () => {
    const temp = inputFormat
    setInputFormat(outputFormat)
    setOutputFormat(temp)
    
    if (outputText) {
      setInputText(outputText)
      setOutputText('')
    }
  }

  const formatInput = () => {
    if (!inputText.trim()) {
      toast.error('请输入要格式化的数据')
      return
    }

    try {
      let formatted: string

      switch (inputFormat) {
        case 'json':
          const jsonData = JSON.parse(inputText)
          formatted = JSON.stringify(jsonData, null, 2)
          break
        case 'yaml':
          const yamlData = yaml.load(inputText)
          formatted = yaml.dump(yamlData, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
            sortKeys: false
          })
          break
        case 'xml':
          const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            textNodeName: '#text',
            parseAttributeValue: true,
            parseTagValue: true
          })
          const xmlData = parser.parse(inputText)
          const builder = new XMLBuilder({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            textNodeName: '#text',
            format: true,
            indentBy: '  ',
            suppressEmptyNode: true
          })
          formatted = '<?xml version="1.0" encoding="UTF-8"?>\\n' + builder.build(xmlData)
          break
        default:
          throw new Error('不支持的格式')
      }

      setInputText(formatted)
      toast.success('格式化成功')
    } catch (error) {
      toast.error('格式化失败: ' + (error as Error).message)
    }
  }

  return (
    <MainLayout>
      <ToolLayout
        title="JSON/YAML/XML转换"
        description="在JSON、YAML、XML数据格式之间进行转换"
        icon="FileCode"
      >
        <div className="space-y-6">
          {/* Format Selection */}
          <div className="grid gap-4 md:grid-cols-3 items-end">
            <div className="space-y-2">
              <Label htmlFor="input-format">输入格式</Label>
              <Select value={inputFormat} onValueChange={(value: DataFormat) => setInputFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div>
                        <div className="font-medium">{format.name}</div>
                        <div className="text-xs text-muted-foreground">{format.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button variant="outline" onClick={swapFormats} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                交换
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="output-format">输出格式</Label>
              <Select value={outputFormat} onValueChange={(value: DataFormat) => setOutputFormat(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div>
                        <div className="font-medium">{format.name}</div>
                        <div className="text-xs text-muted-foreground">{format.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">输入数据 ({inputFormat.toUpperCase()})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={loadSample}>
                      加载示例
                    </Button>
                    <Button variant="outline" size="sm" onClick={formatInput}>
                      格式化
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`输入${inputFormat.toUpperCase()}格式的数据...`}
                  className="font-mono text-sm min-h-[300px]"
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {inputText.length} 字符，{inputText.split('\\n').length} 行
                  </div>
                  <Badge variant="outline">{inputFormat.toUpperCase()}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">输出结果 ({outputFormat.toUpperCase()})</CardTitle>
                  {outputText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(outputText)}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-3 w-3" />
                      复制
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={outputText}
                  readOnly
                  placeholder={`转换后的${outputFormat.toUpperCase()}格式数据将显示在这里...`}
                  className="font-mono text-sm min-h-[300px]"
                />
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {outputText.length} 字符，{outputText.split('\\n').length} 行
                  </div>
                  <Badge variant="outline">{outputFormat.toUpperCase()}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Convert Button */}
          <div className="flex justify-center">
            <Button 
              onClick={convertFormat} 
              disabled={isConverting || inputFormat === outputFormat}
              className="flex items-center gap-2"
              size="lg"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  转换中...
                </>
              ) : (
                <>
                  <ArrowRight className="h-4 w-4" />
                  从 {inputFormat.toUpperCase()} 转换为 {outputFormat.toUpperCase()}
                </>
              )}
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={clearAll}>
              清除全部
            </Button>
          </div>

          {/* Format Info */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">JSON</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant="outline">轻量级</Badge>
                  <Badge variant="outline">易解析</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  最常用的数据交换格式，广泛支持于各种编程语言和API
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">YAML</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant="outline">人类可读</Badge>
                  <Badge variant="outline">配置文件</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  结构清晰的配置文件格式，常用于Docker、Kubernetes等
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">XML</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex gap-2">
                  <Badge variant="outline">结构化</Badge>
                  <Badge variant="outline">元数据</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  支持属性和命名空间的标记语言，企业级应用中常见
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </ToolLayout>
    </MainLayout>
  )
}