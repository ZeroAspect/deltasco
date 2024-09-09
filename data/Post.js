const { DataTypes } = require("sequelize");
const db = require("../mysql/sequelize.js");

const Post = db.define("Posts", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  titulo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fonte: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  post_likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
})

module.exports = Post;