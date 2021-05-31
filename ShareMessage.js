/**
 * Will send the user a picture of Sharing QR Code
 * @param {string} sender
 */
function ShareMessage(sender){
  var sender = TwilioLibrary.lookup(sender,sid,auth).national_format;
  var qrCode_URL = 'https://live.staticflickr.com/65535/51209521843_5b3f673d06_b.jpg';
  TwilioLibrary.sendMMS(sender,qrCode_URL,'Show this QR Code to your friend so they can join!',sid,auth,twilNum);
  CountNumberOfShares(sender);
}

/**
 * This will count the number of times each user is sending SHARE to the number.
 * @param {string} phoneNumber
 */
function CountNumberOfShares(phoneNumber){
  var phoneNumbers = subscriberSheet.getDataRange().getValues().slice(1).map(x => x[1]);
  var index = parseInt(phoneNumbers.indexOf(phoneNumber)) + 2;
  var shareCount = parseInt(subscriberSheet.getRange(index,4).getValue()) + 1;
  subscriberSheet.getRange(index,4).setValue(shareCount);
  //Logger.log(shareCount)
}


