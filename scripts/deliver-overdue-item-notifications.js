module.exports = {


  friendlyName: 'Deliver overdue item notifications',


  description: '',


  fn: async function () {
    var overdueThings = await Thing.find({
      borrowedBy: { '!=': null },
      expectedReturnAt: { '<=': Date.now() - 1000 * 60 * 60 * 12 }
    }).populate('owner').populate('borrowedBy');

    sails.log(overdueThings);

    for (let overdueThing of overdueThings) {
      await sails.helpers.sendTemplateEmail.with({
        to: overdueThing.borrowedBy.emailAddress,
        subject: 'Get Ready To Return Your Item',
        template: 'email-return-thing-soon',
        templateData: {
          overdueThing: overdueThing,
        }
      });
    }

    sails.log('Running custom shell script... (`sails run deliver-overdue-item-notifications`)');

  }


};

