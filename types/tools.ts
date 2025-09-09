export interface Tool {
  id: string
  name: string
  description: string
  icon: string
  path: string
  category: string
}

export interface ToolCategory {
  id: string
  name: string
  icon: string
  tools: Tool[]
}

export const toolCategories: ToolCategory[] = [
  {
    id: 'id-generators',
    name: 'ID 生成工具',
    icon: 'Hash',
    tools: [
      { id: 'id-generator', name: 'ID 生成器', description: '支持 30+ 种 ID 格式生成与解析，包括 UUID、ULID、KSUID 等', icon: 'Hash', path: '/tools/id-generator', category: 'id-generators' },
      { id: 'token', name: 'Token 生成器', description: '生成随机访问令牌', icon: 'Key', path: '/tools/token', category: 'id-generators' },
    ]
  },
  {
    id: 'crypto',
    name: '加密工具',
    icon: 'Shield',
    tools: [
      { id: 'hash', name: 'Hash文本生成', description: '生成MD5、SHA-1、SHA-256等哈希值', icon: 'Lock', path: '/tools/hash', category: 'crypto' },
      { id: 'bcrypt', name: 'Bcrypt加密', description: 'Bcrypt密码哈希和验证', icon: 'KeyRound', path: '/tools/bcrypt', category: 'crypto' },
      { id: 'encrypt', name: '文本加密/解密', description: 'AES、DES等对称加密算法', icon: 'ShieldCheck', path: '/tools/encrypt', category: 'crypto' },
      { id: 'hmac', name: 'HMAC生成器', description: '生成HMAC认证码', icon: 'Fingerprint', path: '/tools/hmac', category: 'crypto' },
      { id: 'rsa', name: 'RSA密钥对生成', description: '生成RSA公私钥对', icon: 'KeySquare', path: '/tools/rsa', category: 'crypto' },
    ]
  },
  {
    id: 'converters',
    name: '转换器工具',
    icon: 'ArrowLeftRight',
    tools: [
      { id: 'base64', name: 'Base64编码/解码', description: 'Base64格式编码和解码', icon: 'Binary', path: '/tools/base64', category: 'converters' },
      { id: 'datetime', name: '日期时间转换', description: '时间戳和日期格式转换', icon: 'Calendar', path: '/tools/datetime', category: 'converters' },
      { id: 'number-base', name: '进制转换', description: '二进制、八进制、十六进制转换', icon: 'Binary', path: '/tools/number-base', category: 'converters' },
      { id: 'color', name: '颜色转换', description: 'HEX、RGB、HSL颜色格式转换', icon: 'Palette', path: '/tools/color', category: 'converters' },
      { id: 'format', name: 'JSON/YAML/XML转换', description: '数据格式之间的转换', icon: 'FileCode', path: '/tools/format', category: 'converters' },
    ]
  },
  {
    id: 'web',
    name: 'Web工具',
    icon: 'Globe',
    tools: [
      { id: 'url', name: 'URL编码/解码', description: 'URL百分号编码和解码', icon: 'Link', path: '/tools/url', category: 'web' },
      { id: 'jwt', name: 'JWT解析器', description: '解析和验证JWT令牌', icon: 'Shield', path: '/tools/jwt', category: 'web' },
      { id: 'html-entities', name: 'HTML实体转义', description: 'HTML特殊字符编码和解码', icon: 'Code', path: '/tools/html-entities', category: 'web' },
      { id: 'otp', name: 'OTP代码生成', description: '生成一次性密码(OTP)', icon: 'Smartphone', path: '/tools/otp', category: 'web' },
      { id: 'user-agent', name: 'User-Agent解析', description: '解析浏览器User-Agent字符串', icon: 'Monitor', path: '/tools/user-agent', category: 'web' },
    ]
  },
  {
    id: 'dev',
    name: '开发工具',
    icon: 'Code2',
    tools: [
      { id: 'json-formatter', name: 'JSON格式化/压缩', description: '格式化和压缩JSON数据', icon: 'Braces', path: '/tools/json-formatter', category: 'dev' },
      { id: 'regex', name: '正则表达式测试', description: '测试和匹配正则表达式', icon: 'SearchCheck', path: '/tools/regex', category: 'dev' },
      { id: 'sql-formatter', name: 'SQL格式化', description: '格式化SQL查询语句', icon: 'Database', path: '/tools/sql-formatter', category: 'dev' },
      { id: 'crontab', name: 'Crontab生成器', description: '生成Cron定时任务表达式', icon: 'Clock', path: '/tools/crontab', category: 'dev' },

    ]
  },
  {
    id: 'text',
    name: '文本工具',
    icon: 'Type',
    tools: [
      { id: 'lorem-ipsum', name: 'Lorem ipsum生成', description: '生成占位文本', icon: 'FileText', path: '/tools/lorem-ipsum', category: 'text' },
      { id: 'text-stats', name: '文本统计', description: '统计字符、单词、行数等', icon: 'BarChart3', path: '/tools/text-stats', category: 'text' },
      { id: 'text-diff', name: '文本对比', description: '比较两段文本的差异', icon: 'Diff', path: '/tools/text-diff', category: 'text' },
      { id: 'case-converter', name: '大小写转换', description: '转换文本大小写格式', icon: 'CaseSensitive', path: '/tools/case-converter', category: 'text' },
    ]
  },
  {
    id: 'utilities',
    name: '实用工具',
    icon: 'Wrench',
    tools: [
      { id: 'qr-code', name: 'QR码生成', description: '生成二维码', icon: 'QrCode', path: '/tools/qr-code', category: 'utilities' },
      { id: 'wifi-qr', name: '二维码WiFi生成', description: '生成WiFi连接二维码', icon: 'Wifi', path: '/tools/wifi-qr', category: 'utilities' },

      { id: 'network', name: '网络工具', description: 'IP查询、端口检测等网络工具', icon: 'Network', path: '/tools/network', category: 'utilities' },
    ]
  },
]