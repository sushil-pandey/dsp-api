/* eslint-disable prefer-arrow-callback */
/* eslint-disable one-var */
/**
 * CreativeController
 *
 * @description :: Server-side actions for handling incoming requests for Create, Update, Find and Get Creative information.
 *                 Uses Mongo Database to store , Update , Delete and retrieve Creative Information.
 * @Database :: Mongo
 * @model :: Creativedetail,Creative
 */
const axios = require('axios')
var path = require('path');

// Upload multiple file on blob storage
function uploadedFileAsyn(uploadedFiles) {
  return new Promise((resolve, reject) => {
    var filename = Blobupload.filename(uploadedFiles.fd);
    console.log(__dirname);
    var obj = {
      source: path.resolve(__dirname + '/../../assets/images/') + '/' + filename,
      dest: filename,
      header: "public-read",
      tempType: uploadedFiles.type
    };
    Blobupload.upload(obj, function (err, result) {
      if (err || !result || !result.dest) {
        resolve(null)
      }
      resolve(result)
    });
  })
}

module.exports = {

  /**
   * `CreativeController.create()`
   * @description :: receives request from front to create Creative and makes an entry in database
   * @param {name,creativeType,advdomain,lp,imp,click,size,tag,image,desc,..} :: request parameters
   * @returns :: created creative details.
   */
  create: async function (req, res) {

    var ava, fileupload = [];

    req.file('fileupload').upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/images')
    },async function (err, uploadedFiles) {
      if (err) { return res.serverError(err); }

      if (uploadedFiles.length > 0) {
        var promises = uploadedFiles.map(uploadedFileAsyn);
       await Promise.all(promises).then(function(data){
            data.map((x)=>{
              fileupload.push(x.dest);
            })
        })
      }

      let name = req.param('name'),
        creativeType = req.param('creativeType'),
        advdomain = req.param('advdomain'),
        lp = req.param('lp'),
        imp = req.param('imp'),
        click = req.param('click'),

        // creative details = req.param('// creative details'),

        iabsize = req.param('iabsize'),
        adtag = req.param('adtag'),
        mainimage = fileupload,
        // w = req.param('w'),
        // h = req.param('h'),
        dur = req.param('dur'),
        protocol = req.param('protocol'),

        // native param
        rating = req.param('rating'),
        calltoaction = req.param('calltoaction'),
        heading = req.param('heading'),
        description = req.param('desc'),
        spons = req.param('spons'),
        icon = req.param('icon'),
        status = 'Pending',
        trafficStatus = req.param('trafficStatus'),
        remarks = 'Waiting for Approval',
        iconw = req.param('iconw'),
        iconh = req.param('iconh');

        //pixel url
        videostart = req.param('videostart');
        q1 = req.param('q1');
        q2 = req.param('q2');
        q3 = req.param('q3');
        q4 = req.param('q4');

        adskip=req.param('adskip');
        aderror=req.param('aderror');
        adpause=req.param('adpause');
        adresume=req.param('adresume');
        mute=req.param('mute');
        unmute=req.param('unmute');
        adviewport=req.param('adviewport');
        user=req.param('user');

      if (!name) { return res.badRequest({ error: 'Missing Credentials - name' }); }
      if (!user) { return res.badRequest({ error: 'Missing Credentials - user' }); }
      if (!creativeType) { return res.badRequest({ error: 'Missing Credentials - creative type' }); }
      // if (!advdomain) { return res.badRequest({ error: 'Missing Credentials - advdomain' }); }

      if (creativeType === 'Banner') {
        if (!lp && mainimage) { return res.badRequest({ error: 'Missing Credentials - lp ' }); }
        if (!iabsize) { return res.badRequest({ error: 'Missing Credentials - iabsize' }); }
        if (!mainimage && !adtag) { return res.badRequest({ error: 'Missing Credentials - adtag or mainimage' }); }
      }
      split_iab = iabsize.split('x');
      w = split_iab[0];
      h = split_iab[1];
      if (creativeType === 'IBV') {
        if (!iabsize) { return res.badRequest({ error: 'Missing Credentials - iabsize' }); }
        if (!adtag) { return res.badRequest({ error: 'Missing Credentials - adtag' }); }
      }
      if (creativeType === 'Native') {
        if (!rating) { return res.badRequest({ error: 'Missing Credentials - rating' }); }
        if (!calltoaction) { return res.badRequest({ error: 'Missing Credentials - calltoaction' }); }
        if (!heading) { return res.badRequest({ error: 'Missing Credentials - heading' }); }
        if (!description) { return res.badRequest({ error: 'Missing Credentials - description' }); }
        if (!spons) { return res.badRequest({ error: 'Missing Credentials - spons' }); }
        // if(!icon) { return res.badRequest ({ error : 'Missing Credentials' }); }
        // if(!mainimage) { return res.badRequest ({ error : 'Missing Credentials' }); }
        if (!lp) { return res.badRequest({ error: 'Missing Credentials - lp' }); }
      }
      if (creativeType === 'Video') {
        if (!iabsize) { return res.badRequest({ error: 'Missing Credentials - iabsize' }); }
        if (!adtag) { return res.badRequest({ error: 'Missing Credentials - adtag' }); }
        if (!dur) { return res.badRequest({ error: 'Missing Credentials - dur' }); }
        if (!protocol) { return res.badRequest({ error: 'Missing Credentials - protocol' }); }
      }

      // if(!name) { return res.badRequest ({ error : 'Missing Credentials' }); }
      // if(!w) { return res.badRequest ({ error : 'Missing Credentials' }); }
      // if(!h) { return res.badRequest ({ error : 'Missing Credentials' }); }
      // insert creative

      Creativedetail.create({
        iabsize: iabsize,
        adtag: adtag,
        mainimage: mainimage,
        w: w,
        h: h,
        dur: dur,
        protocol: protocol,
        rating: rating,
        calltoaction: calltoaction,
        heading: heading,
        description: description,
        spons: spons,
        icon: icon,
        iconw: iconw,
        iconh: iconh,
        user: user

      }).fetch().then(_detail => {
        Creative.create({
          name: name,
          creativeType: creativeType,
          advdomain: advdomain,
          lp: lp,
          imp: imp,
          click: click,
          status: 'Pending',
          trafficStatus: trafficStatus,
          remarks: 'Wating for approval',

          videostart : videostart,
          q1 : q1,
          q2 : q2,
          q3 : q3,
          q4 : q4,

        adskip : adskip,
        aderror:aderror,
        adpause:adpause,
        adresume:adresume,
        mute:mute,
        unmute:unmute,
        adviewport:adviewport,

          creativedetail: [_detail.id],
          user: user
          //creativedetail : [_detail.id,'5bf51595c21d2d3c64c077ba'],
          // creativedetail : '5bf51310ada4853b3b15b44f'
        }).fetch().then(_creative => {
          Campaign_mapping.create({
            id: _creative.id,
            campaignid : _creative.id,
            campname : name
          }).then(_p=>{
            console.log('Complted postgress DB for campaign update');
          }).catch(err => res.serverError(err.message));
          return res.ok(_creative);
        }).catch(err => res.serverError(err.message));

      }).catch(err => res.serverError(err.message));

    });

    //console.log(ava);

  },

  /**
   * `CreativeController.findAll()`
      * @description :; received request from front end to fetch all available creatives.
   * @returns :: On Success, retuns Creatives information.
   *             On Failure No record found or relavent Message.
   */
  findAll: async function (req, res) {
    Creative.find()
      .populate('creativedetail')
      .then(_users => {
        // if (!_users || _users.length === 0) {
        //   throw new Error('No records found');
        // }
        return res.ok(_users);
      })
      .catch(err => res.serverError(err.message));


  },

  // find all pending status
  /**
 * `CreativeController.findAllPending()`
 * @description :; received request from front end to fetch all available creatives which are not approved.
 * @returns :: On Success, retuns Creatives information.
 *             On Failure No record found or relavent Message.
 */
  findAllPending: async function (req, res) {
    Creative.find({ where: { status: { '!=': ['Active','In-Active'] } } }).populate('user').then(_campaigns => {
      // if (!_campaigns || _campaigns.length === 0) {
      //   throw new Error('Record not found');
      // }
      return res.ok(_campaigns);

    }).catch(err => res.serverError(err.message));
  },


  // update creative status
  /**
  * `CreativeController.updateStatus()`
  * @description :; received request from front end to updated creative status.
  * @param {id} :: request param for which status need to be enabled or disabled.
  * @returns :: On Success, retuns Creatives information.
  *             On Failure No record found or relavent Message.
  */
  updateStatus: async function (req, res) {
    console.log('Campaign update request');
    let id = req.param('id');
    Creative.update({ id: id }, {
      status: req.param('status'),
      remarks: req.param('remarks')
    }).then(_data => {
      CampConfigUrl = "http://localhost:1337/config";
      axios.post(CampConfigUrl, {
        todo: 'Buy the milk'
      })
      .then((res) => {
        console.log(res.data);
        axios.get(CampConfigUrl);
      })
      .catch((error) => {
        console.error(error)
      });

      return res.ok('Campaign Updated with status');
    }).catch(err => res.serverError(err.message));
  },


  /**
   * `CreativeController.findOne()`
   * @note :: not implemented
   */
  findOne: async function (req, res) {
    return res.json({
      todo: 'findOne() is not implemented yet!'
    });
  },

  /**
   * `CreativeController.delete()`
   * @description ::  request for deleting a creative
   * @param {id} :: Creative id for removal
   * @returns :: On Success, returns Creative is deleted with id
   *             On Failure, returns No Creative found in our record or relavent error message.
   */
  delete: async function (req, res) {
    let postId = req.params.id;

    if (!postId) {return res.badRequest({ err: 'missing Creative Id field' });}
    Campaigncreative.find({ creativeid: postId }).then(_creative => {
      if(_creative.length > 0){
        return res.serverError({ message: 'Failed, Creative attached to a campaign' });
      } else {
        Creative.destroy({ id: postId })
        .fetch()
        .then(_post => {
          if (!_post || _post.length === 0) {return res.notFound({ err: 'No Creative found in our record' });}
          return res.ok(`Creative is deleted with id ${postId}`);
        })
        .catch(err => res.serverError(err));
  
      }
    });
    
  },

  // replication
  /**
   * `CreativeController.replicate()`
   * @description ::  request for clone a creative
   * @param  :: Creative Array from which new record inserted in db.
   * @returns :: On Success, returns Creative Details
   *             On Failure, returns relavent error message.
   */
  replicate: async function (req, res) {

    crt = req.param('creativedetail');

    Creativedetail.create({
      iabsize: crt[0].iabsize,
      adtag: crt[0].adtag,
      mainimage: crt[0].mainimage,
      w: crt[0].w,
      h: crt[0].h,
      dur: crt[0].dur,
      protocol: crt[0].protocol,
      rating: crt[0].rating,
      calltoaction: crt[0].calltoaction,
      heading: crt[0].heading,
      description: crt[0].description,
      spons: crt[0].spons,
      icon: crt[0].icon,
      iconw: crt[0].iconw,
      iconh: crt[0].iconh,
      user : crt[0].user

    }).fetch().then(_detail => {
      Creative.create({
        name: req.param('name'),
        creativeType: req.param('creativeType'),
        advdomain: req.param('advdomain'),
        lp: req.param('lp'),
        imp: req.param('imp'),
        click: req.param('click'),
        status: 'Pending',
        trafficStatus: req.param('trafficStatus'),
        remarks: 'Wating for approval',
         //pixel url
         videostart : req.param('videostart'),
         q1 : req.param('q1'),
         q2 : req.param('q2'),
         q3 : req.param('q3'),
         q4 : req.param('q4'),
         adskip:req.param('adskip'),
         aderror:req.param('aderror'),
         adpause:req.param('adpause'),
         adresume:req.param('adresume'),
         mute:req.param('mute'),
         unmute:req.param('unmute'),
         adviewport:req.param('adviewport'),
         user : crt[0].user,
        creativedetail: [_detail.id],
        //creativedetail : [_detail.id,'5bf51595c21d2d3c64c077ba'],
        // creativedetail : '5bf51310ada4853b3b15b44f'
      }).fetch().then(_creative => {

        Creative.findOne({ id: _creative.id }).populate('creativedetail').then(_post => {
          return res.ok(_post);
        }).catch(err => res.serverError(err.message));


      }).catch(err => res.serverError(err.message));

    }).catch(err => res.serverError(err.message));


  },

  /**
   * `CreativeController.update()`
   * @description :: receives request to update a Creative.
   * @param {name,creativeType,advdomain,lp,imp,click,size,tag,image,desc,..} :: request parameters
   * @returns :: On success,returns  updated creative details.
   *             On Failure, Record not found or relavent error Message.
   */
  update: async function (req, res) {

    var ava, fileupload = [];
    var path = require('path');

    req.file('fileupload').upload({
      dirname: require('path').resolve(sails.config.appPath, 'assets/images')
    },async function (err, uploadedFiles) {
      if (err) {return res.serverError(err);}

        if (uploadedFiles.length > 0) {
          var promises = uploadedFiles.map(uploadedFileAsyn);
          await Promise.all(promises).then(function (data) {
            data.map((x) => {
              fileupload.push(x.dest);
            })
          })
        } else {
          fileupload = req.param('fileupload');
        }


      let creativeId;
      let name = req.param('name'),
        creativeType = req.param('creativeType'),
        advdomain = req.param('advdomain'),
        lp = req.param('lp'),
        imp = req.param('imp'),
        click = req.param('click'),

        // creative details = req.param('// creative details'),

        iabsize = req.param('iabsize'),
        adtag = req.param('adtag'),
        mainimage = fileupload,
        // w = req.param('w'),
        // h = req.param('h'),
        dur = req.param('dur'),
        protocol = req.param('protocol'),

        // native param
        rating = req.param('rating'),
        calltoaction = req.param('calltoaction'),
        heading = req.param('heading'),
        description = req.param('desc'),
        spons = req.param('spons'),
        icon = req.param('icon'),
        status = 'Pending',
        trafficStatus = req.param('trafficStatus'),
        remarks = 'Waiting for Approval',
        iconw = req.param('iconw'),
        iconh = req.param('iconh');

        //pixel url
        videostart = req.param('videostart');
        q1 = req.param('q1');
        q2 = req.param('q2');
        q3 = req.param('q3');
        q4 = req.param('q4');
        adskip=req.param('adskip');
        aderror=req.param('aderror');
        adpause=req.param('adpause');
        adresume=req.param('adresume');
        mute=req.param('mute');
        unmute=req.param('unmute');
        adviewport=req.param('adviewport');

      campId = req.param('id');


      if (!name) { return res.badRequest({ error: 'Missing Credentials - name' }); }
      if (!creativeType) { return res.badRequest({ error: 'Missing Credentials - creative type' }); }
      if (!advdomain) { return res.badRequest({ error: 'Missing Credentials - advdomain' }); }

      if (creativeType === 'Banner') {
        if (!lp && mainimage) { return res.badRequest({ error: 'Missing Credentials - lp ' }); }
        if (!iabsize) { return res.badRequest({ error: 'Missing Credentials - iabsize' }); }
        if (!mainimage && !adtag) { return res.badRequest({ error: 'Missing Credentials - adtag or mainimage' }); }
      }
      split_iab = iabsize.split('x');
      w = split_iab[0];
      h = split_iab[1];
      if (creativeType === 'IBV') {
        if (!iabsize) { return res.badRequest({ error: 'Missing Credentials - iabsize' }); }
        if (!adtag) { return res.badRequest({ error: 'Missing Credentials - adtag' }); }
      }
      if (creativeType === 'Native') {
        if (!rating) { return res.badRequest({ error: 'Missing Credentials - rating' }); }
        if (!calltoaction) { return res.badRequest({ error: 'Missing Credentials - calltoaction' }); }
        if (!heading) { return res.badRequest({ error: 'Missing Credentials - heading' }); }
        if (!description) { return res.badRequest({ error: 'Missing Credentials - description' }); }
        if (!spons) { return res.badRequest({ error: 'Missing Credentials - spons' }); }
        // if(!icon) { return res.badRequest ({ error : 'Missing Credentials' }); }
        // if(!mainimage) { return res.badRequest ({ error : 'Missing Credentials' }); }
        if (!lp) { return res.badRequest({ error: 'Missing Credentials - lp' }); }
      }
      if (creativeType === 'Video') {
        if (!iabsize) { return res.badRequest({ error: 'Missing Credentials - iabsize' }); }
        if (!adtag) { return res.badRequest({ error: 'Missing Credentials - adtag' }); }
        if (!dur) { return res.badRequest({ error: 'Missing Credentials - dur' }); }
        if (!protocol) { return res.badRequest({ error: 'Missing Credentials - protocol' }); }
      }
      var ad;
      if(trafficStatus === 'Pause') { status = 'In-Active'; }
      if (adtag.indexOf('{CA}') == -1) {
        var a = adtag.split(' ');
         ad = a.map(function (e) {
          if (e.indexOf('src=') !== -1) {
            return e.slice(0, -1) + '?autoplay=on&adskin=true&seekbar=false&ca={CA}&cr={CR}&s={SR}&source_type={STYPE}&zoneid={ZONEID}"';
          } else {
            return e;
          }
        })
      }
      if(ad){
        adtag = ad.join(" ");
      }
      
      Creative.update({ id: campId }, {
        name: name,
        creativeType: creativeType,
        advdomain: advdomain,
        lp: lp,
        imp: imp,
        click: click,
        status: status,
        trafficStatus: trafficStatus ,
        remarks: 'Wating for approval',
        videostart : videostart,
        q1 : q1,
        q2 : q2,
        q3 : q3,
        q4 : q4,
        adskip : adskip,
        aderror:aderror,
        adpause:adpause,
        adresume:adresume,
        mute:mute,
        unmute:unmute,
        adviewport:adviewport,
      }).fetch().then(_creative => {
        Campaign_mapping.update({id: campId},{
          campname : name,
        }).then(_p=>{
          console.log('updated postgress DB for Campaign update');
        }).catch(err => res.serverError(err.message));
      }).catch(err => res.serverError(err.message));

      Creative.findOne({ id: campId }).populate('creativedetail')
        .then(_post => {
          if (!_post) {return res.notFound({ err: 'No post found' });}
          creativeId = _post.creativedetail[0].id;
          console.log('creative id-', creativeId);

          Creativedetail.update({ id: creativeId }, {
            iabsize: iabsize,
            adtag: adtag,
            mainimage: mainimage,
            w: w,
            h: h,
            dur: dur,
            protocol: protocol,
            rating: rating,
            calltoaction: calltoaction,
            heading: heading,
            description: description,
            spons: spons,
            icon: icon,
            iconw: iconw,
            iconh: iconh,

          }).fetch().then(_detail => {

            return res.ok(_post);
          }).catch(err => res.serverError(err.message));



        })
        .catch(err => res.serverError(err));


    });




  }

};

