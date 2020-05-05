/**
 * Campaign.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    datastore: 'mongodbServer',
    tableName: 'campaigns',
    migrate: 'safe',
    attributes: {
      id: { type: 'string', columnName: '_id' },
      // Basic setting
      name: { type: 'string', required: true },
      stdate: { type: 'string', columnType: 'date', required: true },
      eddate: { type: 'string', columnType: 'date', required: true },
      tbudget: { type: 'string', required: true },
      dbudget: { type: 'string', required: true },
      timp: { type: 'string' },
      dimp: { type: 'string' },
      pmpid: { type: 'string' },
      minbid: { type: 'number'},
      maxbid: { type: 'number'},
  
      currency :{ type: 'string', required: true},
      timeZone :{ type: 'string', required: true},
      // Geo Targetting
      country: { type: 'json', columnType: 'array', required: true },
      countryOption: { type: 'string', required: true },
      city: { type: 'json', columnType: 'array', required: true },
      cityOption: { type: 'string', required: true },
  
      //device targetting
      os: { type: 'json', columnType: 'array', required: true },
      osOption: { type: 'string', required: true },
      browser: { type: 'json', columnType: 'array', required: true },
      browserOption: { type: 'string', required: true },
  
      //traffic
      trafficSource: { type: 'json', columnType: 'array', required: true },
      iabCategory: { type: 'json', columnType: 'array', required: true },
      iabCategoryOption: { type: 'string', required: true },
      exchange: { type: 'json', columnType: 'array', required: true },
  
      //carrier
      isp: { type: 'json', columnType: 'array', required: true },
      ispOption: { type: 'string', required: true },
      connectivity: { type: 'json', columnType: 'array', required: true },
  
      //traffic optimize
  
      frequency: { type: 'string',defaultsTo : '0' },
      optimizeBy: { type: 'string' },
      retargetting: { type: 'json', columnType: 'array' ,defaultsTo:[]},
      
      status: { type: 'string' },
      trafficStatus: { type: 'string'    },
      remarks: { type: 'string' },
  
      audience : { type: 'json', columnType: 'array' ,defaultsTo:[]},
  
      //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
      //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
      //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
  
  
      //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
      //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
      //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
  
  
      //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
      //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
      //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  
      user: {
        model: 'user',
        required: true,
    }
    },
  
  };
  
  