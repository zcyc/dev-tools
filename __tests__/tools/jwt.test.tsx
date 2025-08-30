/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import JWTParserPage from '../../app/tools/jwt/page'

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

describe('JWT Parser Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the JWT parser page', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('JWT解析器')).toBeInTheDocument()
    expect(screen.getByText('解析和验证JSON Web Token')).toBeInTheDocument()
  })

  it('has JWT input field', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByPlaceholderText('粘贴JWT token...')).toBeInTheDocument()
  })

  it('has parse button', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByRole('button', { name: '解析JWT' })).toBeInTheDocument()
  })

  it('has clear button', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByRole('button', { name: '清除' })).toBeInTheDocument()
  })

  it('can input JWT token', () => {
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('粘贴JWT token...')
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    
    fireEvent.change(jwtInput, { target: { value: sampleJWT } })
    
    expect(jwtInput).toHaveValue(sampleJWT)
  })

  it('shows error when trying to parse empty input', async () => {
    const { toast } = require('sonner')
    render(<JWTParserPage />)
    
    const parseButton = screen.getByRole('button', { name: '解析JWT' })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入JWT token')
    })
  })

  it('can parse valid JWT successfully', async () => {
    const { toast } = require('sonner')
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('粘贴JWT token...')
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    
    fireEvent.change(jwtInput, { target: { value: sampleJWT } })
    
    const parseButton = screen.getByRole('button', { name: '解析JWT' })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('JWT解析成功')
    })
  })

  it('shows error for invalid JWT format', async () => {
    const { toast } = require('sonner')
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('粘贴JWT token...')
    fireEvent.change(jwtInput, { target: { value: 'invalid.jwt.token' } })
    
    const parseButton = screen.getByRole('button', { name: '解析JWT' })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('JWT格式无效'))
    })
  })

  it('shows JWT parts after successful parsing', async () => {
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('粘贴JWT token...')
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    
    fireEvent.change(jwtInput, { target: { value: sampleJWT } })
    
    const parseButton = screen.getByRole('button', { name: '解析JWT' })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText('Header (头部)')).toBeInTheDocument()
      expect(screen.getByText('Payload (载荷)')).toBeInTheDocument()
      expect(screen.getByText('Signature (签名)')).toBeInTheDocument()
    })
  })

  it('can clear input and results', () => {
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('粘贴JWT token...')
    fireEvent.change(jwtInput, { target: { value: 'test.jwt.token' } })
    
    const clearButton = screen.getByRole('button', { name: '清除' })
    fireEvent.click(clearButton)
    
    expect(jwtInput).toHaveValue('')
  })

  it('has sample JWT button', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByRole('button', { name: '加载示例JWT' })).toBeInTheDocument()
  })

  it('can load sample JWT', () => {
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('粘贴JWT token...')
    const loadSampleButton = screen.getByRole('button', { name: '加载示例JWT' })
    
    fireEvent.click(loadSampleButton)
    
    expect(jwtInput.value.length).toBeGreaterThan(0)
  })

  it('shows JWT structure information', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('JWT结构')).toBeInTheDocument()
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Payload')).toBeInTheDocument()
    expect(screen.getByText('Signature')).toBeInTheDocument()
  })

  it('shows common claims information', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('标准声明 (Claims)')).toBeInTheDocument()
    expect(screen.getByText('iss')).toBeInTheDocument()
    expect(screen.getByText('sub')).toBeInTheDocument()
    expect(screen.getByText('exp')).toBeInTheDocument()
    expect(screen.getByText('iat')).toBeInTheDocument()
  })

  it('shows JWT algorithms information', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('常见算法')).toBeInTheDocument()
    expect(screen.getByText('HS256')).toBeInTheDocument()
    expect(screen.getByText('RS256')).toBeInTheDocument()
    expect(screen.getByText('ES256')).toBeInTheDocument()
  })

  it('has copy functionality after parsing', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('粘贴JWT token...')
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    
    fireEvent.change(jwtInput, { target: { value: sampleJWT } })
    
    const parseButton = screen.getByRole('button', { name: '解析JWT' })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      // After parsing, copy buttons should be available
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.querySelector('svg') && button.getAttribute('class')?.includes('h-8 w-8')
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('shows expiration status for tokens with exp claim', async () => {
    render(<JWTParserPage />)
    
    // Create a JWT with expiration timestamp in the past
    const expiredPayload = btoa(JSON.stringify({
      sub: '1234567890',
      name: 'John Doe',
      exp: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
    }))
    
    const expiredJWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${expiredPayload}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
    
    const jwtInput = screen.getByPlaceholderText('粘贴JWT token...')
    fireEvent.change(jwtInput, { target: { value: expiredJWT } })
    
    const parseButton = screen.getByRole('button', { name: '解析JWT' })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      // Should show expiration information
      expect(screen.getByText(/过期/)).toBeInTheDocument()
    })
  })

  it('validates JWT structure (3 parts separated by dots)', async () => {
    const { toast } = require('sonner')
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('粘贴JWT token...')
    fireEvent.change(jwtInput, { target: { value: 'invalid.jwt' } }) // Only 2 parts
    
    const parseButton = screen.getByRole('button', { name: '解析JWT' })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('JWT必须包含3个部分'))
    })
  })

  it('handles base64 decoding errors gracefully', async () => {
    const { toast } = require('sonner')
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('粘贴JWT token...')
    fireEvent.change(jwtInput, { target: { value: 'invalid.base64.payload' } })
    
    const parseButton = screen.getByRole('button', { name: '解析JWT' })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('解析失败'))
    })
  })

  it('shows security warning', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('安全提醒')).toBeInTheDocument()
    expect(screen.getByText(/JWT仅做解析展示/)).toBeInTheDocument()
    expect(screen.getByText(/不会验证签名有效性/)).toBeInTheDocument()
  })

  it('displays token validation status', async () => {
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('粘贴JWT token...')
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    
    fireEvent.change(jwtInput, { target: { value: sampleJWT } })
    
    const parseButton = screen.getByRole('button', { name: '解析JWT' })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText('Token状态')).toBeInTheDocument()
    })
  })
})