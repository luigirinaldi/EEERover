#define USE_WIFI_NINA         false
#define USE_WIFI101           true

#define _WEBSOCKETS_LOGLEVEL_     2
#define WEBSOCKETS_NETWORK_TYPE   NETWORK_WIFI101

#include <WiFi101.h>
#include <WebSocketsServer_Generic.h>

const char ssid[] = "iPhone di Luigi";
const char pass[] = "passwordThatsVeryStrong";

const int groupNumber = 15;

// Websocket stuff

WebSocketsServer webSocket = WebSocketsServer(81);

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


void webSocketEvent(const uint8_t& num, const WStype_t& type, uint8_t * payload, const size_t& length)
{
  (void) length;
  
  switch (type)
  {
    case WStype_DISCONNECTED:
      Serial.println( "[" + String(num) + "] Disconnected!");
      break;
    case WStype_CONNECTED:
      {
        // only for ESP32 apparently
        // IPAddress ip = webSocket.remoteIP(num);
        // Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);

        // send message to client
        webSocket.sendTXT(num, "Connected");
      }
      break;
    case WStype_TEXT:
      Serial.println( "[" + String(num) + "] get Text: " + String((char *) payload));
      break;

    default:
      break;
  }
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
 if (groupNumber)
   WiFi.config(IPAddress(192,168,0,groupNumber+1));

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
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}

unsigned long last_10sec = 0;
unsigned int counter = 0;


void loop() {
  unsigned long t = millis();
  webSocket.loop();

  if ((t - last_10sec) > 10 * 1000)
  {
    counter++;
    bool ping = (counter % 2);
    int i = webSocket.connectedClients(ping);

    Serial.println(String(i) + " Connected websocket clients ping: " + String(ping));

    last_10sec = millis();
  }

  delay(10);
}
