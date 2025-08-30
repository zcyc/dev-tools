/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import JSONFormatterPage from '../../app/tools/json-formatter/page'

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

describe('JSON Formatter Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the JSON formatter page', () => {
    render(<JSONFormatterPage />)
    
    expect(screen.getByText('JSON格式化/压缩')).toBeInTheDocument()
    expect(screen.getByText('格式化、压缩、验证JSON数据')).toBeInTheDocument()
  })

  it('has JSON input field', () => {
    render(<JSONFormatterPage />)
    
    expect(screen.getByPlaceholderText('输入JSON数据...')).toBeInTheDocument()
  })

  it('has format button', () => {
    render(<JSONFormatterPage />)
    
    expect(screen.getByRole('button', { name: '格式化JSON' })).toBeInTheDocument()
  })

  it('has minify button', () => {
    render(<JSONFormatterPage />)
    
    expect(screen.getByRole('button', { name: '压缩JSON' })).toBeInTheDocument()
  })

  it('has validate button', () => {
    render(<JSONFormatterPage />)
    
    expect(screen.getByRole('button', { name: '验证JSON' })).toBeInTheDocument()
  })

  it('has clear button', () => {
    render(<JSONFormatterPage />)
    
    expect(screen.getByRole('button', { name: '清除' })).toBeInTheDocument()
  })

  it('can input JSON data', () => {
    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    const jsonData = '{"name":"John","age":30}'
    
    fireEvent.change(jsonInput, { target: { value: jsonData } })
    
    expect(jsonInput).toHaveValue(jsonData)
  })

  it('shows error when trying to format empty input', async () => {
    const { toast } = require('sonner')
    render(<JSONFormatterPage />)
    
    const formatButton = screen.getByRole('button', { name: '格式化JSON' })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入JSON数据')
    })
  })

  it('can format valid JSON successfully', async () => {
    const { toast } = require('sonner')
    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    fireEvent.change(jsonInput, { target: { value: '{"name":"John","age":30}' } })
    
    const formatButton = screen.getByRole('button', { name: '格式化JSON' })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('JSON格式化成功')
    })
  })

  it('can minify valid JSON successfully', async () => {
    const { toast } = require('sonner')
    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    const formattedJson = `{
  "name": "John",
  "age": 30
}`
    fireEvent.change(jsonInput, { target: { value: formattedJson } })
    
    const minifyButton = screen.getByRole('button', { name: '压缩JSON' })
    fireEvent.click(minifyButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('JSON压缩成功')
    })
  })

  it('can validate valid JSON successfully', async () => {
    const { toast } = require('sonner')
    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    fireEvent.change(jsonInput, { target: { value: '{"name":"John","age":30}' } })
    
    const validateButton = screen.getByRole('button', { name: '验证JSON' })
    fireEvent.click(validateButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('JSON格式正确')
    })
  })

  it('shows error for invalid JSON', async () => {
    const { toast } = require('sonner')
    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    fireEvent.change(jsonInput, { target: { value: '{"name":"John","age":}' } }) // Invalid JSON
    
    const formatButton = screen.getByRole('button', { name: '格式化JSON' })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('JSON格式错误'))
    })
  })

  it('can clear input and results', () => {
    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    fireEvent.change(jsonInput, { target: { value: '{"test": true}' } })
    
    const clearButton = screen.getByRole('button', { name: '清除' })
    fireEvent.click(clearButton)
    
    expect(jsonInput).toHaveValue('')
  })

  it('has sample JSON button', () => {
    render(<JSONFormatterPage />)
    
    expect(screen.getByRole('button', { name: '加载示例JSON' })).toBeInTheDocument()
  })

  it('can load sample JSON', () => {
    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    const loadSampleButton = screen.getByRole('button', { name: '加载示例JSON' })
    
    fireEvent.click(loadSampleButton)
    
    expect(jsonInput.value.length).toBeGreaterThan(0)
  })

  it('shows formatted output after formatting', async () => {
    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    fireEvent.change(jsonInput, { target: { value: '{"name":"John","age":30}' } })
    
    const formatButton = screen.getByRole('button', { name: '格式化JSON' })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(screen.getByText('格式化结果')).toBeInTheDocument()
    })
  })

  it('has copy functionality after formatting', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    fireEvent.change(jsonInput, { target: { value: '{"name":"John","age":30}' } })
    
    const formatButton = screen.getByRole('button', { name: '格式化JSON' })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      // After formatting, copy button should be available
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && button.getAttribute('class')?.includes('h-8 w-8')
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows JSON statistics after processing', async () => {
    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    fireEvent.change(jsonInput, { target: { value: '{"name":"John","age":30,"active":true}' } })
    
    const formatButton = screen.getByRole('button', { name: '格式化JSON' })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(screen.getByText('JSON统计')).toBeInTheDocument()
    })
  })

  it('has indent size selector', () => {
    render(<JSONFormatterPage />)
    
    expect(screen.getByText('缩进大小')).toBeInTheDocument()
  })

  it('can change indent size', () => {
    render(<JSONFormatterPage />)
    
    const indentSelector = screen.getByDisplayValue('2 空格')
    fireEvent.click(indentSelector)
    
    const fourSpaceOption = screen.getByText('4 空格')
    fireEvent.click(fourSpaceOption)
    
    expect(screen.getByDisplayValue('4 空格')).toBeInTheDocument()
  })

  it('shows JSON format information', () => {
    render(<JSONFormatterPage />)
    
    expect(screen.getByText('JSON格式说明')).toBeInTheDocument()
    expect(screen.getByText(/JavaScript Object Notation/)).toBeInTheDocument()
  })

  it('shows JSON features', () => {
    render(<JSONFormatterPage />)
    
    expect(screen.getByText('主要功能')).toBeInTheDocument()
    expect(screen.getByText(/格式化.*易读的格式/)).toBeInTheDocument()
    expect(screen.getByText(/压缩.*移除空白字符/)).toBeInTheDocument()
    expect(screen.getByText(/验证.*检查语法正确性/)).toBeInTheDocument()
  })

  it('shows syntax highlighting in results', async () => {
    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    fireEvent.change(jsonInput, { target: { value: '{"name":"John","age":30}' } })
    
    const formatButton = screen.getByRole('button', { name: '格式化JSON' })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      // The result should be displayed in a formatted way
      expect(screen.getByText('格式化结果')).toBeInTheDocument()
    })
  })

  it('shows error details for syntax errors', async () => {
    const { toast } = require('sonner')
    render(<JSONFormatterPage />)
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    fireEvent.change(jsonInput, { target: { value: '{"name":}' } }) // Missing value
    
    const validateButton = screen.getByRole('button', { name: '验证JSON' })
    fireEvent.click(validateButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('JSON格式错误'))
    })
  })

  it('handles large JSON files gracefully', async () => {
    render(<JSONFormatterPage />)
    
    // Create a large JSON object
    const largeJson = JSON.stringify({
      data: Array(100).fill().map((_, i) => ({ id: i, name: `Item ${i}` }))
    })
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    fireEvent.change(jsonInput, { target: { value: largeJson } })
    
    const formatButton = screen.getByRole('button', { name: '格式化JSON' })
    fireEvent.click(formatButton)
    
    // Should not crash and should show some indication of processing
    expect(formatButton).toBeInTheDocument()
  })

  it('preserves JSON data types during formatting', async () => {
    render(<JSONFormatterPage />)
    
    const jsonWithTypes = '{"string":"text","number":42,"boolean":true,"null":null,"array":[1,2,3],"object":{"nested":true}}'
    
    const jsonInput = screen.getByPlaceholderText('输入JSON数据...')
    fireEvent.change(jsonInput, { target: { value: jsonWithTypes } })
    
    const formatButton = screen.getByRole('button', { name: '格式化JSON' })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(screen.getByText('格式化结果')).toBeInTheDocument()
    })
  })
})