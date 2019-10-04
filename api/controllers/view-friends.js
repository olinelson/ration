module.exports = {


  friendlyName: 'View friends',


  description: 'Display "Friends" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/friends'
    }

  },


  fn: async function () {
    var me = await User.findOne({ id: this.req.me.id })
      .populate('friends')
      .populate('inboundFriendRequests')
      .populate('outboundFriendRequests');
    var friends = me.friends.map(friend => { return { 'emailAddress': friend.emailAddress, 'fullName': friend.fullName }; });
    var outboundFriendRequests = me.outboundFriendRequests.map(friend => { return { 'emailAddress': friend.emailAddress, 'fullName': friend.fullName }; });
    var inboundFriendRequests = me.inboundFriendRequests.map(friend => { return { 'emailAddress': friend.emailAddress, 'fullName': friend.fullName }; });

    //
    // Respond with view.
    return {
      friends,
      inboundFriendRequests,
      outboundFriendRequests
    };

  }


};
