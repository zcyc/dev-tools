/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import URLEncoderPage from '../../app/tools/url/page'

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

describe('URL Encoder/Decoder Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the URL encoder/decoder page', () => {
    render(<URLEncoderPage />)
    
    expect(screen.getByText('URL编码/解码')).toBeInTheDocument()
    expect(screen.getByText('URL百分号编码和解码工具')).toBeInTheDocument()
  })

  it('has encode and decode tabs', () => {
    render(<URLEncoderPage />)
    
    expect(screen.getByRole('tab', { name: '编码' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '解码' })).toBeInTheDocument()
  })

  it('has encode input field', () => {
    render(<URLEncoderPage />)
    
    expect(screen.getByPlaceholderText('输入要编码的URL或文本...')).toBeInTheDocument()
  })

  it('has encode button', () => {
    render(<URLEncoderPage />)
    
    expect(screen.getByRole('button', { name: '编码URL' })).toBeInTheDocument()
  })

  it('can input text for encoding', () => {
    render(<URLEncoderPage />)
    
    const textInput = screen.getByPlaceholderText('输入要编码的URL或文本...')
    fireEvent.change(textInput, { target: { value: 'Hello World!' } })
    
    expect(textInput).toHaveValue('Hello World!')
  })

  it('shows error when trying to encode empty input', async () => {
    const { toast } = require('sonner')
    render(<URLEncoderPage />)
    
    const encodeButton = screen.getByRole('button', { name: '编码URL' })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入要转换的内容')
    })
  })

  it('can encode URL successfully', async () => {
    const { toast } = require('sonner')
    render(<URLEncoderPage />)
    
    const textInput = screen.getByPlaceholderText('输入要编码的URL或文本...')
    fireEvent.change(textInput, { target: { value: 'Hello World!' } })
    
    const encodeButton = screen.getByRole('button', { name: '编码URL' })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('URL编码成功')
    })
  })

  it('can switch to decode tab', () => {
    render(<URLEncoderPage />)
    
    const decodeTab = screen.getByRole('tab', { name: '解码' })
    fireEvent.click(decodeTab)
    
    expect(screen.getByRole('button', { name: '解码URL' })).toBeInTheDocument()
  })

  it('has decode input field', () => {
    render(<URLEncoderPage />)
    
    const decodeTab = screen.getByRole('tab', { name: '解码' })
    fireEvent.click(decodeTab)
    
    expect(screen.getByPlaceholderText('输入要解码的URL编码文本...')).toBeInTheDocument()
  })

  it('can input encoded text for decoding', () => {
    render(<URLEncoderPage />)
    
    const decodeTab = screen.getByRole('tab', { name: '解码' })
    fireEvent.click(decodeTab)
    
    const textInput = screen.getByPlaceholderText('输入要解码的URL编码文本...')
    fireEvent.change(textInput, { target: { value: 'Hello%20World%21' } })
    
    expect(textInput).toHaveValue('Hello%20World%21')
  })

  it('can decode URL successfully', async () => {
    const { toast } = require('sonner')
    render(<URLEncoderPage />)
    
    const decodeTab = screen.getByRole('tab', { name: '解码' })
    fireEvent.click(decodeTab)
    
    const textInput = screen.getByPlaceholderText('输入要解码的URL编码文本...')
    fireEvent.change(textInput, { target: { value: 'Hello%20World%21' } })
    
    const decodeButton = screen.getByRole('button', { name: '解码URL' })
    fireEvent.click(decodeButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('URL解码成功')
    })
  })

  it('shows error when trying to decode empty input', async () => {
    const { toast } = require('sonner')
    render(<URLEncoderPage />)
    
    const decodeTab = screen.getByRole('tab', { name: '解码' })
    fireEvent.click(decodeTab)
    
    const decodeButton = screen.getByRole('button', { name: '解码URL' })
    fireEvent.click(decodeButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入要转换的内容')
    })
  })

  it('has clear button', () => {
    render(<URLEncoderPage />)
    
    expect(screen.getByRole('button', { name: '清除' })).toBeInTheDocument()
  })

  it('can clear input and results', () => {
    render(<URLEncoderPage />)
    
    const textInput = screen.getByPlaceholderText('输入要编码的URL或文本...')
    fireEvent.change(textInput, { target: { value: 'test' } })
    
    const clearButton = screen.getByRole('button', { name: '清除' })
    fireEvent.click(clearButton)
    
    expect(textInput).toHaveValue('')
  })

  it('has sample text buttons', () => {
    render(<URLEncoderPage />)
    
    expect(screen.getByText('快速示例')).toBeInTheDocument()
    // Should have sample text buttons
    const sampleButtons = screen.getAllByRole('button').filter(button => 
      button.textContent?.includes('https://') || button.textContent?.includes('中文')
    )
    expect(sampleButtons.length).toBeGreaterThan(0)
  })

  it('can load sample text', () => {
    render(<URLEncoderPage />)
    
    // Find and click a sample button (assuming there's one with URL)
    const sampleButtons = screen.getAllByRole('button').filter(button => 
      button.textContent?.includes('https://')
    )
    
    if (sampleButtons.length > 0) {
      const textInput = screen.getByPlaceholderText('输入要编码的URL或文本...')
      fireEvent.click(sampleButtons[0])
      
      expect(textInput.value.length).toBeGreaterThan(0)
    }
  })

  it('shows URL encoding information', () => {
    render(<URLEncoderPage />)
    
    expect(screen.getByText('URL编码说明')).toBeInTheDocument()
  })

  it('shows common encoded characters', () => {
    render(<URLEncoderPage />)
    
    expect(screen.getByText('常见编码字符')).toBeInTheDocument()
    expect(screen.getByText('空格 → %20')).toBeInTheDocument()
    expect(screen.getByText('! → %21')).toBeInTheDocument()
  })

  it('has copy functionality after encoding', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    const { toast } = require('sonner')
    render(<URLEncoderPage />)
    
    const textInput = screen.getByPlaceholderText('输入要编码的URL或文本...')
    fireEvent.change(textInput, { target: { value: 'Hello World!' } })
    
    const encodeButton = screen.getByRole('button', { name: '编码URL' })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      // After encoding, copy button should be available
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && button.getAttribute('class')?.includes('h-8 w-8')
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows encoding results after successful encoding', async () => {
    render(<URLEncoderPage />)
    
    const textInput = screen.getByPlaceholderText('输入要编码的URL或文本...')
    fireEvent.change(textInput, { target: { value: 'Hello World!' } })
    
    const encodeButton = screen.getByRole('button', { name: '编码URL' })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      expect(screen.getByText('编码结果')).toBeInTheDocument()
    })
  })

  it('shows decoding results after successful decoding', async () => {
    render(<URLEncoderPage />)
    
    const decodeTab = screen.getByRole('tab', { name: '解码' })
    fireEvent.click(decodeTab)
    
    const textInput = screen.getByPlaceholderText('输入要解码的URL编码文本...')
    fireEvent.change(textInput, { target: { value: 'Hello%20World%21' } })
    
    const decodeButton = screen.getByRole('button', { name: '解码URL' })
    fireEvent.click(decodeButton)
    
    await waitFor(() => {
      expect(screen.getByText('解码结果')).toBeInTheDocument()
    })
  })

  it('handles decoding errors gracefully', async () => {
    // Mock decodeURIComponent to throw error
    const originalDecode = global.decodeURIComponent
    global.decodeURIComponent = jest.fn().mockImplementation(() => {
      throw new Error('Invalid URL encoding')
    })

    const { toast } = require('sonner')
    render(<URLEncoderPage />)
    
    const decodeTab = screen.getByRole('tab', { name: '解码' })
    fireEvent.click(decodeTab)
    
    const textInput = screen.getByPlaceholderText('输入要解码的URL编码文本...')
    fireEvent.change(textInput, { target: { value: '%ZZ' } }) // Invalid encoding
    
    const decodeButton = screen.getByRole('button', { name: '解码URL' })
    fireEvent.click(decodeButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('解码失败'))
    })

    // Restore original function
    global.decodeURIComponent = originalDecode
  })

  it('shows usage examples', () => {
    render(<URLEncoderPage />)
    
    expect(screen.getByText('使用场景')).toBeInTheDocument()
    expect(screen.getByText(/URL参数传递/)).toBeInTheDocument()
    expect(screen.getByText(/表单数据提交/)).toBeInTheDocument()
  })

  it('shows reserved characters information', () => {
    render(<URLEncoderPage />)
    
    expect(screen.getByText('保留字符')).toBeInTheDocument()
    expect(screen.getByText(/这些字符在URL中有特殊含义/)).toBeInTheDocument()
  })

  it('can handle component encoding vs full URL encoding', () => {
    render(<URLEncoderPage />)
    
    // Should show information about different encoding types
    expect(screen.getByText(/encodeURIComponent/)).toBeInTheDocument()
    expect(screen.getByText(/encodeURI/)).toBeInTheDocument()
  })
})