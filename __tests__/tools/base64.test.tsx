/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Base64Page from '../../app/tools/base64/page'

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

describe('Base64 Encoder/Decoder Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the base64 page', () => {
    render(<Base64Page />)
    
    expect(screen.getByText('Base64编码/解码')).toBeInTheDocument()
    expect(screen.getByText('Base64格式编码和解码工具，支持文本和文件')).toBeInTheDocument()
  })

  it('has encode and decode tabs', () => {
    render(<Base64Page />)
    
    expect(screen.getByRole('tab', { name: '编码' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '解码' })).toBeInTheDocument()
  })

  it('has clear all button', () => {
    render(<Base64Page />)
    
    expect(screen.getByRole('button', { name: '清除全部' })).toBeInTheDocument()
  })

  it('has encode button', () => {
    render(<Base64Page />)
    
    expect(screen.getByRole('button', { name: '编码为Base64' })).toBeInTheDocument()
  })

  it('can input text for encoding', () => {
    render(<Base64Page />)
    
    const textInput = screen.getByPlaceholderText('输入要编码的文本...')
    expect(textInput).toBeInTheDocument()
    
    fireEvent.change(textInput, { target: { value: 'Hello World' } })
    expect(textInput).toHaveValue('Hello World')
  })

  it('can encode text to Base64', async () => {
    render(<Base64Page />)
    
    const textInput = screen.getByPlaceholderText('输入要编码的文本...')
    const encodeButton = screen.getByRole('button', { name: '编码为Base64' })
    
    fireEvent.change(textInput, { target: { value: 'Hello World' } })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      expect(screen.getByText('编码结果')).toBeInTheDocument()
    })
  })

  it('can switch to decode tab', () => {
    render(<Base64Page />)
    
    const decodeTab = screen.getByRole('tab', { name: '解码' })
    fireEvent.click(decodeTab)
    
    expect(screen.getByRole('button', { name: '解码Base64' })).toBeInTheDocument()
  })

  it('can input Base64 for decoding', () => {
    render(<Base64Page />)
    
    // Switch to decode tab
    const decodeTab = screen.getByRole('tab', { name: '解码' })
    fireEvent.click(decodeTab)
    
    const base64Input = screen.getByPlaceholderText('输入要解码的Base64文本...')
    expect(base64Input).toBeInTheDocument()
    
    fireEvent.change(base64Input, { target: { value: 'SGVsbG8gV29ybGQ=' } })
    expect(base64Input).toHaveValue('SGVsbG8gV29ybGQ=')
  })

  it('can decode Base64 to text', async () => {
    render(<Base64Page />)
    
    // Switch to decode tab
    const decodeTab = screen.getByRole('tab', { name: '解码' })
    fireEvent.click(decodeTab)
    
    const base64Input = screen.getByPlaceholderText('输入要解码的Base64文本...')
    const decodeButton = screen.getByRole('button', { name: '解码Base64' })
    
    fireEvent.change(base64Input, { target: { value: 'SGVsbG8gV29ybGQ=' } })
    fireEvent.click(decodeButton)
    
    await waitFor(() => {
      expect(screen.getByText('解码结果')).toBeInTheDocument()
    })
  })

  it('has sample text buttons', () => {
    render(<Base64Page />)
    
    expect(screen.getByRole('button', { name: 'Hello, World!' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '你好，世界！' })).toBeInTheDocument()
  })

  it('can load sample text', () => {
    render(<Base64Page />)
    
    const sampleButton = screen.getByRole('button', { name: 'Hello, World!' })
    const textInput = screen.getByPlaceholderText('输入要编码的文本...')
    
    fireEvent.click(sampleButton)
    expect(textInput).toHaveValue('Hello, World!')
  })

  it('can clear all inputs', () => {
    render(<Base64Page />)
    
    const textInput = screen.getByPlaceholderText('输入要编码的文本...')
    fireEvent.change(textInput, { target: { value: 'Test' } })
    
    const clearButton = screen.getByRole('button', { name: '清除全部' })
    fireEvent.click(clearButton)
    
    expect(textInput).toHaveValue('')
  })

  it('shows Base64 information', () => {
    render(<Base64Page />)
    
    expect(screen.getByText('Base64说明')).toBeInTheDocument()
  })

  it('has file input for encoding', () => {
    render(<Base64Page />)
    
    const fileInput = screen.getByLabelText('或上传文件 (最大1MB)')
    expect(fileInput).toBeInTheDocument()
    expect(fileInput).toHaveAttribute('type', 'file')
  })

  it('handles empty input validation for encoding', async () => {
    const { toast } = require('sonner')
    render(<Base64Page />)
    
    const encodeButton = screen.getByRole('button', { name: '编码为Base64' })
    fireEvent.click(encodeButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入要编码的文本')
    })
  })

  it('handles empty input validation for decoding', async () => {
    const { toast } = require('sonner')
    render(<Base64Page />)
    
    // Switch to decode tab
    const decodeTab = screen.getByRole('tab', { name: '解码' })
    fireEvent.click(decodeTab)
    
    const decodeButton = screen.getByRole('button', { name: '解码Base64' })
    fireEvent.click(decodeButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入要解码的Base64文本')
    })
  })
})