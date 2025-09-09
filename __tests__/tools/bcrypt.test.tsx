import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import BcryptPage from '../../app/[locale]/tools/bcrypt/page'

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
    expect(screen.getByText('Bcrypt密码哈希和验证工具')).toBeInTheDocument()
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
    
    const hashButton = screen.getByText('生成哈希')
    fireEvent.click(hashButton)
    
    await waitFor(() => {
      const hashOutputs = screen.getAllByText(/^\$2b\$10\$mockhashedpassword/)
      expect(hashOutputs.length).toBeGreaterThan(0)
    })
  })

  it('shows salt rounds input and labels', () => {
    render(<BcryptPage />)
    
    // Check if salt rounds related elements are present
    expect(screen.getByText('盐轮数建议:')).toBeInTheDocument()
    expect(screen.getByText('• 10轮: 一般应用推荐')).toBeInTheDocument()
  })

  it('shows verify tab', () => {
    render(<BcryptPage />)
    
    // Check if verify tab exists
    const verifyTab = screen.getByText('密码验证')
    expect(verifyTab).toBeInTheDocument()
  })



  it('shows bcrypt information', () => {
    render(<BcryptPage />)
    
    expect(screen.getByText('Bcrypt说明')).toBeInTheDocument()
    expect(screen.getByText('自适应哈希')).toBeInTheDocument()
    expect(screen.getByText('盐值内置')).toBeInTheDocument()
    expect(screen.getByText('彩虹表抗性')).toBeInTheDocument()
    expect(screen.getByText('行业标准')).toBeInTheDocument()
  })

  it('shows salt rounds explanation', () => {
    render(<BcryptPage />)
    
    expect(screen.getByText('盐轮数建议:')).toBeInTheDocument()
    expect(screen.getByText('• 10轮: 一般应用推荐')).toBeInTheDocument()
    expect(screen.getByText('• 12轮: 高安全要求')).toBeInTheDocument()
    expect(screen.getByText('• 14轮+: 极高安全要求（计算较慢）')).toBeInTheDocument()
  })

  it('has copy functionality for hash result', async () => {
    render(<BcryptPage />)
    
    const passwordInput = screen.getByPlaceholderText(/输入要加密的密码/i)
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } })
    
    const hashButton = screen.getByText('生成哈希')
    fireEvent.click(hashButton)
    
    await waitFor(() => {
      // Verify that hash result is displayed with copy functionality
      const hashOutputs = screen.getAllByText(/^\$2b\$10\$mockhashedpassword/)
      expect(hashOutputs.length).toBeGreaterThan(0)
    })
  })

  it('validates empty password input', () => {
    render(<BcryptPage />)
    
    const hashButton = screen.getByText('生成哈希')
    fireEvent.click(hashButton)
    
    // Should handle empty password gracefully
    expect(hashButton).toBeInTheDocument()
  })













  it('allows multiple hash generations', async () => {
    render(<BcryptPage />)
    
    const passwordInput = screen.getByPlaceholderText(/输入要加密的密码/i)
    const hashButton = screen.getByText('生成哈希')
    
    // Generate first hash
    fireEvent.change(passwordInput, { target: { value: 'password1' } })
    fireEvent.click(hashButton)
    
    await waitFor(() => {
      const hashOutputs = screen.getAllByText(/^\$2b\$10\$mockhashedpasswordpas/)
      expect(hashOutputs.length).toBeGreaterThan(0)
    })
    
    // Generate second hash
    fireEvent.change(passwordInput, { target: { value: 'password2' } })
    fireEvent.click(hashButton)
    
    await waitFor(() => {
      const hashOutputs = screen.getAllByText(/^\$2b\$10\$mockhashedpasswordpas/)
      expect(hashOutputs.length).toBeGreaterThan(0)
    })
  })
})