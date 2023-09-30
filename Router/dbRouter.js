const {insertClient,registerEmailPass,loginClient,getClient,deleteClient} = require('../Controller/DbController')
const Router = require('express').Router()
const verify=require('../Middleware/verifyToken')

Router.post('/resgisterEaP', registerEmailPass);
Router.post('/login', loginClient);
Router.post('/insertClient',verify,insertClient)
Router.post('/getClient',verify,getClient)
Router.post('/deleteClient', deleteClient)

module.exports=Router