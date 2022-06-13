#define USE_WIFI_NINA         false
#define USE_WIFI101           true

#include <WiFiWebServer.h>
#include <Wire.h>


// constants
const char ssid[] = "iPhone di Luigi";
const char pass[] = "passwordThatsVeryStrong";
const int groupNumber = 15; // Set your group number to make the IP address constant - only do this on the EEERover network

const int i2c_slave_motor = 4;

WiFiWebServer server(80);

// GLOBALS
// int sped = 200;
WiFiClient currentClient;


void HandleRoot(){
  Serial.println("Device connected");
  currentClient = server.client();
  currentClient.print(
  "HTTP/1.1 200 OK\r\n"
  "Content-Type: text/plain\r\n"
  "Access-Control-Allow-origin: *\r\n"
  "Connection: Keep-Alive\r\n"  // the connection will be closed after completion of the response
  "Keep-Alive: timeout=60, max=1000\r\n"
  "Server: AYO\r\n"
  "\r\n");
  currentClient.print(F("Connected to JABA Rover\r\n"));
  currentClient.stop();
}

const String returnMessages[] = {"STOP", "forward", "back", "right", "left", "clockwise", "anticlockwise"};

void HandleMovement(){
  currentClient = server.client();

  if(server.method() == HTTP_POST){
    if(server.arg("plain")[0] == 'J' && server.arg("plain")[3] == 'A' && server.arg("plain")[7] == 'B'){ // check if body in correct format 
			char postBody[9];
			server.arg("plain").toCharArray(postBody, 9);
			
			//send data to slave arduino
			Wire.beginTransmission(i2c_slave_motor);
			Wire.write(postBody);
			Wire.endTransmission();
			// Serial.println(F("Data sent to motor controller"));

      currentClient.print(
        "HTTP/1.1 200 \r\n"
        "Content-Type: text/plain\r\n"
        "Access-Control-Allow-origin: *\r\n"
        "Connection: Keep-Alive\r\n"  // the connection will be closed after completion of the response
      "\r\n");
			currentClient.print(F("Success\n"));
			currentClient.print(postBody);
      currentClient.stop();

			// Serial.println(F("Movement Data correct"));
    } else if(server.arg("plain")[0] == 'J' && server.arg("plain")[4] == 'A' && server.arg("plain")[14] == 'B'){ 
			char postBody[16];
			server.arg("plain").toCharArray(postBody, 16);

			//send data to slave arduino
			Wire.beginTransmission(i2c_slave_motor);
			Wire.write(postBody);
			Wire.endTransmission();
			// Serial.println(F("Data sent to motor controller"));

      currentClient.print(
        "HTTP/1.1 200 \r\n"
        "Content-Type: text/plain\r\n"
        "Access-Control-Allow-origin: *\r\n"
        "Connection: Keep-Alive\r\n"  // the connection will be closed after completion of the response
      "\r\n");
			currentClient.print(F("Success\n"));
			currentClient.print(postBody);
      currentClient.stop();

		} else { //wrong argument format
      currentClient.print(
        "HTTP/1.1 400 \r\n"
        "Content-Type: text/plain\r\n"
        "Access-Control-Allow-origin: *\r\n"
        "Connection: close\r\n"  // the connection will be closed after completion of the response
      "\r\n");
      currentClient.print(F("Bad Request: Wrong message format"));
      currentClient.stop();

			Serial.println(F("Incorrect movememnt data"));
    }
  } else { //wrong request format
    currentClient.print(
      "HTTP/1.1 405 Method Not Allowed\r\n"
      "Content-Type: text/plain\r\n"
      "Access-Control-Allow-origin: *\r\n"
      "Connection: close\r\n"  // the connection will be closed after completion of the response
    "\r\n");
    currentClient.print(F("Method Not Allowed"));
    currentClient.stop();

		Serial.println(F("Incorrect method"));
  }
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

  // Configure the static IP address if group number is set
  if (ssid == "EEERover" && groupNumber){
    WiFi.config(IPAddress(192,168,0,groupNumber+1));
  }

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
