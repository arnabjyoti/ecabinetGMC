const { sendMail, eventController} = require('../controllers');

const AuthController = require('../controllers').AuthController;
const IssuesController = require('../controllers').IssuesController;

const upload = require('../middlewares/multer');
//Api's
module.exports = (app) => {
	app.get('/api', (req, res) =>
		res.status(200).send({
			message: 'Welcome'
		})
	);

	// Auth API's
	app.post('/api/request-otp', AuthController.requestOTP);
	app.post('/api/user', AuthController.getUser);

	app.post('/api/verify-otp', AuthController.verifyOTP);

	app.post('/api/refresh-token', AuthController.refreshToken);

	app.post('/api/authenticate', AuthController.authenticate);
	app.post('/api/verifyEmail', AuthController.verifyEmail);
	app.post('/api/sendOtp', sendMail.sendOtp);

	// Issues API's
	app.post('/api/get-issue-list', IssuesController.getIssueList);
	app.post('/api/get-voting-ready-issue-list', IssuesController.getVotingReadyIssueList);
	app.post('/api/create-issue', IssuesController.createIssue);
	app.post('/api/update-issue', IssuesController.updateIssue);
	app.post('/api/get-issue-attachments', IssuesController.getIssueAttachments);
	app.post("/api/upload-issue-attachment", IssuesController.upload_config.single('file'), IssuesController.saveIssueAttachmentData);
	app.post('/api/update-voting-status', IssuesController.updateVotingStatus);	
	
	app.post('/api/add-comment', IssuesController.addComment);	
	app.post('/api/get-all-comments', IssuesController.getAllComments);	
};