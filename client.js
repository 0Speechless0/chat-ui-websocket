
var websocket = false;
var ws = undefined;
var responseHandler  = null;

if ("WebSocket" in window){
	  websocket = true;
    }else{
	// no web socket support
	    websocket = false;
    }
function open_ws(msg)  {
  if( !ws || ws.readyState === undefined || ws.readyState > 1){

    // websocket on same server with address /websocket
      ws = new WebSocket(process.env.WEBSOCKET_URL);
      console.log("CCCC", ws)
      ws.onopen = function(){
          // Web Socket is connected, send data using send()
          console.log("ws open");
      if( msg.length != 0 ){
          ws_send(msg);
        }
      };

      ws.onmessage = function (evt){
          console.log("recives:", evt.data);
          responseHandler(evt.data);

          
      };

      ws.onclose = function(){ 
          // websocket is closed, re-open
          console.log("Connection is closed... reopen");
          var msg = { event: 'register', };
          setTimeout( function(){ws_send(msg);}, 1000 );
      };
  }
}

function  ws_send(msg) {



  console.log("ws_send", msg)
  if( websocket == true ){
    // if ws is not open call open_ws, which will call ws_send back
    if( !ws || ws.readyState === undefined || ws.readyState > 1){
      open_ws(msg);
    }else{
      ws.send( msg );
      console.log("ws_send sent");
    }
  }
}

module.exports = class WebSocketClient {

  ws_send(msg, _responseHandler = responseHandler) {

      responseHandler = _responseHandler;
      ws_send(msg);
  }
  open_ws (msg)  {
      open_ws(msg);
  }


}



