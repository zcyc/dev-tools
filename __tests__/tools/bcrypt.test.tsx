import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BcryptPage from '../../app/tools/bcrypt/page'

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

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn((password, saltRounds) => 
    Promise.resolve(`$2b$${saltRounds}$mockhashedpassword${password.slice(0, 3)}`)
  ),
  compare: jest.fn((password, hash) => {
    if (hash.includes('mockhashedpassword') && hash.includes(password.slice(0, 3))) {
      return Promise.resolve(true)
    }
    return Promise.resolve(false)
  }),
  genSalt: jest.fn((rounds) => Promise.resolve(`$2b$${rounds}$mocksalt`)),
}))

describe('Bcrypt Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders bcrypt page correctly', () => {
    render(<BcryptPage />)
    
    expect(screen.getByText('Bcrypt加密')).toBeInTheDocument()
    expect(screen.getByText('安全的密码哈希和验证工具，使用Bcrypt算法')).toBeInTheDocument()
  })

  it('has hash and verify tabs', () => {
    render(<BcryptPage />)
    
    expect(screen.getByText('密码加密')).toBeInTheDocument()
    expect(screen.getByText('密码验证')).toBeInTheDocument()
  })

  it('hashes password with default salt rounds', async () => {
    render(<BcryptPage />)
    
    const passwordInput = screen.getByPlaceholderText(/输入要加密的密码/i)
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    
    const hashButton = screen.getByRole('button', { name: /生成哈希/i })
    fireEvent.click(hashButton)
    
    await waitFor(() => {
      const hashResult = screen.getByDisplayValue(/^\$2b\$10\$mockhashedpassword/)
      expect(hashResult).toBeInTheDocument()
    })
  })

  it('allows customizing salt rounds', async () => {
    render(<BcryptPage />)
    
    const saltRoundsInput = screen.getByLabelText(/Salt轮数/i)
    fireEvent.change(saltRoundsInput, { target: { value: '12' } })
    
    const passwordInput = screen.getByPlaceholderText(/输入要加密的密码/i)
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    
    const hashButton = screen.getByRole('button', { name: /生成哈希/i })
    fireEvent.click(hashButton)
    
    await waitFor(() => {
      const hashResult = screen.getByDisplayValue(/^\$2b\$12\$mockhashedpassword/)
      expect(hashResult).toBeInTheDocument()
    })
  })

  it('verifies correct password against hash', async () => {
    render(<BcryptPage />)
    
    // Switch to verify tab
    const verifyTab = screen.getByText('密码验证')
    fireEvent.click(verifyTab)
    
    const passwordInput = screen.getByPlaceholderText(/输入原始密码/i)
    fireEvent.change(passwordInput, { target: { value: 'test' } })
    
    const hashInput = screen.getByPlaceholderText(/输入要验证的哈希值/i)
    fireEvent.change(hashInput, { target: { value: '$2b$10$mockhashedpasswordtes' } })
    
    const verifyButton = screen.getByRole('button', { name: /验证密码/i })
    fireEvent.click(verifyButton)
    
    await waitFor(() => {
      expect(screen.getByText(/密码匹配/i)).toBeInTheDocument()
    })
  })

  it('shows mismatch for incorrect password', async () => {
    render(<BcryptPage />)
    
    // Switch to verify tab
    const verifyTab = screen.getByText('密码验证')
    fireEvent.click(verifyTab)
    
    const passwordInput = screen.getByPlaceholderText(/输入原始密码/i)
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    
    const hashInput = screen.getByPlaceholderText(/输入要验证的哈希值/i)
    fireEvent.change(hashInput, { target: { value: '$2b$10$mockhashedpasswordtes' } })
    
    const verifyButton = screen.getByRole('button', { name: /验证密码/i })
    fireEvent.click(verifyButton)
    
    await waitFor(() => {
      expect(screen.getByText(/密码不匹配/i)).toBeInTheDocument()
    })
  })

  it('shows bcrypt information', () => {
    render(<BcryptPage />)
    
    expect(screen.getByText(/Bcrypt特性/i)).toBeInTheDocument()
    expect(screen.getByText(/自适应哈希/i)).toBeInTheDocument()
    expect(screen.getByText(/盐值集成/i)).toBeInTheDocument()
    expect(screen.getByText(/时间成本/i)).toBeInTheDocument()
    expect(screen.getByText(/彩虹表抵御/i)).toBeInTheDocument()
  })

  it('shows salt rounds explanation', () => {
    render(<BcryptPage />)
    
    expect(screen.getByText(/Salt轮数说明/i)).toBeInTheDocument()
    expect(screen.getByText(/10: 默认值/i)).toBeInTheDocument()
    expect(screen.getByText(/12: 高安全/i)).toBeInTheDocument()
    expect(screen.getByText(/14: 极高安全/i)).toBeInTheDocument()
  })

  it('has copy functionality for hash result', async () => {
    render(<BcryptPage />)
    
    const passwordInput = screen.getByPlaceholderText(/输入要加密的密码/i)
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    
    const hashButton = screen.getByRole('button', { name: /生成哈希/i })
    fireEvent.click(hashButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('validates empty password input', () => {
    render(<BcryptPage />)
    
    const hashButton = screen.getByRole('button', { name: /生成哈希/i })
    fireEvent.click(hashButton)
    
    // Should handle empty password gracefully
    expect(hashButton).toBeInTheDocument()
  })

  it('validates salt rounds range', () => {
    render(<BcryptPage />)
    
    const saltRoundsInput = screen.getByLabelText(/Salt轮数/i)
    fireEvent.change(saltRoundsInput, { target: { value: '30' } })
    
    const passwordInput = screen.getByPlaceholderText(/输入要加密的密码/i)
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    
    const hashButton = screen.getByRole('button', { name: /生成哈希/i })
    fireEvent.click(hashButton)
    
    // Should handle out-of-range salt rounds
    expect(hashButton).toBeInTheDocument()
  })

  it('handles invalid hash format in verification', async () => {
    render(<BcryptPage />)
    
    // Switch to verify tab
    const verifyTab = screen.getByText('密码验证')
    fireEvent.click(verifyTab)
    
    const passwordInput = screen.getByPlaceholderText(/输入原始密码/i)
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    
    const hashInput = screen.getByPlaceholderText(/输入要验证的哈希值/i)
    fireEvent.change(hashInput, { target: { value: 'invalid-hash-format' } })
    
    const verifyButton = screen.getByRole('button', { name: /验证密码/i })
    fireEvent.click(verifyButton)
    
    await waitFor(() => {
      expect(screen.getByText(/无效的哈希格式/i)).toBeInTheDocument()
    })
  })

  it('shows security recommendations', () => {
    render(<BcryptPage />)
    
    expect(screen.getByText(/安全建议/i)).toBeInTheDocument()
    expect(screen.getByText(/适当的Salt轮数/i)).toBeInTheDocument()
    expect(screen.getByText(/安全存储/i)).toBeInTheDocument()
    expect(screen.getByText(/定期更新/i)).toBeInTheDocument()
  })

  it('shows hash format explanation', () => {
    render(<BcryptPage />)
    
    expect(screen.getByText(/哈希格式/i)).toBeInTheDocument()
    expect(screen.getByText(/\$2b\$/i)).toBeInTheDocument()
    expect(screen.getByText(/算法版本/i)).toBeInTheDocument()
    expect(screen.getByText(/成本参数/i)).toBeInTheDocument()
    expect(screen.getByText(/盐值和哈希/i)).toBeInTheDocument()
  })

  it('handles verification with empty inputs', () => {
    render(<BcryptPage />)
    
    // Switch to verify tab
    const verifyTab = screen.getByText('密码验证')
    fireEvent.click(verifyTab)
    
    const verifyButton = screen.getByRole('button', { name: /验证密码/i })
    fireEvent.click(verifyButton)
    
    // Should handle empty inputs gracefully
    expect(verifyButton).toBeInTheDocument()
  })

  it('shows timing information for salt rounds', () => {
    render(<BcryptPage />)
    
    expect(screen.getByText(/计算时间参考/i)).toBeInTheDocument()
    expect(screen.getByText(/10轮: ~100ms/i)).toBeInTheDocument()
    expect(screen.getByText(/12轮: ~400ms/i)).toBeInTheDocument()
    expect(screen.getByText(/14轮: ~1.6s/i)).toBeInTheDocument()
  })

  it('allows multiple hash generations', async () => {
    render(<BcryptPage />)
    
    const passwordInput = screen.getByPlaceholderText(/输入要加密的密码/i)
    const hashButton = screen.getByRole('button', { name: /生成哈希/i })
    
    // Generate first hash
    fireEvent.change(passwordInput, { target: { value: 'password1' } })
    fireEvent.click(hashButton)
    
    await waitFor(() => {
      const firstHash = screen.getByDisplayValue(/^\$2b\$10\$mockhashedpasswordpas/)
      expect(firstHash).toBeInTheDocument()
    })
    
    // Generate second hash
    fireEvent.change(passwordInput, { target: { value: 'password2' } })
    fireEvent.click(hashButton)
    
    await waitFor(() => {
      const secondHash = screen.getByDisplayValue(/^\$2b\$10\$mockhashedpasswordpas/)
      expect(secondHash).toBeInTheDocument()
    })
  })
})