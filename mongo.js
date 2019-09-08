const mongoose = require('mongoose')
const constant = require('./constant')
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const dbUrl = 'mongodb://' + constant.db.IP + ':' + constant.db.port + '/appointment';

mongoose.connect(
	dbUrl, {
		useNewUrlParser: true,
		authSource: 'admin',
		user: constant.db.userName,
		pass: constant.db.password,

	}).then(() => { console.log('mongodb connected successfully') },
		(err) => { console.log('Connection to mongodb failed due to', err) })

// Defining the User schema for our application 
const user = new Schema({
	username: { type: String, index: true },
	password: { type: String },
	firstname: { type: String },
	middleName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	email: { type: String, index: true }
});

// Defining the appointment schema for our application
const appointment = new Schema({
	description: { type: String },
	title: {type: String},
	owner: ObjectId,
	invitedPersons: { type: Array, default: [] },
	time: { type: Date },
	location: { type: String, match: /[a-z]/ }
})

const User = mongoose.model('user', user);
const Appointment = mongoose.model('appointment', appointment)

module.exports = {
	User, Appointment
}