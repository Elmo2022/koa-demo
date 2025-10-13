const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// 定义用户模型（对应数据库中的users表）
const User = sequelize.define('User', {
  // id会自动创建（自增主键）
  username: {
    type: DataTypes.STRING(50),  // 字符串类型，最大长度50
    allowNull: false,            // 不允许为空
    unique: true,                // 唯一（不可重复）
    comment: '用户名'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true  // 验证邮箱格式
    },
    comment: '邮箱'
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,  // 允许为空
    validate: {
      min: 0,         // 最小年龄0
      max: 150        // 最大年龄150
    },
    comment: '年龄'
  }
}, {
  tableName: 'users',        // 数据库表名
  timestamps: true,          // 自动添加createdAt（创建时间）和updatedAt（更新时间）
  paranoid: true,            // 软删除（添加deletedAt字段，不会真正删除数据）
  underscored: true          // 使用下划线命名法（如created_at）
});

// 同步模型到数据库（开发环境使用，会自动创建/更新表结构）
User.sync({ alter: true })
  .then(() => console.log('✅ 用户表同步成功'))
  .catch(err => console.error('❌ 用户表同步失败:', err.message));

module.exports = User;
    