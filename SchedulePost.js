/**
 * Need to create some script properties that store the credentials for 
 */


/**
 * Will schedule the post to be sent out
 */
function SchedulePost(){
  var date = String(GetUserInput('Enter the date you want to send post \n \n (Format Help: 5/18)'));
  // Need to create a function called GetDate() will need to handle all the error handling and looping
  var monthDay = 0;
  var hour = 0;
  var minute = 0;
  if(date == 'CLOSE'){
    UIAlert('Your post will not be sent')
    return
  } else{
    date = date.split('/');
    if(date.length < 2){
      UIAlert('The Date is not in the correct format \n \n Format Help: 5/18');
      return
    } else{
      monthDay = date[1];
      var time = String(GetUserInput('Enter the time you want to send the post \n \n (Format Help: 6:00 PM)'));
      time = time.split(':');
      var amPM = time[1].split(' ');
      if(amPM.length < 2){
        UIAlert('Your time was not formatted correctly. \n \n Make sure to include a space between the time and AM or PM');
        // Need to create a function called GetTime()
      } else{

      }
    }
  }
}

/**
 * Will return the day, month and year the user wants to schedule the post.
 */
function GetDate(){
  
}

/**
 * Will send out a draft of your post
 */
function SendOutDraftPost(){
  var ui = SpreadsheetApp.getUi();
  var input = postSheet.getRange(1,2).getValue();
  var unsubMessage = 'Reply Stop to unsubscribe from this messaging service';
  var message = input + '\n \n' + unsubMessage;
  Logger.log(message);
  var userInput_phoneNumber = GetUserInput('Enter the phone number you want to send the draft post to:');
  if(userInput_phoneNumber == 'CLOSE'){
    ui.alert('No number was entered');
    return
  } else{
    var phoneNumber_DRAFT = FormatPhoneNumber(userInput_phoneNumber);
    //Error handling if it spits back an error.
    TwilioLibrary.sendSms(phoneNumber_DRAFT,message,sid,auth,twilNum);
  }
}

/**
 * Take in a phone number and format the phone number.
 * @param {string} input
 */
function FormatPhoneNumber(input){
  return TwilioLibrary.lookup(input,sid,auth).national_format;
}

/**
 * Will take in user data using a pop-up text entry.
 */
function GetUserInput(question){
  var ui = SpreadsheetApp.getUi();
  var prompt = ui.prompt(question)
  var userInput = prompt.getResponseText();
  var buttonPress = prompt.getSelectedButton();
  if(buttonPress === ui.Button.CLOSE){
    return buttonPress
  }
  return userInput
}

/**
 * A UI Alert for the user.
 * @param {string} message - the message you want the user to read.
 */
function UIAlert(message){
  var ui = SpreadsheetApp.getUi();
  ui.alert(message);
}

/**
 * Will create the Post Sheet if it is not there
 */
function CreatePostSheet(){
  var ui = SpreadsheetApp.getUi();
  if(CheckIfSheetExists('Post') == true){
    ui.alert('Sheet already exists: Post');
  } else{
    ss.insertSheet('Post');
    FormatPostSheet();
  }
}

/**
 * This will format the Post Sheet
 * @param {SpreadsheetApp.Sheet} postSheet
 */
function FormatPostSheet(){
  var postSheet = ss.getSheetByName('Post');
  postSheet.clear();
  var labels = ['Message'];
  //var labels = ['Title','Subtitle','Link','Date','Time (EST)'];
  var labelRow = 1;
  for(var i = 0; i < labels.length; i++){
    postSheet.getRange(labelRow,1).setValue(labels[i]).setVerticalAlignment('middle');
    labelRow = labelRow + 1;
  }
  
  var fillIn = ['(Insert Message Here!)' + '\n \n'+ 'Use [Option/Alt + Enter] to get a new line']
  //var fillIn = ['(Insert Title)', '(Insert Subtitle)', '(Insert Link)','(Insert Date)','(Insert Time)'];
  var fillInRow = 1;
  for(var i = 0; i < fillIn.length; i++){
    postSheet.getRange(fillInRow,2).setValue(fillIn[i]).setVerticalAlignment('middle');
    postSheet.setRowHeight(1,200);
    postSheet.setColumnWidth(2,300);
    fillInRow = fillInRow + 1;
  }
}

/**
 * This will tell you if a sheet with the given name exists
 * @param {string} sheetName
 */
function CheckIfSheetExists(sheetName){
  var sheets = ss.getSheets().map(x => x.getName());
  var test = sheets.includes('Post');
  if(sheets.includes(sheetName) == true){
    //Logger.log(`There is a sheet called ${sheetName}`);
    return true;
  } else{
    return false
  }
}


// /**
//  * Gets the details of the post
//  * @returns {Object}
//  */
// function GetPostDetails(){
//   var postData = postSheet.getRange(1,2,5,1).getValues();
//   var postObject = new Object();
//   postObject.title = postData[0][0];
//   postObject.subtitle = postData[1][0];
//   postObject.link = postData[2][0];
//   postObject.date = postData[3][0];
//   postObject.time = postData[4][0];
  
//   return postObject
// }









/**
 * This will create a trigger to run SendNewsletter and then create another trigger to delete that trigger.
 */
function ScheduleNewsletter(){
  var dayFromSheet = newsletter_SHEET.getRange('B4').getValue();
  var newDate = dayFromSheet.toString().split(' ');
  var monthDay = newDate[2];
  var time = newsletter_SHEET.getRange('B5').getValue().toString().split(' ')[4].split(':');
  var hour = time[0];
  var minute = time[1];

  ScriptApp.newTrigger('SendNewsletter')
  .timeBased()
  .onMonthDay(monthDay)
  .atHour(hour)
  .nearMinute(minute)
  .create();

  var hourLater = parseInt(hour) + 1;

  ScriptApp.newTrigger('DeleteTriggers')
  .timeBased()
  .onMonthDay(monthDay)
  .atHour(hourLater)
  .nearMinute(minute)
  .create();
}

/**
 * This will send out the newsletter that is laid out on the sheet.
 */
function SendNewsletter(){
  var details = GetNewsletterDetails();
  if(details.length != 3){
    Logger.log('SendNewsletter: No enough details provided');
  } else{
    var message = CreateNewsletterMessage(details);
    SendToMembers(message);
  }
}

/**
 * Will delete the triggers associated with scheduling the newsletter
 */
function DeleteTriggers(){
  var onSubmission_ID = '8242717008434842736';
  var allTriggers = ScriptApp.getProjectTriggers();
  for(var i = 0; i < allTriggers.length; i++){
    Logger.log(allTriggers[i].getUniqueId());
    if(allTriggers[i].getUniqueId() != onSubmission_ID){
      ScriptApp.deleteTrigger(allTriggers[i]);
      Logger.log('Deleted a Trigger');
    }
  }
}

/**
 * This will take the message and send it to all of the of the members
 * @param {String} message
 */
function SendToMembers(message){
  var memberData = member_SHEET.getDataRange().getValues().slice(1);
  var memberNumbers = memberData.map(function(r){return r[2]});
  for(var i = 0; i < memberNumbers.length; i++){
    sendSms(memberNumbers[i], message);
  }
}

/**
 * This will create the newsletter message
 * @param {Object[]} details
 */
function CreateNewsletterMessage(details){
  var newsletterMessage = details[0] + '\n' + details[1] + '\n \n' + details[2] + '\n \n';
  var unsubURL = 'https://forms.gle/5yaFAAwVH3MDBkc2A';
  var unsubMessage = 'If you want to stop recieving texts fill out the form below \n' + unsubURL + '\n \n';
  var closer = 'Thank you for supporting What You Missed This Week!';
  var message = newsletterMessage + unsubMessage + closer;
  return message;
}


/**
 * This will get all of the details of the newsletter.
 */
function GetNewsletterDetails(){
  var title = newsletter_SHEET.getRange('B1').getValue();
  var subtitle = newsletter_SHEET.getRange('B2').getValue();
  var url = newsletter_SHEET.getRange('B3').getValue();
  return [title, subtitle, url];
}
