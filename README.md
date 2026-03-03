# HowToRise Platform (Next.js + SQLite)

本项目已从纯静态站重构为：
- 前台：Next.js App Router（`/zh`、`/en`）
- 后台：`/admin` 内容管理 + 媒体管理 + 统计看板
- 数据层：SQLite（本地文件持久化，位于 `prisma/dev.db`）
- 去重：数据库时间窗去重（无需 Redis）

## 1. 快速启动

### 本地开发
1. 无需额外数据库服务（使用本地 SQLite 文件）
2. `npm install`
3. `cp .env.example .env` 并填好连接串
4. `npm run db:generate`
5. `npm run db:migrate`
6. `npm run db:seed-admin`
7. `npm run migrate:legacy`
8. `npm run dev`

## 2. 环境变量
- `DATABASE_URL`：SQLite 文件路径（默认 `file:./prisma/dev.db`）
- `APP_BASE_URL`：站点基础地址（sitemap/canonical）
- `SESSION_SECRET`：会话密钥
- `ADMIN_DEFAULT_EMAIL` / `ADMIN_DEFAULT_PASSWORD`：管理员初始账号
- `ANALYTICS_RAW_RETENTION_DAYS`：raw 事件保留天数（默认 90）

## 3. 内容发布与缓存策略
- 首页、教程列表、教程详情采用 `revalidate=300` + cache tags。
- 匿名请求响应头：
  - `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400`
- Admin 发布/更新教程时触发：
  - `tutorial:{slug}:{locale}`
  - `tutorial-list:{locale}`
  - `home:{locale}`

## 4. 统计口径说明
- `page_view`：页面访问事件（含 path/locale/referrer/utm/session）
- `tutorial_view`：教程详情进入事件（含 tutorialSlug）
- `duration`：停留时长事件（`sendBeacon` 上报秒数）

### PV/UV 定义
- PV：`page_view` 事件条数
- UV：时间窗口内 `session_id` 去重后的数量

### 停留时长定义
- 平均停留：`duration` 事件的 `durationSec` 平均值
- 上报时机：`beforeunload` + `visibilitychange(hidden)`

### 去重与数据质量
- 去重窗口：`session + eventType + path (+tutorialSlug)` 30 秒
- 机器人识别：UA 规则（bot/spider/crawler/curl 等）打标 `is_bot`
- 去重实现：基于数据库查询窗口，不依赖 Redis

### 保留策略
- `analytics_raw_events`：短期保留（默认 90 天）
- 聚合表：`analytics_aggregates_hourly` / `analytics_aggregates_daily` 长期保留
- 聚合任务：`npm run analytics:aggregate`

## 5. 旧内容迁移
- 输入源：`tutorials.json`、`tutorials/*.md`、`tutorials/zh/*.md`
- 命令：`npm run migrate:legacy`
- 迁移后：
  - tutorial slug 继承旧 `id`
  - 分类按 section 建立
  - 中英文正文进入 `tutorial_translations`

## 6. URL 与 SEO
- i18n 路由：`/zh/...`、`/en/...`
- 旧路径 301：
  - `/tutorials/:slug.md` -> `/en/tutorials/:slug`
  - `/tutorials/zh/:slug.md` -> `/zh/tutorials/:slug`
- 生成 sitemap：`/sitemap.xml`
- 页面 metadata 包含 canonical + hreflang

## 7. 可观测性（最小可行）
- 前端：`window.onerror`、`unhandledrejection` 上报到 `/api/errors/report`
- 后端：API 异常返回规范错误码，可扩展写入 `error_events`

## 8. 测试与质量命令
- `npm run test`：基础测试
- `npm run lint`
- `npm run typecheck`
- `npm run build`
