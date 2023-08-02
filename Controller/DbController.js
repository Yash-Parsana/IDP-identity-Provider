const Client = require('../Models/Client')
const { v4: uuidv4, v4 } = require('uuid');

const insertClient = async(req,res) => {
    const nClinet = new Client();

    nClinet.ClientName = req.body.name
    nClinet.ClientID = v4()
    nClinet.Secret = v4()
    nClinet.scope = req.body.scope
    nClinet.protocol = req.body.protocol
    nClinet.RedirectURIs=req.body.RedirectURIs

    // console.log(` ${req.body}  ${req.body.scope} ${req.body.protocol} ${req.body.RedirectURIs}`);

    try {
        await nClinet.save();
        res.send(nClinet);
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
    // console.log("Client id : ",ClientID," RedirectURI : ",RedirectURI);
    try {
        const client = await Client.findOne({ ClientID }).lean()
        // console.log(client);
        if (client)
        {
            if (client.RedirectURIs.includes(RedirectURI))
            {
                res.render('login',{ClientID,RedirectURI})
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


module.exports={insertClient,deleteClient,checkClient,checkClientWithSecret}