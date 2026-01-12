const async = require("async");
const usersModel = require("../models").users;
const issuesModel = require("../models").issues;
const attachmentsModel = require("../models").attachments;
const votingTrackersModel = require("../models").voting_trackers;
const evmModel = require("../models").evms;
const commentsModel = require("../models").comments;
const micMeetingModel = require("../models").micmeetings;
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

const getRoleName = (role) => {
  let userRole = "";
  switch (role) {
    case "branch_user":
      userRole = "Branch User";
      break;
    case "municipal_secretary":
      userRole = "Municipal Secretary";
      break;
    case "commissioner":
      userRole = "Commissioner";
      break;
  }
  return userRole;
};

module.exports = {
  getIssueList(req, res) {
    const department = req.body.requestObject.department;
    const role = req.body.requestObject.role;
    let whereClause = {
      isDeleted: false,
      finalStatus: {
        [Op.notIn]: ["Accepted", "Rejected"],
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
    if (role === "mayor") {
      whereClause.branchAction = "Sent";
      whereClause.municipalAction = "Approved";
      whereClause.commissionerAction = "Approved";
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
      branchActionDate: null,
      municipalAction: "",
      municipalActionDate: null,
      municipalActionRemarks: "",
      municipalUserId: "",
      commissionerAction: "",
      commissionerActionDate: null,
      commissionerActionRemarks: "",
      commissionerUserId: "",
      mayorAction: "",
      mayorActionDate: null,
      mayorActionRemarks: "",
      mayorUserId: "",
      voting: "",
      votingDate: null,
      status: "Pending",
      finalStatus: "Pending",
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
            msg = "Issue successfully forwarded to Mayor.";
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
        case "mayor":
          if (requestObject.action.status == "Positive") {
            issue.mayorAction = "Approved";
            msg = "Issue has been approved for MIC meeting.";
          }
          if (requestObject.action.status == "Negative") {
            issue.mayorAction = "Rejected";
            issue.mayorActionRemarks = requestObject?.action?.remarks;
            issue.status = "Rejected";
            msg = "Issue has been rejected.";
          }
          issue.mayorActionDate = new Date();
          issue.mayorUserId = requestObject.user.userId;
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
  async deferredIssue(req, res) {
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
        case "commissioner":
          msg = "Issue has been deferred.";
          issue.commissionerAction = "Deferred";
          issue.commissionerActionRemarks = "";
          issue.status = "Deferred";
          issue.commissionerActionDate = new Date();
          issue.commissionerUserId = requestObject.user.userId;
          break;
        case "mayor":
          msg = "Issue has been deferred.";
          issue.mayorAction = "Deferred";
          issue.mayorActionRemarks = "";
          issue.status = "Deferred";
          issue.finalStatus = "Deferred";
          issue.mayorActionDate = new Date();
          issue.mayorUserId = requestObject.user.userId;
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
  getVotePageData(req, res) {
    try {
      let requestObject = req.body.requestObject;
      let responseObject = { attachments: [], voters: [], members: [] };
      async.waterfall(
        [
          (fn) => {
            let whereClause = {
              issue_id: requestObject.issueId,
              isDeleted: false,
              status: "Active",
            };
            return attachmentsModel
              .findAll({
                where: whereClause,
              })
              .then((docs) => {
                responseObject.attachments = docs;
                return fn(null, responseObject);
              })
              .catch((error) => {
                return fn(null, responseObject);
              });
          },
          (responseObject, fn) => {
            let whereClause = {
              isDeleted: false,
              isVoter: true,
              status: "Active",
            };
            return usersModel
              .findAll({
                where: whereClause,
              })
              .then((v) => {
                let voters = [];
                if (v.length > 0) {
                  v.map((item) => {
                    if (
                      item.role != "municipal_secretary" &&
                      item.role != "commissioner" &&
                      item.role != "mayor"
                    ) {
                      voters.push(item);
                    }
                  });
                }
                responseObject.voters = voters;
                return fn(null, responseObject);
              })
              .catch((error) => {
                return fn(null, responseObject);
              });
          },
          (responseObject, fn) => {
            if (responseObject.voters.length > 0) {
              let count = 0;
              responseObject.voters.map(async (item) => {
                let whereClause = {
                  issue_id: requestObject.issueId,
                  user_id: item.id,
                  status: "Active",
                  isDeleted: false,
                };
                const doc = await evmModel.findOne({ where: whereClause });
                const roleName = getRoleName(item?.role);
                if (doc) {
                  responseObject.members.push({
                    id: item?.id,
                    name: item?.name,
                    role: item?.role,
                    roleName: roleName,
                    vote: doc.vote,
                  });
                } else {
                  responseObject.members.push({
                    id: item?.id,
                    name: item?.name,
                    role: item?.role,
                    roleName: roleName,
                    vote: null,
                  });
                }
                count++;
                if (responseObject.voters.length == count) {
                  return fn(null, responseObject);
                }
              });
            } else {
              return fn(null, responseObject);
            }
          },
        ],
        (error, result) => {
          if (error) {
            console.error(err);
            return;
          }
          return res
            .status(200)
            .send({ status: true, data: result, message: "Success" });
        }
      );
    } catch (error) {
      console.error("Error in getVotePageData:", error);
      return res.status(500).send({ status: false, data: [], message: error });
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
  // async updateVotingStatus(req, res) {
  //   let requestObject = req.body.requestObject;
  //   if (!requestObject.user || !requestObject.issue) {
  //     return res.status(200).send({
  //       status: false,
  //       message: "Unable to update issue. Please check the values provided",
  //     });
  //   }
  //   try {
  //     const id = requestObject.issue.id;
  //     const issue = await issuesModel.findByPk(id);
  //     if (!issue) {
  //       return res
  //         .status(404)
  //         .json({ status: false, message: "Issue not found" });
  //     }
  //     let whereClause = {
  //       status: "Active",
  //       isDeleted: false,
  //       isVoter: true,
  //     };
  //     await usersModel
  //       .count({
  //         where: whereClause,
  //       })
  //       .then((totalCount) => {
  //         const newVotingTracker = {
  //           issue_id: id,
  //           total_voter: totalCount,
  //           vote_polled: 0,
  //           accepted: 0,
  //           rejected: 0,
  //           abstained: 0,
  //           voting_status: "Open",
  //           record_status: "Active",
  //           isDeleted: false,
  //         };
  //         votingTrackersModel.create(newVotingTracker).then(async (r) => {
  //           issue.voting = "Started";
  //           issue.votingDate = new Date();
  //           await issue.save();
  //           return res.status(200).send({
  //             status: true,
  //             message: "Voting started successfully",
  //           });
  //         });
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         return res.status(500).send({
  //           status: false,
  //           message: error,
  //         });
  //       });
  //   } catch (error) {
  //     console.error("Error updating issue:", error);
  //     return res.status(500).send({ status: false, message: error });
  //   }
  // },

  getVoters(req, res) {
    const issueId = req.body.requestObject.issueId;
    let whereClause = {
      isDeleted: false,
      isVoter: true,
      status: "Active",
    };
    return usersModel
      .findAll({
        where: whereClause,
      })
      .then((v) => {
        let voters = [];
        if (v.length > 0) {
          v.map((item) => {
            if (
              item.role != "municipal_secretary" &&
              item.role != "commissioner" &&
              item.role != "mayor"
            ) {
              voters.push(item);
            }
          });
        }
        return res
          .status(200)
          .send({ status: true, data: voters, message: "Success" });
      })
      .catch((error) => {
        console.log(error);
        return res
          .status(500)
          .send({ status: false, data: [], message: error });
      });
  },

  async castVote(req, res) {
    let requestObject = req.body.requestObject;
    if (
      !requestObject.issueId ||
      !requestObject.userId ||
      !requestObject.vote
    ) {
      return res.status(200).send({
        status: false,
        message: "Unable to vote. Please check ! something went wrong",
      });
    }
    try {
      let whereClause = {
        issue_id: requestObject.issueId,
        user_id: requestObject.userId,
        status: "Active",
        isDeleted: false,
      };
      await evmModel
        .count({
          where: whereClause,
        })
        .then((c) => {
          if (c > 0) {
            return res.status(200).send({
              status: false,
              message: "Vote polled already",
            });
          } else {
            const newVote = {
              issue_id: requestObject.issueId,
              user_id: requestObject.userId,
              vote: requestObject.vote,
              status: "Active",
              isDeleted: false,
            };
            evmModel.create(newVote).then(async (r) => {
              return res.status(200).send({
                status: true,
                message: "Vote polled successfully",
              });
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(500).send({
            status: false,
            message: error,
          });
        });
    } catch (error) {
      console.error("Error updating issue:", error);
      return res.status(500).send({ status: false, message: error });
    }
  },

  async startVoting(req, res) {
    let requestObject = req.body.requestObject;
    if (!requestObject.meeting || !requestObject.issues) {
      return res.status(200).send({
        status: false,
        message: "Unable to start voting. Please check the values provided",
      });
    }
    try {
      const issueIds = requestObject.issues.split(",");
      if (issueIds.length > 0) {
        micMeetingModel.create(requestObject).then(async (m) => {
          let whereClause = {
            status: "Active",
            isDeleted: false,
            isVoter: true,
          };
          let totalVoters = await usersModel.count({ where: whereClause });
          let count = 0;
          issueIds.map(async (id) => {
            const issue = await issuesModel.findByPk(id);
            if (issue) {
              const newVotingTracker = {
                issue_id: id,
                total_voter: totalVoters,
                vote_polled: 0,
                accepted: 0,
                rejected: 0,
                abstained: 0,
                voting_status: "Open",
                record_status: "Active",
                isDeleted: false,
              };
              votingTrackersModel.create(newVotingTracker).then(async (r) => {
                issue.voting = "Started";
                issue.status = "Accepted";
                issue.votingDate = new Date();
                await issue.save();
              });
            }
            count++;
            if (issueIds.length == count) {
              return res.status(200).send({
                status: true,
                message: "Placed in MIC Meeting successfully",
              });
            }
          });
        });
      } else {
        return res.status(200).send({
          status: false,
          message: "No issues found for start voting.",
        });
      }
    } catch (error) {
      console.error("Error updating issue:", error);
      return res.status(500).send({ status: false, message: error });
    }
  },

  async stopVoting(req, res) {
    let requestObject = req.body.requestObject;
    if (!requestObject.role == "commissioner" || !requestObject.issues) {
      return res.status(200).send({
        status: false,
        message:
          "Unable to stop meeting. Something went wrong, please try again",
      });
    }
    try {
      const issueIds = requestObject.issues.split(",");
      if (issueIds.length > 0) {
        let count = 0;
        issueIds.map(async (id) => {
          const issue = await issuesModel.findByPk(id);
          let whereClause1 = {
            issue_id: id,
            record_status: "Active",
            voting_status: "Open",
            isDeleted: false,
          };
          const voting_tracker = await votingTrackersModel.findOne({
            where: whereClause1,
          });
          if (issue && voting_tracker) {
            let whereClause2 = {
              issue_id: id,
              status: "Active",
              isDeleted: false,
            };
            await evmModel
              .findAll({
                where: whereClause2,
              })
              .then(async (votes) => {
                let total_voter = voting_tracker.total_voter;
                let vote_polled = 0;
                let approved = 0;
                let rejected = 0;
                let abstained = 0;
                let status = "";
                if (votes.length > 0) {
                  vote_polled = votes.length;
                  votes.map((item) => {
                    console.log("ITEM==", item.vote);
                    if (item.vote == "Approved") {
                      approved++;
                    }
                    if (item.vote == "Rejected") {
                      rejected++;
                    }
                    if (item.vote == "Abstained") {
                      abstained++;
                    }
                  });
                }
                if (approved >= rejected) {
                  status = "Accepted";
                } else {
                  status = "Rejected";
                }
                voting_tracker.vote_polled = vote_polled;
                voting_tracker.accepted = approved;
                voting_tracker.rejected = rejected;
                voting_tracker.abstained = abstained;
                voting_tracker.voting_status = status;
                voting_tracker.save();
                issue.voting = "Completed";
                issue.status = status;
                issue.votingDate = new Date();
                await issue.save();
              })
              .catch((error) => {
                console.log(error);
                return res.status(200).send({
                  status: false,
                  message: error,
                });
              });
          }
          count++;
          if (issueIds.length == count) {
            return res.status(200).send({
              status: true,
              message: "Meeting stopped successfully",
            });
          }
        });
      } else {
        return res.status(200).send({
          status: false,
          message: "No issues found for stop voting.",
        });
      }
    } catch (error) {
      console.error("Error updating issue:", error);
      return res.status(200).send({ status: false, message: error });
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
