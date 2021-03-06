var keypub = localStorage.getItem("keypub");
var keysub = localStorage.getItem("keysub");
var channel = "pistorm";

var main_menu = { "items" : [
    { "title":"Forward" , "cmd":"f" },
    { "title":"Backward" , "cmd":"b" },
    { "title":"Right" , "cmd":"r" },
    { "title":"Left" , "cmd":"l" },
    { "title":"Voltage" , "cmd":"v" },
    { "title":"Quit" , "cmd":"q" }
  ]
};

var items = main_menu.items;

function publishToPubNub(value) {
  var url = 'http://pubsub.pubnub.com/publish/' + keypub + '/' + keysub + '/0/' + channel + '/0/';
  var cmd = '%22' + value + '%22';
	
  var xhg = new XMLHttpRequest();
  xhg.open('GET', url + cmd);
  xhg.send();
}

function sendAppMsgToPebble(dict) {
  Pebble.sendAppMessage(
    dict,
    function(e) {
      console.log("Sending message.");
    },
    function(e) {
      console.log("Failed to send message!");
    }
  );
}

Pebble.addEventListener('appmessage',
  function(e) {
    if ('KEY_ACTION' in e.payload) {
      publishToPubNub(items[e.payload.KEY_ACTION].cmd);
    }
  }                     
);

Pebble.addEventListener('ready',
  function(e) {
    var dictionary = {
      "KEY_MENU_ITEMS": items.length
    };
    sendAppMsgToPebble(dictionary);

    for(var i = 0; i < items.length; i++) {
      var dictionary2 = {
        "KEY_MENU_TITLE": items[i].title
      };
      sendAppMsgToPebble(dictionary2);
    }
    publishToPubNub('p');
  }
);

Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL('http://pebble.mrkunkel.com/pistorm.php');
});

Pebble.addEventListener('webviewclosed', function(e) {
  console.log('Configuration window returned: ' + e.response);
  var configuration;
  try {
    configuration = JSON.parse(decodeURIComponent(e.response));

    // Disabled to prevent overwriting valid values while testing
    //localStorage.clear();
    localStorage.setItem("keypub", configuration.keypub);
    localStorage.setItem("keysub", configuration.keysub);
  } catch(err) {
    configuration = false;
    console.log("No JSON response or received Cancel event");
  }
});