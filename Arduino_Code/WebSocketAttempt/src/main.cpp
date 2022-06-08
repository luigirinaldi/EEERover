
#define WEBSOCKETS_USE_WIFI101           true
#define WEBSOCKETS_WIFI101_USE_SAMD      true
#define USE_WIFI101       true

// #include <WiFi101.h>
// #include <WiFiWebServer.h>
#include <WebSockets2_Generic.h>

const char ssid[] = "iPhone di Luigi";
const char pass[] = "passwordThatsVeryStrong";

const int groupNumber = 15;

// Websocket stuff
websockets2_generic::WebsocketsServer sockServer;

int status = WL_IDLE_STATUS;

void printWifiStatus()
{
  // print the SSID of the network you're attached to:
  // you're connected now, so print out the data
  Serial.print(F("You're connected to the network, IP = "));
  Serial.println(static_cast<IPAddress>(WiFi.localIP()));

  Serial.print(F("SSID: "));
  Serial.print(WiFi.SSID());

  // print the received signal strength:
  int32_t rssi = WiFi.RSSI();
  Serial.print(F(", Signal strength (RSSI):"));
  Serial.print(rssi);
  Serial.println(F(" dBm"));
}


void setup() {
  Serial.begin(9600);

  while(!Serial && millis() < 5000); //wait 10 seconds

  Serial.println(F("Starting up!"));
  Serial.println(WiFi.status());

 //Check WiFi shield is present
 if (WiFi.status() == WL_NO_SHIELD)
 {
   Serial.println(F("WiFi shield not present"));
   while (true);
 }

 //Configure the static IP address if group number is set
//  if (groupNumber)
//    WiFi.config(IPAddress(192,168,0,groupNumber+1));

  // attempt to connect to WiFi network
  Serial.print(F("Connecting to WPA SSID: "));
  Serial.println(ssid);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED)
  {
    delay(500);
    Serial.print('.');
  }

  printWifiStatus();

  Serial.println(F("\nStarting Simple websocket!"));

    // start webSocket server
  sockServer.listen(81); //set the port on which the server listens

  if(sockServer.available()){
    Serial.print("Web Socket started at IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("Web Socket server failed");
  }

}


void loop() {
  websockets2_generic::WebsocketsClient client = sockServer.accept();
 
  if (client.available())
  {
    websockets2_generic::WebsocketsMessage msg = client.readNonBlocking();

    // log
    Serial.print("Got Message: ");
    Serial.println(msg.data());

    // return echo
    client.send("Echo: " + msg.data());

    // close the connection
    client.close();
  }

  delay(1000);
}
