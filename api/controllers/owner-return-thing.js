module.exports = {


  friendlyName: 'Owner return thing',


  description: '',



  inputs: {
    id: {
      description: 'The id of the thing that is being returned',
      type: 'number',
      required: true
    }
  },


  exits: {
    forbidden: {
      responseType: 'forbidden'
    },
    notFound: {
      responseType: 'notFound'
    },
    conflict: {
      responseType: 'conflict'
    }
  },

  fn: async function (inputs) {
    var thing = await Thing.findOne({ id: inputs.id });
    console.log(thing);
    if (!thing.borrowedBy) {
      throw 'conflict';
    }

    var updatedThing = await Thing.updateOne({ id: thing.id }).set({ borrowedBy: null });

    if (!updatedThing) {
      throw 'notFound';
    }

    return { updatedThing };
  }


};
