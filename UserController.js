/* eslint-disable one-var */
/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests  for Create, Update, Find and Get User information.
 *                 this service also used for User Auth
 *                 Uses Mongo Database to store , Update , Delete and retrieve  Information
 * @Database :: Mongo
 * @model :: User - holds user information,
 *          Useraccess -  Holds mapping user and publisher access information
 */
var bcrypt = require("bcryptjs");
var hogan = require('hogan.js');
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken');
var randomString = require('randomstring');
var fs = require('fs');
var sgTransport = require('nodemailer-sendgrid-transport');
var passport = require('passport');

module.exports = {

  /**
    * `UserController.AccessUpdate()`
    * @description ::Receives request from Front end, Make an entry in user Access table.
    * @param :: userid, exchange  information passed from fornt end.
    * @returns :: On Success,returns message Updated Successfully
    *             On Failure, returns related Error Message
    */
  AccessUpdate: async function (req, res) {

    let userid = req.param('userid'),
      exchange = req.param('exchange');

    User.findOne({ "_id": userid }).then(u => {
      if (u.role === 'Publisher') {
        Useraccess.destroy({ userid: userid }).then(usr => {
          //console.log('user access deleted');

          Useraccess.create({
            userid: userid,
            exchange: exchange,
          }).fetch()
            .then(_user => {
              return res.ok('Updated Successfully');
            })
            .catch(err => res.serverError(err.message));
        });
      }
      if (u.role === 'Advertiser') {
        Useradvaccess.destroy({ userid: userid }).then(usr => {
          Useradvaccess.create({
            userid: userid,
            exchange: exchange,
          }).fetch()
            .then(_user => {
              //console.log('Access updated', _user);
              return res.ok('Updated Successfully');
            })
            .catch(err => res.serverError(err.message));
        });
      }
    }).catch(err => res.serverError(err.message));




  },

  /**
   * `UserController.AccessUpdate()`
   * @description ::Receives request from Front end, to fetch access for particular user.
   * @param :: userid for which information is required.
   * @returns :: On Success,returns user Acccess details
   *             On Failure, returns No User found
   */
  AccessGet: async function (req, res) {
    let userid = req.param('userid');
    console.log('get user : ', userid);
    User.findOne({ "_id": userid }).then(u => {
      if (u.role === 'Publisher') {
        Useraccess.findOne({ userid: userid })
          .then(_users => {
            if (!_users || _users.length === 0) {
              throw new Error('No User found');
            }
            console.log(_users);
            return res.ok(_users);
          })
          .catch(err => res.serverError(err.message));
      } else if (u.role === 'Advertiser') {
        Useradvaccess.findOne({ userid: userid })
          .then(_users => {
            if (!_users || _users.length === 0) {
              throw new Error('No User found');
            }
            console.log(_users);
            return res.ok(_users);
          })
          .catch(err => res.serverError(err.message));
      }
    }).catch(err => res.serverError(err.message));
    // Useraccess.findOne({ userid: userid })
    //   .then(_users => {
    //     if (!_users || _users.length === 0) {
    //       throw new Error('No User found');
    //     }
    //     console.log(_users);
    //     return res.ok(_users);
    //   })
    //   .catch(err => res.serverError(err.message));

  },


  /**
   * `UserController.create()`
   * @description :: received request from front end to create an User
   * @param :: name, role,email,mobile number, lastname, skypeid,company name
   * @returns ::  On success Data inserted
   *              On Failure, returns related Error Message
   */
  create: async function (req, res) {

    let name = req.param('name'),
      role = req.param('role'),
      superuser = req.param('superuser'),
      email = req.param('email'),
      pwd = req.param('pwd'),
      mno = req.param('mno'),
      lastname = req.param('lastname'),
      skype = req.param('skype'),
      compay = req.param('company'),
      remarks = req.param('remarks'),
      parentid = req.param('parentid'),
      balance = '0',
      status = 'Enable',
      resettoken = '',
      pwdresettoken = '';
      
    if (!name) {
      return res.badRequest({ error: 'Invalid name' });
    }

    if (!email) {
      return res.badRequest({ error: 'Invlaid email' });
    }

    User.find({ email: email }).then(usr => {
      console.log(usr);
      if (usr.length === 0) {
        User.create({
          name: name,
          role: role,
          superuser:superuser,
          email: email,
          pwd: pwd,
          mno: mno,
          lastname: lastname,
          skype: skype,
          company: compay,
          remarks: remarks,
          parentid: parentid,
          status: status,
          balance: balance,
          resettoken: resettoken,
          pwdresettoken: pwdresettoken
        }).fetch()
          .then(_user => {

            var smtpTransport = nodemailer.createTransport({
              service: "SendGrid",
              auth: {
                user: "azure_da28c768db3b337d8eaa33f0da4ec084@azure.com",
                pass: "Videotap@9966"
              }
            });
            profile = {
              id: "1234%^&*(%$#@$",
            };

            // var secret = "videotap.com";
            // var token = jwt.sign(profile, secret, { expiresIn: 60 * 60 * 24 });
            // var host = req.get('host');
            var rand = randomString.generate({
              length: 30,
              charset: 'alphabetic'
            });
            _user.resettoken = rand;
            link = req.protocol + "://" + sails.config.dspServerUrl + "/verify/" + rand;
            //console.log(user);
            var template = fs.readFileSync(__dirname + "/../template/mail.html", 'utf8');
            var compiledTemplate = hogan.compile(template);
            //_user.pwd=pwd;
            User.update({id:_user.id},_user).then(d=> {
                console.log(d)
            }).catch(e => {
              console.log(e)
            });
            
            if(superuser){
              mailOptions = {
                from:'info@videotap.com',
                to: 'gopalswamy.r@videotap.com',
                subject: "Please confirm your Email account" + email,
                html: compiledTemplate.render({ link: link, email: req.body.emailId })
              }
            } else {
              mailOptions = {
                from:'info@videotap.com',
                to: email,
                subject: "Please confirm your Email account",
                html: compiledTemplate.render({ link: link, email: req.body.emailId })
              }
            }
            
            //console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function (error, response) {
              //  sleep.sleep(20);
              if (error) {
                //console.log("mail error is   " + error);
                res.end("error");
              } else {
                console.log("Message sent: " + JSON.stringify(response));
                // res.end("sent");
              }
            });
            return res.ok({ message: 'Data inserted' });

          })
          .catch(err => res.serverError(err.message));
      } else {
        return res.serverError({ message: 'Email Already Exist' });
      }
    }).catch(err => res.serverError(err.message));



  },

  /**
   * `UserController.findAll()`
   * @description :: Get all the users configured
   * @returns :: On Success All User Information
   *             On Failure No User Found or relavent error mesaage
   */
  findAll: async function (req, res) {
    User.find()
      .then(_users => {
        if (!_users || _users.length === 0) {
          throw new Error('No User found');
        }
        return res.ok(_users);
      })
      .catch(err => res.serverError(err.message));

  },

  /**
   * `UserController.findOne()`
   * @Note : Not implement right now.
   */
  findOne: async function (req, res) {
    return res.json({
      todo: 'findOne() is not implemented yet!'
    });
  },

  /**
   * `UserController.delete()`
   * @description :: removes user from Database when a user id is passed
   * @param :: id of the user
   * @returns :: On Success message with user is deleted with id xyz
   *             On Failure Record not found or relavent error msg.
   */
  delete: async function (req, res) {

    let userId = req.params.id;

    if (!userId) { return res.badRequest({ err: 'missing user id field' }); }

    User.destroy({ id: userId })
      .then(_user => {
        if (!_user || _user.length === 0) { return res.notFound({ err: 'Record not found' }); }
        return res.ok(`user is deleted with id ${userId}`);
      })
      .catch(err => res.serverError(err));

  },

  // user login authenticate
  /**
   * `UserController.authenticate()`
   * @description :: user authentication for front end login
   * @param {email,pwd} :: req
   * @returns {_user} as response, On failure returns missing Credentials, User not found or Password incorrect or relavent error message.
   */

  // authenticate: async function (req, res) {
  //   let email = req.param('email');
  //   let pwd = req.param('pwd');

  //   if (!email || !pwd) { return res.badRequest({ err: 'Missing Credentials' }); }
  //   User.findOne({ email: email, status: 'Enable', role: { '!=': 'User' } })
  //     .then(_user => {
  //       //console.log('user available', _user);
  //       if (!_user) { return res.badRequest({ err: 'Either email or password is invalid' }); }
  //       if ( _user.verifyuser == false){
  //         return res.badRequest({ err: 'Please verify you email address.' });
  //       }
  //       if (_user && (bcrypt.compareSync(pwd, _user.pwd))) {
  //         return res.ok(_user);
  //       } else {
  //         return res.badRequest({ err: 'Invalid Password' });
  //       }

  //     })

  //     .catch(err => res.serverError(err.message));

  // },

  authenticate:  (req, res ,next) => {
		// console.log('\nauth login');
		passport.authenticate('local', function(err, user, info){
			if((err) || !user || (user && !Object.keys(user))) {
				let status = (err) ? 500 : 401; 
				return res.status(status).json({message: info});
      }
      
      if(user.status !== 'Enable'){
        return res.status(500).json({message: 'Please contact admin,User access is denied', result: err});
      }
			// console.log(user);
			req.login(user, function(err) {
				if(err){
					// console.log('\nerr:',err);
					return res.status(500).json({message: 'Please contact admin,User access is denied', result: err});
				} 
				const token = jwt.sign({id: user.id, email:user.email , role: user.role , name : user.name, super:user.superuser}, 'your_jwt_secret');
				return res.status(200).json({key:token});
			});
		})(req, res ,next);
	},

  //pwd update

  /**
   * `UserController.pwdupdate()`
   * @description :: Updates the password for given user.
   * @param {id,pwd} req , user id and new password for the user
   * @returns On Success, returns a message with Password updated.
   *          On Failure, returns relavent error message.
   */
  pwdupdate: async function (req, res) {
    console.log('request for pwd');
    let userId = req.param('id'),
      pwd = req.param('newpwd');

    User.findOne({ id: userId }).then(_user => {
      User.update({ id: _user.id }, {
        pwd: pwd
      }).then(_upuser => {
        return res.ok('Password updated');
      }).catch(err => res.serverError(err.message));
    }).catch(err => res.serverError(err.message));

  },

  //status updte
  /**
   * `UserController.statusupdate()`
   * @description :: Updates the status for given user.
   * @param {id,status} req , user id and status (Enable or Disable) for the user
   * @returns On Success, returns a message with Status updated.
   *          On Failure, returns relavent error message.
   */
  statusupdate: async function (req, res) {
    let userId = req.param('id'),
      status = req.param('status');

    User.findOne({ id: userId }).then(_user => {
      User.update({ id: _user.id }, {
        status: status
      }).then(_upuser => {
        return res.ok('Status updated');
      }).catch(err => res.serverError(err.message));
    }).catch(err => res.serverError(err.message));

  },

  /**
   * `UserController.update()`
   * @description :: Updates the User infromation in Database for given user.
   * @param {id,name,role,email,pwd,mobile,skype,lastname,company} req , user id and status (Enable or Disable) for the user
   * @returns On Success, returns a message with Data Updated.
   *          On Failure, returns relavent error message.
   */
  update: async function (req, res) {

    let userId = req.param('id');
    let name = req.param('name'),
      role = req.param('role'),
      email = req.param('email'),
      pwd = req.param('pwd'),
      mno = req.param('mno'),
      lastname = req.param('lastname'),
      skype = req.param('skype'),
      compay = req.param('company'),
      remarks = req.param('remarks'),
      parentid = req.param('parentid'),
      balance = req.param('parentid'),
      status = req.param('status'),
      resettoken = '',
      pwdresettoken = '';

    if (!name) {
      return res.badRequest({ error: 'Invalid name' });
    }

    if (!email) {
      return res.badRequest({ error: 'Invlaid email' });
    }
    User.find({ email: email }).then(usr => {
      console.log(usr);
      if (usr.length === 0 || usr[0].id === userId) {

    User.update({ id: userId }, {
      name: name,
      role: role,
      email: email,
      mno: mno,
      lastname: lastname,
      skype: skype,
      company: compay,
      remarks: remarks,
      parentid: parentid,
      status: status,
      balance: balance,
      resettoken: resettoken,
      pwdresettoken: pwdresettoken
    })
      .then(_user => {
        return res.ok({ message: 'Data Updated' });

      })
      .catch(err => res.serverError(err.message));

      }else {
        return res.serverError({ message: 'Email Already Exist' });
      }
    });


  },


  verify: function (req, res) {
    User.findOne({ 'resettoken': req.params.id }, function (err, user) {
      if (user) {
        user.verifyuser = true;
        user.resettoken = "";
        rand = randomString.generate({
          length: 30,
          charset: 'alphabetic'
        });
        user.pwdresettoken = rand;
        
        User.update(
          { id: user.id }, user
        ).exec(function (err, users) {
        })
        link = req.protocol + "://" + sails.config.dspServerUrl + "/passwordReset/" + rand;
        //res.redirect(req.protocol + "://" + sails.config.dspClintUrl + "/login");
        res.redirect(link);
      }
      else {
        res.end("<h1>Bad Request</h1>");
      }
    })
  },

  passwordResetMail: function(req,res){
    User.findOne({'email': req.body.email}, function (err, user) {
      if (err) throw err;
      else {
          if (user) {
              try {
                  rand = randomString.generate({
                      length: 30,
                      charset: 'alphabetic'
                  });
                  link = req.protocol + "://" + sails.config.dspServerUrl + "/passwordReset/" + rand;
                  var template = fs.readFileSync(__dirname + "/../template/mail.html", 'utf8');
                  var compiledTemplate = hogan.compile(template);
                  user.pwdresettoken = rand;
                  User.update({ id: user.id }, user).then(d => {
                    console.log(d)
                  }).catch(e => {
                    console.log(e)
                  });

                        var smtpTransport = nodemailer.createTransport({
                          service: "SendGrid",
                          auth: {
                            user: "azure_da28c768db3b337d8eaa33f0da4ec084@azure.com",
                            pass: "Videotap@9966"
                          }
                        });
                          mailOptions = {
                              from : 'info@videotap.com',
                              to: req.body.email,
                              subject: "Reset Password",
                              html: compiledTemplate.render({link: link, name: user.name})
                          }
                          smtpTransport.sendMail(mailOptions, function (error, response) {
                              if (error) {
                                  res.end("error");
                              } else {
                                  res.send({success: true});
                              }
                          });




              }
              catch (exception) {
                  //console.log(exception);
              }

          }
          else {
              res.json({success: false, message: "User does not exist."});
          }
      }
  })
  },

  passwordReset: function (req, res) {
    User.findOne({ 'pwdresettoken': req.params.id }, function (err, user) {
        if (user) {
          try {
            user.pwdresettoken = '';
            User.update(
              { id: user.id }, user
            ).exec(function (err, users) {
            })
            res.redirect(req.protocol + "://" + sails.config.dspClintUrl + "/resetpass?id="+user.id);
          }
          catch (exception) {
          }

        }
        else {
          res.end("<h1>Bad Request</h1>");
        }
      })
  },

  getNewPassword: function (req, res) {
    User.findOne({ '_id': req.body.id }, function (err, user) {

      if (user) {
        try {
          user.pwd = req.body.password;
          User.update(
            { id: user.id }, user
          ).exec(function (err, users) {
            if (err) throw err;
            else
              res.status(200).send({ success: true, user: user });
          })
        }
        catch (exception) {
        }
      }
      else {
        res.json({ success: false });
      }
    })
  },

  getuserInfo: function (req, res) {

    User.findOne({ '_id': req.params.id }, function (err, user) {
        if (user) {
          try {
            res.status(200).send({ success: true, user: user });
          }
          catch (exception) {
          }

        }
      })
  },

  logout: (req, res) => {
		req.session.destroy();
		res.status(200).send({'status': 'success', 'message': 'Succesfully logged out'})
	}

};

