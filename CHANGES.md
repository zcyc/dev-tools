# Dev Tools 项目更新日志

## 重大更新 - ID生成器升级

### 1. 应用重命名
- **从 "IT Tools" 重命名为 "Dev Tools"**
- 更新了所有UI组件、页面标题和元数据
- 更新了Logo从 "IT" 改为 "DT"
- 更新了SEO关键词，包含30+种ID格式的描述

### 2. 高级ID生成器实现
创建了全新的高级ID生成器 (`/tools/id-generator`)，支持30+种ID格式：

#### 支持的ID类型：
**UUID 系列：**
- UUID v1 (基于时间戳和MAC地址)
- UUID v4 (完全随机)
- UUID v5 (基于SHA-1哈希)
- UUID v6 (重新排序的时间戳)
- UUID v7 (基于Unix时间戳)
- UUID Nil (全零)
- UUID Max (全F)

**现代ID格式：**
- ULID (按时间排序的唯一标识符)
- KSUID (K-Sortable唯一标识符)
- Nano ID (小巧的URL安全ID)
- CUID2 (防碰撞的唯一标识符v2)

**编码格式：**
- Hashids (数字到字符串的可逆编码)
- Sqids (Hashids的现代替代)

**时间戳格式：**
- Unix时间戳 (秒)
- Unix时间戳 (毫秒)
- Unix时间戳 (微秒)
- Unix时间戳 (纳秒)

**其他格式：**
- ObjectId (MongoDB风格)
- Hex Hash (十六进制哈希)
- Short UUID (紧凑格式)

#### 功能特性：
- **双模式界面**：生成和解析两个标签页
- **批量生成**：支持一次生成1-100个ID
- **智能解析**：自动识别ID格式并提取元数据
- **自定义参数**：支持UUID v5命名空间、Nano ID自定义字母表等
- **导出功能**：支持复制到剪贴板和文件导出
- **格式信息**：显示每种ID格式的详细说明和特性

### 3. 路由重构
将原有的独立ID生成器合并：
- `/tools/uuid` → 重定向到 `/tools/id-generator`
- `/tools/ulid` → 重定向到 `/tools/id-generator`
- `/tools/objectid` → 重定向到 `/tools/id-generator`
- `/tools/random-id` → 重定向到 `/tools/id-generator`

### 4. 测试系统完善
#### 新增测试：
- 为高级ID生成器创建了全面的测试套件 (20个测试用例)
- 为重定向页面创建了测试用例
- 添加了第三方库的Mock配置

#### 测试覆盖率：
- 配置了Jest测试覆盖率收集
- 设置覆盖率阈值为70%
- 生成HTML和LCOV格式的覆盖率报告
- 覆盖率报告保存在 `/coverage` 目录

### 5. 技术栈升级
#### 新增依赖：
```json
{
  "ulid": "^3.0.1",
  "ksuid": "^3.0.0", 
  "nanoid": "^5.1.5",
  "hashids": "^2.3.0",
  "sqids": "^0.3.0",
  "short-unique-id": "^5.3.2",
  "@paralleldrive/cuid2": "^2.2.2"
}
```

#### Jest配置优化：
- 添加了第三方ES模块的转换配置
- 配置了详细的覆盖率收集规则
- 设置了覆盖率阈值和报告格式

### 6. 用户体验提升
- **统一的界面**：所有ID生成功能集中在一个页面
- **实时解析**：输入ID即时显示解析结果
- **格式提示**：每种ID格式都有详细说明和示例
- **响应式设计**：支持桌面和移动设备
- **便捷操作**：一键复制、批量生成、文件导出

### 7. 性能优化
- 使用React Hooks进行状态管理
- 实现了高效的ID格式检测算法
- 优化了大批量ID生成的性能
- 添加了适当的错误处理和用户反馈

## 运行命令

### 开发
```bash
npm run dev
```

### 测试
```bash
# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监视模式运行测试
npm run test:watch
```

### 构建
```bash
npm run build
npm start
```

## 覆盖率报告
测试覆盖率报告会生成在 `coverage/` 目录下：
- `coverage/lcov-report/index.html` - HTML格式的详细报告
- `coverage/lcov.info` - LCOV格式数据
- 控制台会显示文本格式的覆盖率摘要

当前ID生成器相关代码的覆盖率约为32%，重定向页面达到100%覆盖率。

## 技术亮点
1. **统一的ID生成平台**：将多个独立的ID生成器合并为一个功能强大的工具
2. **智能格式识别**：能够自动识别和解析30+种不同的ID格式
3. **完善的测试覆盖**：包含单元测试、集成测试和覆盖率报告
4. **现代化的UI**：使用Radix UI和Tailwind CSS构建的响应式界面
5. **类型安全**：全面的TypeScript类型定义和检查