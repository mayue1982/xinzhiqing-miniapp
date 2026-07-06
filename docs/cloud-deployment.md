# 心之清文旅小程序云部署说明

## 云开发环境

- AppID: `wx7a9fae74aa32c0f3`
- 环境名称: `cloud1`
- 环境 ID: `cloud1-d1gs9gcgeeb3b347f`
- 报名通知邮箱: `MAYUE1982@163.COM`

## 数据库

在微信开发者工具的云开发控制台里创建集合：

- `requests`: 存储成长定制报名需求

报名提交后会优先写入云数据库 `requests`；如果云环境不可用，会临时写入本地缓存，避免体验版中断。

## 邮件云函数

云函数目录：

- `cloudfunctions/sendRequestEmail`

需要在云函数环境变量里配置：

- `SMTP_HOST`: 默认可用 `smtp.163.com`
- `SMTP_PORT`: 默认 `465`
- `SMTP_USER`: 163 发件邮箱账号
- `SMTP_PASS`: 163 邮箱 SMTP 授权码
- `ADMIN_EMAIL`: `MAYUE1982@163.COM`

没有配置 SMTP 时，报名仍会正常入库，只是邮件通知会跳过。

## 隐藏管理入口

进入 `我的` 页面，连续点击顶部个人信息卡片 5 次，即可进入隐藏管理页。
