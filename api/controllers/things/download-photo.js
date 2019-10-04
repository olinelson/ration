module.exports = {


  friendlyName: 'Download photo',


  description: 'Download photo file (returning a stream).',


  inputs: {
    id: {
      description: 'The id of the thing whose photo we are downloading.',
      type: 'number',
      required: true
    }

  },


  exits: {
    // success: {
    //   outputDescription: 'The streaming bytes of the specified thing\'s photo',
    //   outputType: 'ref'
    // },
    notFound: {
      responseType: 'notFound'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },


  fn: async function (inputs) {


    var thing = await Thing.findOne({ id: inputs.id });

    if (!thing) { throw 'notFound'; }

    var me = await User.findOne({ id: this.req.me.id }).populate('friends');

    var friends = me.friends;

    if (this.req.me.id !== thing.owner && !_.any(friends, { id: thing.owner })) {

      throw 'forbidden';
    }
    // set mime type of response
    this.res.type(thing.imageUploadMime);

    var downloading = await sails.startDownload(thing.imageUploadFd);
    // All done.
    return downloading;

  }


};
