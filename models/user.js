
var bcrypt = require("bcryptjs");

module.exports = {

  datastore: 'mongodbServer',

  tableName: 'users',
  migrate: 'safe',
  attributes: {
    id: { type: 'string', columnName: '_id' },
    name: { type: 'string', required: true },
    role: { type: 'string', required: true },
    email: { type: 'string', unique: true, required: true },
    pwd: { type: 'string', required: true },
    mno: { type: 'string', required: true },
    lastname: { type: 'string' },
    skype: { type: 'string', unique: true },
    company: { type: 'string', required: true },
    remarks: { type: 'string' },
    parentid: { type: 'string' },
    status: { type: 'string' },
    balance: { type: 'string' },
    resettoken: { type: 'string' },
    pwdresettoken: { type: 'string' },
    verifyuser : { type: "boolean", defaultsTo: false},
    logger: {
      collection: 'logger',
      via: 'user'

    }

  },

  // beforeCreate: function (values, cb) {

  //   // Hash password
  //   bcrypt.hash(values.pwd, 10, function (err, hash) {
  //     if (err) return cb(err);
  //     values.pwd = hash;
  //     cb();
  //   });

  // },

  beforeUpdate: function (values, cb) {

    if(values.pwd){
    // Hash password
    bcrypt.hash(values.pwd, 10, function (err, hash) {
      if (err) return cb(err);
      values.pwd = hash;
      cb();
    });
  } else {
    cb();
  }
  },

  // toJSON: function () {
  //   var obj = this.toObject();
  //   delete obj.password;

  //   return obj;
  // }

};
