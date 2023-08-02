const mongoose = require('mongoose')

const Client = new mongoose.Schema({
    ClientName: {
        type: String,
        require:true
    },
    ClientID: {
        type: String,
        require:true
    },
    Secret: {
        type: String,
        require:true
    },
    scope: {
        type: String,
        require:true
    },
    protocol: {
        type: String,
        require:true
    },
    RedirectURIs: {
        type: [String],
        require:true
    },
    AuthorizationCode: {
        type: String,
        require:false
    }
    
})

module.exports=mongoose.model('Client',Client)