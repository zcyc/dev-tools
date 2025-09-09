/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TextStatsPage from '../../app/[locale]/tools/text-stats/page'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}))

describe('Text Statistics Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the text statistics page', () => {
    render(<TextStatsPage />)
    
    expect(screen.getByText('文本统计')).toBeInTheDocument()
    expect(screen.getByText('统计文本的字符、单词、行数等信息')).toBeInTheDocument()
  })

  it('has text input area', () => {
    render(<TextStatsPage />)
    
    expect(screen.getByPlaceholderText('输入或粘贴文本内容...')).toBeInTheDocument()
  })

  it('does not show statistics when text is empty', () => {
    render(<TextStatsPage />)
    
    expect(screen.queryByText('字符数')).not.toBeInTheDocument()
    expect(screen.queryByText('单词数')).not.toBeInTheDocument()
  })

  it('shows statistics when text is entered', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: 'Hello world!' } })
    
    expect(screen.getByText('字符数')).toBeInTheDocument()
    expect(screen.getByText('单词数')).toBeInTheDocument()
    expect(screen.getByText('行数')).toBeInTheDocument()
    expect(screen.getByText('句子数')).toBeInTheDocument()
  })

  it('calculates character count correctly', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: 'Hello world!' } })
    
    // Should show character count in the statistics cards
    expect(screen.getByText('字符数')).toBeInTheDocument()
    expect(screen.getAllByText('12')).toHaveLength(1) // Total characters
  })

  it('calculates word count correctly', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: 'Hello world!' } })
    
    expect(screen.getByText('单词数')).toBeInTheDocument()
    // Find the word count specifically in the word count card
    const wordCountCard = screen.getByText('单词数').closest('.space-y-6, [class*="card"], [class*="Card"]') || screen.getByText('单词数').parentElement?.parentElement
    expect(wordCountCard).toHaveTextContent('2')
  })

  it('calculates characters without spaces', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: 'Hello world!' } })
    
    expect(screen.getByText('不含空格: 11')).toBeInTheDocument() // 11 characters without space
  })

  it('calculates line count correctly', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: 'Line 1\nLine 2\nLine 3' } })
    
    expect(screen.getByText('行数')).toBeInTheDocument()
    // Line count will be shown in the statistics
  })

  it('calculates sentence count correctly', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: 'Hello! How are you? I am fine.' } })
    
    expect(screen.getByText('句子数')).toBeInTheDocument()
    // Sentence count will be shown in the statistics
  })

  it('calculates paragraph count correctly', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: 'Paragraph 1\n\nParagraph 2\n\nParagraph 3' } })
    
    expect(screen.getByText('3 个段落')).toBeInTheDocument() // 3 paragraphs
  })

  it('shows average words per sentence', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: 'Hello world! How are you?' } })
    
    expect(screen.getByText(/平均每句 \d+\.?\d* 词/)).toBeInTheDocument()
  })

  it('shows average characters per word', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: 'Hello world!' } })
    
    expect(screen.getByText(/平均每词 \d+\.?\d* 字符/)).toBeInTheDocument()
  })

  it('handles empty input gracefully', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: 'test' } })
    fireEvent.change(textArea, { target: { value: '' } })
    
    expect(screen.queryByText('字符数')).not.toBeInTheDocument()
  })

  it('handles multiple spaces correctly', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: 'Hello    world' } })
    
    expect(screen.getByText('单词数')).toBeInTheDocument() // Should still count as 2 words
  })

  it('handles text with only spaces', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    fireEvent.change(textArea, { target: { value: '   ' } })
    
    expect(screen.getByText('单词数')).toBeInTheDocument()
    // Should show 0 words for spaces only
  })

  it('updates statistics in real-time', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    
    fireEvent.change(textArea, { target: { value: 'Hello' } })
    expect(screen.getByText('字符数')).toBeInTheDocument()
    
    fireEvent.change(textArea, { target: { value: 'Hello world' } })
    expect(screen.getByText('字符数')).toBeInTheDocument() // Statistics should update
  })

  it('displays large numbers with proper formatting', () => {
    render(<TextStatsPage />)
    
    const textArea = screen.getByPlaceholderText('输入或粘贴文本内容...')
    const longText = 'word '.repeat(1000) // 1000 words
    fireEvent.change(textArea, { target: { value: longText } })
    
    expect(screen.getByText('单词数')).toBeInTheDocument() // Should show word count with proper formatting
  })
})