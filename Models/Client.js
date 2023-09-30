const mongoose = require('mongoose')

const Client = new mongoose.Schema({
    email: {
        type:String,
    },
    password: {
        type:String,
    },
    ClientName: {
        type: String,
    },
    ClientID: {
        type: String,
    },
    Secret: {
        type: String,
    },
    scope: {
        type: String,
    },
    protocol: {
        type: String,
    },
    RedirectURIs: {
        type: [String],
    },
    AuthorizationCode: {
        type: String,
    },
    access: {
        type: [String],
    }
    
})

module.exports=mongoose.model('Client',Client)