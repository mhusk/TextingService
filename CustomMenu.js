function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
  .addSubMenu(ui.createMenu('Set-Up Twilio')
    .addItem('Add Twilio Account SID','SetTwilioSID')
    .addItem('Add Twilio Account Auth','SetTwilioAuth')
    .addItem('Add Twilio Phone Number','SetTwilioNumber')
    .addSeparator()
    .addItem('Check Credentials', 'CheckingCredentials')
    .addItem('Clear Credentials','ClearTwilioCredentials')
    .addSeparator()
    .addItem('Test Credentials','TestTwilioCredentials'))
  .addSeparator()
  .addSubMenu(ui.createMenu('Post')
    .addItem('Create Post Sheet','CreatePostSheet')
    .addItem('Format Post Sheet','FormatPostSheet'))
    .addToUi();
}

// function CheckProperties(){
//   var test = ScriptProperties.getProperties()
//   Logger.log(test);
// }

// function SetTwilioSID(){
//   var sid = GetUserInput_Twilio('Enter Twilio Account SID:');
//   Logger.log(sid)
//   if(sid != 'CLOSE'){
//     ScriptProperties.setProperty('sid',sid);
//   }
// }

// function SetTwilioAuth(){
//   var auth = GetUserInput_Twilio('Enter your Twilio Account Auth Token:');
//   ScriptProperties.setProperty('auth',auth)
// }

// function SetTwilioNumber(){
//   var twilNum = GetUserInput_Twilio('Enter Twilio Account Number:');
//   try{
//     twilNum = TwilioLibrary.lookup(twilNum,sid,auth).national_format;
//     ScriptProperties.setProperty('twilNum', twilNum);
//   } catch(e){
//     Logger.log(e);
//     var ui = SpreadsheetApp.getUi();
//     ui.alert("One of your Twilio Credentials is incorrect");
//   }
// }

// function ClearTwilioCredentials(){
//   var twilCreds = ['sid', 'twilNum', 'auth'];
//   for(var i = 0; i < twilCreds.length; i++){
//     var prop = twilCreds[i];
//     try{
//       ScriptProperties.setProperty(prop,'');
//     } catch(e) {
//       Logger.log('ClearTwilioCredentials: Does not exist');
//     }
//   }
// }

// function CheckingCredentials(){
//   var ui = SpreadsheetApp.getUi();
//   var properties = Object.entries(ScriptProperties.getProperties()) ;
//   var mapped = properties.map(x => x[0]);
//   var missingCredentials = 0;
//   //Logger.log(mapped)
//   var twil_Keys = ['sid','twilNum', 'auth'];
//   for(var i = 0; i < properties.length; i++){
//     var key = twil_Keys[i];
//     if(mapped.includes(key)){
//       var value = ScriptProperties.getProperty(key);
//       if(value == '' || value == 'CLOSED'){
//         ui.alert(`You don't have your Twilio Acount ${key}. Please use Custom Menu to add.`);
//         missingCredentials = missingCredentials + 1;
//       } 
//     } else{
//       Logger.log(`You don't have your Twilio Acount ${key}. Please use Custom Menu to add.`);
//       missingCredentials = missingCredentials + 1;
//     }
//   }
//   if(missingCredentials == 0){
//     ui.alert('All your Twilio Credentials have been entered');
//   }
// }

// function TestTwilioCredentials(){
//   var ui = SpreadsheetApp.getUi();
//   var phoneNumber = GetUserPhoneNumber();
//   var output = TwilioLibrary.sendSms(phoneNumber,'Twilio Credentials are correct', sid, auth, twilNum);
//   if(output.split(':')[0] == 'error'){
//     ui.alert('Some Credentials are wrong. Try re-entering Twilio Credentials');
//   } else{
//     ui.alert('Check your phone for a confirmation text!');
//   }
// }

// function GetUserPhoneNumber(){
//   var ui = SpreadsheetApp.getUi();
//   var prompt = ui.prompt('Enter your phone number so we can validate Twilio Credentials');
//   try{
//     var userInput = TwilioLibrary.lookup(prompt.getResponseText(),sid, auth).national_format;
//   } catch(e){
//     ui.alert('Re-enter your phone number');
//   }
//   return userInput; 
// }

// /**
//  * Use this to collect user input
//  * @param {string} question
//  * @returns {string}
//  */
// function GetUserInput_Twilio(question){
//   var ui = SpreadsheetApp.getUi();
//   var prompt = ui.prompt(question)
//   var userInput = prompt.getResponseText();
//   var buttonPress = prompt.getSelectedButton();
//   if(buttonPress === ui.Button.CLOSE){
//     ui.alert("You did not enter all of your credentials");
//     return buttonPress
//   }
//   return userInput
// }


// function InputTwilioCredentials(){
//   //Need to add error handling if one of the credentials is incorrect.
//   //ScriptProperties.setProperty('buttonPress', 'true');
//   //while(ScriptProperties.getProperty('buttonPress') == 'true'){
//     var sid = GetUserInput('Enter Twilio Account SID:');
//     Logger.log(ScriptProperties.getProperty('buttonPress'));
//     var auth = GetUserInput('Enter your Twilio Account Auth Token:');
//     Logger.log(ScriptProperties.getProperty('buttonPress'));
//     var twilNum = GetUserInput('Enter Twilio Number you want to send message from:');
//     Logger.log(ScriptProperties.getProperty('buttonPress'));
//     try{
//       twilNum = TwilioLibrary.lookup(twilNum,sid,auth).national_format;
//     } catch(e){
//       Logger.log(e);
//     }
//     ScriptProperties.setProperty('twilNum', twilNum);
//     ScriptProperties.setProperty('sid',sid)
//     ScriptProperties.setProperty('auth',auth)
//   //}
//   //ScriptProperties.setProperty('buttonPress', 'true');
// }









