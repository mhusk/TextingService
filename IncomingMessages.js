// function doGet(e){
//   var a = String(JSON.stringify(e));
//   var b = JSON.parse(a);
//   var sender = b.parameters.From[0];
//   var body = String(b.parameters.Body[0]).toUpperCase().trim();
//   if(body == 'JOIN'){
//     Join(sender);
//     var reply = ContentService.createTextOutput(welcomeMessage);
//     return reply; 
//   } else{
//     reply = ContentService.createTextOutput('I do not recognize this command');
//     return reply
//   }
// }


function doGet(e){
  var eventObject = CreateJSON(e);
  var sender = eventObject.parameters.From[0];
  var body = String(eventObject.parameters.Body[0]).toUpperCase().trim();
  if(body == 'JOIN'){
    var reply = Join(sender);
    //var reply = ContentService.createTextOutput(welcomeMessage);
    return reply; 
  } else{
    reply = ContentService.createTextOutput('I do not recognize this command');
    return reply
  }
}

function CreateJSON(e){
  var a = String(JSON.stringify(e));
  var b = JSON.parse(a);
  return b
}
