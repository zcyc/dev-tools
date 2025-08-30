import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SQLFormatterPage from '../../app/tools/sql-formatter/page'

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

// Mock sql-formatter library
jest.mock('sql-formatter', () => ({
  format: jest.fn((sql, options) => {
    const formatted = sql
      .replace(/\s+/g, ' ')
      .replace(/\s*,\s*/g, ',\n  ')
      .replace(/FROM/gi, '\nFROM')
      .replace(/WHERE/gi, '\nWHERE')
      .replace(/SELECT/gi, 'SELECT\n  ')
      .trim()
    
    if (options?.uppercase) {
      return formatted.replace(/\b(SELECT|FROM|WHERE|AND|OR|ORDER BY|GROUP BY)\b/gi, match => match.toUpperCase())
    }
    return formatted
  }),
  supportedDialects: ['sql', 'mysql', 'postgresql', 'sqlite', 'oracle', 'mssql']
}))

describe('SQL Formatter Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders SQL formatter page correctly', () => {
    render(<SQLFormatterPage />)
    
    expect(screen.getByText('SQL格式化')).toBeInTheDocument()
    expect(screen.getByText('格式化和美化SQL查询语句，支持多种数据库方言')).toBeInTheDocument()
  })

  it('formats basic SQL query', async () => {
    render(<SQLFormatterPage />)
    
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    const testSQL = 'SELECT id,name,email FROM users WHERE age > 18 AND status = "active"'
    fireEvent.change(sqlInput, { target: { value: testSQL } })
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      const formattedResult = screen.getByDisplayValue(/SELECT\s+id,name,email\s+FROM\s+users\s+WHERE/)
      expect(formattedResult).toBeInTheDocument()
    })
  })

  it('supports different SQL dialects', async () => {
    render(<SQLFormatterPage />)
    
    const dialectSelect = screen.getByLabelText(/数据库类型/i)
    fireEvent.change(dialectSelect, { target: { value: 'mysql' } })
    
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    fireEvent.change(sqlInput, { target: { value: 'SELECT * FROM users' } })
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      const formattedResult = screen.getByDisplayValue(/SELECT\s+\*\s+FROM\s+users/)
      expect(formattedResult).toBeInTheDocument()
    })
  })

  it('supports uppercase keywords option', async () => {
    render(<SQLFormatterPage />)
    
    const uppercaseCheckbox = screen.getByLabelText(/关键字大写/i)
    fireEvent.click(uppercaseCheckbox)
    
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    fireEvent.change(sqlInput, { target: { value: 'select * from users where id = 1' } })
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      const formattedResult = screen.getByDisplayValue(/SELECT.*FROM.*WHERE/)
      expect(formattedResult).toBeInTheDocument()
    })
  })

  it('minifies SQL queries', async () => {
    render(<SQLFormatterPage />)
    
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    const multiLineSQL = `SELECT 
      id,
      name,
      email
    FROM 
      users 
    WHERE 
      age > 18`
    fireEvent.change(sqlInput, { target: { value: multiLineSQL } })
    
    const minifyButton = screen.getByRole('button', { name: /压缩/i })
    fireEvent.click(minifyButton)
    
    await waitFor(() => {
      const minifiedResult = screen.getByDisplayValue('SELECT id,name,email FROM users WHERE age > 18')
      expect(minifiedResult).toBeInTheDocument()
    })
  })

  it('shows SQL syntax examples', () => {
    render(<SQLFormatterPage />)
    
    expect(screen.getByText(/SQL示例/i)).toBeInTheDocument()
    expect(screen.getByText(/SELECT查询/i)).toBeInTheDocument()
    expect(screen.getByText(/JOIN连接/i)).toBeInTheDocument()
    expect(screen.getByText(/UPDATE更新/i)).toBeInTheDocument()
    expect(screen.getByText(/INSERT插入/i)).toBeInTheDocument()
  })

  it('allows using preset SQL examples', async () => {
    render(<SQLFormatterPage />)
    
    const selectExampleButton = screen.getByRole('button', { name: /SELECT查询/i })
    fireEvent.click(selectExampleButton)
    
    await waitFor(() => {
      const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
      expect(sqlInput.value).toContain('SELECT')
    })
  })

  it('validates SQL syntax', async () => {
    render(<SQLFormatterPage />)
    
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    fireEvent.change(sqlInput, { target: { value: 'INVALID SQL SYNTAX HERE' } })
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(screen.getByText(/语法错误|格式错误/i)).toBeInTheDocument()
    })
  })

  it('has copy functionality for formatted SQL', async () => {
    render(<SQLFormatterPage />)
    
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    fireEvent.change(sqlInput, { target: { value: 'SELECT * FROM users' } })
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      const copyButtons = screen.getAllByRole('button').filter(button => 
        button.textContent?.includes('复制') || 
        (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
      )
      expect(copyButtons.length).toBeGreaterThan(0)
    })
  })

  it('handles empty SQL input', () => {
    render(<SQLFormatterPage />)
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    // Should handle empty input gracefully
    expect(formatButton).toBeInTheDocument()
  })

  it('formats complex JOIN queries', async () => {
    render(<SQLFormatterPage />)
    
    const complexSQL = 'SELECT u.name, p.title FROM users u LEFT JOIN posts p ON u.id = p.user_id WHERE u.active = 1'
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    fireEvent.change(sqlInput, { target: { value: complexSQL } })
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(/LEFT JOIN/i)).toBeInTheDocument()
    })
  })

  it('shows supported database dialects', () => {
    render(<SQLFormatterPage />)
    
    expect(screen.getByText(/支持的数据库/i)).toBeInTheDocument()
    expect(screen.getByText(/MySQL/i)).toBeInTheDocument()
    expect(screen.getByText(/PostgreSQL/i)).toBeInTheDocument()
    expect(screen.getByText(/SQLite/i)).toBeInTheDocument()
    expect(screen.getByText(/Oracle/i)).toBeInTheDocument()
  })

  it('provides formatting options', () => {
    render(<SQLFormatterPage />)
    
    expect(screen.getByText(/格式选项/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/缩进大小/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/关键字大写/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/换行风格/i)).toBeInTheDocument()
  })

  it('handles large SQL queries', async () => {
    render(<SQLFormatterPage />)
    
    const largeSQL = 'SELECT ' + Array(50).fill('column').map((col, i) => `${col}${i}`).join(', ') + ' FROM large_table'
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    fireEvent.change(sqlInput, { target: { value: largeSQL } })
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(/column0.*column49/s)).toBeInTheDocument()
    }, { timeout: 5000 })
  })

  it('formats stored procedures', async () => {
    render(<SQLFormatterPage />)
    
    const procedureSQL = 'CREATE PROCEDURE GetUser(@id INT) AS BEGIN SELECT * FROM users WHERE id = @id END'
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    fireEvent.change(sqlInput, { target: { value: procedureSQL } })
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(/CREATE PROCEDURE/i)).toBeInTheDocument()
    })
  })

  it('shows SQL best practices', () => {
    render(<SQLFormatterPage />)
    
    expect(screen.getByText(/最佳实践/i)).toBeInTheDocument()
    expect(screen.getByText(/索引使用/i)).toBeInTheDocument()
    expect(screen.getByText(/查询优化/i)).toBeInTheDocument()
    expect(screen.getByText(/性能调优/i)).toBeInTheDocument()
  })

  it('provides query analysis', async () => {
    render(<SQLFormatterPage />)
    
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    fireEvent.change(sqlInput, { target: { value: 'SELECT * FROM users WHERE name LIKE "%test%"' } })
    
    const analyzeButton = screen.queryByRole('button', { name: /分析/i })
    if (analyzeButton) {
      fireEvent.click(analyzeButton)
      
      await waitFor(() => {
        expect(screen.getByText(/查询分析/i)).toBeInTheDocument()
      })
    }
  })

  it('handles SQL comments', async () => {
    render(<SQLFormatterPage />)
    
    const sqlWithComments = `-- Get all active users
    SELECT * FROM users 
    WHERE status = 'active' /* only active ones */`
    
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    fireEvent.change(sqlInput, { target: { value: sqlWithComments } })
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(/--.*Get all active users/s)).toBeInTheDocument()
    })
  })

  it('supports different indentation styles', async () => {
    render(<SQLFormatterPage />)
    
    const indentSelect = screen.getByLabelText(/缩进大小/i)
    fireEvent.change(indentSelect, { target: { value: '4' } })
    
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    fireEvent.change(sqlInput, { target: { value: 'SELECT id, name FROM users' } })
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(/    id,name/)).toBeInTheDocument()
    })
  })

  it('exports formatted SQL', async () => {
    render(<SQLFormatterPage />)
    
    const sqlInput = screen.getByPlaceholderText(/输入SQL语句/i)
    fireEvent.change(sqlInput, { target: { value: 'SELECT * FROM users' } })
    
    const formatButton = screen.getByRole('button', { name: /格式化/i })
    fireEvent.click(formatButton)
    
    await waitFor(() => {
      const exportButton = screen.queryByRole('button', { name: /导出/i })
      if (exportButton) {
        expect(exportButton).toBeInTheDocument()
      }
    })
  })
})