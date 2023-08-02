const {insertClient,deleteClient} = require('../Controller/DbController')
const {AuthorizationCodeGrant}=require('../Controller/AuthController')
const Router = require('express').Router()

Router.post('/insertClient',insertClient)
Router.post('/deleteClient', deleteClient)

module.exports=Router