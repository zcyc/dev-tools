/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NumberBaseConverterPage from '../../app/tools/number-base/page'

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

describe('Number Base Converter Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the number base converter page', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByText('进制转换')).toBeInTheDocument()
    expect(screen.getByText('二进制、八进制、十进制、十六进制等数字进制转换')).toBeInTheDocument()
  })

  it('has number input field', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByPlaceholderText('输入要转换的数字')).toBeInTheDocument()
  })

  it('has input base selector', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByText('输入进制')).toBeInTheDocument()
  })

  it('has convert button', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByRole('button', { name: '转换' })).toBeInTheDocument()
  })

  it('has clear button', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByRole('button', { name: '清除' })).toBeInTheDocument()
  })

  it('can input number', () => {
    render(<NumberBaseConverterPage />)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '123' } })
    
    expect(numberInput).toHaveValue('123')
  })

  it('shows error when trying to convert empty input', async () => {
    const { toast } = require('sonner')
    render(<NumberBaseConverterPage />)
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入要转换的数字')
    })
  })

  it('can convert decimal number successfully', async () => {
    const { toast } = require('sonner')
    render(<NumberBaseConverterPage />)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '123' } })
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('数字转换成功')
    })
  })

  it('shows conversion results after successful conversion', async () => {
    render(<NumberBaseConverterPage />)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '123' } })
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(screen.getByText('转换结果')).toBeInTheDocument()
    })
  })

  it('can convert binary number', async () => {
    const { toast } = require('sonner')
    render(<NumberBaseConverterPage />)
    
    // Change input base to binary
    const baseSelector = screen.getByDisplayValue('十进制 (Decimal)')
    fireEvent.click(baseSelector)
    
    const binaryOption = screen.getByText('二进制 (Binary)')
    fireEvent.click(binaryOption)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '1010' } })
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('数字转换成功')
    })
  })

  it('can convert hexadecimal number', async () => {
    const { toast } = require('sonner')
    render(<NumberBaseConverterPage />)
    
    // Change input base to hexadecimal
    const baseSelector = screen.getByDisplayValue('十进制 (Decimal)')
    fireEvent.click(baseSelector)
    
    const hexOption = screen.getByText('十六进制 (Hexadecimal)')
    fireEvent.click(hexOption)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: 'FF' } })
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('数字转换成功')
    })
  })

  it('shows error for invalid characters in binary', async () => {
    const { toast } = require('sonner')
    render(<NumberBaseConverterPage />)
    
    // Change input base to binary
    const baseSelector = screen.getByDisplayValue('十进制 (Decimal)')
    fireEvent.click(baseSelector)
    
    const binaryOption = screen.getByText('二进制 (Binary)')
    fireEvent.click(binaryOption)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '1019' } }) // Invalid binary (contains 9)
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('输入包含无效字符'))
    })
  })

  it('shows error for negative numbers', async () => {
    const { toast } = require('sonner')
    render(<NumberBaseConverterPage />)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '-123' } })
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('暂不支持负数转换'))
    })
  })

  it('can clear input and results', () => {
    render(<NumberBaseConverterPage />)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '123' } })
    
    const clearButton = screen.getByRole('button', { name: '清除' })
    fireEvent.click(clearButton)
    
    expect(numberInput).toHaveValue('')
  })

  it('has example buttons for different bases', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByText('快速示例')).toBeInTheDocument()
    // Should have example buttons for different bases
    const exampleButtons = screen.getAllByRole('button').filter(button => 
      button.textContent?.includes('例:')
    )
    expect(exampleButtons.length).toBeGreaterThan(0)
  })

  it('can load example values', () => {
    render(<NumberBaseConverterPage />)
    
    // Find and click a binary example button
    const binaryExampleButton = screen.getByRole('button', { name: /例: 1010/ })
    fireEvent.click(binaryExampleButton)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    expect(numberInput).toHaveValue('1010')
  })

  it('shows base information', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByText('进制说明')).toBeInTheDocument()
    expect(screen.getByText('二进制 (Binary)')).toBeInTheDocument()
    expect(screen.getByText('八进制 (Octal)')).toBeInTheDocument()
    expect(screen.getByText('十进制 (Decimal)')).toBeInTheDocument()
    expect(screen.getByText('十六进制 (Hexadecimal)')).toBeInTheDocument()
  })

  it('shows conversion rules', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByText('转换规则')).toBeInTheDocument()
    expect(screen.getByText(/所有进制最终都通过十进制进行转换/)).toBeInTheDocument()
  })

  it('has copy functionality after conversion', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    render(<NumberBaseConverterPage />)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '123' } })
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      // After conversion, copy buttons should be available
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && button.getAttribute('class')?.includes('h-8 w-8')
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows number properties after conversion', async () => {
    render(<NumberBaseConverterPage />)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '16' } }) // 2^4
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(screen.getByText('数字属性')).toBeInTheDocument()
    })
  })

  it('can load value from conversion results', async () => {
    render(<NumberBaseConverterPage />)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '10' } })
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      // Results should be shown and clickable for further conversion
      expect(screen.getByText('转换结果')).toBeInTheDocument()
    })
  })

  it('handles invalid number format gracefully', async () => {
    const { toast } = require('sonner')
    render(<NumberBaseConverterPage />)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: 'xyz' } })
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('转换失败'))
    })
  })

  it('shows supported characters for each base', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByText('二进制: 01')).toBeInTheDocument()
    expect(screen.getByText('八进制: 01234567')).toBeInTheDocument()
    expect(screen.getByText('十进制: 0123456789')).toBeInTheDocument()
    expect(screen.getByText('十六进制: 0123456789ABCDEF')).toBeInTheDocument()
  })
})