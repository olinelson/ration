module.exports = {


  friendlyName: 'Destroy one thing',


  description: 'Delete on thing from the database.',


  inputs: {
    id: {
      type: 'number',
      required: true,
    }
  },


  exits: {
    forbidden: {
      description: 'The user making this request doesn\'t have the appropriate permissions to delete this thing',
      responseType: 'forbidden'
    },
    notFound: {
      description: 'The id of the thing could not be found',
      responseType: 'notFound'
    }
  },


  fn: async function (inputs) {
    console.log('in destroy one thing', inputs);

    var thing = await Thing.findOne({
      id: inputs.id
    });
    if (!thing) { throw 'notFound'; }

    if (thing.owner !== this.req.me.id) {
      throw 'forbidden';
    }

    await Thing.destroy({ id: inputs.id });
    // All done.
    return;

  }


};
