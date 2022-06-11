#define USE_WIFI_NINA         false
#define USE_WIFI101           true
#include <WiFiWebServer.h>
#include <Wire.h>


// constants
const char ssid[] = "iPhone di Luigi";
const char pass[] = "passwordThatsVeryStrong";
const int groupNumber = 0; // Set your group number to make the IP address constant - only do this on the EEERover network

const int i2c_slave_motor = 4;

WiFiWebServer server(80);

// GLOBALS
// int sped = 200;

// given a server objects, scans the arguments for GET arg "argName" storing value in "argValues"
// returns true if arg is found
bool getGetValue(const String &argName, String &argValue, const WiFiWebServer &s){
  for(uint8_t i = 0; i < server.args(); i++){
    if(server.argName(i) == argName){
      argValue = server.arg(i);
      return true;
    }
  }
  return false;
}

String getSped(){
  String value;
  if (getGetValue("sped", value, server))  {
    return value;
  }
  return "0";
}


// might be redundant
uint8_t getDir(){
  String value;
  if(getGetValue("dir", value, server)){
    return value.toInt();
  }
  return 0; //defualt return value
}

void HandleRoot(){
  WiFiClient current_client = server.client();
  current_client.print(
  "HTTP/1.1 200 OK\r\n"
  "Content-Type: text/plain\r\n"
  "Access-Control-Allow-origin: *\r\n"
  "Connection: Keep-Alive\r\n"  // the connection will be closed after completion of the response
  "Keep-Alive: timeout=60, max=1000\r\n"
  "Server: AYO\r\n"
  "\r\n");
  current_client.print(F("YOUR MOM\r\n"));
  //server.send(200, F("text/plain"), F("Hello, you have connected to JABA rover"));
  Serial.println("Device connected");
  current_client.stop();
}

const String returnMessages[] = {"STOP", "forward", "back", "right", "left", "clockwise", "anticlockwise"};

void HandleMovement(){
  WiFiClient currentClient = server.client();

  if(server.method() == HTTP_POST){
    if(server.hasArg()){ 
      String message = server.argName(0) + ": " + server.arg(0) + ", " + server.argName(1) + ": " + server.arg(1); //print post args
      Serial.println(message);
      uint8_t direction = (server.arg(0)[1] - '0') + (server.arg(0)[0] - '0')*10;
      uint8_t sped =  (server.arg(1)[2] - '0') + (server.arg(1)[1] - '0')*10 + (server.arg(1)[0] - '0')*100;

      // Serial.println(direction + " " + sped);

      currentClient.print(
        "HTTP/1.1 200 \r\n"
        "Content-Type: text/plain\r\n"
        "Access-Control-Allow-origin: *\r\n"
        "Connection: Keep-Alive\r\n"  // the connection will be closed after completion of the response
      "\r\n");
      String returnMessage = "dir=" + String(direction) + "\nsped=" + String(sped);
      currentClient.print(returnMessage);
      currentClient.stop();

    } else {
      currentClient.print(
        "HTTP/1.1 405 \r\n"
        "Content-Type: text/plain\r\n"
        "Access-Control-Allow-origin: *\r\n"
        "Connection: close\r\n"  // the connection will be closed after completion of the response
      "\r\n");
      currentClient.print(F("Too few args"));
      currentClient.stop();
    }
  } else {
    currentClient.print(
      "HTTP/1.1 405 Method Not Allowed\r\n"
      "Content-Type: text/plain\r\n"
      "Access-Control-Allow-origin: *\r\n"
      "Connection: close\r\n"  // the connection will be closed after completion of the response
    "\r\n");
    currentClient.print(F("Method Not Allowed"));
    currentClient.stop();
  }
//   char message[10] = "J00A000B";
//   int direction = getDir();
//   if(direction != 0){
//     String sped = getSped();
//     if(sped.length() == 3) {
//       message[6] = sped.charAt(2);
//       message[5] = sped.charAt(1);
//       message[4] = sped.charAt(0);
//     } else if (sped.length() == 2) {
//       message[6] = sped.charAt(1);
//       message[5] = sped.charAt(0);
//     } else {
//       message[6] = sped.charAt(0);
//     }

//     String dir = String(direction);
//     if(dir.length() == 2){
//       message[2] = dir.charAt(1);
//       message[1] = dir.charAt(0);
//     } else {
//       message[2] = dir.charAt(0);
//     }
//   }

//   Serial.print(F("sending message: "));
//   Serial.println(message);

//   Wire.beginTransmission(i2c_slave_motor);
//   Wire.write(message);
//   Wire.endTransmission();


//   const String returnMessage = returnMessages[direction];
//   Serial.println(returnMessage);

//   WiFiClient current_client = server.client();
//   current_client.print(
//   "HTTP/1.1 200 OK\r\n"
//   "Content-Type: text/plain\r\n"
//   "Access-Control-Allow-origin: *\r\n"
//   "Connection: close\r\n"  // the connection will be closed after completion of the response
// //  "Keep-Alive: timeout=60, max=1000\r\n"
//   "Server: AYO\r\n"
//   "\r\n");
//   current_client.print(F("Moving\r\n"));
//   current_client.print(message);
//   current_client.print(F("\r\n"));
//   //server.send(200, F("text/plain"), F("Hello, you have connected to JABA rover"));
//   Serial.println("Handling Movement");
//   current_client.stop();}
}

//Generate a 404 response with details of the failed request
void handleNotFound()
{
  String message = F("File Not Found\n\n"); 
  message += F("URI: ");
  message += server.uri();
  message += F("\nMethod: ");
  message += (server.method() == HTTP_GET) ? F("GET") : F("POST");
  message += F("\nArguments: ");
  message += server.args();
  message += F("\n");
  for (uint8_t i = 0; i < server.args(); i++)
  {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, F("text/plain"), message);
}

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, 1);

  Serial.begin(9600);

  //Wait 10s for the serial connection before proceeding
  //This ensures you can see messages from startup() on the monitor
  //Remove this for faster startup when the USB host isn't attached
  while (!Serial && millis() < 10000);  

  Serial.println(F("\nStarting Web Server"));

  //Check WiFi shield is present
  if (WiFi.status() == WL_NO_SHIELD)
  {
    Serial.println(F("WiFi shield not present"));
    while (true);
  }

  //Configure the static IP address if group number is set
  // if (groupNumber){
  //   WiFi.config(IPAddress(192,168,0,groupNumber+1));
  // }

  // attempt to connect to WiFi network
  Serial.print(F("Connecting to WPA SSID: "));
  Serial.println(ssid);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED)
  {
    delay(500);
    Serial.print('.');
  }

  //Register the callbacks to respond to HTTP requests
  server.on(F("/"), HandleRoot);
  server.on(F("/move"), HandleMovement);


  server.onNotFound(handleNotFound);
  
  server.begin();
  
  Serial.print(F("HTTP server started @ "));
  Serial.println(static_cast<IPAddress>(WiFi.localIP()));

  // Begin i2c communication
  Wire.begin();

  Wire.beginTransmission(i2c_slave_motor);
  Wire.write("Test Message");
  Wire.endTransmission();
}

//Call the server polling function in the main loop
void loop()
{
  server.handleClient();
}
