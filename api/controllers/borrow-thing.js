module.exports = {


  friendlyName: 'Borrow thing',


  description: '',


  inputs: {
    id: {
      description: 'The id of the thing that is being borrowed',
      type: 'number',
      required: true
    },
    expectedReturnAt: {
      description: 'When the item is meant to be returned',
      type: 'number',
      required: true
    },
    whenToPickUpThingMessage: {
      description: 'When can the borrower pick up the item?',
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
    }
  },


  fn: async function (inputs) {
    var thing = await Thing.findOne({ id: inputs.id });

    console.log(inputs);


    // if item is already borrowed
    if (thing.borrowedBy) {
      console.log('is already borrowed');
      throw 'forbidden';
    }

    if (new Date(inputs.expectedReturnAt) < new Date) {
      console.log('invalid date');
      throw 'forbidden';
    }

    {
      var updatedThing = await Thing.updateOne({ id: thing.id }).set({
        borrowedBy: this.req.me.id,
        expectedReturnAt: inputs.expectedReturnAt,
        // pickUpAt: inputs.pickUpAt,
      });
    }

    var fullUpdatedThing = await Thing.findOne({ id: updatedThing.id }).populate('owner').populate('borrowedBy');

    sails.log(fullUpdatedThing);

    if (!fullUpdatedThing) {
      throw 'notFound';
    }
    await sails.helpers.sendTemplateEmail.with({
      to: fullUpdatedThing.owner.emailAddress,
      subject: 'Will you share your ' + fullUpdatedThing.label,
      template: 'email-borrow-item',
      templateData: {
        borrowerName: this.req.me.fullName,
        borrowerEmail: this.req.me.emailAddress,
        itemLabel: fullUpdatedThing.label,
        fullName: fullUpdatedThing.owner.fullName,
        pickupInfo: inputs.whenToPickUpThingMessage,
        expectedReturnAt: new Date(fullUpdatedThing.expectedReturnAt).toDateString()
      }
    });

    // All done.
    return { fullUpdatedThing };

  }


};
