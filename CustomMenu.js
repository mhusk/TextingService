var buttonPress = ScriptProperties.getProperty('buttonPress');

function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Custom Menu')
    .addItem('Add Twilio Account SID','SetTwilioSID')
    .addItem('Add Twilio Account Auth','SetTwilioAuth')
    .addItem('Add Twilio Phone Number','SetTwilioNumber')
    .addItem('Twilio Account Credentials', 'InputTwilioCredentials')
    .addItem('Credential Error Handling', 'CheckingCredentials')
    .addToUi();
  ScriptProperties.setProperty('buttonPress','true');
}

function SetTwilioSID(){
  var sid = GetUserInput('Enter Twilio Account SID:');
  Logger.log(sid)
  if(sid != 'CLOSE'){
    ScriptProperties.setProperty('sid',sid);
  }
}

function SetTwilioAuth(){
  var auth = GetUserInput('Enter your Twilio Account Auth Token:');
  ScriptProperties.setProperty('auth',auth)
}

function SetTwilioNumber(){
  var twilNum = GetUserInput('Enter Twilio Number you want to send message from:');
  try{
    twilNum = TwilioLibrary.lookup(twilNum,sid,auth).national_format;
    ScriptProperties.setProperty('twilNum', twilNum);
  } catch(e){
    Logger.log(e);
    var ui = SpreadsheetApp.getUi();
    ui.alert("One of your Twilio Credentials is incorrect");
  }
}


function InputTwilioCredentials(){
  //Need to add error handling if one of the credentials is incorrect.
  //ScriptProperties.setProperty('buttonPress', 'true');
  //while(ScriptProperties.getProperty('buttonPress') == 'true'){
    var sid = GetUserInput('Enter Twilio Account SID:');
    Logger.log(ScriptProperties.getProperty('buttonPress'));
    var auth = GetUserInput('Enter your Twilio Account Auth Token:');
    Logger.log(ScriptProperties.getProperty('buttonPress'));
    var twilNum = GetUserInput('Enter Twilio Number you want to send message from:');
    Logger.log(ScriptProperties.getProperty('buttonPress'));
    try{
      twilNum = TwilioLibrary.lookup(twilNum,sid,auth).national_format;
    } catch(e){
      Logger.log(e);
    }
    ScriptProperties.setProperty('twilNum', twilNum);
    ScriptProperties.setProperty('sid',sid)
    ScriptProperties.setProperty('auth',auth)
  //}
  //ScriptProperties.setProperty('buttonPress', 'true');
}

/**
 * Use this to collect user input
 * @param {string} question
 * @returns {string}
 */
function GetUserInput(question){
  var ui = SpreadsheetApp.getUi();
  var prompt = ui.prompt(question)
  var userInput = prompt.getResponseText();
  var buttonPress = prompt.getSelectedButton();
  if(buttonPress === ui.Button.CLOSE){
    ui.alert("You did not enter all of your credentials");
    ScriptProperties.setProperty('buttonPress','false');
    return buttonPress
  }
  return userInput
}

function CheckingCredentials(){
  var properties = Object.entries(ScriptProperties.getProperties()) ;
  var twil_Keys = ['sid','twilNum', 'auth'];
  for(var i = 0; i < properties.length; i++){
    var key = twil_Keys[i];
    var test = properties.includes(key)
    var isThere 
  }

  // for(var i = 0; i < keys.length; i++){
  //   var k = keys[i];
  //   var prop = properties.k;
  //   Logger.log(prop)
  // }
}








