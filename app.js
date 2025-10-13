const Koa = require('koa');
const bodyParser = require('koa-bodyparser'); // 解析请求体
const static = require('koa-static'); // 托管静态文件
const cors = require('koa2-cors'); // 处理跨域
const path = require('path');
require('dotenv').config(); // 加载环境变量

// 导入路由
const userRouter = require('./routes/user');

// 创建Koa应用
const app = new Koa();
const PORT = process.env.APP_PORT || 3000;

// 1. 跨域配置（允许前端访问）
app.use(cors({
  origin: '*', // 开发环境允许所有来源（生产环境需指定具体域名）
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的HTTP方法
  allowHeaders: ['Content-Type'] // 允许的请求头
}));

// 2. 静态文件托管（前端HTML页面）
const staticDir = path.join(__dirname, 'static'); // 静态文件目录
app.use(static(staticDir));

// 3. 解析请求体（必须在路由之前）
app.use(bodyParser());

// 4. 注册路由
app.use(userRouter.routes());
app.use(userRouter.allowedMethods()); // 处理405（方法不允许）和501（未实现）错误

// 5. 全局错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next(); // 执行后续中间件
    // 处理404
    if (ctx.status === 404) {
      ctx.body = { code: 404, message: '接口不存在' };
    }
  } catch (error) {
    // 捕获所有异常
    ctx.status = error.status || 500;
    ctx.body = {
      code: ctx.status,
      message: error.message || '服务器内部错误',
    };
  }
});

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 服务器已启动：http://localhost:${PORT}`);
  console.log(`📱 前端页面：http://localhost:${PORT}`);
  console.log(`🔌 API接口：http://localhost:${PORT}/users`);
});
    