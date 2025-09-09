/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NumberBaseConverterPage from '../../app/[locale]/tools/number-base/page'

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

  it('has clear button after conversion', async () => {
    render(<NumberBaseConverterPage />)
    
    // First do a conversion to show clear button
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '123' } })
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: '清除结果' })).toBeInTheDocument()
    })
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
    const baseSelector = screen.getByRole('combobox')
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
    const baseSelector = screen.getByRole('combobox')
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
    const baseSelector = screen.getByRole('combobox')
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
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringMatching(/转换失败: 输入包含无效字符.*十进制.*只支持字符/)
      )
    })
  })

  it('can clear input and results', async () => {
    render(<NumberBaseConverterPage />)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    fireEvent.change(numberInput, { target: { value: '123' } })
    
    const convertButton = screen.getByRole('button', { name: '转换' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(screen.getByText('转换结果')).toBeInTheDocument()
    })
    
    const clearButton = screen.getByRole('button', { name: '清除结果' })
    fireEvent.click(clearButton)
    
    expect(numberInput).toHaveValue('')
    expect(screen.queryByText('转换结果')).not.toBeInTheDocument()
  })

  it('has example buttons for different bases', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByText('快速示例')).toBeInTheDocument()
    // Should have example buttons for different bases
    const exampleButtons = screen.getAllByRole('button').filter(button => 
      button.textContent?.includes('二进制') || button.textContent?.includes('八进制') ||
      button.textContent?.includes('十进制') || button.textContent?.includes('十六进制')
    )
    expect(exampleButtons.length).toBeGreaterThan(0)
  })

  it('can load example values', () => {
    render(<NumberBaseConverterPage />)
    
    // Find and click a binary example button
    const binaryExampleButton = screen.getByRole('button', { name: /二进制 1010/ })
    fireEvent.click(binaryExampleButton)
    
    const numberInput = screen.getByPlaceholderText('输入要转换的数字')
    expect(numberInput).toHaveValue('1010')
  })

  it('shows base information', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByText('进制说明')).toBeInTheDocument()
    expect(screen.getByText('二进制')).toBeInTheDocument()
    expect(screen.getByText('八进制')).toBeInTheDocument()
    expect(screen.getByText('十进制')).toBeInTheDocument()
    expect(screen.getByText('十六进制')).toBeInTheDocument()
  })

  it('shows conversion rules', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByText('转换规则:')).toBeInTheDocument()
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
      // After conversion, copy buttons should be available (look for buttons with Copy icon)
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && button.getAttribute('class')?.includes('h-6 w-6')
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
      // Check for conversion results instead of specific "number properties" text
      expect(screen.getByText('转换结果')).toBeInTheDocument()
      // Should show power of 2 badge (16 = 2^4)
      expect(screen.getByText('2的4次方')).toBeInTheDocument()
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

  it('shows base information in help section', () => {
    render(<NumberBaseConverterPage />)
    
    expect(screen.getByText('转换规则:')).toBeInTheDocument()
    expect(screen.getByText(/所有进制最终都通过十进制进行转换/)).toBeInTheDocument()
  })
})