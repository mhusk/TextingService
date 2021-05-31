var welcomeMessage = ss.getSheetByName('Welcome Message').getRange('b1').getValue();


/**
 * This will add a subscriber to our subscriber list
 * @param {string} phoneNumber
 */
function Join(phoneNumber){
  var timeStamp = new Date();
  phoneNumber = TwilioLibrary.lookup(phoneNumber,sid,auth).national_format;
  if(CheckForDuplicates(phoneNumber) == true){
    var message = 'You are already a subscriber!';
    var output = ContentService.createTextOutput(message);
    return output
  } else{
    subscriberSheet.appendRow([timeStamp, phoneNumber]);
    var output = ContentService.createTextOutput(welcomeMessage);
    return output
  }
  //SendWelcomeText(phoneNumber);
}

/**
 * Check to see if phone number is already a subscriber
 * @param {string} phoneNumber
 */
function CheckForDuplicates(phoneNumber){
  var phoneNumbers = subscriberSheet.getDataRange().getValues().slice(1).map(x => x[1]);
  return phoneNumbers.includes(phoneNumber)
}
