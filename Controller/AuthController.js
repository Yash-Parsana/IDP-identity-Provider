const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const CryptoJS = require('crypto-js');
const axios=require('axios')
const Client = require('../Models/Client')

const AuthorizationCodeGrant = async(req,res) => {
    const clientID = req.body.ClientID
    const RedirectURI = req.body.RedirectURI
    // console.log("Redirect uri : ",RedirectURI," Inside AuthrizationcodeGrant");
    // console.log("Client id : ",clientID," Redirect uri : ",RedirectURI);

    const Credentials = {
        "email": req.body.email,
        "password":req.body.password
    }
    // console.log("Client id",clientID);
    try {
        const data = {
            clientID,
            Credentials
        }
        const str = JSON.stringify(data);
        const encrypted = CryptoJS.AES.encrypt(str, process.env.EncryptionKey).toString();
        const payload = {
            encrypted
        }
        const code = await jwt.sign(payload,process.env.jwtKEY,{algorithm:"HS256",expiresIn:5*60})
        const RedirectUrl=`${RedirectURI}?code=${code}`
        // console.log(RedirectUrl);
        res.redirect(RedirectUrl)
    }
    catch (err)
    {
        console.log(err);
        res.send(err);
    }
}

const checkRequestToResourceServer = async(req,res,next)=> {
    const email = req.body.email
    const password = req.body.password
    console.log("Email : ", email, " Password : ", password);
    

    const serverUrl = `${process.env.ResourceServer}/user/login`;
    const data = {
        Email: email,
        Password: password
    };

    axios.post(serverUrl, data)
    .then(response => {
        const result = response.data
        
        if (result.token)
        {
            next();
        }
        else {
            res.send("Wrong Credentials")
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

const AccessToken = async(req, res) => {
    const code = req.body.code
    
    try {
        const isValid = jwt.verify(code, process.env.jwtKEY)
        
        if (isValid)
        {
            const encrypted = isValid.encrypted;
            const decrypted = CryptoJS.AES.decrypt(encrypted, process.env.EncryptionKey).toString(CryptoJS.enc.Utf8);
            const decryptedObject = JSON.parse(decrypted);
            const email = decryptedObject.Credentials.email
            const ClientID=decryptedObject.clientID

            const client = await Client.findOne({ ClientID }).lean();
            // console.log("Client : ",client);
            const requirements = client.access

            // console.log(`Email : ${email} Requirenments: ${requirements}`);
            const body={
                "Email": email,
                "token": process.env.IDP_SERVER_AUTH,
                requirements
            }
            const serverUrl=`${process.env.ResourceServer}/user/accessToken`
            
            axios.post(serverUrl, body)
            .then(response => {
                const token = response.data.token
                // console.log(response);
                res.status(200).json({token,email})
            })
            .catch(error => {
                console.error('Error:', error);
                res.send("Error Occured...")
            });

        }
    }
    catch (err) {
        console.log(err);
        res.send("Bad Request");
    }

    

}

module.exports={AuthorizationCodeGrant,checkRequestToResourceServer,AccessToken}