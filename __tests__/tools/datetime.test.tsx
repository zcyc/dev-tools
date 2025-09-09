/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DateTimeConverterPage from '../../app/[locale]/tools/datetime/page'

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

describe('DateTime Converter Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock Date.now() to return a consistent timestamp
    jest.spyOn(Date, 'now').mockImplementation(() => 1642248600000) // 2022-01-15 10:30:00 UTC
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders the datetime converter page', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByText('日期时间转换')).toBeInTheDocument()
    expect(screen.getByText('时间戳和日期格式相互转换工具')).toBeInTheDocument()
  })

  it('has timestamp to date and date to timestamp tabs', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByText('时间戳转日期')).toBeInTheDocument()
    expect(screen.getByText('日期转时间戳')).toBeInTheDocument()
  })

  it('shows current time', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByText('当前时间')).toBeInTheDocument()
  })

  it('has timestamp input field', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByPlaceholderText('输入时间戳')).toBeInTheDocument()
  })

  it('has timestamp unit selector', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByText('单位')).toBeInTheDocument()
  })

  it('has convert timestamp button', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByText('转换为日期')).toBeInTheDocument()
  })

  it('can input timestamp', () => {
    render(<DateTimeConverterPage />)
    
    const timestampInput = screen.getByPlaceholderText('输入时间戳')
    fireEvent.change(timestampInput, { target: { value: '1642248600000' } })
    
    expect(timestampInput).toHaveValue('1642248600000')
  })

  it('shows error when trying to convert empty timestamp', async () => {
    const { toast } = require('sonner')
    render(<DateTimeConverterPage />)
    
    const convertButton = screen.getByText('转换为日期')
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入时间戳')
    })
  })

  it('shows error when trying to convert invalid timestamp', async () => {
    const { toast } = require('sonner')
    render(<DateTimeConverterPage />)
    
    const timestampInput = screen.getByPlaceholderText('输入时间戳')
    fireEvent.change(timestampInput, { target: { value: 'invalid' } })
    
    const convertButton = screen.getByText('转换为日期')
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('转换失败'))
    })
  })

  it('can convert valid timestamp successfully', async () => {
    const { toast } = require('sonner')
    render(<DateTimeConverterPage />)
    
    const timestampInput = screen.getByPlaceholderText('输入时间戳')
    fireEvent.change(timestampInput, { target: { value: '1642248600000' } })
    
    const convertButton = screen.getByText('转换为日期')
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('时间戳转换成功')
    })
  })

  it('has date to timestamp tab', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByText('日期转时间戳')).toBeInTheDocument()
  })

  it('shows expected input fields', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByPlaceholderText('输入时间戳')).toBeInTheDocument()
  })

  it('has refresh button', () => {
    render(<DateTimeConverterPage />)
    
    // Check for refresh button (icon button)
    const refreshButtons = document.querySelectorAll('button svg')
    expect(refreshButtons.length).toBeGreaterThan(0)
  })



  it('has timezone selector', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByText('时区')).toBeInTheDocument()
  })

  it('has output format selector', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByText('输出格式')).toBeInTheDocument()
  })



  it('can convert valid timestamp successfully', async () => {
    const { toast } = require('sonner')
    render(<DateTimeConverterPage />)
    
    const timestampInput = screen.getByPlaceholderText('输入时间戳')
    fireEvent.change(timestampInput, { target: { value: '1642248600000' } })
    
    const convertButton = screen.getByText('转换为日期')
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('时间戳转换成功')
    })
  })

  it('shows timezone selector', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByText('时区')).toBeInTheDocument()
  })

  it('shows timestamp description', () => {
    render(<DateTimeConverterPage />)
    
    expect(screen.getByText('时间戳说明')).toBeInTheDocument()
    expect(screen.getByText('Unix时间戳')).toBeInTheDocument()
  })



  it('has copy functionality after conversion', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    render(<DateTimeConverterPage />)
    
    const timestampInput = screen.getByPlaceholderText('输入时间戳')
    fireEvent.change(timestampInput, { target: { value: '1642248600000' } })
    
    const convertButton = screen.getByText('转换为日期')
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      // After conversion, copy buttons should be available
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && button.getAttribute('class')?.includes('h-6 w-6')
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows conversion results after successful conversion', async () => {
    render(<DateTimeConverterPage />)
    
    const timestampInput = screen.getByPlaceholderText('输入时间戳')
    fireEvent.change(timestampInput, { target: { value: '1642248600000' } })
    
    const convertButton = screen.getByRole('button', { name: '转换为日期' })
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(screen.getByText('转换结果')).toBeInTheDocument()
    })
  })

  it('shows conversion results after successful conversion', async () => {
    render(<DateTimeConverterPage />)
    
    const timestampInput = screen.getByPlaceholderText('输入时间戳')
    fireEvent.change(timestampInput, { target: { value: '1642248600000' } })
    
    const convertButton = screen.getByText('转换为日期')
    fireEvent.click(convertButton)
    
    await waitFor(() => {
      expect(screen.getByText('转换结果')).toBeInTheDocument()
    })
  })
})