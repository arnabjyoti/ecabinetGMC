const AuthController = require('./AuthController');
const IssuesController = require('./IssuesController');
const sendMail = require('./sendMail');
const analyticController = require('./analyticController');
module.exports = {
	AuthController,
	IssuesController,
	sendMail,
	analyticController
};
