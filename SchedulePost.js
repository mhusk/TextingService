/**
 * Need to create some script properties that store the credentials for 
 */


/**
 * Will schedule the post to be sent out
 */
function SchedulePost(){

}

/**
 * Will send out a draft of your post
 */
function SendOutDraftPost(){
  var postObject = GetPostDetails();
  
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
  var labels = ['Title','Subtitle','Link','Date','Time (EST)'];
  var labelRow = 1;
  for(var i = 0; i < labels.length; i++){
    postSheet.getRange(labelRow,1).setValue(labels[i]);
    labelRow = labelRow + 1;
  }
  
  var fillIn = ['(Insert Title)', '(Insert Subtitle)', '(Insert Link)','(Insert Date)','(Insert Time)'];
  var fillInRow = 1;
  for(var i = 0; i < fillIn.length; i++){
    postSheet.getRange(fillInRow,2).setValue(fillIn[i]);
    fillInRow = fillInRow + 1;
  }

  var example = ['Example Input','5/6/2021', '6:45 PM']
  var exampleRow = 3;
  for(var i = 0; i < example.length; i++){
    postSheet.getRange(exampleRow,3).setValue(example[i]);
    exampleRow = exampleRow + 1;
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


/**
 * Gets the details of the post
 * @returns {Object}
 */
function GetPostDetails(){
  var postData = postSheet.getRange(1,2,5,1).getValues();
  var postObject = new Object();
  postObject.title = postData[0][0];
  postObject.subtitle = postData[1][0];
  postObject.link = postData[2][0];
  postObject.date = postData[3][0];
  postObject.time = postData[4][0];
  
  return postObject
}









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
