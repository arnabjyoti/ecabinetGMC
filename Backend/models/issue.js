"use strict";
const { DataTypes } = require('sequelize');
module.exports = (sequelize, type) => {
  const issues = sequelize.define('issues', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title:{
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description:{
      type: DataTypes.TEXT,
      allowNull: true,
    },
    department:{
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ward:{
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    location:{
      type: DataTypes.STRING(50),
      allowNull: true,
    }, 
    raisedByName:{
      type: DataTypes.STRING(50),
      allowNull: true,
    },   
    raisedBy:{
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    branchAction:{
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    branchActionDate:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    municipalAction:{
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    municipalActionDate:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    municipalActionRemarks:{
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    municipalUserId:{
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    commissionerAction:{
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    commissionerActionDate:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    commissionerActionRemarks:{
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    commissionerUserId:{
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    mayorAction:{
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    mayorActionDate:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    mayorActionRemarks:{
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    mayorUserId:{
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    voting:{
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    votingDate:{
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    finalStatus: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  }, {
    tableName: 'issues',
    timestamps: true
  });

  issues.associate = function (models) {
    // associations can be defined here
  };
  return issues;
};
