import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CrontabGeneratorPage from '../../app/tools/crontab/page'

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

describe('Crontab Generator Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders crontab generator page correctly', () => {
    render(<CrontabGeneratorPage />)
    
    expect(screen.getByText('Crontab生成器')).toBeInTheDocument()
    expect(screen.getByText('生成Cron定时任务表达式，支持可视化编辑和表达式解析')).toBeInTheDocument()
  })

  it('generates basic cron expression', async () => {
    render(<CrontabGeneratorPage />)
    
    const minuteSelect = screen.getByLabelText(/分钟/i)
    fireEvent.change(minuteSelect, { target: { value: '30' } })
    
    const hourSelect = screen.getByLabelText(/小时/i)
    fireEvent.change(hourSelect, { target: { value: '9' } })
    
    const generateButton = screen.getByRole('button', { name: /生成表达式/i })
    fireEvent.click(generateButton)
    
    await waitFor(() => {
      const cronResult = screen.getByDisplayValue('30 9 * * *')
      expect(cronResult).toBeInTheDocument()
    })
  })

  it('supports common preset expressions', async () => {
    render(<CrontabGeneratorPage />)
    
    const presetButton = screen.getByRole('button', { name: /每天凌晨/i })
    fireEvent.click(presetButton)
    
    await waitFor(() => {
      const cronResult = screen.getByDisplayValue('0 0 * * *')
      expect(cronResult).toBeInTheDocument()
    })
  })

  it('parses and explains cron expressions', async () => {
    render(<CrontabGeneratorPage />)
    
    const cronInput = screen.getByPlaceholderText(/输入Cron表达式/i)
    fireEvent.change(cronInput, { target: { value: '0 9 * * 1-5' } })
    
    const parseButton = screen.getByRole('button', { name: /解析表达式/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText(/工作日上午9点/i)).toBeInTheDocument()
    })
  })

  it('shows cron syntax explanation', () => {
    render(<CrontabGeneratorPage />)
    
    expect(screen.getByText(/Cron语法/i)).toBeInTheDocument()
    expect(screen.getByText(/分钟 小时 日期 月份 星期/i)).toBeInTheDocument()
    expect(screen.getByText(/0-59/i)).toBeInTheDocument()
    expect(screen.getByText(/0-23/i)).toBeInTheDocument()
    expect(screen.getByText(/1-31/i)).toBeInTheDocument()
  })

  it('provides common cron examples', () => {
    render(<CrontabGeneratorPage />)
    
    expect(screen.getByText(/常用示例/i)).toBeInTheDocument()
    expect(screen.getByText(/每分钟/i)).toBeInTheDocument()
    expect(screen.getByText(/每小时/i)).toBeInTheDocument()
    expect(screen.getByText(/每天/i)).toBeInTheDocument()
    expect(screen.getByText(/每周/i)).toBeInTheDocument()
  })

  it('has copy functionality for generated expressions', async () => {
    render(<CrontabGeneratorPage />)
    
    const presetButton = screen.getByRole('button', { name: /每小时/i })
    fireEvent.click(presetButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('validates cron expression syntax', async () => {
    render(<CrontabGeneratorPage />)
    
    const cronInput = screen.getByPlaceholderText(/输入Cron表达式/i)
    fireEvent.change(cronInput, { target: { value: 'invalid-cron-expression' } })
    
    const parseButton = screen.getByRole('button', { name: /解析表达式/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText(/无效的Cron表达式/i)).toBeInTheDocument()
    })
  })

  it('shows next execution times', async () => {
    render(<CrontabGeneratorPage />)
    
    const cronInput = screen.getByPlaceholderText(/输入Cron表达式/i)
    fireEvent.change(cronInput, { target: { value: '0 9 * * *' } })
    
    const parseButton = screen.getByRole('button', { name: /解析表达式/i })
    fireEvent.click(parseButton)
    
    await waitFor(() => {
      expect(screen.getByText(/下次执行时间/i)).toBeInTheDocument()
    })
  })
})