const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    email: String,
    password: String,
    role: String,
    pbio: String,
    number: Number,
    firstname: String,
    secondname: String,
    type: String,
    service: String,
    experience: String,
    companyname: String,
    createdAt: { type: Date, default: Date.now }
})

const EmployeeModel = mongoose.model("Employee", EmployeeSchema)
module.exports = EmployeeModel