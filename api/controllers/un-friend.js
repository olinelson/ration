module.exports = {


  friendlyName: 'Un friend',


  description: '',


  inputs: {
    friend: {
      description: 'A user to to un friend.',
      type: {
        fullName: 'string',
        emailAddress: 'string'
      },
      example: {
        fullName: 'Rory Milliard',
        emailAddress: 'rory@example.com'
      },
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs) {
    var foundFriend = await User.findOne({ emailAddress: inputs.friend.emailAddress });

    await User.removeFromCollection(foundFriend.id, 'friends', this.req.me.id);
    await User.removeFromCollection(this.req.me.id, 'friends', foundFriend.id);

    // All done.
    return { friend: foundFriend };

  }


};
