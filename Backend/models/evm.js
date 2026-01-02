"use strict";
const { DataTypes } = require('sequelize');
module.exports = (sequelize, type) => {
  const evms = sequelize.define('evms', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    issue_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vote: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  }, {
    tableName: 'evms',
    timestamps: true
  });

  evms.associate = function (models) {
    // associations can be defined here
  };
  return evms;
};
