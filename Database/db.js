const mongoose = require('mongoose')


const connectDb = async() => {
    try {
        const con = await mongoose.connect(process.env.mongoURI)
        console.log("Database Connected 👍");
        return con.connection
    }
    catch (err)
    {
        console.log("Error Occured : ", err);
        return err;
    }
}

module.exports=connectDb