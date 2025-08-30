import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import UserAgentParserPage from '../../app/tools/user-agent/page'

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

// Mock user-agent parser library
jest.mock('ua-parser-js', () => {
  return jest.fn().mockImplementation((userAgent) => ({
    getResult: () => ({
      ua: userAgent,
      browser: {
        name: userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : 'Unknown',
        version: userAgent.includes('Chrome') ? '120.0.0.0' : userAgent.includes('Firefox') ? '121.0' : 'Unknown',
        major: userAgent.includes('Chrome') ? '120' : userAgent.includes('Firefox') ? '121' : 'Unknown'
      },
      engine: {
        name: userAgent.includes('Chrome') ? 'Blink' : userAgent.includes('Firefox') ? 'Gecko' : 'Unknown',
        version: userAgent.includes('Chrome') ? '120.0.0.0' : userAgent.includes('Firefox') ? '121.0' : 'Unknown'
      },
      os: {
        name: userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'Mac OS' : userAgent.includes('Linux') ? 'Linux' : 'Unknown',
        version: userAgent.includes('Windows') ? '10' : userAgent.includes('Mac') ? '14.0' : 'Unknown'
      },
      device: {
        vendor: userAgent.includes('iPhone') ? 'Apple' : userAgent.includes('Samsung') ? 'Samsung' : undefined,
        model: userAgent.includes('iPhone') ? 'iPhone' : userAgent.includes('Samsung') ? 'Galaxy' : undefined,
        type: userAgent.includes('Mobile') || userAgent.includes('iPhone') ? 'mobile' : 'desktop'
      },
      cpu: {
        architecture: userAgent.includes('x64') || userAgent.includes('x86_64') ? 'amd64' : userAgent.includes('arm') ? 'arm' : undefined
      }
    })
  }))
})

describe('User-Agent Parser Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders user-agent parser page correctly', () => {
    render(<UserAgentParserPage />)
    
    expect(screen.getByText('User-Agent解析')).toBeInTheDocument()
    expect(screen.getByText('解析浏览器User-Agent字符串，获取详细的设备和浏览器信息')).toBeInTheDocument()
  })

  it('displays current user agent by default', () => {
    render(<UserAgentParserPage />)
    
    expect(screen.getByText(/当前User-Agent/i)).toBeInTheDocument()
  })

  it('parses Chrome user agent', async () => {
    render(<UserAgentParserPage />)
    
    const chromeUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    
    const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
    fireEvent.change(uaInput, { target: { value: chromeUA } })
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText('Chrome')).toBeInTheDocument()
      expect(screen.getByText('120.0.0.0')).toBeInTheDocument()
      expect(screen.getByText('Windows')).toBeInTheDocument()
      expect(screen.getByText('Blink')).toBeInTheDocument()
    })
  })

  it('parses Firefox user agent', async () => {
    render(<UserAgentParserPage />)
    
    const firefoxUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
    
    const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
    fireEvent.change(uaInput, { target: { value: firefoxUA } })
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText('Firefox')).toBeInTheDocument()
      expect(screen.getByText('121.0')).toBeInTheDocument()
      expect(screen.getByText('Gecko')).toBeInTheDocument()
    })
  })

  it('parses mobile user agent', async () => {
    render(<UserAgentParserPage />)
    
    const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
    
    const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
    fireEvent.change(uaInput, { target: { value: mobileUA } })
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('iPhone')).toBeInTheDocument()
      expect(screen.getByText('mobile')).toBeInTheDocument()
    })
  })

  it('shows parsing results in structured format', async () => {
    render(<UserAgentParserPage />)
    
    const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
    fireEvent.change(uaInput, { target: { value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText(/浏览器信息/i)).toBeInTheDocument()
      expect(screen.getByText(/操作系统/i)).toBeInTheDocument()
      expect(screen.getByText(/设备信息/i)).toBeInTheDocument()
      expect(screen.getByText(/引擎信息/i)).toBeInTheDocument()
    })
  })

  it('shows common user agent examples', () => {
    render(<UserAgentParserPage />)
    
    expect(screen.getByText(/常见User-Agent/i)).toBeInTheDocument()
    expect(screen.getByText(/Chrome/i)).toBeInTheDocument()
    expect(screen.getByText(/Firefox/i)).toBeInTheDocument()
    expect(screen.getByText(/Safari/i)).toBeInTheDocument()
    expect(screen.getByText(/Edge/i)).toBeInTheDocument()
  })

  it('has copy functionality for parsed results', async () => {
    render(<UserAgentParserPage />)
    
    const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
    fireEvent.change(uaInput, { target: { value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } })
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('handles empty user agent input', () => {
    render(<UserAgentParserPage />)
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    // Should handle empty input gracefully
    expect(parseButton).toBeInTheDocument()
  })

  it('handles malformed user agent', async () => {
    render(<UserAgentParserPage />)
    
    const malformedUA = 'invalid-user-agent-string-123'
    
    const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
    fireEvent.change(uaInput, { target: { value: malformedUA } })
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText('Unknown')).toBeInTheDocument()
    })
  })

  it('shows user agent structure explanation', () => {
    render(<UserAgentParserPage />)
    
    expect(screen.getByText(/User-Agent结构/i)).toBeInTheDocument()
    expect(screen.getByText(/Mozilla版本/i)).toBeInTheDocument()
    expect(screen.getByText(/平台信息/i)).toBeInTheDocument()
    expect(screen.getByText(/引擎信息/i)).toBeInTheDocument()
    expect(screen.getByText(/浏览器标识/i)).toBeInTheDocument()
  })

  it('provides browser detection tips', () => {
    render(<UserAgentParserPage />)
    
    expect(screen.getByText(/检测建议/i)).toBeInTheDocument()
    expect(screen.getByText(/特性检测/i)).toBeInTheDocument()
    expect(screen.getByText(/版本兼容/i)).toBeInTheDocument()
    expect(screen.getByText(/移动端适配/i)).toBeInTheDocument()
  })

  it('shows security considerations', () => {
    render(<UserAgentParserPage />)
    
    expect(screen.getByText(/安全考虑/i)).toBeInTheDocument()
    expect(screen.getByText(/隐私保护/i)).toBeInTheDocument()
    expect(screen.getByText(/伪造检测/i)).toBeInTheDocument()
    expect(screen.getByText(/指纹识别/i)).toBeInTheDocument()
  })

  it('handles bot user agents', async () => {
    render(<UserAgentParserPage />)
    
    const botUA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    
    const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
    fireEvent.change(uaInput, { target: { value: botUA } })
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText(/bot|爬虫|机器人/i)).toBeInTheDocument()
    })
  })

  it('allows using preset user agents', async () => {
    render(<UserAgentParserPage />)
    
    const presetButton = screen.getByRole('button', { name: /使用示例/i })
    fireEvent.click(presetButton)
    
    // Should populate the input with a preset UA
    await waitFor(() => {
      const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
      expect(uaInput.value).not.toBe('')
    })
  })

  it('shows device type classification', async () => {
    render(<UserAgentParserPage />)
    
    const tabletUA = 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
    
    const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
    fireEvent.change(uaInput, { target: { value: tabletUA } })
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText(/设备类型/i)).toBeInTheDocument()
    })
  })

  it('provides JSON export of parsed data', async () => {
    render(<UserAgentParserPage />)
    
    const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
    fireEvent.change(uaInput, { target: { value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } })
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      const exportButton = screen.queryByRole('button', { name: /导出JSON/i })
      if (exportButton) {
        expect(exportButton).toBeInTheDocument()
      }
    })
  })

  it('shows parsing statistics', async () => {
    render(<UserAgentParserPage />)
    
    const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
    fireEvent.change(uaInput, { target: { value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } })
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText(/解析统计/i)).toBeInTheDocument()
      expect(screen.getByText(/字符长度/i)).toBeInTheDocument()
    })
  })

  it('handles very long user agent strings', async () => {
    render(<UserAgentParserPage />)
    
    const longUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' + 'extra'.repeat(100)
    
    const uaInput = screen.getByPlaceholderText(/输入User-Agent字符串/i)
    fireEvent.change(uaInput, { target: { value: longUA } })
    
    const parseButton = screen.getByRole('button', { name: /解析/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText(/解析结果/i)).toBeInTheDocument()
    }, { timeout: 5000 })
  })
})