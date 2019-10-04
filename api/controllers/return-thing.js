module.exports = {


  friendlyName: 'Return thing',


  description: '',


  inputs: {
    id: {
      description: 'The id of the thing that is being returned',
      type: 'number',
      required: true
    },
    whenToDropOffThingMessage: {
      description: 'The text saying when the borrower would like to return the thing',
      type: 'string',
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
    var thing = await Thing.findOne({ id: inputs.id }).populate('owner').populate('borrowedBy');
    console.log(thing);
    if (!thing.borrowedBy) {
      throw 'conflict';
    }

    var updatedThing = await Thing.updateOne({ id: thing.id }).set({ borrowedBy: null });

    if (!updatedThing) {
      throw 'notFound';
    }
    // All done.
    await sails.helpers.sendTemplateEmail.with({
      to: thing.owner.emailAddress,
      subject: this.req.me.fullName + ' wants to return your ' + updatedThing.label,
      template: 'email-return-thing',
      templateData: {
        borrowerName: this.req.me.fullName,
        borrowerEmail: this.req.me.emailAddress,
        itemLabel: thing.label,
        fullName: thing.owner.fullName,
        whenToDropOffThingMessage: inputs.whenToDropOffThingMessage
      }
    });


    return { updatedThing };

  }


};
