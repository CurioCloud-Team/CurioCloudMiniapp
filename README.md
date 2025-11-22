# CurioCloud 微信小程序

CurioCloud 教师备课平台的小程序版本，覆盖登录、教学设计、教案与 PPT 管理、习题助手、学情分析等核心能力。

## 快速开始
1. 安装依赖
   ```pwsh
   cd wechat-miniprogram
   npm install
   ```
2. 构建 TS（可选，微信开发者工具也可自动编译）
   ```pwsh
   npm run build
   ```
3. 打开微信开发者工具，选择 “导入项目”，目录指向 `wechat-miniprogram`，AppID 填入真实项目。
4. 在开发者工具中配置 **本地设置 → 不校验合法域名** 方便本地 API 调试。

## 目录
- `miniprogram/`：小程序源码（App、页面、组件、服务）。
- `project.config.json`：项目配置。
- `tsconfig.json`：TypeScript 选项。
- `docs/miniprogram/ARCHITECTURE.md`：整体设计说明。

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
