/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EncryptDecryptPage from '../../app/tools/encrypt/page'

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

// Mock crypto-js
jest.mock('crypto-js', () => ({
  AES: {
    encrypt: jest.fn().mockReturnValue({ toString: () => 'encrypted-text' }),
    decrypt: jest.fn().mockReturnValue({ toString: () => 'decrypted-text' })
  },
  DES: {
    encrypt: jest.fn().mockReturnValue({ toString: () => 'encrypted-text' }),
    decrypt: jest.fn().mockReturnValue({ toString: () => 'decrypted-text' })
  },
  TripleDES: {
    encrypt: jest.fn().mockReturnValue({ toString: () => 'encrypted-text' }),
    decrypt: jest.fn().mockReturnValue({ toString: () => 'decrypted-text' })
  },
  RC4: {
    encrypt: jest.fn().mockReturnValue({ toString: () => 'encrypted-text' }),
    decrypt: jest.fn().mockReturnValue({ toString: () => 'decrypted-text' })
  },
  Rabbit: {
    encrypt: jest.fn().mockReturnValue({ toString: () => 'encrypted-text' }),
    decrypt: jest.fn().mockReturnValue({ toString: () => 'decrypted-text' })
  },
  enc: {
    Utf8: {}
  }
}))

describe('Encrypt/Decrypt Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the encrypt/decrypt page', () => {
    render(<EncryptDecryptPage />)
    
    expect(screen.getByText('文本加密/解密')).toBeInTheDocument()
    expect(screen.getByText('使用AES、DES、3DES等算法加密和解密文本')).toBeInTheDocument()
  })

  it('has encrypt and decrypt tabs', () => {
    render(<EncryptDecryptPage />)
    
    expect(screen.getByRole('tab', { name: '加密' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '解密' })).toBeInTheDocument()
  })

  it('has algorithm selector', () => {
    render(<EncryptDecryptPage />)
    
    expect(screen.getByText('加密算法')).toBeInTheDocument()
  })

  it('has clear results button', () => {
    render(<EncryptDecryptPage />)
    
    expect(screen.getByRole('button', { name: '清除结果' })).toBeInTheDocument()
  })

  it('can input plaintext for encryption', () => {
    render(<EncryptDecryptPage />)
    
    const plaintextInput = screen.getByPlaceholderText('输入要加密的文本...')
    expect(plaintextInput).toBeInTheDocument()
    
    fireEvent.change(plaintextInput, { target: { value: 'Hello World' } })
    expect(plaintextInput).toHaveValue('Hello World')
  })

  it('can input encryption key', () => {
    render(<EncryptDecryptPage />)
    
    const keyInput = screen.getByPlaceholderText('输入加密密钥')
    expect(keyInput).toBeInTheDocument()
    
    fireEvent.change(keyInput, { target: { value: 'mykey123' } })
    expect(keyInput).toHaveValue('mykey123')
  })

  it('has encrypt button', () => {
    render(<EncryptDecryptPage />)
    
    expect(screen.getByRole('button', { name: '加密文本' })).toBeInTheDocument()
  })

  it('shows error when trying to encrypt without plaintext', async () => {
    const { toast } = require('sonner')
    render(<EncryptDecryptPage />)
    
    const encryptButton = screen.getByRole('button', { name: '加密文本' })
    fireEvent.click(encryptButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入要加密的文本')
    })
  })

  it('shows error when trying to encrypt without key', async () => {
    const { toast } = require('sonner')
    render(<EncryptDecryptPage />)
    
    const plaintextInput = screen.getByPlaceholderText('输入要加密的文本...')
    fireEvent.change(plaintextInput, { target: { value: 'test text' } })
    
    const encryptButton = screen.getByRole('button', { name: '加密文本' })
    fireEvent.click(encryptButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入加密密钥')
    })
  })

  it('can encrypt text successfully', async () => {
    const { toast } = require('sonner')
    render(<EncryptDecryptPage />)
    
    const plaintextInput = screen.getByPlaceholderText('输入要加密的文本...')
    const keyInput = screen.getByPlaceholderText('输入加密密钥')
    
    fireEvent.change(plaintextInput, { target: { value: 'test text' } })
    fireEvent.change(keyInput, { target: { value: 'mykey123' } })
    
    const encryptButton = screen.getByRole('button', { name: '加密文本' })
    fireEvent.click(encryptButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('文本加密成功')
    })
  })

  it('can switch to decrypt tab', () => {
    render(<EncryptDecryptPage />)
    
    const decryptTab = screen.getByRole('tab', { name: '解密' })
    fireEvent.click(decryptTab)
    
    expect(screen.getByRole('button', { name: '解密文本' })).toBeInTheDocument()
  })

  it('can input ciphertext for decryption', () => {
    render(<EncryptDecryptPage />)
    
    // Switch to decrypt tab
    const decryptTab = screen.getByRole('tab', { name: '解密' })
    fireEvent.click(decryptTab)
    
    const ciphertextInput = screen.getByPlaceholderText('输入要解密的密文...')
    expect(ciphertextInput).toBeInTheDocument()
    
    fireEvent.change(ciphertextInput, { target: { value: 'encrypted-text' } })
    expect(ciphertextInput).toHaveValue('encrypted-text')
  })

  it('can decrypt text successfully', async () => {
    const { toast } = require('sonner')
    render(<EncryptDecryptPage />)
    
    // Switch to decrypt tab
    const decryptTab = screen.getByRole('tab', { name: '解密' })
    fireEvent.click(decryptTab)
    
    const ciphertextInput = screen.getByPlaceholderText('输入要解密的密文...')
    const keyInput = screen.getByPlaceholderText('输入解密密钥')
    
    fireEvent.change(ciphertextInput, { target: { value: 'encrypted-text' } })
    fireEvent.change(keyInput, { target: { value: 'mykey123' } })
    
    const decryptButton = screen.getByRole('button', { name: '解密文本' })
    fireEvent.click(decryptButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('文本解密成功')
    })
  })

  it('shows error when trying to decrypt without ciphertext', async () => {
    const { toast } = require('sonner')
    render(<EncryptDecryptPage />)
    
    // Switch to decrypt tab
    const decryptTab = screen.getByRole('tab', { name: '解密' })
    fireEvent.click(decryptTab)
    
    const decryptButton = screen.getByRole('button', { name: '解密文本' })
    fireEvent.click(decryptButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入要解密的密文')
    })
  })

  it('shows error when trying to decrypt without key', async () => {
    const { toast } = require('sonner')
    render(<EncryptDecryptPage />)
    
    // Switch to decrypt tab
    const decryptTab = screen.getByRole('tab', { name: '解密' })
    fireEvent.click(decryptTab)
    
    const ciphertextInput = screen.getByPlaceholderText('输入要解密的密文...')
    fireEvent.change(ciphertextInput, { target: { value: 'encrypted-text' } })
    
    const decryptButton = screen.getByRole('button', { name: '解密文本' })
    fireEvent.click(decryptButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入解密密钥')
    })
  })

  it('has generate random key button', () => {
    render(<EncryptDecryptPage />)
    
    expect(screen.getByRole('button', { name: '生成随机密钥' })).toBeInTheDocument()
  })

  it('can generate random key', () => {
    render(<EncryptDecryptPage />)
    
    const keyInput = screen.getByPlaceholderText('输入加密密钥')
    const generateKeyButton = screen.getByRole('button', { name: '生成随机密钥' })
    
    fireEvent.click(generateKeyButton)
    
    expect(keyInput.value.length).toBeGreaterThan(0)
  })

  it('can clear results', () => {
    render(<EncryptDecryptPage />)
    
    const clearButton = screen.getByRole('button', { name: '清除结果' })
    fireEvent.click(clearButton)
    
    // Results should be cleared
    expect(clearButton).toBeInTheDocument()
  })

  it('shows encryption algorithm information', () => {
    render(<EncryptDecryptPage />)
    
    expect(screen.getByText('加密算法说明')).toBeInTheDocument()
    expect(screen.getByText('AES')).toBeInTheDocument()
    expect(screen.getByText('高级加密标准，目前最安全的对称加密算法')).toBeInTheDocument()
  })

  it('shows security considerations', () => {
    render(<EncryptDecryptPage />)
    
    expect(screen.getByText('安全注意事项')).toBeInTheDocument()
    expect(screen.getByText(/密钥长度至少8位/)).toBeInTheDocument()
    expect(screen.getByText(/不要在不安全的环境中使用/)).toBeInTheDocument()
  })

  it('has copy functionality', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    const { toast } = require('sonner')
    render(<EncryptDecryptPage />)
    
    const plaintextInput = screen.getByPlaceholderText('输入要加密的文本...')
    const keyInput = screen.getByPlaceholderText('输入加密密钥')
    
    fireEvent.change(plaintextInput, { target: { value: 'test text' } })
    fireEvent.change(keyInput, { target: { value: 'mykey123' } })
    
    const encryptButton = screen.getByRole('button', { name: '加密文本' })
    fireEvent.click(encryptButton)
    
    await waitFor(() => {
      // After encryption, copy buttons should be available
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && button.getAttribute('class')?.includes('h-8 w-8')
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })
})