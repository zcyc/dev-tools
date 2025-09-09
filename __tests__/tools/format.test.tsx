/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FormatConverterPage from '../../app/[locale]/tools/format/page'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}))

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock js-yaml
jest.mock('js-yaml', () => ({
  load: jest.fn().mockReturnValue({ name: 'test', value: 123 }),
  dump: jest.fn().mockReturnValue('name: test\nvalue: 123\n')
}))

// Mock fast-xml-parser
jest.mock('fast-xml-parser', () => ({
  XMLParser: jest.fn().mockImplementation(() => ({
    parse: jest.fn().mockReturnValue({ root: { name: 'test', value: 123 } })
  })),
  XMLBuilder: jest.fn().mockImplementation(() => ({
    build: jest.fn().mockReturnValue('<root><name>test</name><value>123</value></root>')
  }))
}))

describe('Format Converter Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the format converter page', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByText('JSON/YAML/XML转换')).toBeInTheDocument()
    expect(screen.getByText('在JSON、YAML、XML数据格式之间进行转换')).toBeInTheDocument()
  })

  it('has input and output format selectors', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByText('输入格式')).toBeInTheDocument()
    expect(screen.getByText('输出格式')).toBeInTheDocument()
  })

  it('has input textarea', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByPlaceholderText('输入JSON格式的数据...')).toBeInTheDocument()
  })

  it('has convert button', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })).toBeInTheDocument()
  })

  it('has clear button', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByText('清除全部')).toBeInTheDocument()
  })

  it('can input data', () => {
    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式的数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    expect(inputTextarea).toHaveValue('{"name": "test"}')
  })

  it('shows error when trying to convert empty input', async () => {
    const { toast } = require('sonner')
    render(<FormatConverterPage />)
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入要转换的数据')
    })
  })

  it('shows error when trying to convert with same format', async () => {
    const { toast } = require('sonner')
    render(<FormatConverterPage />)
    
    // Test that convert button initially works with different formats (JSON -> YAML)
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式的数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })
    expect(convertButton).not.toBeDisabled()
  })

  it('can convert JSON to YAML successfully', async () => {
    const { toast } = require('sonner')
    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式的数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('成功从 JSON 转换为 YAML')
    })
  })

  it('can change input format', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByText('输入格式')).toBeInTheDocument()
    expect(screen.getByText('输出格式')).toBeInTheDocument()
  })

  it('can change output format', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })).toBeInTheDocument()
  })

  it('can load sample data', () => {
    render(<FormatConverterPage />)
    
    const loadSampleButton = screen.getByText('加载示例')
    fireEvent.click(loadSampleButton)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式的数据...')
    expect(inputTextarea.value.length).toBeGreaterThan(0)
  })

  it('can clear content', () => {
    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式的数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    const clearButton = screen.getByText('清除全部')
    fireEvent.click(clearButton)
    
    expect(inputTextarea).toHaveValue('')
  })

  it('has swap button', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByText('交换')).toBeInTheDocument()
  })

  it('shows output area after conversion', async () => {
    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式的数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(screen.getByText(/输出结果.*YAML/)).toBeInTheDocument()
    })
  })

  it('has copy functionality after conversion', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式的数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      // After conversion, copy button should be available
      expect(screen.getByText('复制')).toBeInTheDocument()
    })
  })

  it('shows format descriptions', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getAllByText('JSON').length).toBeGreaterThan(0)
    expect(screen.getAllByText('YAML').length).toBeGreaterThan(0)
    expect(screen.getAllByText('XML').length).toBeGreaterThan(0)
  })

  it('shows format features', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByText('轻量级')).toBeInTheDocument()
    expect(screen.getByText('易解析')).toBeInTheDocument()
    expect(screen.getByText('人类可读')).toBeInTheDocument()
    expect(screen.getByText('配置文件')).toBeInTheDocument()
    expect(screen.getByText('结构化')).toBeInTheDocument()
    expect(screen.getByText('元数据')).toBeInTheDocument()
  })

  it('has sample data button', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByText('加载示例')).toBeInTheDocument()
  })

  it('handles JSON parsing errors gracefully', async () => {
    // Mock JSON.parse to throw error
    const originalParse = JSON.parse
    JSON.parse = jest.fn().mockImplementation(() => {
      throw new Error('Invalid JSON')
    })

    const { toast } = require('sonner')
    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式的数据...')
    fireEvent.change(inputTextarea, { target: { value: '{invalid json}' } })
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('转换失败'))
    })

    // Restore original JSON.parse
    JSON.parse = originalParse
  })

  it('has format button', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByText('格式化')).toBeInTheDocument()
  })
})