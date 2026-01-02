"use strict";
const { DataTypes } = require("sequelize");
module.exports = (sequelize, type) => {
  const comments = sequelize.define(
    "comments",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      commentByName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      commentByRole: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      commentBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      issue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    //   commentDate: {
    //     type: DataTypes.DATE,
    //     allowNull: true,
    //   },
    //   commentTime: {
    //     type: DataTypes.TIME,
    //     allowNull: true,
    //   },

      status: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      tableName: "comments",
      timestamps: true,
    }
  );

  comments.associate = function (models) {
    // associations can be defined here
  };
  return comments;
};
