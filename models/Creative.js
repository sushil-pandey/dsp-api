/**
 * Creative.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    datastore: 'mongodbServer',
    tableName: 'creatives',
    migrate: 'safe',
    attributes: {
      id: { type: 'string', columnName: '_id' },
      name: { type: 'string', required: true },
      creativeType: { type: 'string', required: true },
      advdomain: { type: 'string' },
      lp: { type: 'string' },
      imp: { type: 'string' },
      click: { type: 'string' },
      status: { type: 'string' },
      trafficStatus: { type: 'string' },
      remarks: { type: 'string' },
      videostart : { type: 'string' },
      q1 : { type: 'string' },
      q2 : { type: 'string' },
      q3 : { type: 'string' },
      q4 : { type: 'string' },
  
      //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
      //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
      //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
  
  
      //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
      //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
      //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
  
  
      //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
      //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
      //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
      // creativedetail : { model :'creativedetail'},
  
      creativedetail: {
        collection: 'creativedetail',
        via: 'creative'
      },
      user: {
        model: 'user',
        required: true,
    }
  
    },
  
  };
  
  