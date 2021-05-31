//var properties = PropertiesService.getScriptProperties();


/**
 * Sends the post to all subscribers
 */
function SendPost(){
  var phoneNumberArr = GetSubscriberPhoneNumbers();
  var message = CreatePost();
  //var imageURL = postSheet.getRange('B2').getValue();
  for(var i = 0; i < phoneNumberArr.length; i++){
    var row = 2+i;
    if(GetLatestPostValidation(row)){
      Logger.log('Send Post: Message has already been sent.')
    } else{
      var phoneNumber = phoneNumberArr[i];
      var imageURL = GetImageURL();
      if(imageURL == ''){
        TwilioLibrary.sendSms(phoneNumber,message,sid, auth, twilNum);
      } else{
        TwilioLibrary.sendMMS(phoneNumber,imageURL,message,sid,auth,twilNum);
      }
      UpdateLatestPostValidation(row);
    }
  }
}


function GetImageURL(){
  var val = postSheet.getRange('B2').getValue();
  return val
}

/**
 * Updates that the latest post has been sent column
 * @param {number} row - row that I am updating value
 */
function UpdateLatestPostValidation(row){
  subscriberSheet.getRange(row,3).setValue(true);
}

/**
 * Tells if the latest post has been sent. 
 * @param {number} row - row that you are getting value from
 */
function GetLatestPostValidation(row){
  return subscriberSheet.getRange(row,3).getValue();
}

/**
 * Returns an array of all the subscriber phone numbers.
 */
function GetSubscriberPhoneNumbers(){
  var data = subscriberSheet.getDataRange().getValues().slice(1);
  var numbersOnly = data.map(entry => entry[1])
  return numbersOnly
}


/**
 * Will schedule the post to be sent out
 */
function SchedulePost(){
  var dateInfo = GetDate();
  // Add Error handling if the date is in the past.
  if(dateInfo == 'CLOSE'){
    return
  } else{
    var timeInfo = GetTime();
      if(timeInfo == 'CLOSE'){
        return
      } else{
        SetUpTriggers(dateInfo,timeInfo);
      }
  }
}

/**
 * Create the trigger that will send out the post to all users and the trigger that will delete the trigger.
 * @param {number[]} dateInfo
 * @param {number[]} timeInfo
 */
function SetUpTriggers(dateInfo, timeInfo){
  // dateInfo = [month, day, year]
  // timeInfo = [hour, minute]
  var month = parseInt(dateInfo[0]) - 1; //Because of the way the month is formatted
  var day = dateInfo[1];
  var year = dateInfo[2];
  var hour = parseInt(timeInfo[0]);
  var minute = timeInfo[1];

  var postTime = new Date(year,month,day,hour,minute);
  
  var sendPost_TriggerID = ScriptApp.newTrigger('SendPost')
    .timeBased()
    .at(postTime)
    .create()
    .getUniqueId()
  return sendPost_TriggerID
}

/**
 * Will delete the most trigger for the most recent post
 */
function DeletePostTrigger(){
  var triggerIDs = [properties.getProperty('scheduledPost_ID'), properties.getProperty('deleteTrigger_ID')];
  var allTriggers = ScriptApp.getProjectTriggers();
  for(var i = 0; i < allTriggers.length; i++){
    for(var j = 0; j < triggerIDs.length; j++){
      var trigger = allTriggers[i]
      var triggerID = trigger.getUniqueId();
      if(triggerID == triggerIDs[j]){
        ScriptApp.deleteTrigger(trigger);
      }
    }
  }
  DeleteProperty('scheduledPost_ID');
  DeletePropery('deleteTrigger_ID');
}

/**
 * Gets the time the user enters and converts it 24 hours time
 * @returns {number[]}
 */
function GetTime(){
  var hour = 0;
  var minute = 0;
  var amPM = 0;
  var userInput = String(GetUserInput('Enter the time you want to send out the post. \n Time Zone: EST \n Example: 6:00 PM'));
  if(userInput.split(':') < 2){
    UIAlert('Incorrect Time Input');
    GetTime();
  } else{
    if(userInput.split(' ').length < 2){
      UIAlert('You did not specify AM or PM or you did not include a space');
      GetTime();
    } else{
      hour = userInput.split(':')[0]
      minute = userInput.split(':')[1].split(' ')[0]
      amPM = userInput.split(':')[1].split(' ')[1].toUpperCase();
      Logger.log(amPM)
      if(amPM == 'PM' && hour != 12){
        hour = parseInt(hour) + 12;
      } else if(amPM == 'AM' && hour == 12){
        hour = parseInt(hour) + 12;
      }
      var output = [hour, minute];
      return output;
    }
  }
}

/**
 * Will return the day, month and year the user wants to schedule the post.
 * @returns {number[]}
 */
function GetDate(){
  var month = 0;
  var day = 0;
  var year = 0;
  var userInput = String(GetUserInput('Enter the date you want to send post \n \n Format Tip: Month/Day/Year \n Example: 5/18/2021'));
  if(userInput == 'CLOSE'){
    return userInput;
  } else{
    var length = userInput.split('/').length;
    if(length < 3){
      UIAlert('Your date format is incorrect.');
      GetDate();
    } else{
      var date = userInput.split('/');
      if(date[2].length < 4){
        UIAlert('Your year format is incorrect. Make sure your write out the complete year. \n Ex. 2021 NOT 21');
        GetDate()
      } else{
        month = date[0];
        day = date[1];
        year = date[2];
        var output = [month,day,year];
        return output
      }
    }
  }
}

/**
 * Will send out a draft of your post
 */
function SendOutDraftPost(){
  var ui = SpreadsheetApp.getUi();
  // var input = postSheet.getRange(1,2).getValue();
  // var unsubMessage = 'Reply Stop to unsubscribe from this messaging service';
  // var message = input + '\n \n' + unsubMessage;
  var message = CreatePost();
  var imageURL = postSheet.getRange('B2').getValue();
  Logger.log(message);
  var userInput_phoneNumber = GetUserInput('Enter the phone number you want to send the draft post to:');
  if(userInput_phoneNumber == 'CLOSE'){
    ui.alert('No number was entered');
    return
  } else{
    var phoneNumber_DRAFT = FormatPhoneNumber(userInput_phoneNumber);
    var imageURL = GetImageURL();
    if(imageURL == ''){
      TwilioLibrary.sendSms(phoneNumber_DRAFT,message,sid,auth,twilNum);
    } else{
      TwilioLibrary.sendMMS(phoneNumber_DRAFT,imageURL,message,sid,auth,twilNum);
    }    
  }
}

function CreatePost(){
  var input = postSheet.getRange(1,2).getValue();
  var unsubMessage = 'Reply Stop to unsubscribe from this messaging service';
  var message = input + '\n \n' + unsubMessage;
  return message;
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