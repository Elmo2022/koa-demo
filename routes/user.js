const Router = require('koa-router');
const User = require('../models/user');
const router = new Router({ prefix: '/users' }); // 路由前缀：所有接口都以/users开头

// 1. 查：获取所有用户
router.get('/', async (ctx) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'age', 'created_at'] // 只返回需要的字段
    });
    ctx.body = {
      code: 200,
      data: users,
      message: '获取成功'
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '获取失败',
      error: error.message
    };
  }
});

// 2. 查：获取单个用户（按ID）
router.get('/:id', async (ctx) => {
  try {
    const user = await User.findByPk(ctx.params.id);
    if (!user) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '用户不存在' };
      return;
    }
    ctx.body = {
      code: 200,
      data: user,
      message: '获取成功'
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '获取失败',
      error: error.message
    };
  }
});

// 3. 增：创建用户
router.post('/', async (ctx) => {
  try {
    const user = await User.create(ctx.request.body);
    ctx.status = 201; // 201表示创建成功
    ctx.body = {
      code: 201,
      data: user,
      message: '创建成功'
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: '创建失败',
      error: error.message
    };
  }
});

// 4. 改：更新用户
router.put('/:id', async (ctx) => {
  try {
    const userId = ctx.params.id;
    // 先检查用户是否存在
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '用户不存在' };
      return;
    }
    // 更新用户数据
    await User.update(ctx.request.body, { where: { id: userId } });
    // 返回更新后的用户信息
    const updatedUser = await User.findByPk(userId);
    ctx.body = {
      code: 200,
      data: updatedUser,
      message: '更新成功'
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      message: '更新失败',
      error: error.message
    };
  }
});

// 5. 删：删除用户
router.delete('/:id', async (ctx) => {
  try {
    const userId = ctx.params.id;
    const user = await User.findByPk(userId);
    if (!user) {
      ctx.status = 404;
      ctx.body = { code: 404, message: '用户不存在' };
      return;
    }
    await User.destroy({ where: { id: userId } });
    ctx.body = {
      code: 200,
      message: '删除成功'
    };
  } catch (error) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '删除失败',
      error: error.message
    };
  }
});

module.exports = router;
    