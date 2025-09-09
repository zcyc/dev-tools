/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import JWTParserPage from '../../app/[locale]/tools/jwt/page'

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
    expect(screen.getByText('解析和验证JSON Web Token (JWT)')).toBeInTheDocument()
  })

  it('has JWT input field', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByPlaceholderText('输入JWT token (eyJ...)')).toBeInTheDocument()
  })

  it('has parse button', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('解析JWT')).toBeInTheDocument()
  })

  it('has clear button', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('清空')).toBeInTheDocument()
  })

  it('can input JWT token', () => {
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('输入JWT token (eyJ...)')
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    
    fireEvent.change(jwtInput, { target: { value: sampleJWT } })
    
    expect(jwtInput).toHaveValue(sampleJWT)
  })

  it('shows error when trying to parse empty input', async () => {
    const { toast } = require('sonner')
    render(<JWTParserPage />)
    
    const parseButton = screen.getByText('解析JWT')
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('请输入JWT token')
    })
  })

  it('can parse valid JWT successfully', async () => {
    const { toast } = require('sonner')
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('输入JWT token (eyJ...)')
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    
    fireEvent.change(jwtInput, { target: { value: sampleJWT } })
    
    const parseButton = screen.getByText('解析JWT')
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('JWT解析成功')
    })
  })

  it('shows error for invalid JWT format', async () => {
    const { toast } = require('sonner')
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('输入JWT token (eyJ...)')
    fireEvent.change(jwtInput, { target: { value: 'invalid.jwt.token' } })
    
    const parseButton = screen.getByText('解析JWT')
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('JWT解析失败')
    })
  })

  it('shows JWT parts after successful parsing', async () => {
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('输入JWT token (eyJ...)')
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    
    fireEvent.change(jwtInput, { target: { value: sampleJWT } })
    
    const parseButton = screen.getByText('解析JWT')
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      // Check that JWT parsing sections are displayed
      expect(screen.getByText('Header')).toBeInTheDocument()
      expect(screen.getByText('Payload')).toBeInTheDocument()
      expect(screen.getByText('Signature')).toBeInTheDocument()
    })
  })

  it('can clear input and results', () => {
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('输入JWT token (eyJ...)')
    fireEvent.change(jwtInput, { target: { value: 'test.jwt.token' } })
    
    const clearButton = screen.getByText('清空')
    fireEvent.click(clearButton)
    
    expect(jwtInput).toHaveValue('')
  })

  it('has sample JWT button', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('使用示例')).toBeInTheDocument()
  })

  it('can load sample JWT', () => {
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('输入JWT token (eyJ...)')
    const loadSampleButton = screen.getByText('使用示例')
    
    fireEvent.click(loadSampleButton)
    
    expect(jwtInput.value.length).toBeGreaterThan(0)
  })

  it('shows basic UI elements', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('JWT解析器')).toBeInTheDocument()
    expect(screen.getByText('JWT Token输入')).toBeInTheDocument()
    expect(screen.getByText('输入需要解析的JWT token')).toBeInTheDocument()
  })

  it('shows JWT input form', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('JWT Token')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('输入JWT token (eyJ...)')).toBeInTheDocument()
    expect(screen.getByText('解析JWT')).toBeInTheDocument()
    expect(screen.getByText('使用示例')).toBeInTheDocument()
    expect(screen.getByText('清空')).toBeInTheDocument()
  })

  it('shows JWT information section', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('JWT说明')).toBeInTheDocument()
    expect(screen.getByText(/JSON Web Token.*开放标准/)).toBeInTheDocument()
    expect(screen.getByText('注意:')).toBeInTheDocument()
  })

  it('has copy functionality after parsing', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })

    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('输入JWT token (eyJ...)')
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    
    fireEvent.change(jwtInput, { target: { value: sampleJWT } })
    
    const parseButton = screen.getByText('解析JWT')
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
    
    const jwtInput = screen.getByPlaceholderText('输入JWT token (eyJ...)')
    fireEvent.change(jwtInput, { target: { value: expiredJWT } })
    
    const parseButton = screen.getByText('解析JWT')
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      // Should show expiration information
      expect(screen.getByText(/过期/)).toBeInTheDocument()
    })
  })

  it('validates JWT structure (3 parts separated by dots)', async () => {
    const { toast } = require('sonner')
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('输入JWT token (eyJ...)')
    fireEvent.change(jwtInput, { target: { value: 'invalid.jwt' } }) // Only 2 parts
    
    const parseButton = screen.getByText('解析JWT')
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('JWT解析失败')
    })
  })

  it('handles base64 decoding errors gracefully', async () => {
    const { toast } = require('sonner')
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('输入JWT token (eyJ...)')
    fireEvent.change(jwtInput, { target: { value: 'invalid.base64.payload' } })
    
    const parseButton = screen.getByText('解析JWT')
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('JWT解析失败')
    })
  })

  it('shows security warning', () => {
    render(<JWTParserPage />)
    
    expect(screen.getByText('注意:')).toBeInTheDocument()
    expect(screen.getByText(/本工具仅解析JWT内容/)).toBeInTheDocument()
    expect(screen.getByText(/不验证签名/)).toBeInTheDocument()
  })

  it('displays parsed JWT sections after parsing', async () => {
    render(<JWTParserPage />)
    
    const jwtInput = screen.getByPlaceholderText('输入JWT token (eyJ...)')
    const sampleJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    
    fireEvent.change(jwtInput, { target: { value: sampleJWT } })
    
    const parseButton = screen.getByText('解析JWT')
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      // Check that parsed sections are displayed
      const headerElements = screen.getAllByText('Header')
      expect(headerElements.length).toBeGreaterThan(0)
    })
  })
})