/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FormatConverterPage from '../../app/tools/format/page'

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
    
    expect(screen.getByPlaceholderText('输入JSON格式数据...')).toBeInTheDocument()
  })

  it('has convert button', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })).toBeInTheDocument()
  })

  it('has clear button', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByRole('button', { name: '清除内容' })).toBeInTheDocument()
  })

  it('can input data', () => {
    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式数据...')
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

  it('shows error when input and output formats are the same', async () => {
    const { toast } = require('sonner')
    render(<FormatConverterPage />)
    
    // Change output format to JSON (same as input)
    const outputSelector = screen.getByDisplayValue('YAML')
    fireEvent.click(outputSelector)
    
    const jsonOption = screen.getByText('JSON')
    fireEvent.click(jsonOption)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 JSON/ })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('输入格式和输出格式不能相同')
    })
  })

  it('can convert JSON to YAML successfully', async () => {
    const { toast } = require('sonner')
    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('成功从 JSON 转换为 YAML')
    })
  })

  it('can change input format', () => {
    render(<FormatConverterPage />)
    
    const inputSelector = screen.getByDisplayValue('JSON')
    fireEvent.click(inputSelector)
    
    const yamlOption = screen.getByText('YAML')
    fireEvent.click(yamlOption)
    
    // Placeholder should change
    expect(screen.getByPlaceholderText('输入YAML格式数据...')).toBeInTheDocument()
  })

  it('can change output format', () => {
    render(<FormatConverterPage />)
    
    const outputSelector = screen.getByDisplayValue('YAML')
    fireEvent.click(outputSelector)
    
    const xmlOption = screen.getByText('XML')
    fireEvent.click(xmlOption)
    
    // Button text should change
    expect(screen.getByRole('button', { name: /从 JSON 转换为 XML/ })).toBeInTheDocument()
  })

  it('can load sample data', () => {
    render(<FormatConverterPage />)
    
    const loadSampleButton = screen.getByRole('button', { name: '加载示例 JSON' })
    fireEvent.click(loadSampleButton)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式数据...')
    expect(inputTextarea.value.length).toBeGreaterThan(0)
  })

  it('can clear content', () => {
    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    const clearButton = screen.getByRole('button', { name: '清除内容' })
    fireEvent.click(clearButton)
    
    expect(inputTextarea).toHaveValue('')
  })

  it('can swap input and output formats', () => {
    render(<FormatConverterPage />)
    
    // Initial state: JSON -> YAML
    expect(screen.getByDisplayValue('JSON')).toBeInTheDocument()
    expect(screen.getByDisplayValue('YAML')).toBeInTheDocument()
    
    const swapButton = screen.getByRole('button', { name: '交换格式' })
    fireEvent.click(swapButton)
    
    // After swap: YAML -> JSON
    expect(screen.getByDisplayValue('YAML')).toBeInTheDocument()
    expect(screen.getByDisplayValue('JSON')).toBeInTheDocument()
  })

  it('shows output area after conversion', async () => {
    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(screen.getByText('转换结果')).toBeInTheDocument()
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
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      // After conversion, copy button should be available
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && button.getAttribute('class')?.includes('h-8 w-8')
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows format descriptions', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByText('格式说明')).toBeInTheDocument()
    expect(screen.getByText('JSON')).toBeInTheDocument()
    expect(screen.getByText('YAML')).toBeInTheDocument()
    expect(screen.getByText('XML')).toBeInTheDocument()
  })

  it('shows format features', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByText('格式特点')).toBeInTheDocument()
    expect(screen.getByText(/JSON.*Web API.*传输/)).toBeInTheDocument()
    expect(screen.getByText(/YAML.*配置文件.*可读性/)).toBeInTheDocument()
    expect(screen.getByText(/XML.*结构化数据.*标准化/)).toBeInTheDocument()
  })

  it('has sample data for all formats', () => {
    render(<FormatConverterPage />)
    
    expect(screen.getByRole('button', { name: '加载示例 JSON' })).toBeInTheDocument()
    
    // Change to YAML input format
    const inputSelector = screen.getByDisplayValue('JSON')
    fireEvent.click(inputSelector)
    
    const yamlOption = screen.getByText('YAML')
    fireEvent.click(yamlOption)
    
    expect(screen.getByRole('button', { name: '加载示例 YAML' })).toBeInTheDocument()
    
    // Change to XML input format
    const inputSelector2 = screen.getByDisplayValue('YAML')
    fireEvent.click(inputSelector2)
    
    const xmlOption = screen.getByText('XML')
    fireEvent.click(xmlOption)
    
    expect(screen.getByRole('button', { name: '加载示例 XML' })).toBeInTheDocument()
  })

  it('handles JSON parsing errors gracefully', async () => {
    // Mock JSON.parse to throw error
    const originalParse = JSON.parse
    JSON.parse = jest.fn().mockImplementation(() => {
      throw new Error('Invalid JSON')
    })

    const { toast } = require('sonner')
    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式数据...')
    fireEvent.change(inputTextarea, { target: { value: '{invalid json}' } })
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('转换失败'))
    })

    // Restore original JSON.parse
    JSON.parse = originalParse
  })

  it('shows loading state during conversion', async () => {
    render(<FormatConverterPage />)
    
    const inputTextarea = screen.getByPlaceholderText('输入JSON格式数据...')
    fireEvent.change(inputTextarea, { target: { value: '{"name": "test"}' } })
    
    const convertButton = screen.getByRole('button', { name: /从 JSON 转换为 YAML/ })
    fireEvent.click(convertButton)
    
    // Should show loading state
    expect(screen.getByText('转换中...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.queryByText('转换中...')).not.toBeInTheDocument()
    })
  })
})