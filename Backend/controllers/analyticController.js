"use strict";
const usersModel = require("../models").users;
const issuesModel = require("../models").issues;
const attachmentsModel = require("../models").attachments;
const votingTrackersModel = require("../models").voting_trackers;
const evmModel = require("../models").evms;
const commentsModel = require("../models").comments;
var request = require("request");
const nodemailer = require("nodemailer");
const { Op, fn, col, literal } = require("sequelize");

module.exports = {
  getCounts(req, res) {
    const role = req.body.requestObject.role;
    const userId = req.body.requestObject.userId;

    // Base condition
    let baseWhere = {
      isDeleted: false,
    };

    // If branch_user, restrict by raisedBy
    if (role === "branch_user") {
      baseWhere.raisedBy = userId;
    }

    Promise.all([
      // All issues
      issuesModel.count({
        where: baseWhere,
      }),

      // Accepted
      issuesModel.count({
        where: {
          ...baseWhere,
          status: "Accepted",
        },
      }),

      // Pending
      issuesModel.count({
        where: {
          ...baseWhere,
          status: "Pending",
        },
      }),

      // Deferred
      issuesModel.count({
        where: {
          ...baseWhere,
          status: "Deferred",
        },
      }),

      // Rejected
      issuesModel.count({
        where: {
          ...baseWhere,
          status: "Rejected",
        },
      }),
    ])
      .then(([all, accepted, pending, deferred, rejected]) => {
        return res.status(200).send({
          status: true,
          data: {
            all,
            accepted,
            pending,
            deferred,
            rejected,
          },
          message: "Success",
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send({
          status: false,
          data: {},
          message: error.message || "Server Error",
        });
      });
  },

  async getMonthlyIssuesChart(req, res) {
    try {
      const { role, userId } = req.body.requestObject;

      // ================== BUILD LAST 12 MONTHS ==================
      const months = [];
      const monthMap = {};

      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);

        const year = d.getFullYear();
        const month = d.getMonth() + 1; // 1–12
        const label = d.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });

        months.push({ year, month, label });

        // Initialize with 0
        monthMap[`${year}-${month}`] = {
          label,
          total: 0,
          accepted: 0,
          rejected: 0,
        };
      }

      // ================== BASE WHERE ==================
      let whereClause = `
        isDeleted = 0
        AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
      `;

      if (role === "branch_user") {
        whereClause += ` AND raisedBy = '${userId}'`;
      }

      // ================== QUERY ==================
      const query = `
        SELECT
          YEAR(createdAt) AS year,
          MONTH(createdAt) AS month,
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'Accepted' THEN 1 ELSE 0 END) AS accepted,
          SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) AS rejected
        FROM issues
        WHERE ${whereClause}
        GROUP BY YEAR(createdAt), MONTH(createdAt)
      `;

      const rows = await issuesModel.sequelize.query(query, {
        type: issuesModel.sequelize.QueryTypes.SELECT,
      });

      // ================== MERGE DB DATA ==================
      rows.forEach((row) => {
        const key = `${row.year}-${row.month}`;
        if (monthMap[key]) {
          monthMap[key].total = Number(row.total);
          monthMap[key].accepted = Number(row.accepted);
          monthMap[key].rejected = Number(row.rejected);
        }
      });

      // ================== FINAL CHART ARRAYS ==================
      const labels = [];
      const allIssues = [];
      const acceptedIssues = [];
      const rejectedIssues = [];

      months.forEach((m) => {
        const data = monthMap[`${m.year}-${m.month}`];
        labels.push(data.label);
        allIssues.push(data.total);
        acceptedIssues.push(data.accepted);
        rejectedIssues.push(data.rejected);
      });

      const data = {
        labels,
        datasets: [
          { label: "All Issues", data: allIssues },
          { label: "Accepted Issues", data: acceptedIssues },
          { label: "Rejected Issues", data: rejectedIssues },
        ],
      };

    //   console.log("data ", JSON.stringify(data));

      // ================== RESPONSE ==================
      return res.status(200).json({
        status: true,
        data: {
          labels,
          datasets: [
            { label: "All Issues", data: allIssues },
            { label: "Accepted Issues", data: acceptedIssues },
            { label: "Rejected Issues", data: rejectedIssues },
          ],
        },
        message: "Success",
      });
    } catch (error) {
      console.error("Monthly Issues Chart Error:", error);
      return res.status(500).json({
        status: false,
        message: error.message || "Server Error",
      });
    }
  },


  getRecentIssues(req, res) {
    const department = req.body.requestObject.department;
    const role = req.body.requestObject.role;
    let whereClause = {
      isDeleted: false,
    //   status: {
    //     [Op.ne]: "Completed",
    //   },
    };
    if (role === "branch_user" && department) {
      whereClause.department = department;
    }
    return issuesModel
      .findAll({
        where: whereClause,
        limit: 5,
        order: [["createdAt", "DESC"]],
      })
      .then((issues) => {
        return res
          .status(200)
          .send({ status: true, data: issues, message: "Success" });
      })
      .catch((error) => {
        console.log(error);
        return res
          .status(500)
          .send({ status: false, data: [], message: error });
      });
  },
};
