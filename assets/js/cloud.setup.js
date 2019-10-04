/**
 * cloud.setup.js
 *
 * Configuration for this Sails app's generated browser SDK ("Cloud").
 *
 * Above all, the purpose of this file is to provide endpoint definitions,
 * each of which corresponds with one particular route+action on the server.
 *
 * > This file was automatically generated.
 * > (To regenerate, run `sails run rebuild-cloud-sdk`)
 */

Cloud.setup({

  /* eslint-disable */
  methods: {"confirmEmail":{"verb":"GET","url":"/email/confirm","args":["token"]},"logout":{"verb":"GET","url":"/api/v1/account/logout","args":[]},"updatePassword":{"verb":"PUT","url":"/api/v1/account/update-password","args":["password"]},"updateProfile":{"verb":"PUT","url":"/api/v1/account/update-profile","args":["fullName","emailAddress"]},"updateBillingCard":{"verb":"PUT","url":"/api/v1/account/update-billing-card","args":["stripeToken","billingCardLast4","billingCardBrand","billingCardExpMonth","billingCardExpYear"]},"login":{"verb":"PUT","url":"/api/v1/entrance/login","args":["emailAddress","password","rememberMe"]},"signup":{"verb":"POST","url":"/api/v1/entrance/signup","args":["emailAddress","password","fullName"]},"sendPasswordRecoveryEmail":{"verb":"POST","url":"/api/v1/entrance/send-password-recovery-email","args":["emailAddress"]},"updatePasswordAndLogin":{"verb":"POST","url":"/api/v1/entrance/update-password-and-login","args":["password","token"]},"claimAccountAndLogin":{"verb":"POST","url":"/api/v1/entrance/claim-account-and-login","args":["password","fullName","token"]},"deliverContactFormMessage":{"verb":"POST","url":"/api/v1/deliver-contact-form-message","args":["emailAddress","topic","fullName","message"]},"destroyOneThing":{"verb":"DELETE","url":"/api/v1/things/destroy-one-thing","args":["id"]},"uploadThing":{"verb":"POST","url":"/api/v1/things/upload-thing","args":["photo","label"]},"downloadPhoto":{"verb":"GET","url":"/api/v1/things/download-photo/:id","args":["id"]},"borrowThing":{"verb":"POST","url":"/api/v1/things/borrow-thing","args":["id","expectedReturnAt","whenToPickUpThingMessage"]},"returnThing":{"verb":"POST","url":"/api/v1/things/return-thing","args":["id","whenToDropOffThingMessage"]},"ownerReturnThing":{"verb":"POST","url":"/api/v1/things/owner-return-thing","args":["id"]},"approveFriend":{"verb":"POST","url":"/api/v1/friends/approve-friend","args":["friend"]},"addFriends":{"verb":"POST","url":"/api/v1/friends/add-friends","args":["friends"]},"cancelFriendRequest":{"verb":"POST","url":"/api/v1/cancel-friend-request","args":["friend"]},"declineFriendRequest":{"verb":"POST","url":"/api/v1/decline-friend-request","args":["friend"]},"unFriend":{"verb":"POST","url":"/api/v1/un-friend","args":["friend"]}}
  /* eslint-enable */

});
