
var passport = require('passport')
    , FacebookStrategy = require('passport-facebook').Strategy;
var UserService = require('../services/user.service');
var config = require('../config');

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getUsers = async function (req, res, next) {

    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = req.query.page ? req.query.page : 1
    var limit = req.query.limit ? req.query.limit : 10;
    try {
        var Users = await UserService.getUsers({}, page, limit)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({status: 200, data: Users, message: "Succesfully Users Recieved"});
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: e.message});
    }
}

exports.createUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    var User = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var createdUser = await UserService.createUser(User)
        return res.status(201).json({token: createdUser, message: "Succesfully Created User"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: "User Creation was Unsuccesfull"})
    }
}

exports.updateUser = async function (req, res, next) {

    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(400).json({status: 400., message: "Id must be present"})
    }

    var id = req.body._id;
    var User = {
        id,
        name: req.body.name ? req.body.name : null,
        email: req.body.email ? req.body.email : null,
        password: req.body.password ? req.body.password : null
    }
    try {
        var updatedUser = await UserService.updateUser(User)
        return res.status(200).json({status: 200, data: updatedUser, message: "Succesfully Updated User"})
    } catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
}

exports.removeUser = async function (req, res, next) {

    var id = req.params.id;
    try {
        var deleted = await UserService.deleteUser(id);
        res.status(200).send("Succesfully Deleted... ");
    } catch (e) {
        return res.status(400).json({status: 400, message: e.message})
    }
}


exports.loginUser = async function (req, res, next) {
    // Req.Body contains the form submit values.
    var User = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        // Calling the Service function with the new object from the Request Body
        var loginUser = await UserService.loginUser(User);
        res.header('x-access-token', loginUser);
        return res.status(201).json({token: loginUser, message: "Succesfully login"})
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(400).json({status: 400, message: "Invalid username or password"})
    }
}
    


exports.FacebookLogin = async function(req,res,next){

    console.log(req.body);

       console.log('===Im not here...=================');
   var url = 'https://www.facebook.com/v2.11/dialog/oauth?response_type=code&client_id=' + config.facebookAuth.clientID + '&redirect_uri=' + config.facebookAuth.callbackURL + '&scope=public_profile,email';
    res.redirect(url);



//--------------------------------------------------------------------------//
//                             FACEBOOK LOGIN                               //
//--------------------------------------------------------------------------//

// router.get('/facebook', function (req, res) {
//     if(req.query.returnUrl){
//         req.session.returnUrl=req.query.returnUrl;
//     }
//     var url = 'https://www.facebook.com/v2.11/dialog/oauth?response_type=code&client_id=' + config.facebookAuth.clientID + '&redirect_uri=' + config.facebookAuth.callbackURL + '&scope=public_profile,email';
//     res.redirect(url);
// });


router.get('/callback/facebook', function (req, res) {
    /*Get Access Token*/
    var tokenUrl = 'https://graph.facebook.com/v2.11/oauth/access_token';
    var dataVal = '?code=' + req.query.code + '&client_id=' + config.facebookAuth.clientID + '&client_secret=' + config.facebookAuth.clientSecret + '&redirect_uri=' + config.facebookAuth.callbackURL + '&grant_type=authorization_code';
    var options = {
        method: 'POST',
        url: tokenUrl + dataVal,
    };
    request(options, function (err, response) {
        response.body = JSON.parse(response.body);
        var resp = {};
        var url2 = 'https://graph.facebook.com/v2.11/me?access_token=' + response.body.access_token + '&fields=name,email,work,address,first_name,last_name,middle_name';
        var options = {
            method: 'GET',
            url: url2,
        };
        request(options, function (err, response) {
            var user_data = JSON.parse(response.body);
            var user_params = {};
            user_params.email = user_data.email;
            user_params.username = user_data.email;
            if (user_data.first_name) {
                user_params.firstName = user_data.first_name;
            }
            if (user_data.last_name) {
                user_params.lastName = user_data.last_name;
            }

            user_params.social_login_type = "facebook";
            user_params.social_id = user_data.id;
            user_params.planId = config.defaultPlanId;
            user_params.planPeriod = config.defaultPlanPeriod;
            user_params.customerCurrencySign = config.defaultCurrencySign;
            user_params.customerCurrencyCode = config.defaultCurrencyCode;
            user_params.customerBalance = config.defaultBalance;
            user_params.auto_recharge_status = config.defaultAutoRechargeStatus;
            user_params.recharge_balance = config.defaultRechargeBalance;
            user_params.status = parseInt(1);
            var clientIp = requestIp.getClientIp(req);
            user_params.clientIp = clientIp;
            // register using api to maintain clean separation between layers
            request.post({
                url: config.apisUrl + '/customers/loginWithSocial',
                form: user_params,
                json: true
            }, function (error, response, body) {
                if (body.mfaToken && req.session.mfa != true) {
                    var clientIp = requestIp.getClientIp(req);
                    req.session.clientIp = clientIp;
                    req.session.testingAccount = body.testingAccount;
                    //req.session.token = body.token;
                    req.session.customerId = body.customerId;
                    req.session.username = body.username;
                    req.session.secret = body.mfaToken;
                    req.session.mfa = true;
                    __getPageType({"returnUrl":req.session.returnUrl}, function (result) {
                        viewData=result;
                        viewData["username"]= body.username;
                        viewData["secret"]= body.mfaToken;
                        res.render('social-login-with-mfa',viewData);
                        return false;
                    });
                    
                }else{
                    var clientIp = requestIp.getClientIp(req);
                    req.session.clientIp = clientIp;
                    req.session.testingAccount = body.testingAccount;
                    req.session.token = body.token;
                    req.session.customerId = body.customerId;
                    req.session.username = body.username;
                    req.session.mfa = false;
                    /*create log*/
                    logService.customerActivity(req, "LOGIN", "Customer logged in to system from Facebook");
                    res.render('social-login');
                }
            });
        });
    });
});


       
}

    
