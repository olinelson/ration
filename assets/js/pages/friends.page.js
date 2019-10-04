parasails.registerPage('friends', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    friends: [],

    newFriends: [
      { placeholderFullName: 'Sigmund Freud', placeholderEmailAddress: 'all_the_feels@gmail.com', emailAddress: '', fullName: '' },
      { placeholderFullName: 'Julius Caeser', placeholderEmailAddress: 'clementia@noregrets.com', emailAddress: '', fullName: '' },
      { placeholderFullName: 'Catherine de Medici', placeholderEmailAddress: 'france4eva@gmail.com', emailAddress: '', fullName: '' },
    ],

    inboundFriendRequests: [],
    outboundFriendRequests: [],

    selectedFriend: undefined,

    addFriendsModalOpen: false,
    cancelFriendRequestModalOpen: false,
    unFriendModalOpen: false,
    approveFriendModalOpen: false,
    declineFriendModalOpen: false,




    syncing: false,
    cloudError: '',


  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    this.friends = this.friends;
    this.inboundFriendRequests = this.inboundFriendRequests;
    this.outboundFriendRequests = this.outboundFriendRequests;
  },
  mounted: async function () {
    console.log(this.friends);
    console.log('in', this.inboundFriendRequests);
    console.log('out', this.outboundFriendRequests);
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    openAddFriendsModal: function () {
      this.addFriendsModalOpen = true;
    },
    closeAddFriendsModal: function () {
      this.addFriendsModalOpen = false;
      this.newFriends = [
        { placeholderFullName: 'Sigmund Freud', placeholderEmailAddress: 'all_the_feels@gmail.com', emailAddress: '', fullName: '' },
        { placeholderFullName: 'Julius Caeser', placeholderEmailAddress: 'clementia@noregrets.com', emailAddress: '', fullName: '' },
        { placeholderFullName: 'Catherine de Medici', placeholderEmailAddress: 'france4eva@gmail.com', emailAddress: '', fullName: '' },
      ];
    },
    handleParsingAddFriendsForm: function () {
      let friends = this.newFriends.filter(f => f.emailAddress.length && f.fullName.length);
      this.outboundFriendRequests = this.outboundFriendRequests.concat(friends);
      return { friends };
    },
    submittedAddFriendsForm: function () {
      this.addFriendsModalOpen = false;
      this.newFriends = [
        { placeholderFullName: 'Sigmund Freud', placeholderEmailAddress: 'all_the_feels@gmail.com', emailAddress: '', fullName: '' },
        { placeholderFullName: 'Julius Caeser', placeholderEmailAddress: 'clementia@noregrets.com', emailAddress: '', fullName: '' },
        { placeholderFullName: 'Catherine de Medici', placeholderEmailAddress: 'france4eva@gmail.com', emailAddress: '', fullName: '' },
      ];
    },
    addFriendSlot: function () {
      this.newFriends.push({ placeholderFullName: 'Olaf Olafson', placeholderEmailAddress: 'toSleepPerchance@gmail.com', emailAddress: '', fullName: '' });
    },
    handleParsingApproveFriendForm: function () {
      return { friend: this.selectedFriend };
    },
    submittedApproveFriendForm: function (res) {
      this.friends.push(res.friend);
      this.approveFriendModalOpen = false;
      this.inboundFriendRequests = this.inboundFriendRequests.filter(f => f.emailAddress !== res.friend.emailAddress);
    },
    handleParsingCancelFriendRequestForm: function () {
      return { friend: this.selectedFriend };
    },
    submittedCancelFriendRequestForm: function (result) {
      this.cancelFriendRequestModalOpen = false;
      this.outboundFriendRequests = this.outboundFriendRequests.filter(f => f.emailAddress !== result.friend.emailAddress);
    },
    handleParsingDeclineFriendRequestForm: function () {
      return { friend: this.selectedFriend };
    },
    submittedDeclineFriendRequestForm: function (result) {
      this.declineFriendModalOpen = false;
      this.inboundFriendRequests = this.inboundFriendRequests.filter(f => f.emailAddress !== result.friend.emailAddress);
    },
    handleParsingUnFriendForm: function () {
      return { friend: this.selectedFriend };
    },
    submittedUnFriendForm: function (result) {
      this.unFriendModalOpen = false;
      this.friends = this.friends.filter(f => f.emailAddress !== result.friend.emailAddress);
    },

    selectFriend: function (friend, action) {
      this.selectedFriend = friend;
      switch (action) {
        case 'unFriend':
          this.unFriendModalOpen = true;
          break;
        case 'approveFriend':
          this.approveFriendModalOpen = true;
          break;
        case 'declineFriend':
          this.declineFriendModalOpen = true;
          break;
        case 'cancelFriendRequest':
          this.cancelFriendRequestModalOpen = true;
          break;

      }

    },

    closeAllModals: function () {
      this.selectedFriend = undefined;

      this.addFriendsModalOpen = false;
      this.cancelFriendRequestModalOpen = false;
      this.unFriendModalOpen = false;
      this.approveFriendModalOpen = false;
      this.declineFriendModalOpen = false;
    }



    //…
  }
});
