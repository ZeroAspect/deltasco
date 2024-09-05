const { Sequelize, DataTypes } = require("sequelize");
const db = require("../mysql/sequelize.js");

const User = db.define("Users", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nome: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false
  },
  senha: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  descricao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ip: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

module.exports = User