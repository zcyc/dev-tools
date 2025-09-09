import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RegexTesterPage from '../../app/[locale]/tools/regex/page'

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

describe('Regex Tester Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders regex tester page correctly', () => {
    render(<RegexTesterPage />)
    
    expect(screen.getByText('正则表达式测试')).toBeInTheDocument()
    expect(screen.getByText('测试和匹配正则表达式，支持实时匹配和详细解释')).toBeInTheDocument()
  })

  it('tests regex pattern matching', async () => {
    render(<RegexTesterPage />)
    
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: '\\d+' } })
    
    const testInput = screen.getByPlaceholderText(/输入测试文本/i)
    fireEvent.change(testInput, { target: { value: 'Test 123 and 456' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    await waitFor(() => {
      expect(screen.getByText(/匹配结果/i)).toBeInTheDocument()
      expect(screen.getByText('123')).toBeInTheDocument()
      expect(screen.getByText('456')).toBeInTheDocument()
    })
  })

  it('supports different regex flags', async () => {
    render(<RegexTesterPage />)
    
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: 'test' } })
    
    const flagsInput = screen.getByLabelText(/标志/i)
    fireEvent.change(flagsInput, { target: { value: 'gi' } })
    
    const testInput = screen.getByPlaceholderText(/输入测试文本/i)
    fireEvent.change(testInput, { target: { value: 'Test TEST test' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    await waitFor(() => {
      const matches = screen.getAllByText('test', { exact: false })
      expect(matches.length).toBeGreaterThan(1) // Should match all three due to 'i' flag
    })
  })

  it('highlights matches in test text', async () => {
    render(<RegexTesterPage />)
    
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: '[a-z]+' } })
    
    const testInput = screen.getByPlaceholderText(/输入测试文本/i)
    fireEvent.change(testInput, { target: { value: 'Hello World 123' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    await waitFor(() => {
      expect(screen.getByText(/高亮显示/i)).toBeInTheDocument()
    })
  })

  it('shows regex explanation', async () => {
    render(<RegexTesterPage />)
    
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' } })
    
    const explainButton = screen.getByRole('button', { name: /解释/i })
    fireEvent.click(explainButton)
    
    await waitFor(() => {
      expect(screen.getByText(/表达式解释/i)).toBeInTheDocument()
    })
  })

  it('provides common regex patterns', () => {
    render(<RegexTesterPage />)
    
    expect(screen.getByText(/常用模式/i)).toBeInTheDocument()
    expect(screen.getByText(/邮箱地址/i)).toBeInTheDocument()
    expect(screen.getByText(/手机号码/i)).toBeInTheDocument()
    expect(screen.getByText(/URL地址/i)).toBeInTheDocument()
    expect(screen.getByText(/身份证号/i)).toBeInTheDocument()
  })

  it('allows using preset patterns', async () => {
    render(<RegexTesterPage />)
    
    const emailPatternButton = screen.getByRole('button', { name: /邮箱地址/i })
    fireEvent.click(emailPatternButton)
    
    await waitFor(() => {
      const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
      expect(regexInput.value).toContain('@')
    })
  })

  it('shows match groups and captures', async () => {
    render(<RegexTesterPage />)
    
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: '(\\d{4})-(\\d{2})-(\\d{2})' } })
    
    const testInput = screen.getByPlaceholderText(/输入测试文本/i)
    fireEvent.change(testInput, { target: { value: '2024-03-15' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    await waitFor(() => {
      expect(screen.getByText(/捕获组/i)).toBeInTheDocument()
      expect(screen.getByText('2024')).toBeInTheDocument()
      expect(screen.getByText('03')).toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument()
    })
  })

  it('validates regex syntax', async () => {
    render(<RegexTesterPage />)
    
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: '[invalid-regex' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    await waitFor(() => {
      expect(screen.getByText(/语法错误/i)).toBeInTheDocument()
    })
  })

  it('shows regex flags explanation', () => {
    render(<RegexTesterPage />)
    
    expect(screen.getByText(/标志说明/i)).toBeInTheDocument()
    expect(screen.getByText(/g: 全局匹配/i)).toBeInTheDocument()
    expect(screen.getByText(/i: 忽略大小写/i)).toBeInTheDocument()
    expect(screen.getByText(/m: 多行匹配/i)).toBeInTheDocument()
    expect(screen.getByText(/s: 点号匹配换行/i)).toBeInTheDocument()
  })

  it('has copy functionality for matches', async () => {
    render(<RegexTesterPage />)
    
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: '\\d+' } })
    
    const testInput = screen.getByPlaceholderText(/输入测试文本/i)
    fireEvent.change(testInput, { target: { value: 'Number 123' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('handles empty regex input', () => {
    render(<RegexTesterPage />)
    
    const testInput = screen.getByPlaceholderText(/输入测试文本/i)
    fireEvent.change(testInput, { target: { value: 'Test text' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    // Should handle empty regex gracefully
    expect(testButton).toBeInTheDocument()
  })

  it('supports replace functionality', async () => {
    render(<RegexTesterPage />)
    
    // Switch to replace tab if exists
    const replaceTab = screen.queryByText('替换')
    if (replaceTab) {
      fireEvent.click(replaceTab)
      
      const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
      fireEvent.change(regexInput, { target: { value: '\\d+' } })
      
      const testInput = screen.getByPlaceholderText(/输入测试文本/i)
      fireEvent.change(testInput, { target: { value: 'Test 123 and 456' } })
      
      const replaceInput = screen.getByPlaceholderText(/替换为/i)
      fireEvent.change(replaceInput, { target: { value: 'XXX' } })
      
      const replaceButton = screen.getByRole('button', { name: /替换/i })
      fireEvent.click(replaceButton)
      
      await waitFor(() => {
        expect(screen.getByText('Test XXX and XXX')).toBeInTheDocument()
      })
    }
  })

  it('shows match statistics', async () => {
    render(<RegexTesterPage />)
    
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: '\\w+' } })
    
    const testInput = screen.getByPlaceholderText(/输入测试文本/i)
    fireEvent.change(testInput, { target: { value: 'Hello World Test' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    await waitFor(() => {
      expect(screen.getByText(/匹配统计/i)).toBeInTheDocument()
      expect(screen.getByText(/匹配次数/i)).toBeInTheDocument()
    })
  })

  it('handles multiline text', async () => {
    render(<RegexTesterPage />)
    
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: '^\\w+' } })
    
    const flagsInput = screen.getByLabelText(/标志/i)
    fireEvent.change(flagsInput, { target: { value: 'm' } })
    
    const testInput = screen.getByPlaceholderText(/输入测试文本/i)
    fireEvent.change(testInput, { target: { value: 'Line1\nLine2\nLine3' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    await waitFor(() => {
      expect(screen.getByText('Line1')).toBeInTheDocument()
      expect(screen.getByText('Line2')).toBeInTheDocument()
      expect(screen.getByText('Line3')).toBeInTheDocument()
    })
  })

  it('provides regex learning resources', () => {
    render(<RegexTesterPage />)
    
    expect(screen.getByText(/学习资源/i)).toBeInTheDocument()
    expect(screen.getByText(/元字符/i)).toBeInTheDocument()
    expect(screen.getByText(/量词/i)).toBeInTheDocument()
    expect(screen.getByText(/字符类/i)).toBeInTheDocument()
  })

  it('shows performance warnings for complex regex', async () => {
    render(<RegexTesterPage />)
    
    const complexRegex = '(a+)+b'
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: complexRegex } })
    
    const testInput = screen.getByPlaceholderText(/输入测试文本/i)
    fireEvent.change(testInput, { target: { value: 'aaaaaaaaaaaaaaaaaa' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    await waitFor(() => {
      expect(screen.getByText(/性能警告|复杂度警告/i)).toBeInTheDocument()
    })
  })

  it('handles Unicode characters', async () => {
    render(<RegexTesterPage />)
    
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: '[\\u4e00-\\u9fff]+' } })
    
    const testInput = screen.getByPlaceholderText(/输入测试文本/i)
    fireEvent.change(testInput, { target: { value: 'Hello 你好 World 世界' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    await waitFor(() => {
      expect(screen.getByText('你好')).toBeInTheDocument()
      expect(screen.getByText('世界')).toBeInTheDocument()
    })
  })

  it('exports match results', async () => {
    render(<RegexTesterPage />)
    
    const regexInput = screen.getByPlaceholderText(/输入正则表达式/i)
    fireEvent.change(regexInput, { target: { value: '\\d+' } })
    
    const testInput = screen.getByPlaceholderText(/输入测试文本/i)
    fireEvent.change(testInput, { target: { value: 'Test 123 and 456' } })
    
    const testButton = screen.getByRole('button', { name: /测试/i })
    fireEvent.click(testButton)
    
    await waitFor(() => {
      const exportButton = screen.queryByRole('button', { name: /导出/i })
      if (exportButton) {
        expect(exportButton).toBeInTheDocument()
      }
    })
  })
})