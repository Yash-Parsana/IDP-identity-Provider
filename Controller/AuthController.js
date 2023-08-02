const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const CryptoJS = require('crypto-js');

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
    const email = req.body.mail
    const password = req.body.password
    console.log("Email : ",email);
    // const options = {
    //     method: 'POST',
    //     url: `${process.env.ResourceServer}/check`,
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //       },
    //     body: `
    //         {
    //             "emial":"${email}",
    //             "password":"${password}",
    //         }
    //     `
    // };
    // const isValid = await fetch(`${process.env.ResourceServer}/check`,options);

    if (true)
    {
        next();
    }
    else {
        res.send("Wrong Credentials")
    }

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
            const password = decryptedObject.Credentials.password
            const ClientID=decryptedObject.ClientID
            console.log(`Email : ${email} Password : ${password}`);
            
            const body={
                "emial":email,
                "password": password,
                "ClientID":ClientID
            }
            const options = {
                method: 'POST',
                url: `${process.env.ResourceServer}/check`,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify(body)
            };
            const accessToken = await fetch(`${process.env.ResourceServer}/accessToken`,options);
            
            res.json({
                "accessToken":accessToken
            })
        }
    }
    catch (err) {
        console.log(err);
        res.send("Bad Request");
    }

    

}

module.exports={AuthorizationCodeGrant,checkRequestToResourceServer,AccessToken}