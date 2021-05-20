var welcomeMessage = ss.getSheetByName('Welcome Message').getRange('b1').getValue() + twilioCompliance;

function Test(){
  Logger.log(welcomeMessage);
}

function TestWelcomeMessage(){
  var userInput = GetUserInput('Enter the phone number you want to send the welcome message to:');
  if(userInput == 'CLOSE'){
    ui.alert('No number was entered');
    return
  } else{
    //Error handling if it spits back an error.
    var phoneNumber = FormatPhoneNumber(userInput);
    TwilioLibrary.sendSms(phoneNumber,welcomeMessage,sid,auth,twilNum);
  }
}

// function SendOutDraftPost(){
//   var ui = SpreadsheetApp.getUi();
//   // var input = postSheet.getRange(1,2).getValue();
//   // var unsubMessage = 'Reply Stop to unsubscribe from this messaging service';
//   // var message = input + '\n \n' + unsubMessage;
//   var message = CreatePost();
//   Logger.log(message);
//   var userInput_phoneNumber = GetUserInput('Enter the phone number you want to send the draft post to:');
//   if(userInput_phoneNumber == 'CLOSE'){
//     ui.alert('No number was entered');
//     return
//   } else{
//     var phoneNumber_DRAFT = FormatPhoneNumber(userInput_phoneNumber);
//     //Error handling if it spits back an error.
//     TwilioLibrary.sendSms(phoneNumber_DRAFT,message,sid,auth,twilNum);
//   }
// }

/**
 * @param {string} sheetName
 */
function CreateWelcomeSheet(){
  //var ui = SpreadsheetApp.getUi();
  if(CheckIfSheetExists('Welcome Message') == true){
    UIAlert(`Sheet already exists: ${sheetName}`);
  } else{
    ss.insertSheet('Welcome Message');
    FormatWelcomeSheet()
  }
}

function FormatWelcomeSheet(){
  var welcomeSheet = ss.getSheetByName('Welcome Message');
  welcomeSheet.clear()
  var inputHint = '(Insert Message Here!)' + '\n \n'+ 'Use [Option/Alt + Enter] to get a new line';
  welcomeSheet.getRange('A1').setValue('Welcome Message').setVerticalAlignment('middle');
  welcomeSheet.getRange('B1').setValue(inputHint).setVerticalAlignment('middle');
  welcomeSheet.setRowHeight(1, 100);
  welcomeSheet.setColumnWidth(1, 150);
  welcomeSheet.setColumnWidth(2, 300);
}

/**
 * Will call a UI box and return the input
 */
function UIInput(){

}


// function CreatePostSheet(){
//   var ui = SpreadsheetApp.getUi();
//   if(CheckIfSheetExists('Post') == true){
//     ui.alert('Sheet already exists: Post');
//   } else{
//     ss.insertSheet('Post');
//     FormatPostSheet();
//   }
// }
