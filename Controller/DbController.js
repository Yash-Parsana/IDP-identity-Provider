const Client = require('../Models/Client')
const { v4: uuidv4, v4 } = require('uuid');
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')

const insertClient = async (req, res) => {

    const { ClientID,name, scope, protocol, RedirectURIs, access } = req.body

    if (!ClientID||!name || !scope || !protocol || !RedirectURIs || RedirectURIs.length == 0 || !access || access.length == 0)
    {
        res.status(400).send("Incomplete Data")
    }

    const client = Client.findOne({ ClientID });

    if (!client)
    {
        res.status(400).send("Client Does not exist")
    }
    const secret = v4()

    // console.log(` ${req.body}  ${req.body.scope} ${req.body.protocol} ${req.body.RedirectURIs}`);
    
    try {
        await Client.updateOne({ ClientID }, { $set: { ClientName: name, Secret: secret,scope:scope,protocol:protocol,RedirectURIs:RedirectURIs,access:access } })
        res.send("Registered");
    }
    catch (err) {
        console.log(err);
    }
}
const deleteClient = async (req, res) => {
    const ClinetId = req.body.ClientID
    
    try {
        await Client.deleteOne({ ClinetId })
        res.send("Deleted Successfully")
    }
    catch (err)
    {
        console.log(err);
        res.send(err);
    }
}

const checkClient =async (req,res,next) => {
    const ClientID = req.query.ClientID
    const RedirectURI = req.query.RedirectURI
    console.log("Client id : ",ClientID," RedirectURI : ",RedirectURI);
    try {
        const client = await Client.findOne({ ClientID }).lean()
        console.log(client);
        if (client)
        {
            if (client.RedirectURIs.includes(RedirectURI))
            {
                const ClientName = client.ClientName
                const accessArr = client.access
                
                let access = ""
                accessArr.forEach(ele => {
                    access+=`${ele} `
                })

                res.render('login',{ClientID,RedirectURI,ClientName,access})
            }
            else {
                res.send("Wrong Redirect URI")
            }
        }
        else {
            res.send("Client is not Exist");
        }
    }
    catch (err)
    {
        console.log(err);
        res.send(err);
    }

}

const checkClientWithSecret =async (req,res,next) => {
    const ClientID = req.body.ClientID
    const RedirectURI = req.body.RedirectURI
    const ClientSecret = req.body.ClientSecret

    // console.log("Client id : ",ClientID);
    try {
        const client = await Client.findOne({ ClientID }).lean()
        // console.log(client);
        if (client)
        {
            if (client.RedirectURIs.includes(RedirectURI)&&client.Secret==ClientSecret)
            {
                next()
            }
            else {
                console.log("Invalie Request");
                res.send("Invalid Request")
            }
        }
        else {
            console.log("Client Not Exist");
            res.send("Client is not Exist");
        }
    }
    catch (err)
    {
        console.log(err);
        res.send(err);
    }

}

const registerEmailPass = async (req,res) => {
    const { email, password } = req.body
    
    try {
        const nClient = new Client();
        nClient.email = email
        const npass = await bcrypt.hash(password, 10);
        nClient.password = npass
        nClient.ClientID = v4();
        await nClient.save();
        res.send("You are Registered")
    }
    catch (err)
    {
        console.log(err);
        res.send(err)
    }
}

const getClient = async(req, res, next) => {
    const ClientID = req.body.ClientID
    
    try {
        const client =await Client.findOne({ ClientID });
        res.send(client)
    }
    catch (err)
    {
        console.log(err);
        res.send(err);
    }

}

const loginClient = async(req,res) => {
    const { email, password } = req.body
    
    try {
        const client = await Client.findOne({ email }).lean()
        // console.log(client);
        if (client)
        {
            const check = await bcrypt.compare(password, client.password);
            if (check)
            {
                const token=await jwt.sign({ClientID:client.ClientID},process.env.jwtKEY,{expiresIn:24*60*60})
                res.cookie("jwtToken",token,{
                    httpOnly: true,
                    sameSite:"strict"
                })
                res.send("You are Logged In");
            }
            else {
                console.log("Invalie Request");
                res.send("Invalid Request")
            }
        }
        else {
            console.log("Client Not Exist");
            res.send("Client is not Exist");
        }
    }
    catch (err)
    {
        console.log(err);
        res.send(err);
    }

}

module.exports={insertClient,getClient,registerEmailPass,deleteClient,checkClient,checkClientWithSecret,loginClient}