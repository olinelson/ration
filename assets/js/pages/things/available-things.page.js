parasails.registerPage('available-things', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    things: [],

    syncing: false,
    cloudError: '',

    hoveringThingId: null,
    selectedThing: undefined,

    confirmDeleteThingModalOpen: false,
    createNewThingModalOpen: false,
    borrowThingModalOpen: false,
    returnThingModalOpen: false,
    ownerReturnThingModalOpen: false,
    borrowThingSuccessModalOpen: false,
    returnThingSuccessModalOpen: false,

    whenToPickUpThingMessage: '',
    whenToDropOffThingMessage: '',

    uploadFormData: {
      photo: undefined,
      label: '',
      previewImageSrc: ''
    },

    formErrors: ''

  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function () {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    this.things = this.things;

  },
  mounted: async function () {
    console.log(this.things);
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    onHover: function (thingId) {
      this.hoveringThingId = thingId;
    },

    // CREATING THING METHODS
    clickCreateNewThing: function () {
      this.createNewThingModalOpen = true;
    },

    closeCreateNewThingModal: function () {
      this.createNewThingModalOpen = false;
    },

    handleParsingUploadThingForm: function () {
      this.formErrors = {};

      var argins = this.uploadFormData;

      if (!argins.photo) {
        this.formErrors.photo = true;
      }

      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return _.omit(argins, ['previewImageSrc']);
    },

    submittedUploadThingForm: function (result) {
      var newItem = {
        id: result.id,
        label: this.uploadFormData.label,
        isBorrowed: false,
        imageSrc: result.imageSrc,
        owner: this.me,
      };

      // Add the new thing to the list
      this.things.push(newItem);
      console.log(newItem);

      // Close the modal.
      this.closeCreateNewThingModal();

      this.uploadFormData = {
        photo: undefined,
        label: '',
        previewImageSrc: ''
      };
    },

    changeFileInput: function (files) {
      if (files.length !== 1 && !this.uploadFormData.photo) {
        throw new Error('Consistency violation: `changeFileInput` was somehow called with an empty array of files, or with more than one file in the array!  This should never happen unless there is already an uploaded file tracked.');
      }
      var selectedFile = files[0];

      if (!selectedFile && this.uploadFormData.photo) {
        return;
      }

      this.uploadFormData.photo = selectedFile;

      // Set up the file preview for the UI:
      var reader = new FileReader();
      reader.onload = (event) => {
        this.uploadFormData.previewImageSrc = event.target.result;

        // Unbind this "onload" event.
        delete reader.onload;
      };
      // Clear out any error messages about not providing an image.
      this.formErrors.photo = false;
      reader.readAsDataURL(selectedFile);

    },

    // DELETE THING METHODS

    clickDeleteThing: async function (thingId) {
      this.selectedThing = this.things.find(t => t.id === thingId);
      this.confirmDeleteThingModalOpen = true;
    },

    closeConfirmDeleteThingModal: function () {
      this.selectedThing = undefined;
      this.confirmDeleteThingModalOpen = false;
    },

    handleParsingDeleteThingForm: function () {
      return {
        id: this.selectedThing.id
      };
    },

    submittedDeleteThingForm: function () {
      _.remove(this.things, { id: this.selectedThing.id });
      this.confirmDeleteThingModalOpen = false;
      this.selectedThing = undefined;
      this.$forceUpdate();
    },

    // BORROW THING METHODS
    setPickUpTimeForSelectedEvent: function (timeStamp) {
      if (timeStamp) {
        this.selectedThing.pickUpAt = timeStamp;
        return null;
      }
    },

    setExpectedReturnAtForSelectedEvent: function (timeStamp) {
      if (timeStamp) {
        this.selectedThing.expectedReturnAt = timeStamp;
        return null;
      }
      this.selectedThing.expectedReturnAt = new Date().getTime();
    },

    closeBorrowThingModal: function () {
      this.borrowThingModalOpen = false;
      this.whenToPickUpThingMessage = '';
    },

    clickBorrowThing: function (thingId) {
      this.selectedThing = this.things.find(t => t.id === thingId);
      this.borrowThingModalOpen = true;
    },

    handleParsingBorrowThingForm: function () {
      return { id: this.selectedThing.id, expectedReturnAt: this.selectedThing.expectedReturnAt, whenToPickUpThingMessage: this.whenToPickUpThingMessage };
    },

    submittedBorrowThingForm: function () {
      var borrowedItem = _.find(this.things, { id: this.selectedThing.id });
      borrowedItem.borrowedBy = this.me;
      this.borrowThingModalOpen = false;
      this.whenToPickUpThingMessage = '';
      this.borrowThingSuccessModalOpen = true;
    },

    closeBorrowThingSuccessModal: function () {
      this.borrowThingSuccessModalOpen = false;
      this.selectedThing = undefined;

    },

    // RETURN THING METHODS
    closeReturnThingModal: function () {
      this.returnThingModalOpen = false;
      this.whenToDropOffThingMessage = '';
    },

    closeReturnThingSuccessModal: function () {
      this.returnThingSuccessModalOpen = false;
      this.selectedThing = undefined;

    },

    clickReturnThing: function (thingId) {
      this.selectedThing = this.things.find(t => t.id === thingId);
      this.returnThingModalOpen = true;
    },

    handleParsingReturnThingForm: function () {
      return {
        id: this.selectedThing.id,
        whenToDropOffThingMessage: this.whenToDropOffThingMessage
      };
    },

    submittedReturnThingForm: function () {
      var borrowedItem = _.find(this.things, { id: this.selectedThing.id });
      borrowedItem.borrowedBy = null;
      this.returnThingModalOpen = false;
      this.returnThingSuccessModalOpen = true;
      this.whenToDropOffThingMessage = '';
    },

    // OWNER RETURN THING METHODS
    closeOwnerReturnThingModal: function () {
      this.ownerReturnThingModalOpen = false;
    },

    clickOwnerReturnThing: function (thingId) {
      this.selectedThing = this.things.find(t => t.id === thingId);
      this.ownerReturnThingModalOpen = true;
    },

    handleParsingOwnerReturnThingForm: function () {
      return {
        id: this.selectedThing.id,
      };
    },

    submittedOwnerReturnThingForm: function () {
      var borrowedItem = _.find(this.things, { id: this.selectedThing.id });
      borrowedItem.borrowedBy = null;
      this.borrowThingModalOpen = false;
      this.selectedThing = undefined;
    },







  }
});
