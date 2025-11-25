# CurioCloud 微信小程序

CurioCloud 教师备课平台的小程序版本，覆盖登录、教学设计、教案与 PPT 管理、习题助手、学情分析等核心能力。

## 快速开始

1. 安装依赖
   ```pwsh
   npm install
   ```

2. 构建项目
   ```pwsh
   npm run build
   ```

3. 打开微信开发者工具，选择 "导入项目"，目录指向项目根目录，AppID 填入真实项目。

4. 在开发者工具中点击 **工具 → 构建 npm**，生成 `miniprogram_npm`。

5. 在开发者工具中配置 **本地设置 → 不校验合法域名** 方便本地 API 调试。

## 目录结构

```
├── miniprogram/          # 小程序源码
│   ├── components/       # 公共组件
│   ├── pages/            # 页面
│   ├── services/         # API 服务
│   ├── store/            # 状态管理
│   ├── types/            # 类型定义
│   └── utils/            # 工具函数
├── dist/                 # 编译输出目录
│   └── miniprogram_npm/  # 微信构建 npm 包
├── scripts/              # 构建脚本
├── project.config.json   # 项目配置
├── tsconfig.json         # TypeScript 配置（生产构建）
└── tsconfig.dev.json     # TypeScript 配置（开发模式）
```

## NPM 脚本

| 命令 | 说明 |
|------|------|
| `npm run build` | 生产构建：清理 dist → 复制资源文件 → 编译 TypeScript |
| `npm run dev` | 开发模式：启用 sourcemap，监听文件变化自动编译 |
| `npm run clean` | 仅清理 dist 目录（保留 `miniprogram_npm` 和 `.gitkeep`） |
| `npm run lint` | TypeScript 类型检查 |

> **注意**：`clean` 和 `build` 命令会保留 `dist/miniprogram_npm` 文件夹，避免每次构建后需要重新在微信开发者工具中点击"构建 npm"。

## 环境变量

`miniprogram/utils/env.ts` 会根据运行环境（develop / trial / release）计算 API 地址，也可在 `app.json` 的 `customConfig` 中覆盖：

```json
{
  "customConfig": {
    "API_BASE_URL": "https://api.curiocloud.cn",
    "LANDPPT_API_BASE_URL": "https://ppt.curiocloud.cn"
  }
}
```

## 代码质量

- `npm run lint`：仅做类型检查。
- 建议在微信开发者工具中启用 **严格模式 / ESLint** 以保持代码质量。

## 后续工作

- 接入 `miniprogram-ci` 以实现自动化上传。
- 可拆分业务包（subPackages）提升首屏性能。
