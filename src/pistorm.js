var keypub = localStorage.getItem("keypub");
var keysub = localStorage.getItem("keysub");
var channel = "pistorm";

var main_menu = { "items" : [
    { "title":"Forward" , "cmd":"f" },
    { "title":"Right" , "cmd":"r" },
    { "title":"Left" , "cmd":"l" },
    { "title":"Stop" , "cmd":"s" }
	]
};

var items = main_menu.items;

function publishToPubNub(index) {
	var url = 'http://pubsub.pubnub.com/publish/' + keypub + '/' + keysub + '/0/' + channel + '/0/';
	var cmd = '%22' + items[index].cmd + '%22';
	
	console.log("Using URL:" + url);
	console.log("Using CMD:" + cmd);
	
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

// Listen for when an AppMessage is received
Pebble.addEventListener('appmessage',
  function(e) {
    if ('KEY_ACTION' in e.payload) {
			console.log("Sending message: " + e.payload.KEY_ACTION);
			publishToPubNub(e.payload.KEY_ACTION);
		}
  }                     
);

// Listen for when the watchapp is opened
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
  }
);

// Show configuration page
Pebble.addEventListener('showConfiguration', function(e) {
  Pebble.openURL('http://pebble.mrkunkel.com/pistorm.php');
});

// Handle the settings update
Pebble.addEventListener('webviewclosed', function(e) {
  console.log('Configuration window returned: ' + e.response);
  var configuration;
  try {
    configuration = JSON.parse(decodeURIComponent(e.response));
		
		//https://github.com/mcongrove/PebbleBigBlocks/blob/master/src/js/pebble-js-app.js
		
    //localStorage.clear();
    //localStorage.setItem("keypub", configuration.keypub);
    //localStorage.setItem("keysub", configuration.keysub);
  } catch(err) {
    configuration = false;
    console.log("No JSON response or received Cancel event");
  }
});