var ss = SpreadsheetApp.getActiveSpreadsheet();
var subscriberSheet = ss.getSheetByName('Subscribers');
var postSheet = ss.getSheetByName('Post');
var updateSheet = ss.getSheetByName('Update');
var sid = ScriptProperties.getProperty('sid')
var auth = ScriptProperties.getProperty('auth')
var twilNum = ScriptProperties.getProperty('twilNum');

var welcomeMessage = ss.getSheetByName('Welcome Message').getRange('A1').getValue();

