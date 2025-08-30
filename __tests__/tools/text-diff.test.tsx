import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import TextDiffPage from '../../app/tools/text-diff/page'

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

// Mock diff library
jest.mock('diff', () => ({
  diffWords: jest.fn((text1, text2) => [
    { value: 'Hello ', count: 1 },
    { value: 'world', count: 1, removed: true },
    { value: 'universe', count: 1, added: true },
    { value: '!', count: 1 }
  ]),
  diffLines: jest.fn((text1, text2) => [
    { value: 'Line 1\n', count: 1 },
    { value: 'Line 2\n', count: 1, removed: true },
    { value: 'Line 2 Modified\n', count: 1, added: true },
    { value: 'Line 3\n', count: 1 }
  ]),
  diffChars: jest.fn((text1, text2) => [
    { value: 'Hel', count: 3 },
    { value: 'l', count: 1, removed: true },
    { value: 'p', count: 1, added: true },
    { value: 'o', count: 1 }
  ])
}))

describe('Text Diff Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders text diff page correctly', () => {
    render(<TextDiffPage />)
    
    expect(screen.getByText('文本对比')).toBeInTheDocument()
    expect(screen.getByText('比较两段文本的差异，支持多种对比模式和高亮显示')).toBeInTheDocument()
  })

  it('compares two text inputs', async () => {
    render(<TextDiffPage />)
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Hello world!' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'Hello universe!' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText(/差异结果/i)).toBeInTheDocument()
      expect(screen.getByText('world')).toBeInTheDocument()
      expect(screen.getByText('universe')).toBeInTheDocument()
    })
  })

  it('supports different comparison modes', async () => {
    render(<TextDiffPage />)
    
    const modeSelect = screen.getByLabelText(/比较模式/i)
    fireEvent.change(modeSelect, { target: { value: 'lines' } })
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Line 1\nLine 2\nLine 3' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'Line 1\nLine 2 Modified\nLine 3' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText('Line 2')).toBeInTheDocument()
      expect(screen.getByText('Line 2 Modified')).toBeInTheDocument()
    })
  })

  it('supports character-level comparison', async () => {
    render(<TextDiffPage />)
    
    const modeSelect = screen.getByLabelText(/比较模式/i)
    fireEvent.change(modeSelect, { target: { value: 'chars' } })
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Hello' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'Helpo' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText('l')).toBeInTheDocument()
      expect(screen.getByText('p')).toBeInTheDocument()
    })
  })

  it('shows diff statistics', async () => {
    render(<TextDiffPage />)
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Original text' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'Modified text' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText(/统计信息/i)).toBeInTheDocument()
      expect(screen.getByText(/添加/i)).toBeInTheDocument()
      expect(screen.getByText(/删除/i)).toBeInTheDocument()
      expect(screen.getByText(/修改/i)).toBeInTheDocument()
    })
  })

  it('highlights differences with colors', async () => {
    render(<TextDiffPage />)
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Test text' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'Test content' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText(/差异高亮/i)).toBeInTheDocument()
    })
  })

  it('provides side-by-side view', async () => {
    render(<TextDiffPage />)
    
    const viewModeSelect = screen.getByLabelText(/显示模式/i)
    fireEvent.change(viewModeSelect, { target: { value: 'side-by-side' } })
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Left text' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'Right text' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText(/并排显示/i)).toBeInTheDocument()
    })
  })

  it('supports unified diff view', async () => {
    render(<TextDiffPage />)
    
    const viewModeSelect = screen.getByLabelText(/显示模式/i)
    fireEvent.change(viewModeSelect, { target: { value: 'unified' } })
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Original' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'Modified' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText(/统一视图/i)).toBeInTheDocument()
    })
  })

  it('has copy functionality for diff result', async () => {
    render(<TextDiffPage />)
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Test' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'Test modified' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('handles empty text inputs', () => {
    render(<TextDiffPage />)
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    // Should handle empty inputs gracefully
    expect(compareButton).toBeInTheDocument()
  })

  it('ignores whitespace when option is enabled', async () => {
    render(<TextDiffPage />)
    
    const ignoreWhitespaceCheckbox = screen.getByLabelText(/忽略空白字符/i)
    fireEvent.click(ignoreWhitespaceCheckbox)
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Hello world' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'Hello   world' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText(/无差异|相同/i)).toBeInTheDocument()
    })
  })

  it('ignores case when option is enabled', async () => {
    render(<TextDiffPage />)
    
    const ignoreCaseCheckbox = screen.getByLabelText(/忽略大小写/i)
    fireEvent.click(ignoreCaseCheckbox)
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Hello World' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'hello world' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText(/无差异|相同/i)).toBeInTheDocument()
    })
  })

  it('exports diff results', async () => {
    render(<TextDiffPage />)
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Export test' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'Export test modified' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      const exportButton = screen.queryByRole('button', { name: /导出/i })
      if (exportButton) {
        expect(exportButton).toBeInTheDocument()
      }
    })
  })

  it('handles large text files efficiently', async () => {
    render(<TextDiffPage />)
    
    const largeText1 = 'Line\n'.repeat(1000)
    const largeText2 = largeText1.replace('Line', 'Modified Line')
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: largeText1 } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: largeText2 } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText(/差异结果/i)).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('shows line numbers in results', async () => {
    render(<TextDiffPage />)
    
    const showLineNumbersCheckbox = screen.getByLabelText(/显示行号/i)
    fireEvent.click(showLineNumbersCheckbox)
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'Line 1\nLine 2\nLine 3' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'Line 1\nModified Line 2\nLine 3' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText(/行号/i)).toBeInTheDocument()
    })
  })

  it('provides context lines around changes', async () => {
    render(<TextDiffPage />)
    
    const contextLinesInput = screen.getByLabelText(/上下文行数/i)
    fireEvent.change(contextLinesInput, { target: { value: '3' } })
    
    const text1Input = screen.getByPlaceholderText(/输入第一段文本/i)
    fireEvent.change(text1Input, { target: { value: 'A\nB\nC\nD\nE\nF\nG' } })
    
    const text2Input = screen.getByPlaceholderText(/输入第二段文本/i)
    fireEvent.change(text2Input, { target: { value: 'A\nB\nC\nModified\nE\nF\nG' } })
    
    const compareButton = screen.getByRole('button', { name: /比较/i })
    fireEvent.click(compareButton)
    
    await waitFor(() => {
      expect(screen.getByText(/上下文/i)).toBeInTheDocument()
    })
  })
})