/****************************************************************************************************************************
  UDPSendReceive.ino - Simple Arduino web server sample for SAMD21 running WiFiNINA shield
  For any WiFi shields, such as WiFiNINA W101, W102, W13x, or custom, such as ESP8266/ESP32-AT, Ethernet, etc
  
  WiFiWebServer is a library for the ESP32-based WiFi shields to run WebServer
  Based on and modified from ESP8266 https://github.com/esp8266/Arduino/releases
  Based on  and modified from Arduino WiFiNINA library https://www.arduino.cc/en/Reference/WiFiNINA
  Built by Khoi Hoang https://github.com/khoih-prog/WiFiWebServer
  Licensed under MIT license
 ***************************************************************************************************************************************/

#define USE_WIFI_NINA         false
#define USE_WIFI101           true
#include <WiFiWebServer.h>
#include <WiFiUDP.h>
#include <Wire.h>

#define DEBUG_WIFI_WEBSERVER_PORT   Serial

int status = WL_IDLE_STATUS;     // the Wifi radio's status

unsigned int localPort = 1883;    //10002;  // local port to listen on
unsigned int upperPort = 52113; 

char packetBuffer[255];          // buffer to hold incoming packet
char ReplyBuffer[] = "ACK";      // a string to send back
char SendDetail[] = "J00A000B";
char SendDetail2[] = "J000A000000000B";

WiFiUDP Udp;

char ssid[] = "CL2.4G";        // your network SSID (name)
char pass[] = "aGASS123";
const int groupNumber = 15;

void printWifiStatus()
{
  // print the SSID of the network you're attached to:
  // you're connected now, so print out the data
  Serial.print(F("You're connected to the network, IP = "));
  Serial.println(WiFi.localIP());

  Serial.print(F("SSID: "));
  Serial.print(WiFi.SSID());

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print(F(", Signal strength (RSSI):"));
  Serial.print(rssi);
  Serial.println(F(" dBm"));
}

void setup()
{
  Serial.begin(9600);

  //Wait 10s for the serial connection before proceeding
  //This ensures you can see messages from startup() on the monitor
  //Remove this for faster startup when the USB host isn't attached
  while (!Serial && millis() < 10000);  

  Serial.println(F("\nStarting Web Server"));
  


/*#if !(ESP32 || ESP8266)
  
  // check for the presence of the shield
  #if USE_WIFI_NINA
    if (WiFi.status() == WL_NO_MODULE)
  #else
    if (WiFi.status() == WL_NO_SHIELD)
  #endif
    {
      Serial.println(F("WiFi shield not present"));
      // don't continue
      while (true);
    }

  #if USE_WIFI_NINA
    String fv = WiFi.firmwareVersion();
    
    if (fv < WIFI_FIRMWARE_LATEST_VERSION)
    {
      Serial.println(F("Please upgrade the firmware"));
    }
  #endif
  
#endif
*/
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

  Serial.println(F("\nStarting connection to server..."));
  // if you get a connection, report back via serial:
  Udp.begin(localPort);

  Serial.print(F("Listening on port "));
  Serial.println(localPort);
  Serial.println(static_cast<IPAddress>(WiFi.localIP()));

  
  Wire.begin();
}

void loop()
{
  // if there's data available, read a packet
  int packetSize = Udp.parsePacket();
  //Serial.println("Listening");
  if (packetSize)
  {
    Serial.print(F("Received packet of size "));
    Serial.println(packetSize);
    Serial.print(F("From "));
    IPAddress remoteIp = Udp.remoteIP();
    Serial.print(remoteIp);
    Serial.print(F(", port "));
    Serial.println(Udp.remotePort());

    // read the packet into packetBufffer
    int len = Udp.read(packetBuffer, 255);
    if (len > 0)
    {
      packetBuffer[len] = 0;
    }

    Serial.println(F("Contents:"));
    Serial.println(packetBuffer);
  Serial.println(packetBuffer[1]);
    if(packetBuffer[0]=='B'){
      if(packetBuffer[4]=='A'){
        if(packetBuffer[8]=='R'){
          Wire.beginTransmission(4);
          SendDetail[2] = packetBuffer[3];
          SendDetail[4] = packetBuffer[5];
          SendDetail[5] = packetBuffer[6];
          SendDetail[6] = packetBuffer[7];
          Wire.write(SendDetail);
          Wire.endTransmission();
          Serial.println(SendDetail);
          Udp.beginPacket(Udp.remoteIP(), upperPort);

          Udp.write(SendDetail);
    
          Udp.endPacket();
        }else{Serial.println("WRONG R in 1");
          if(packetBuffer[14]=='R'){
            Wire.beginTransmission(4);
            SendDetail2[1] = packetBuffer[1];
            SendDetail2[2] = packetBuffer[2];
            SendDetail2[3] = packetBuffer[3];
            SendDetail2[5] = packetBuffer[5];
            SendDetail2[6] = packetBuffer[6];
            SendDetail2[7] = packetBuffer[7];
            SendDetail2[8] = packetBuffer[8];
            SendDetail2[9] = packetBuffer[9];
            SendDetail2[10] = packetBuffer[10];
            SendDetail2[11] = packetBuffer[11];
            SendDetail2[12] = packetBuffer[12];
            SendDetail2[13] = packetBuffer[13];
            Wire.write(SendDetail2);
            Wire.endTransmission();
            Serial.println(SendDetail2);
            Udp.beginPacket(Udp.remoteIP(), upperPort);

            Udp.write(SendDetail2);
    
            Udp.endPacket();
          }
        }
      }else{Serial.println("WRONG A in all");}
    }else{Serial.println("WRONG B in all");}

    // send a reply, to the IP address and port that sent us the packet we received
    
  }
}
