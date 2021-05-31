function doGet(e){
  var eventObject = CreateJSON(e);
  var sender = eventObject.parameters.From[0];
  var body = String(eventObject.parameters.Body[0]).toUpperCase().trim();
  if(body == 'JOIN'){
    var reply = Join(sender);
    //var reply = ContentService.createTextOutput(welcomeMessage);
    return reply; 
  } else if(body == 'SHARE'){
    ShareMessage(sender);
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
