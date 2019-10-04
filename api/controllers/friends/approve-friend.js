module.exports = {


  friendlyName: 'Approve friend',


  description: '',


  inputs: {
    friend: {
      description: 'An array of users to add as friends.',
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

    await User.addToCollection(foundFriend.id, 'friends', this.req.me.id);
    await User.addToCollection(this.req.me.id, 'friends', foundFriend.id);

    await User.removeFromCollection(this.req.me.id, 'inboundFriendRequests')
      .members([foundFriend.id]);
    // All done.
    return { friend: foundFriend };

  }


};
