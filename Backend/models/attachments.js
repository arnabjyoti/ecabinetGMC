"use strict";
const { DataTypes } = require('sequelize');
module.exports = (sequelize, type) => {
  const attachments = sequelize.define('attachments', {
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
    doc_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    doc_type: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    doc_size: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    doc_path: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    uploadedBy: {
      type: DataTypes.STRING(10),
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
    tableName: 'attachments',
    timestamps: true
  });

  attachments.associate = function (models) {
    // associations can be defined here
  };
  return attachments;
};
