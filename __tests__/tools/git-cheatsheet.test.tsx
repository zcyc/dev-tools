import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import GitCheatsheetPage from '../../app/[locale]/tools/git-cheatsheet/page'

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

describe('Git Cheatsheet Tool', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders git cheatsheet page correctly', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText('Git速查表')).toBeInTheDocument()
    expect(screen.getByText('Git常用命令参考，快速查找和学习Git操作')).toBeInTheDocument()
  })

  it('shows basic git commands', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/基础操作/i)).toBeInTheDocument()
    expect(screen.getByText('git init')).toBeInTheDocument()
    expect(screen.getByText('git add')).toBeInTheDocument()
    expect(screen.getByText('git commit')).toBeInTheDocument()
    expect(screen.getByText('git status')).toBeInTheDocument()
  })

  it('shows branch operations', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/分支操作/i)).toBeInTheDocument()
    expect(screen.getByText('git branch')).toBeInTheDocument()
    expect(screen.getByText('git checkout')).toBeInTheDocument()
    expect(screen.getByText('git merge')).toBeInTheDocument()
  })

  it('shows remote operations', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/远程操作/i)).toBeInTheDocument()
    expect(screen.getByText('git remote')).toBeInTheDocument()
    expect(screen.getByText('git push')).toBeInTheDocument()
    expect(screen.getByText('git pull')).toBeInTheDocument()
    expect(screen.getByText('git clone')).toBeInTheDocument()
  })

  it('provides command search functionality', async () => {
    render(<GitCheatsheetPage />)
    
    const searchInput = screen.getByPlaceholderText(/搜索Git命令/i)
    fireEvent.change(searchInput, { target: { value: 'commit' } })
    
    await waitFor(() => {
      expect(screen.getByText('git commit')).toBeInTheDocument()
    })
  })

  it('filters commands by category', async () => {
    render(<GitCheatsheetPage />)
    
    const categorySelect = screen.getByLabelText(/类别/i)
    fireEvent.change(categorySelect, { target: { value: 'branch' } })
    
    await waitFor(() => {
      expect(screen.getByText('git branch')).toBeInTheDocument()
      expect(screen.getByText('git checkout')).toBeInTheDocument()
    })
  })

  it('has copy functionality for individual commands', async () => {
    render(<GitCheatsheetPage />)
    
    const copyButtons = screen.getAllByRole('button').filter(button => 
      button.textContent?.includes('复制') || 
      (button.querySelector('svg') && button.getAttribute('class')?.includes('h-4 w-4'))
    )
    
    expect(copyButtons.length).toBeGreaterThan(0)
    
    fireEvent.click(copyButtons[0])
    
    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    })
  })

  it('shows command descriptions and examples', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/初始化仓库/i)).toBeInTheDocument()
    expect(screen.getByText(/添加文件到暂存区/i)).toBeInTheDocument()
    expect(screen.getByText(/提交更改/i)).toBeInTheDocument()
  })

  it('provides git workflow guides', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/工作流程/i)).toBeInTheDocument()
    expect(screen.getByText(/Feature Branch/i)).toBeInTheDocument()
    expect(screen.getByText(/Git Flow/i)).toBeInTheDocument()
  })

  it('shows git configuration commands', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/配置设置/i)).toBeInTheDocument()
    expect(screen.getByText('git config')).toBeInTheDocument()
    expect(screen.getByText(/用户名设置/i)).toBeInTheDocument()
    expect(screen.getByText(/邮箱设置/i)).toBeInTheDocument()
  })

  it('includes advanced git operations', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/高级操作/i)).toBeInTheDocument()
    expect(screen.getByText('git rebase')).toBeInTheDocument()
    expect(screen.getByText('git cherry-pick')).toBeInTheDocument()
    expect(screen.getByText('git stash')).toBeInTheDocument()
  })

  it('provides troubleshooting commands', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/问题排查/i)).toBeInTheDocument()
    expect(screen.getByText('git log')).toBeInTheDocument()
    expect(screen.getByText('git diff')).toBeInTheDocument()
    expect(screen.getByText('git reflog')).toBeInTheDocument()
  })

  it('shows undo operations', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/撤销操作/i)).toBeInTheDocument()
    expect(screen.getByText('git reset')).toBeInTheDocument()
    expect(screen.getByText('git revert')).toBeInTheDocument()
    expect(screen.getByText('git restore')).toBeInTheDocument()
  })

  it('provides git aliases examples', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/常用别名/i)).toBeInTheDocument()
    expect(screen.getByText(/git st/i)).toBeInTheDocument()
    expect(screen.getByText(/git co/i)).toBeInTheDocument()
  })

  it('includes git hooks information', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/Git钩子/i)).toBeInTheDocument()
    expect(screen.getByText(/pre-commit/i)).toBeInTheDocument()
    expect(screen.getByText(/post-commit/i)).toBeInTheDocument()
  })

  it('shows gitignore patterns', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/忽略文件/i)).toBeInTheDocument()
    expect(screen.getByText(/\.gitignore/i)).toBeInTheDocument()
    expect(screen.getByText(/node_modules/i)).toBeInTheDocument()
  })

  it('provides command parameter explanations', () => {
    render(<GitCheatsheetPage />)
    
    expect(screen.getByText(/-m/i)).toBeInTheDocument()
    expect(screen.getByText(/-a/i)).toBeInTheDocument()
    expect(screen.getByText(/--force/i)).toBeInTheDocument()
  })
})