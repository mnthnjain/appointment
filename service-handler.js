const express = require('express');
const mongoose = require('mongoose')
const db = require('./mongo')
const router = express.Router();
const ObjectId = mongoose.ObjectId;

mongoose.set('useFindAndModify', false);

router.get('/api/users/', getUsers)
router.get('/api/userinfo/', getUserInfo)
router.route('/api/appointment').get(getAppointment).post(newAppointment).put(updateAppointment).delete(deleteAppointment)

// End point to get list of all the users
function getUsers(req, res) {
    db.User.find({}, {
        _id: 1,
        firstname: 1,
        middleName: 1,
        lastName: 1,
        email: 1
    }).then((response) => {
        res.send(response.filter((user) => {
            return user !== req.user
        }))
    })
}

// End point to get current user info
function getUserInfo(req, res) {
    delete req.user.password
    res.send(req.user)

}

// End point to get the list of all appointment for the current user
function getAppointment(req, res) {
    db.Appointment.find({ owner: req.user.id }).then((response) => {
        res.send(response)
    })
}

// End point to create a new appointment for the current user
function newAppointment(req, res) {
    var newAppointmentStructure = req.body;
    newAppointmentStructure.owner = req.user
    var newAppointment = new db.Appointment(req.body)

    newAppointment.save().then(() => {
        res.send(201)
    }, (err) => {
        console.log(err)
    })
}

// End point to create a update particular apoointment 
function updateAppointment(req, res) {
    db.Appointment.findOneAndUpdate({ _id: req.body._id, owner: req.user.id }, req.body).then((response) => {
        res.send(response)
    })
}

// End point to delete a particular appointment
function deleteAppointment(req, res) {
    db.Appointment.findOneAndDelete({ _id: req.body._id, owner: req.user.id }).then((response) => {
        res.send(response)
    })
}

module.exports = {
    router
}

