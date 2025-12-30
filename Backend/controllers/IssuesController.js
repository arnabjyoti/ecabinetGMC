const async = require("async");
const usersModel = require("../models").users;
const issuesModel = require("../models").issues;
const attachmentsModel = require("../models").attachments;
const commentsModel = require("../models").comments;
var request = require("request");
const Op = require("sequelize").Op;
const jwt = require("jsonwebtoken");
const env = "development";
const config = require("../config/config.json")[env];
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const user = JSON.parse(req.body.user);
    const issue = JSON.parse(req.body.issue);
    let dest = path.join(
      path.join(config.FILE_UPLOAD_PATH, user.userId.toString()),
      issue.id.toString()
    );
    module.exports.checkDirectory(dest, () => {
      callback(null, dest);
    });
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG or PDF allowed"));
  }
  cb(null, true);
};

module.exports = {
  getIssueList(req, res) {
    const department = req.body.requestObject.department;
    const role = req.body.requestObject.role;
    let whereClause = {
      isDeleted: false,
      status: {
        [Op.ne]: "Completed",
      },
    };
    if (role === "branch_user" && department) {
      whereClause.department = department;
    }
    if (role === "municipal_secretary") {
      whereClause.branchAction = "Sent";
    }
    if (role === "commissioner") {
      whereClause.branchAction = "Sent";
      whereClause.municipalAction = "Approved";
    }
    return issuesModel
      .findAll({
        where: whereClause,
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
  getVotingReadyIssueList(req, res) {
    const department = req.body.requestObject.department;
    const role = req.body.requestObject.role;
    let whereClause = {
      isDeleted: false,
      status: {
        [Op.ne]: "Completed",
      },
    };
    // if (role === "branch_user" && department) {
    //   whereClause.department = department;
    // }
    whereClause.branchAction = "Sent";
    whereClause.municipalAction = "Approved";
    whereClause.commissionerAction = "Approved";
    whereClause.voting = "Started";
    return issuesModel
      .findAll({
        where: whereClause,
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
  createIssue(req, res) {
    let requestObject = req.body.requestObject;
    if (
      !requestObject.title ||
      !requestObject.ward ||
      !requestObject.location ||
      !requestObject.description ||
      !requestObject.department ||
      !requestObject.userId
    ) {
      return res.status(200).send({
        status: false,
        message: "Unable to create issue. Please check input values provided",
      });
    }

    const newIssue = {
      title: requestObject?.title,
      description: requestObject?.description,
      department: requestObject?.department,
      ward: requestObject?.ward,
      location: requestObject?.location,
      raisedByName: requestObject.userName,
      raisedBy: requestObject.userId,
      branchAction: "Draft",
      branchActionDate: "",
      municipalAction: "",
      municipalActionDate: "",
      municipalActionRemarks: "",
      municipalUserId: "",
      commissionerAction: "",
      commissionerActionDate: "",
      commissionerActionRemarks: "",
      commissionerUserId: "",
      voting: "",
      votingDate: "",
      status: "Pending",
      isDeleted: false,
    };
    issuesModel.create(newIssue).then((r) => {
      return res.status(200).send({
        status: true,
        message: "Success! New issue has been registered successfully",
      });
    });
  },
  async updateIssue(req, res) {
    let requestObject = req.body.requestObject;
    if (!requestObject.user || !requestObject.issue) {
      return res.status(200).send({
        status: false,
        message: "Unable to update issue. Please check the values provided",
      });
    }
    try {
      const id = requestObject.issue.id;
      const issue = await issuesModel.findByPk(id);
      if (!issue) {
        return res
          .status(404)
          .json({ status: false, message: "Issue not found" });
      }
      let msg = "Success";
      switch (requestObject.user.role) {
        case "branch_user":
          issue.branchAction = "Sent";
          issue.branchActionDate = new Date();
          msg = "Issue successfully sent to Municipal Secretary.";
          break;
        case "municipal_secretary":
          if (requestObject.action.status == "Positive") {
            issue.municipalAction = "Approved";
            msg = "Issue successfully forwarded to Commissioner.";
          }
          if (requestObject.action.status == "Negative") {
            issue.municipalAction = "Rejected";
            issue.municipalActionRemarks = requestObject?.action?.remarks;
            issue.status = "Rejected";
            msg = "Issue has been rejected.";
          }
          issue.municipalActionDate = new Date();
          issue.municipalUserId = requestObject.user.userId;
          break;
        case "commissioner":
          if (requestObject.action.status == "Positive") {
            issue.commissionerAction = "Approved";
            msg = "Issue has been approved for MIC meeting.";
          }
          if (requestObject.action.status == "Negative") {
            issue.commissionerAction = "Rejected";
            issue.commissionerActionRemarks = requestObject?.action?.remarks;
            issue.status = "Rejected";
            msg = "Issue has been rejected.";
          }
          issue.commissionerActionDate = new Date();
          issue.commissionerUserId = requestObject.user.userId;
          break;
      }
      await issue.save();
      return res.status(200).send({
        status: true,
        message: msg,
      });
    } catch (error) {
      console.error("Error updating issue:", error);
      return res.status(500).send({ status: false, message: error });
    }
  },
  upload_config: multer({ storage, fileFilter }),
  checkDirectory(directory, callback) {
    console.log("DIRECTORY:", directory);
    fs.stat(directory, (err, stats) => {
      // Directory does NOT exist
      if (err) {
        // Create multi-level directory
        fs.mkdir(directory, { recursive: true }, (mkErr) => {
          if (mkErr) {
            console.error("Directory creation failed:", mkErr);
            return callback && callback(mkErr);
          }
          return callback && callback();
        });
      } else {
        // Directory already exists
        return callback && callback();
      }
    });
  },
  saveIssueAttachmentData(req, res) {
    try {
      const issue = JSON.parse(req.body.issue);
      const user = JSON.parse(req.body.user);
      const doc_path =
        user.userId + "/" + issue.id + "/" + req.file.originalname;
      const newAttachment = {
        issue_id: issue?.id,
        doc_name: req.file.originalname,
        doc_type: req.file.mimetype,
        doc_size: req.file.size,
        doc_path: doc_path,
        uploadedBy: user.userId,
        status: "Active",
        isDeleted: false,
      };
      attachmentsModel.create(newAttachment).then((r) => {
        return res.status(200).send({
          status: true,
          message: "Attachment uploaded successfully",
        });
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Error while uploading issue attachment",
        error: err.message,
      });
    }
  },
  getIssueAttachments(req, res) {
    const issueId = req.body.requestObject.issueId;
    let whereClause = {
      issue_id: issueId,
      isDeleted: false,
      status: "Active",
    };
    return attachmentsModel
      .findAll({
        where: whereClause,
      })
      .then((docs) => {
        return res
          .status(200)
          .send({ status: true, data: docs, message: "Success" });
      })
      .catch((error) => {
        console.log(error);
        return res
          .status(500)
          .send({ status: false, data: [], message: error });
      });
  },
  async updateVotingStatus(req, res) {
    let requestObject = req.body.requestObject;
    if (!requestObject.user || !requestObject.issue) {
      return res.status(200).send({
        status: false,
        message: "Unable to update issue. Please check the values provided",
      });
    }
    try {
      const id = requestObject.issue.id;
      const issue = await issuesModel.findByPk(id);
      if (!issue) {
        return res
          .status(404)
          .json({ status: false, message: "Issue not found" });
      }
      issue.voting = "Started";
      issue.votingDate = new Date();
      await issue.save();
      return res.status(200).send({
        status: true,
        message: "Voting started successfully",
      });
    } catch (error) {
      console.error("Error updating issue:", error);
      return res.status(500).send({ status: false, message: error });
    }
  },

  async addComment(req, res) {
    let requestObject = req.body.requestObject;
    if (!requestObject.user || !requestObject.issue) {
      return res.status(200).send({
        status: false,
        message: "Unable to update issue. Please check the values provided",
      });
    }
    try {
      const id = requestObject.issue.id;
      const issue = await issuesModel.findByPk(id);
      if (!issue) {
        return res
          .status(404)
          .json({ status: false, message: "Issue not found" });
      }

      // commentsModel.create({
      //   issueId: id,
      //   userId: requestObject.user.userId,
      //   comment: requestObject.comment
      // })

      let obj = {
        // issueId: id,
        commentByName: requestObject.user.name,
        commentByRole: requestObject.user.role,
        commentBy: requestObject.user.userId,
        issue_id: id,
        comment: requestObject.comment,
        status: "Active",
        isDeleted: false,
      };

      commentsModel.create(obj).then((r) => {
        return res.status(200).send({
          status: true,
          message: "Comment added successfully",
        });
      });
      // issue.comments = requestObject.comments;
      // await issue.save();
    } catch (error) {
      console.error("Error updating issue:", error);
      return res.status(500).send({ status: false, message: error });
    }
  },

  async getAllComments(req, res) {
    let requestObject = req.body.requestObject;
    if (!requestObject.user || !requestObject.issue) {
      return res.status(200).send({
        status: false,
        message: "Unable to update issue. Please check the values provided",
      });
    }
    try {
      const id = requestObject.issue.id;
      const issue = await issuesModel.findByPk(id);
      if (!issue) {
        return res
          .status(404)
          .json({ status: false, message: "Issue not found" });
      }
      const comments = await commentsModel.findAll({
        where: {
          issue_id: id,
          status: "Active",
          isDeleted: false,
        },
      });
      return res.status(200).send({
        status: true,
        data: comments,
        message: "Success",
      });
    } catch (error) {
      console.error("Error updating issue:", error);
      return res.status(500).send({ status: false, message: error });
    }
  },
};
