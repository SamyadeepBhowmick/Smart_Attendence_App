const express=require('express');
const app=express()
const bcrypt=require('bcrypt')
const bodyParser=require('body-parser');
const cors=require('cors');
const mongo = require('mongodb').MongoClient;
var nodemailer = require('nodemailer');
const Verifier = require("email-verifier");

const PORT=3000;
//const api=require('./routes/api');
//app.use('/api',api);

app.set('view-engine','ejs')
app.use(express.urlencoded({extended:false}))

app.use(bodyParser.json());

//support parsing of application
app.use(bodyParser.urlencoded({ extended: true }));

//connect with mongodb and create database
mongo.connect('mongodb://localhost:27017/institute',function(err,client){
    if(err ) throw err;
    console.log('Connected to mongodb');

    var db = client.db('institute');
    teachers=db.collection('teachers');
    students=db.collection('students');

    app.get('/',(req,res)=>{
        //res.render('app.ejs',{name: "Soumya"})
    })

    app.use(express.static(__dirname+'/public'))
    
    app.get('/login',(req,res)=>{
        res.render('login.ejs')
    })
    
    app.get('/register',(req,res)=>{
        res.render('register.ejs')
    })

    app.post('/register',(req,res)=>{
        let userData=req.body;
        teachers.find({email:userData.email}).toArray(function(err,response){
            if(!response[0]){
                teachers.insert(userData,function(){
                    data={success:1};
                    res.status(200).send(data)
                    console.log(userData)

                    let verifier = new Verifier('at_MvCy1d8k9nBYSTQec717nWmVOZhfu')
                    verifier.verify(userData.email, (err, data) => {
                        if (err) throw err;
                        console.log(data);
                    });

                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.googlemail.com', // Gmail Host
                        port: 465, // Port
                        secure: true, // this is true as port is 465
                        auth: {
                          user: 'yourmail@gmail.com',
                          pass: 'password'
                        }
                    });
    
                    var mailOptions = {
                        from: 'yourmail@gmail.com',
                        to: userData.email,
                        subject: 'Sending Email using Node.js',
                        text: 'That was easy!'
                    };
    
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                    });    
                });
            }else{
                data={success:0};
                res.status(200).send(data);
            }
        });
    });

    app.post('/login',(req,res)=>{
        let userData=req.body;

        if(userData.email!=""){
            teachers.find({email:userData.email}).toArray(function(err,response){
                if(!response[0]){
                    var data={success:0};
                    res.status(200).send(data);
                }else{
                    var data=response[0]
                    res.status(200).send(data);
                    console.log(data)
                }
            });
        }
    })
})

app.listen(PORT,function(req,res){
    console.log('Server is running on port: '+PORT);
});
