const {checkClient,checkClientWithSecret} = require('../Controller/DbController')
const {AuthorizationCodeGrant,checkRequestToResourceServer,AccessToken}=require('../Controller/AuthController')
const Router = require('express').Router()


Router.get('/Authorizationcode', checkClient);
Router.post('/credential', checkRequestToResourceServer, AuthorizationCodeGrant)
Router.post('/token',checkClientWithSecret,AccessToken)
// Router.post('/generatecode',checkClient,AuthorizationCodeGrant)
module.exports=Router