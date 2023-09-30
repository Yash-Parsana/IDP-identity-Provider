const express = require('express')
const dotenv=require('dotenv')
const mondoDb=require('./Database/db')
const bodyParser=require('body-parser')
const cookieParser=require('cookie-parser')
const app = express()

dotenv.config({path:'./.env'})
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser())

mondoDb()

const DbRouter = require('./Router/dbRouter')
const AuthRouter=require('./Router/AuthRouter')


app.use('/api/client', DbRouter)
app.use('/api/auth',AuthRouter)

app.get("/verify", (req,res) => {
    const token = req.body.token
    
    const data=require('jsonwebtoken').verify(token,process.env.jwtKEY)
    console.log(data);
})

app.get('/page', (req,res) =>{
    res.render('login')
})

app.listen(3000, () => {
    console.log("Server is listening on port : ",3000,"🏃");
})