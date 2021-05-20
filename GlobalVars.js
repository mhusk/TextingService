var ss = SpreadsheetApp.getActiveSpreadsheet();
var subscriberSheet = ss.getSheetByName('Subscribers');
var postSheet = ss.getSheetByName('Post');
var updateSheet = ss.getSheetByName('Update');
// !!!!Update this to user Properties Service!!!!
var sid = ScriptProperties.getProperty('sid')
var auth = ScriptProperties.getProperty('auth')
var twilNum = ScriptProperties.getProperty('twilNum');

// var welcomeMessage = ss.getSheetByName('Welcome Message').getRange('b1').getValue();

var twilioCompliance = '\n \n'+'Msg&data rates may apply \n' + 'Reply Stop to unsubscribe from this messaging service';

