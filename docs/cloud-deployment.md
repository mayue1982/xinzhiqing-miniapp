# 心之清文旅小程序云部署说明

## 云开发环境

- AppID: `wx7a9fae74aa32c0f3`
- 环境名称: `cloud1`
- 环境 ID: `cloud1-d1gs9gcgeeb3b347f`
- 报名通知邮箱: `MAYUE1982@163.COM`

## 数据库

在微信开发者工具的云开发控制台里创建集合：

- `orders`: 存储路线报名订单
- `requests`: 存储成长定制需求

路线报名提交后会写入云数据库 `orders`，成长定制提交后会写入云数据库 `requests`。如果云环境不可用，小程序会临时写入本地缓存，避免体验版中断。

## 必须部署的云函数

上线前至少部署以下云函数：

- `cloudfunctions/verifyAdmin`: 管理员登录验证
- `cloudfunctions/adminList`: 后台读取路线报名与成长定制列表
- `cloudfunctions/adminAction`: 后台确认、标记已联系、删除记录
- `cloudfunctions/submitRecord`: 用户提交路线报名与成长定制
- `cloudfunctions/myRecords`: 用户查看自己的报名订单和定制记录

其中 `verifyAdmin`、`adminList`、`adminAction` 都需要配置相同的环境变量：

- `ADMIN_USERNAME`: 管理员用户名
- `ADMIN_PASSWORD`: 管理员密码

管理员账号密码不要写入前端代码，也不要提交到 GitHub。

## 可选邮件云函数

邮件通知暂时可以不部署。后续需要邮件提醒时，再部署：

- `cloudfunctions/sendRequestEmail`

需要配置的环境变量：

- `SMTP_HOST`: 默认可用 `smtp.163.com`
- `SMTP_PORT`: 默认 `465`
- `SMTP_USER`: 163 发件邮箱账号
- `SMTP_PASS`: 163 邮箱 SMTP 授权码
- `ADMIN_EMAIL`: `MAYUE1982@163.COM`

没有配置 SMTP 时，报名仍会正常入库，只是邮件通知会跳过。

## 隐藏管理入口

进入“我的”页面，连续点击顶部个人信息卡片 5 次，即可进入隐藏管理页。输入管理员账号密码后，可查看路线报名和成长定制列表，并进行确认、删除、复制电话、拨号、标记已联系等操作。
