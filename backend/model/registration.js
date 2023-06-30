const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
    companyName: {
        type: String,
    },
    workEmailId: {
        type: String,
    },
    noOfEmployees: {
        type: String,
    },
    registeredName: {
        type: String,
    },
    registeredLocation: {
        type: String,
    },
    avgAgeEmployee: {
        type: String,
    },
    coverageForPeople: {
        type: String,
    },
    coverageForAmount: {
        type: String,
    },
    mobileNumber: {
        type: String,
    }
},{
    timestamps:true
})

module.exports = mongoose.model('Profile', profileSchema)