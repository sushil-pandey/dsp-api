/**
 * LoggerController
 *
 * @description :: Server-side actions for handling incoming requests for Create, Find and Get Activity log information.
 *                 Activity log is created based on user action
 *                 Uses Mongo Database to store , Update , Delete and retrieve  Information.
 * @Database :: Mongo
 * @model :: Logger
 */

module.exports = {


    /**
     * `LoggerController.create()`
     * @description :: receives request from front end to create Log
     * @param {msg user} :: request parameters
     * @returns :: On Success, returns Activity logged
     *             On Failure, returns relavent error Message.
     */
    create: async function (req, res) {
      let msg = req.param('msg');
      let user = req.param('user');
  
      if (!msg) {
        return res.badRequest({ error: 'Msg not foung try agin' });
      }
      console.log('userid - ', user);
  
      Logger.create({
        msg: msg,
        user: user
      })
        .then(_logger => {
          //    console.log('logging details inserted');
          return res.ok('Activity logged');
        })
        .catch(err => res.serverError(err.message));
  
      //console.log('logging completed');
  
    },
  
    /**
     * `LoggerController.findAll()`
     * @description :: receives request from front end to fetch all Logs
     * @returns :: On Success, returns all logs limited to 100 records
     *             On Failure, returns No records found
     */
    findAll: async function (req, res) {
  
      // let _users = await  Logger.find().sort('createdAt DESC');
      //  return res.ok(_users);
  
  
      Logger.find().sort('createdAt DESC').limit(100)
        .populate('user')
        .then(_users => {
          if (!_users || _users.length === 0) {
            throw new Error('No records found');
          }
          return res.ok(_users);
        })
        .catch(err => res.serverError(err.message));
  
    },
  
    /**
     * `LoggerController.findOne()`
     * @note :: Not implemented
     */
    findOne: async function (req, res) {
      return res.json({
        todo: 'findOne() is not implemented yet!'
      });
    },
  
    /**
     * `LoggerController.delete()`
     * @note :: Not implemented
     */
    delete: async function (req, res) {
      return res.json({
        todo: 'delete() is not implemented yet!'
      });
    },
  
    /**
     * `LoggerController.update()`
     * @note :: Not implemented
     */
    update: async function (req, res) {
      return res.json({
        todo: 'update() is not implemented yet!'
      });
    }
  
  };
  
  