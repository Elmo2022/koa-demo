const { Sequelize } = require('sequelize');
require('dotenv').config();

// 创建数据库连接
const sequelize = new Sequelize(
  process.env.DB_NAME,       // 数据库名
  process.env.DB_USER,       // 用户名
  process.env.DB_PASSWORD,   // 密码
  {
    host: process.env.DB_HOST,   // 主机地址
    port: process.env.DB_PORT,   // 端口
    dialect: 'mysql',            // 数据库类型
    logging: false,              // 关闭SQL日志（开发时可设为console.log调试）
    pool: {
      max: 5,    // 连接池最大连接数
      min: 0,
      acquire: 30000,  // 超时时间（毫秒）
      idle: 10000      // 空闲时间（毫秒）
    }
  }
);

// 测试数据库连接
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    process.exit(1); // 连接失败则退出程序
  }
}

// 初始化数据库（创建数据库和表）
async function initDB() {
  try {
    // 创建数据库（如果不存在）
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, {
      type: Sequelize.QueryTypes.CREATE
    });
    console.log('✅ 数据库初始化成功');
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error.message);
  }
}

// 执行初始化
testConnection();
initDB();

module.exports = sequelize;
    