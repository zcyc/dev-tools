/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import HashGeneratorPage from '../../app/tools/hash/page'

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

// Mock crypto for browser environment
const mockCrypto = {
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue('mocked-hash-value')
  })
}

Object.defineProperty(global, 'crypto', {
  value: mockCrypto,
  writable: true
})

describe('Hash Generator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the hash generator page', () => {
    render(<HashGeneratorPage />)
    
    expect(screen.getByText('Hash文本生成')).toBeInTheDocument()
    expect(screen.getByText('生成文本的MD5、SHA-1、SHA-256等哈希值')).toBeInTheDocument()
  })

  it('has text input area', () => {
    render(<HashGeneratorPage />)
    
    expect(screen.getByLabelText('输入文本')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('输入要生成哈希值的文本...')).toBeInTheDocument()
  })

  it('has algorithm selector', () => {
    render(<HashGeneratorPage />)
    
    expect(screen.getByLabelText('哈希算法')).toBeInTheDocument()
  })

  it('has generate hash button', () => {
    render(<HashGeneratorPage />)
    
    expect(screen.getByRole('button', { name: '生成哈希' })).toBeInTheDocument()
  })

  it('has generate all hashes button', () => {
    render(<HashGeneratorPage />)
    
    expect(screen.getByRole('button', { name: '生成常用哈希' })).toBeInTheDocument()
  })

  it('can input text', () => {
    render(<HashGeneratorPage />)
    
    const textInput = screen.getByPlaceholderText('输入要生成哈希值的文本...')
    fireEvent.change(textInput, { target: { value: 'test text' } })
    
    expect(textInput).toHaveValue('test text')
  })

  it('shows error when trying to generate hash with empty input', async () => {
    const { toast } = require('sonner')
    render(<HashGeneratorPage />)
    
    const generateButton = screen.getByRole('button', { name: '生成哈希' })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入要哈希的文本')
    })
  })

  it('can generate hash with valid input', async () => {
    const { toast } = require('sonner')
    render(<HashGeneratorPage />)
    
    const textInput = screen.getByPlaceholderText('输入要生成哈希值的文本...')
    fireEvent.change(textInput, { target: { value: 'test text' } })
    
    const generateButton = screen.getByRole('button', { name: '生成哈希' })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('哈希值生成成功')
    })
  })

  it('can generate all common hashes', async () => {
    const { toast } = require('sonner')
    render(<HashGeneratorPage />)
    
    const textInput = screen.getByPlaceholderText('输入要生成哈希值的文本...')
    fireEvent.change(textInput, { target: { value: 'test text' } })
    
    const generateAllButton = screen.getByRole('button', { name: '生成常用哈希' })
    fireEvent.click(generateAllButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining('成功生成'))
    })
  })

  it('shows error when trying to generate all hashes with empty input', async () => {
    const { toast } = require('sonner')
    render(<HashGeneratorPage />)
    
    const generateAllButton = screen.getByRole('button', { name: '生成常用哈希' })
    fireEvent.click(generateAllButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入要哈希的文本')
    })
  })

  it('shows hash algorithm information', () => {
    render(<HashGeneratorPage />)
    
    expect(screen.getByText('哈希算法说明')).toBeInTheDocument()
    expect(screen.getByText('MD5')).toBeInTheDocument()
    expect(screen.getByText('SHA-256')).toBeInTheDocument()
    expect(screen.getByText('SHA-512')).toBeInTheDocument()
  })

  it('has copy functionality after generating hash', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    render(<HashGeneratorPage />)
    
    const textInput = screen.getByPlaceholderText('输入要生成哈希值的文本...')
    fireEvent.change(textInput, { target: { value: 'test text' } })
    
    const generateButton = screen.getByRole('button', { name: '生成哈希' })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      // After generating, copy buttons should be available
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && button.getAttribute('class')?.includes('h-8 w-8')
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows security considerations', () => {
    render(<HashGeneratorPage />)
    
    expect(screen.getByText('安全注意事项')).toBeInTheDocument()
    expect(screen.getByText(/MD5和SHA-1已不再被认为是安全的/)).toBeInTheDocument()
    expect(screen.getByText(/推荐使用SHA-256或更高版本/)).toBeInTheDocument()
  })

  it('displays hash algorithm descriptions', () => {
    render(<HashGeneratorPage />)
    
    expect(screen.getByText('MD5：128位哈希值，快速但不安全')).toBeInTheDocument()
    expect(screen.getByText('SHA-256：256位哈希值，安全且广泛使用')).toBeInTheDocument()
    expect(screen.getByText('SHA-512：512位哈希值，更高安全性')).toBeInTheDocument()
  })

  it('handles crypto errors gracefully', async () => {
    // Mock crypto to throw error
    const errorCrypto = {
      createHash: jest.fn().mockImplementation(() => {
        throw new Error('Crypto error')
      })
    }
    
    Object.defineProperty(global, 'crypto', {
      value: errorCrypto,
      writable: true
    })

    const { toast } = require('sonner')
    render(<HashGeneratorPage />)
    
    const textInput = screen.getByPlaceholderText('输入要生成哈希值的文本...')
    fireEvent.change(textInput, { target: { value: 'test text' } })
    
    const generateButton = screen.getByRole('button', { name: '生成哈希' })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('哈希生成失败'))
    })

    // Restore original mock
    Object.defineProperty(global, 'crypto', {
      value: mockCrypto,
      writable: true
    })
  })
})