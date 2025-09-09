'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GitBranch } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ToolLayout } from '@/components/layout/tool-layout'

export default function GitCheatsheetPage() {
  const gitCommands = [
    {
      category: '基础操作',
      commands: [
        { command: 'git init', description: '初始化Git仓库' },
        { command: 'git clone <url>', description: '克隆远程仓库' },
        { command: 'git status', description: '查看文件状态' },
        { command: 'git add <file>', description: '添加文件到暂存区' },
        { command: 'git commit -m "message"', description: '提交更改' },
        { command: 'git push', description: '推送到远程仓库' },
        { command: 'git pull', description: '从远程仓库拉取' }
      ]
    },
    {
      category: '分支操作',
      commands: [
        { command: 'git branch', description: '查看分支列表' },
        { command: 'git branch <name>', description: '创建新分支' },
        { command: 'git checkout <branch>', description: '切换分支' },
        { command: 'git merge <branch>', description: '合并分支' },
        { command: 'git branch -d <branch>', description: '删除分支' }
      ]
    },
    {
      category: '历史查看',
      commands: [
        { command: 'git log', description: '查看提交历史' },
        { command: 'git log --oneline', description: '简洁历史' },
        { command: 'git diff', description: '查看差异' },
        { command: 'git show <commit>', description: '查看提交详情' }
      ]
    }
  ]

  return (
    <MainLayout>
      <ToolLayout
        title="Git速查表"
        description="Git常用命令参考手册"
        icon="GitBranch"
      >
        <div className="space-y-6">
          {gitCommands.map((section) => (
            <Card key={section.category}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  {section.category}
                  <Badge variant="outline">{section.commands.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.commands.map((cmd, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-muted rounded">
                      <div className="font-mono text-sm">{cmd.command}</div>
                      <div className="text-sm text-muted-foreground">{cmd.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ToolLayout>
    </MainLayout>
  )
}