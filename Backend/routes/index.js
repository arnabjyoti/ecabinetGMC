const { sendMail, eventController} = require('../controllers');

const AuthController = require('../controllers').AuthController;
const OrganizerController = require('../controllers').OrganizerController;

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
	// Organizer API's
	
	};