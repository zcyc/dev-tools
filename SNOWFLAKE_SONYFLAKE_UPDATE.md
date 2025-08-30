# ID生成器更新记录

## 更新日期
2024年12月

## 更新内容

### 1. 删除 Hashids 支持
- 从依赖中移除了 `hashids` 包
- 删除了Hashids的生成和解析功能
- 移除了相关的测试mock

### 2. 添加 Snowflake ID 支持
- 安装了 `@sapphire/snowflake` 库
- 添加了Snowflake ID生成功能
- 实现了Snowflake ID解析功能，可以提取：
  - 时间戳信息
  - 机器ID
  - 序列号
  - 64位结构信息

#### Snowflake ID 特性
- **时间排序**: 基于时间戳生成，自然排序
- **64位数字**: 使用64位整数表示
- **高性能**: 适合高并发场景
- **分布式**: 支持分布式系统

### 3. 添加 Sony Flake ID 支持
- 安装了 `sonyflake` 库
- 添加了Sony Flake ID生成功能
- 实现了Sony Flake ID解析功能

#### Sony Flake ID 特性
- **时间排序**: 基于时间戳，优化的排序算法
- **优化算法**: 相比Snowflake有更好的性能表现
- **低碰撞**: 降低了ID碰撞的可能性
- **分布式**: 支持分布式系统部署

### 4. 更新测试套件
- 删除了hashids相关的mock
- 添加了Snowflake和Sony Flake的mock
- 确保所有现有测试继续通过

## 技术细节

### 新增依赖
```json
{
  "@sapphire/snowflake": "^3.5.5",
  "sonyflake": "^1.1.2"
}
```

### 移除依赖
```json
{
  "hashids": "^2.3.0"  // 已移除
}
```

### ID格式示例

#### Snowflake ID
```
1234567890123456789
```
- 格式：64位整数字符串
- 长度：15-20位数字
- 包含时间戳、机器ID、序列号信息

#### Sony Flake ID
```
12345678901234567
```
- 格式：64位整数字符串
- 长度：15-20位数字
- 优化的时间戳和随机性算法

## 解析功能增强

新的ID解析器可以：
1. 自动识别Snowflake ID格式
2. 提取时间戳并转换为可读日期
3. 显示机器ID和序列号
4. 智能区分Snowflake和Sony Flake格式

## 测试状态
✅ 所有测试通过 (20/20)
✅ 项目正常运行
✅ ID生成功能正常
✅ ID解析功能正常

## 用户界面更新
- ID类型选择器中已更新格式列表
- 删除了Hashids选项
- 添加了Snowflake ID和Sony Flake选项
- 解析器支持新的ID格式识别