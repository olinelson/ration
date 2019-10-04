/**
 * Thing.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    label: {
      type: 'string',
      example: 'Great Drum Kit',
      description: 'A user-submitted label describing this thing'

    },

    imageUploadFd: {
      type: 'string',
      required: true,
      description: 'The skipper file descriptor that uniquely identifies the uploaded image'
    },

    imageUploadMime: {
      type: 'string',
      required: true,
    },
    expectedReturnAt: {
      type: 'number',
      example: 4654654321,
      description: 'A js timestamp representing the moment of this item\'s expected return'
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    owner: {
      model: 'User',
      required: true,
    },
    borrowedBy: {
      model: 'User',
      description: 'The id of the user who is currently borrowing the thing or null.'
    }
  },

};

