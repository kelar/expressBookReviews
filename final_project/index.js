const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const accessToken = req.session.accessToken;
  
    if (accessToken) {
      // Validate the access token (assuming you have a function validateAccessToken)
      if (validateAccessToken(accessToken)) {
        next(); // Proceed to the next middleware or route handler
      } else {
        res.status(401).send('Unauthorized: Invalid access token');
      }
    } else {
      res.status(401).send('Unauthorized: No access token found');
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
