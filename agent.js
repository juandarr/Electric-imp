// When Device sends new readings, Run this!
device.on("new_readings" function(msg) {

    //Plotly Data Object
    local data = [{
        x = msg.time_stamp, // Time Stamp from Device
        y = msg.sensor_reading // Sensor Reading from Device
    }];

    // Plotly Layout Object
    local layout = {
        fileopt = "extend",
        filename = "Temperature@HOME",
    };

    // Setting up Data to be POSTed
    local payload = {
    un = "overcode",
    key = "cd7fa4g8ve",
    origin = "plot",
    platform = "electricimp",
    args = http.jsonencode(data),
    kwargs = http.jsonencode(layout),
    version = "0.0.1"
    };

    // encode data and log
    local headers = { "Content-Type" : "application/json" };
    local body = http.urlencode(payload);
    local url = "https://plot.ly/clientresp";
    HttpPostWrapper(url, headers, body, true);
});


// Http Request Handler
function HttpPostWrapper (url, headers, string, log) {
  local request = http.post(url, headers, string);
  local response = request.sendsync();
  if (log)
    server.log(http.jsonencode(response));
  return response;

}

server.log("Detection counter value request " + http.agenturl() + "?detection");
local dataNull;

function requestHandler(request, response) {
  try {
      
    if ("detection" in request.query){
        
        device.send("detection", dataNull);
        
        device.on("detection_value", function(detection_counter){
        response.send(200, detection_counter);
        });
        
        
    }
   
  } catch (ex) {
    response.send(500, "Internal Server Error: " + ex);
  }
}
 
// register the HTTP handler
http.onrequest(requestHandler);
