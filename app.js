const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const cors = require('koa2-cors');
const views = require('koa-views');
const path = require('path');
require('dotenv').config();

const userRouter = require('./routes/user');
const app = new Koa();
const PORT = process.env.APP_PORT || 3000;

// 1. 跨域配置
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type']
}));

// 2. 模板引擎配置
app.use(views(path.join(__dirname, 'views'), {
  extension: 'ejs',
  options: { siteName: 'My Koa App' }
}));

// 3. 静态文件托管（可选，注释也不影响）
// const staticDir = path.join(__dirname, 'static');
// app.use(static(staticDir));

// 4. 解析请求体
app.use(bodyParser());

// 🌟 关键调整：把 SSR 页面路由移到 API 路由之前！
// 6. 服务端渲染页面路由（先处理页面路径）
app.use(async (ctx, next) => {
  if (ctx.path === '/' || ctx.path.startsWith('/page/')) {
    console.log(`📄 尝试渲染页面: ${ctx.path}`);

    try {
      if (ctx.path === '/') {
        console.log('🔄 开始渲染首页...');
        // 渲染首页时添加 currentTime 数据
        await ctx.render('index', {
          title: '首页 - Koa SSR示例',
          message: '这是通过服务端渲染的首页',
          userList: ['用户A', '用户B', '用户C'],
         currentTime: new Date().toLocaleString('zh-CN')// 补充当前时间变量
        });
        console.log('✅ 首页渲染成功');
        return;
      } else if (ctx.path === '/page/user') {
        console.log('🔄 开始渲染用户页...');
        await ctx.render('user', {
          title: '用户中心',
          username: '访客'
        });
        console.log('✅ 用户页渲染成功');
        return;
      }
    } catch (error) {
      console.error('❌ 页面渲染失败:', error);
      console.error('错误堆栈:', error.stack);
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: '页面渲染失败',
        error: error.message // 开发环境下显示具体错误
      };
      return;
    }
  }

  await next();
});

// 5. API路由（后处理接口路径）
app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

// 7. 全局错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404) {
      ctx.body = { code: 404, message: '接口不存在' };
    }
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = {
      code: ctx.status,
      message: error.message || '服务器内部错误',
    };
  }
});

app.listen(PORT, () => {
  console.log(`🚀 服务器已启动：http://localhost:${PORT}`);
  console.log(`🌐 SSR页面：http://localhost:${PORT} (首页)、http://localhost:${PORT}/page/user (用户页)`);
  console.log(`🔌 API接口：http://localhost:${PORT}/users`);
});