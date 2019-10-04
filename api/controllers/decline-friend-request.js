module.exports = {


  friendlyName: 'Decline friend request',


  description: '',


  inputs: {
    friend: {
      description: 'An user object to remove from current users inbound friend requests.',
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
    const potentialFriend = await User.findOne({ emailAddress: inputs.friend.emailAddress });


    await User.removeFromCollection(this.req.me.id, 'inboundFriendRequests')
      .members([potentialFriend.id]);
    // All done.
    return { friend: potentialFriend };

  }


};
