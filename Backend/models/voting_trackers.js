"use strict";
const { DataTypes } = require('sequelize');
module.exports = (sequelize, type) => {
  const voting_trackers = sequelize.define('voting_trackers', {
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
    total_voter: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    vote_polled: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    accepted: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rejected: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    abstained: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    voting_status: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    record_status: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    }
  }, {
    tableName: 'voting_trackers',
    timestamps: true
  });

  voting_trackers.associate = function (models) {
    // associations can be defined here
  };
  return voting_trackers;
};
