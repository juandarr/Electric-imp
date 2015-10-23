local number_of_samples = 200;
local sample_frequency = 100;

local R0 = 10000.0;
local B = 3435.0;
local T0= 298.3;

local r_inf = R0*math.exp(-B/T0);
local resistor = 0;

local temperature = 0;

local data_ready = false;

local detection_counter =0;

function getDetectionCounter(dataNull){
    agent.send("detection_value", detection_counter);
}

// register a handler for "led" messages from the agent
agent.on("detection", getDetectionCounter)

function samplesReady(buffer, length)
{   
    //data_ready = true;
    if (length > 0) {
        temperature = processing_data(buffer, length);

        local sensordata = {
        sensor_reading = temperature,
        time_stamp = getTime()
    }
    agent.send("new_readings", sensordata);
    
        //processing_data(buffer,length);
        
      //agent.send("bufferFull", buffer);
      server.log("bufferFull");
      //imp.sleep(30);
    } else {
      server.log("Overrun");
    }
    
}

function processing_data(buffer, length){
    local i;
    local sum=0;
    local avg=0;
    for (i=0;i<length;i+=2)
    {
        sum = sum + (buffer[i]+256*buffer[i+1]);
    //    server.log(format("%d",buffer[i]+256*buffer[i+1])); // little endian
    }
    avg = sum / (length/2);
    //server.log(format("Average: %f",avg));
    
    resistor = 10000.0/(1.0-avg/65535.0)-10000.0;
    //server.log(format("Resistor: %f",resistor));
    
    temperature = B/math.log(resistor/r_inf) -273.3;
    
    server.log(format("Temperature: %f", temperature));
    
    return (temperature);
}






// returns time string, -14400 is for -4 GMT (Montreal)
// use 3600 and multiply by the hours +/- GMT.
// e.g for +5 GMT local date = date(time()+18000, "u");
function getTime() {
    local date = date(time()-14400, "u");
    local sec = stringTime(date["sec"]);
    local min = stringTime(date["min"]);
    local hour = stringTime(date["hour"]);
    local day = stringTime(date["day"]);
    local month = date["month"];
    local year = date["year"];
    return year+"-"+month+"-"+day+" "+hour+":"+min+":"+sec;

}

// function to fix time string
function stringTime(num) {
    if (num < 10)
        return "0"+num;
    else
        return ""+num;
}

//Buffer to measure average temperature for 2 mins
buffer1 <- blob(120);
buffer2 <- blob(120);
 
hardware.sampler.configure(hardware.pin1,0.05, [buffer1, buffer2], samplesReady);
hardware.sampler.start();
server.log("start!")
// Alias the GPIO pin as 'button'
 
//button <- hardware.pin2
/* 
function IR_detection() 
{
    local state = button.read()
    if (state == 1) 
    {
        // Detection of motion in sensor
        
        server.log("Detected!")
        detection_counter += 1;
    } 
    else 
    {
        // Detection of motion in sensor
        
        server.log("OFF mode!")
    }
}



// Configure the button to call buttonPress() when the pin's state changes
 
button.configure(DIGITAL_IN_PULLDOWN, IR_detection)
*/
/*

// function to send sensor data to be plotted
function sendDataToAgent() {
    hardware.sampler.start();
    server.log("start!");
    
     while (data_ready==false){
         server.log("loop!: "+ data_ready);
     }
     hardware.sampler.stop();
     server.log("end!");
    //stopSampler();
    /*
    temperature = processing_data(samples, len);

    local sensordata = {
        sensor_reading = temperature,
        time_stamp = getTime()
    }
    agent.send("new_readings", sensordata);
    // How often to make http request (seconds)
    
    data_ready = false;
    imp.wakeup(5, sendDataToAgent);
}

// Initialize Loop

sendDataToAgent();
*/
