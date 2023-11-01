const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
  const accessToken = req.headers.authorization && req.headers.authorization.split('')[1];
  if(!accessToken){
    return res.status(401).json({error: 'Your Access Token is missing. '});
  }
  jwt.verify(accessToken, '', (err, user) => {
    if(err){
        return res.status(401).json({error: 'Invalid Access Token'});
    }
    req.user = user;

    next();
  });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
