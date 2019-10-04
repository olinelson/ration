module.exports = {


  friendlyName: 'Upload thing',


  description: '',

  files: ['photo'],


  inputs: {
    photo: {
      type: 'ref',
      description: 'Uploaded file stream',
      required: true,
    },
    label: {
      type: 'string'
    }
  },


  exits: {


    badRequest: {
      description: 'No image upload was provided',
      responseType: 'badRequest'
    },

    success: {
      outputDescription: 'The newly created `Thing`.',
      outputExample: {}
    },
  },


  fn: async function (inputs) {
    var url = require('url');

    var info = await sails.uploadOne(inputs.photo);
    // console.log(info, inputs);

    if (!info) {
      throw 'badRequest';
    }

    var newThing = await Thing.create({
      owner: this.req.me.id,
      label: inputs.label,
      imageUploadFd: info.fd,
      imageUploadMime: info.type,
    }).fetch();

    var imageSrc = url.resolve(sails.config.custom.baseUrl, `/api/v1/things/download-photo/${newThing.id}`);
    // All done.


    return {
      id: newThing.id,
      imageSrc
    };

  }


};
