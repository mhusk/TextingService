/**
 * This will add a subscriber to our subscriber list
 * @param {string} phoneNumber
 */
function Join(phoneNumber){
  var timeStamp = new Date();
  phoneNumber = TwilioLibrary.lookup(phoneNumber,sid,auth).national_format;
  subscriberSheet.appendRow([timeStamp, phoneNumber]);
  //SendWelcomeText(phoneNumber);
}
