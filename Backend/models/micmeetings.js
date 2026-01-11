"use strict";
const { DataTypes } = require('sequelize');
module.exports = (sequelize, type) => {
  const micmeetings = sequelize.define('micmeetings', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    meeting:{
      type: DataTypes.TEXT,
      allowNull: true,
    },
    issues:{
      type: DataTypes.TEXT,
      allowNull: true,
    }, 
    meetingDate:{
      type: DataTypes.DATE,
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
    tableName: 'micmeetings',
    timestamps: true
  });

  micmeetings.associate = function (models) {
    // associations can be defined here
  };
  return micmeetings;
};
