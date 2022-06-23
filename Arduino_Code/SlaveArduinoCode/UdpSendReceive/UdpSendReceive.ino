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
#include <Adafruit_LIS2MDL.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>

#define DEBUG_WIFI_WEBSERVER_PORT   Serial

int status = WL_IDLE_STATUS;     // the Wifi radio's status

unsigned int localPort = 1883;    //10002;  // local port to listen on
unsigned int upperPort = 52113; 

char packetBuffer[255];          // buffer to hold incoming packet
char ReplyBuffer[] = "ACK";      // a string to send back
char SendDetail[] = "J00A000B";
char SendDetail2[] = "J000A000000000B";


// global UDP object
IPAddress pcIP; //global ip address op pc needed to send responses back without message
WiFiUDP Udp;

char ssid[] = "EEERover";        // your network SSID (name)
char pass[] = "exhibition";
const int groupNumber = 15;
const int i2c_slave_motor = 4;

// interrupt pins for measuring frequencies:
const byte infraredPin = A0;
const byte acousticPin = A1;
const byte radioSignalPin = A2;
const byte radioCarrierPin = A3;

// globals for sensor measurement
/* Assign a unique ID to this sensor at the same time */
Adafruit_LIS2MDL lis2mdl = Adafruit_LIS2MDL(12345);



const int samplingPeriod = 200; //measure the frequency every second
unsigned long prevTime = 0; //measure elapsed time, should last up to 72 hours

volatile int infraredCounter = 0;
double infraredFreq = 0;

volatile int acousticCounter = 0;
double acousticFreq = 0;

volatile int radioSignalCounter = 0;
volatile int radioCarrierCounter = 0;

bool countCarrier = false;

double radioSignalFreq = 0;
double radioCarrierFreq = 0;

// Interrupt Service Routines
void infraredISR(){
  infraredCounter++;
}

void acousticISR(){
  acousticCounter++;
}

void radioSignalISR(){
  radioSignalCounter++;
  countCarrier = true;
}

void radioSignalFalling(){
  countCarrier = false;
}

void radioCarrierISR(){
  if(countCarrier){
    radioCarrierCounter++;
  }
}

void attachISRs(){
  attachInterrupt(digitalPinToInterrupt(infraredPin), infraredISR, RISING);
  attachInterrupt(digitalPinToInterrupt(acousticPin), acousticISR, RISING);
  attachInterrupt(digitalPinToInterrupt(radioSignalPin), radioSignalISR, RISING);
  attachInterrupt(digitalPinToInterrupt(radioSignalPin), radioSignalISR, FALLING); // to detect falling edge and stop measuring the carrier frequency
  attachInterrupt(digitalPinToInterrupt(radioCarrierPin), radioCarrierISR, RISING);
}


void printWifiStatus()
{
  // print the SSID of the network you're attached to:
  // you're connected now, so print out the data
  Serial.print(F("You're connected to the network, IP = "));
  Serial.println(static_cast<IPAddress>(WiFi.localIP()));

  Serial.print(F("SSID: "));
  Serial.print(WiFi.SSID());

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print(F(", Signal strength (RSSI):"));
  Serial.print(rssi);
  Serial.println(F(" dBm"));
}

void sendUDPData(){
  // Global magnet event struct/object?
  sensors_event_t magnetEvent;
  lis2mdl.getEvent(&magnetEvent);
  // Serial.print("X: ");
  // Serial.print(magnetEvent.magnetic.x);
  // Serial.print("  ");
  // Serial.print("Y: ");
  // Serial.print(magnetEvent.magnetic.y);
  // Serial.print("  ");
  // Serial.print("Z: ");
  // Serial.print(magnetEvent.magnetic.z);
  // Serial.print("  ");
  // Serial.println("uT");

  char Databuff[32];
  int radioCarrierTrunc = radioCarrierFreq / 1000; //integer division by a 1000 to keep only thousands' digits
  int acousticTrunc = acousticFreq / 1000; // same as radio carrier
  sprintf(Databuff, "dR%+0.3d|%+0.2dI%+0.3dA%+0.2dM%+.5d|%+.5d|%+.5d|", int(radioSignalFreq), radioCarrierTrunc, int(infraredFreq), acousticTrunc, int(magnetEvent.magnetic.x),  int(magnetEvent.magnetic.y),  int(magnetEvent.magnetic.z));
  // sprintf(IRbuff, "%5.2f", infraredFreq);
  Serial.print("pc IP:");
  Serial.println(static_cast<IPAddress>(pcIP));
  Serial.println(Databuff);
  Udp.beginPacket(pcIP, upperPort);
  Udp.write(Databuff);
  Udp.endPacket();
}

void udpHandleMove(char packetBuffer[255]){
  if(packetBuffer[1]=='J' && packetBuffer[4]=='A' && packetBuffer[8]=='B'){ // mJ__A___B
    // direction info
    SendDetail[1] = packetBuffer[2];
    SendDetail[2] = packetBuffer[3];
    // sped info
    SendDetail[4] = packetBuffer[5];
    SendDetail[5] = packetBuffer[6];
    SendDetail[6] = packetBuffer[7];

    Wire.beginTransmission(i2c_slave_motor);
    Wire.write(SendDetail);
    Wire.endTransmission();

    // Serial.println(SendDetail);

    Udp.beginPacket(Udp.remoteIP(), upperPort);
    Udp.write('m');
    Udp.write(SendDetail);  
    Udp.endPacket();
  } else if (packetBuffer[1]=='J' && packetBuffer[5]=='A' && packetBuffer[15]=='B'){ //mJ___A_________B
    // direction codes
    SendDetail2[1] = packetBuffer[2];
    SendDetail2[2] = packetBuffer[3];
    SendDetail2[3] = packetBuffer[4];
    //sped codes
    SendDetail2[5] = packetBuffer[6];
    SendDetail2[6] = packetBuffer[7];
    SendDetail2[7] = packetBuffer[8];
    SendDetail2[8] = packetBuffer[9];
    SendDetail2[9] = packetBuffer[10];
    SendDetail2[10] = packetBuffer[11];
    SendDetail2[11] = packetBuffer[12];
    SendDetail2[12] = packetBuffer[13];
    SendDetail2[13] = packetBuffer[14];
    
    Wire.beginTransmission(i2c_slave_motor);
    Wire.write(SendDetail2);
    Wire.endTransmission();

    // Serial.println(SendDetail2);

    Udp.beginPacket(Udp.remoteIP(), upperPort);
    Udp.write('m'); //code to signal it is a motor message
    Udp.write(SendDetail2);  
    Udp.endPacket();
  } else {
    Serial.println("wrong format");
    Udp.beginPacket(Udp.remoteIP(), upperPort);
    Udp.write("eIncorrect Data Format");  
    Udp.endPacket();
  }
}

void udpHandleMessage(int packetSize){
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

    switch(packetBuffer[0]){
      case 'm': //movement message
        udpHandleMove(packetBuffer);
        break; //not really needed
      case 't': //test message
        char IPbuff[20];
        pcIP = Udp.remoteIP();
        Serial.print("Ip from remote: ");
        Serial.println(static_cast<IPAddress>(pcIP));
        // sprintf(IPbuff, "", pcIP , );
        // Serial.println(IPbuff);
        Udp.beginPacket(pcIP, upperPort);
        Udp.write("tSuccessful connection to JABA Rover from:");  
        // Udp.write(IPbuff);
        Udp.endPacket();
        break;
      default:
        Udp.beginPacket(Udp.remoteIP(), upperPort);
        Udp.write("eIncorrect Data Format");  
        Udp.endPacket();
        break;
    }

    // send a reply, to the IP address and port that sent us the packet we received
}

void setup()
{
  Serial.begin(9600);

  //Wait 10s for the serial connection before proceeding
  //This ensures you can see messages from startup() on the monitor
  //Remove this for faster startup when the USB host isn't attached
  while (!Serial && millis() < 10000);  

  /* Initialise the sensor */
  if (!lis2mdl.begin()) {  // I2C mode
  //if (! lis2mdl.begin_SPI(LIS2MDL_CS)) {  // hardware SPI mode
  //if (! lis2mdl.begin_SPI(LIS2MDL_CS, LIS2MDL_CLK, LIS2MDL_MISO, LIS2MDL_MOSI)) { // soft SPI
    /* There was a problem detecting the LIS2MDL ... check your connections */
    Serial.println("Ooops, no LIS2MDL detected ... Check your wiring!");
    while (1) delay(10);
  }
  Serial.println("Magnet sensor detected!");
  lis2mdl.printSensorDetails();

  Serial.println(F("\nStarting Web Server"));
  

  if (WiFi.status() == WL_NO_SHIELD)
  {
    Serial.println(F("WiFi shield not present"));
    while (true);
  }

  //Configure the static IP address if group number is set
  if (ssid == "EEERover" && groupNumber)
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

  attachISRs();
  prevTime = millis(); //initialize at the start of setup
}



void loop()
{
  // UDP listening
  // if there's data available, read a packet
  int packetSize = Udp.parsePacket();
  //Serial.println("Listening");
  if (packetSize)
  {
    udpHandleMessage(packetSize);    
  }

  //sensor measuremt
  if(millis() - prevTime >= samplingPeriod){
    prevTime = millis();
    //measure stuff
    infraredFreq = (double(infraredCounter)/samplingPeriod)* 1000;
    infraredCounter = 0;

    acousticFreq = (double(acousticCounter)/samplingPeriod)* 1000;
    acousticCounter = 0;

    radioSignalFreq = (double(radioSignalCounter)/samplingPeriod)* 1000;
    radioSignalCounter = 0;
    radioCarrierFreq = (double(radioCarrierCounter)/samplingPeriod)* 1000;
    radioCarrierCounter = 0;

    // Serial.print("Acoustic freq: ");
    // Serial.print(acousticFreq);
    // Serial.print("Hz ");

    // Serial.print("Radio Signal freq: ");
    // Serial.print(radioSignalFreq);
    // Serial.print("Hz ");

    // Serial.print("Radio Carrier freq: ");
    // Serial.print(radioCarrierFreq);
    // Serial.print("Hz ");  

    // Serial.print("infrared freq: ");
    // Serial.print(infraredFreq);
    // Serial.println("Hz");

    sendUDPData();
  }

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(50);
    Serial.print('.');
    WiFi.begin(ssid, pass);
  }

}
