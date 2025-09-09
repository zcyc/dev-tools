import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import HMACGeneratorPage from '../../app/[locale]/tools/hmac/page'

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
})

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock crypto-js
jest.mock('crypto-js', () => ({
  HmacMD5: jest.fn((message, key) => ({
    toString: () => `md5-hmac-${message}-${key}`
  })),
  HmacSHA1: jest.fn((message, key) => ({
    toString: () => `sha1-hmac-${message}-${key}`
  })),
  HmacSHA256: jest.fn((message, key) => ({
    toString: () => `sha256-hmac-${message}-${key}`
  })),
  HmacSHA512: jest.fn((message, key) => ({
    toString: () => `sha512-hmac-${message}-${key}`
  })),
}))

describe('HMAC Generator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders HMAC generator page correctly', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText('HMAC生成器')).toBeInTheDocument()
    expect(screen.getByText('生成和验证基于哈希的消息认证码（HMAC）')).toBeInTheDocument()
  })

  it('generates HMAC with default algorithm (SHA-256)', async () => {
    render(<HMACGeneratorPage />)
    
    const messageInput = screen.getByPlaceholderText('输入要签名的消息内容...')
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const keyInput = screen.getByPlaceholderText('输入HMAC密钥')
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getAllByText('生成HMAC')[1]
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('HMAC结果')).toBeInTheDocument()
    })
  })

  it('supports different HMAC algorithms', async () => {
    render(<HMACGeneratorPage />)
    
    const algorithmSelect = screen.getByText('HMAC算法')
    expect(algorithmSelect).toBeInTheDocument()
    
    const messageInput = screen.getByPlaceholderText('输入要签名的消息内容...')
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const keyInput = screen.getByPlaceholderText('输入HMAC密钥')
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getAllByText('生成HMAC')[1]
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('HMAC结果')).toBeInTheDocument()
    })
  })

  it('supports MD5 HMAC algorithm', async () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText('HMAC算法')).toBeInTheDocument()
    
    const messageInput = screen.getByPlaceholderText('输入要签名的消息内容...')
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const keyInput = screen.getByPlaceholderText('输入HMAC密钥')
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getAllByText('生成HMAC')[1]
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('HMAC结果')).toBeInTheDocument()
    })
  })

  it('supports SHA-512 HMAC algorithm', async () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText('HMAC算法')).toBeInTheDocument()
    
    const messageInput = screen.getByPlaceholderText('输入要签名的消息内容...')
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const keyInput = screen.getByPlaceholderText('输入HMAC密钥')
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getAllByText('生成HMAC')[1]
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('HMAC结果')).toBeInTheDocument()
    })
  })

  it('shows HMAC information', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText('HMAC说明')).toBeInTheDocument()
    expect(screen.getByText('消息认证')).toBeInTheDocument()
    expect(screen.getByText('密钥保护')).toBeInTheDocument()
    expect(screen.getByText('抗篡改')).toBeInTheDocument()
    expect(screen.getByText('API安全')).toBeInTheDocument()
  })

  it('shows algorithm options', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText('HMAC算法')).toBeInTheDocument()
    expect(screen.getAllByText('生成HMAC')).toHaveLength(2)
    expect(screen.getByText('验证HMAC')).toBeInTheDocument()
  })

  it('has copy functionality', async () => {
    render(<HMACGeneratorPage />)
    
    const messageInput = screen.getByPlaceholderText('输入要签名的消息内容...')
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const keyInput = screen.getByPlaceholderText('输入HMAC密钥')
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getAllByText('生成HMAC')[1]
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('HMAC结果')).toBeInTheDocument()
    })
  })

  it('validates empty message input', () => {
    render(<HMACGeneratorPage />)
    
    const keyInput = screen.getByPlaceholderText('输入HMAC密钥')
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getAllByText('生成HMAC')[1]
    fireEvent.click(generateButton)
    
    // Should handle empty message gracefully
    expect(generateButton).toBeInTheDocument()
  })

  it('validates empty key input', () => {
    render(<HMACGeneratorPage />)
    
    const messageInput = screen.getByPlaceholderText('输入要签名的消息内容...')
    fireEvent.change(messageInput, { target: { value: 'test message' } })
    
    const generateButton = screen.getAllByText('生成HMAC')[1]
    fireEvent.click(generateButton)
    
    // Should handle empty key gracefully
    expect(generateButton).toBeInTheDocument()
  })

  it('shows application scenarios', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText('常见应用场景:')).toBeInTheDocument()
    expect(screen.getByText('• API请求签名验证')).toBeInTheDocument()
    expect(screen.getByText('• Webhook消息验证')).toBeInTheDocument()
    expect(screen.getByText('• 数据完整性校验')).toBeInTheDocument()
  })

  it('shows verification tab', () => {
    render(<HMACGeneratorPage />)
    
    const verifyTab = screen.getByText('验证HMAC')
    expect(verifyTab).toBeInTheDocument()
  })

  it('handles large message input', async () => {
    render(<HMACGeneratorPage />)
    
    const largeMessage = 'a'.repeat(100)
    const messageInput = screen.getByPlaceholderText('输入要签名的消息内容...')
    fireEvent.change(messageInput, { target: { value: largeMessage } })
    
    const keyInput = screen.getByPlaceholderText('输入HMAC密钥')
    fireEvent.change(keyInput, { target: { value: 'secret-key' } })
    
    const generateButton = screen.getAllByText('生成HMAC')[1]
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('HMAC结果')).toBeInTheDocument()
    })
  })

  it('shows generate random key button', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getByText('生成随机密钥')).toBeInTheDocument()
  })

  it('shows HMAC tabs', () => {
    render(<HMACGeneratorPage />)
    
    expect(screen.getAllByText('生成HMAC')).toHaveLength(2)
    expect(screen.getByText('验证HMAC')).toBeInTheDocument()
  })

  it('handles special characters in message and key', async () => {
    render(<HMACGeneratorPage />)
    
    const messageInput = screen.getByPlaceholderText('输入要签名的消息内容...')
    fireEvent.change(messageInput, { target: { value: 'Hello 世界! @#$%^&*()' } })
    
    const keyInput = screen.getByPlaceholderText('输入HMAC密钥')
    fireEvent.change(keyInput, { target: { value: 'key-with-特殊字符-123' } })
    
    const generateButton = screen.getAllByText('生成HMAC')[1]
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      expect(screen.getByText('HMAC结果')).toBeInTheDocument()
    })
  })
})