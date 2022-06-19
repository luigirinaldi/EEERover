// (c) Michael Schoeffler 2017, http://www.mschoeffler.de

#include "Wire.h" // This library allows you to communicate with I2C devices.

const int MPU_ADDR = 0x68; // I2C address of the MPU-6050. If AD0 pin is set to HIGH, the I2C address will be 0x69.

int16_t accelerometer_x, accelerometer_y, accelerometer_z; // variables for accelerometer raw data
int16_t gyro_x, gyro_y, gyro_z; // variables for gyro raw data
int16_t temperature; // variables for temperature data

char tmp_str[7]; // temporary variable used in convert function



int sped = 255;
int inputt = 0;

int fldir = 7;
int flpwm = 6;
int frdir = 12;
int frpwm = 10;
int bldir = 13;
int blpwm = 5;
int brdir = 8;
int brpwm = 11;

char i2cdata[10];//should only contain 8 : START'J' + DIR1(DONT CARE - for redundancy) + DIR2 + SPLIT'A' + SPED1 + SPED2 + SPED3 + END'B' => e.g. forward 255 = 'J01B255A'

char serialmessage = 0;

void frontleft(int sped, bool isForward){
  digitalWrite(fldir, isForward);
  analogWrite(flpwm, sped);
}

void frontright(int sped, bool isForward){
  digitalWrite(frdir, isForward);
  analogWrite(frpwm, sped);
}

void backleft(int sped, bool isForward){
  digitalWrite(bldir, isForward);
  analogWrite(blpwm, sped);
}

void backright(int sped, bool isForward){
  digitalWrite(brdir, isForward);
  analogWrite(brpwm, sped);
}

void left(int sped, bool isForward){
  frontleft(sped, !isForward);
  backleft(sped, isForward);
  frontright(sped, isForward);
  backright(sped, !isForward);
}

void front(int sped, bool isForward){
  frontleft(sped, isForward);
  backleft(sped, isForward);
  frontright(sped, isForward);
  backright(sped, isForward);
}

void clockwise(int sped, bool isForward){
  frontleft(sped, isForward);
  backleft(sped, isForward);
  frontright(sped, !isForward);
  backright(sped, !isForward);
}


void halt(){
  frontleft(0, HIGH);
  backleft(0, HIGH);
  frontright(0, HIGH);
  backright(0, HIGH);
}

char* convert_int16_to_str(int16_t i) { // converts int16 to string. Moreover, resulting strings will have the same length in the debug monitor.
  sprintf(tmp_str, "%6d", i);
  return tmp_str;
}

void setup() {
  Serial.begin(9600);
  Serial.println("Finishing Cereal");
  Wire.begin(4);
  Wire.beginTransmission(MPU_ADDR); // Begins a transmission to the I2C slave (GY-521 board)
  Wire.write(0x6B); // PWR_MGMT_1 register
  Wire.write(0); // set to zero (wakes up the MPU-6050)
  Wire.endTransmission(true);
  Serial.println("Finishing Talking to Accelerometer");
  pinMode(fldir,OUTPUT);
  pinMode(flpwm,OUTPUT);
  pinMode(frdir,OUTPUT);
  pinMode(frpwm,OUTPUT);
  pinMode(bldir,OUTPUT);
  pinMode(blpwm,OUTPUT);
  pinMode(brdir,OUTPUT);
  pinMode(brpwm,OUTPUT);
  Serial.println("Finishing PinMode");
  pinMode(3,INPUT);
  pinMode(4,INPUT);//digital communication abandoned
  Wire.onReceive(receiveEvent);
  Serial.println("Finishing Setup");
}
void loop() {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(0x3B); // starting with register 0x3B (ACCEL_XOUT_H) [MPU-6000 and MPU-6050 Register Map and Descriptions Revision 4.2, p.40]
  Wire.endTransmission(false); // the parameter indicates that the Arduino will send a restart. As a result, the connection is kept active.
  Wire.requestFrom(MPU_ADDR, 7*2, true); // request a total of 7*2=14 registers
  
  // "Wire.read()<<8 | Wire.read();" means two registers are read and stored in the same variable
  accelerometer_x = Wire.read()<<8 | Wire.read(); // reading registers: 0x3B (ACCEL_XOUT_H) and 0x3C (ACCEL_XOUT_L)
  accelerometer_y = Wire.read()<<8 | Wire.read(); // reading registers: 0x3D (ACCEL_YOUT_H) and 0x3E (ACCEL_YOUT_L)
  accelerometer_z = Wire.read()<<8 | Wire.read(); // reading registers: 0x3F (ACCEL_ZOUT_H) and 0x40 (ACCEL_ZOUT_L)
  temperature = Wire.read()<<8 | Wire.read(); // reading registers: 0x41 (TEMP_OUT_H) and 0x42 (TEMP_OUT_L)
  gyro_x = Wire.read()<<8 | Wire.read(); // reading registers: 0x43 (GYRO_XOUT_H) and 0x44 (GYRO_XOUT_L)
  gyro_y = Wire.read()<<8 | Wire.read(); // reading registers: 0x45 (GYRO_YOUT_H) and 0x46 (GYRO_YOUT_L)
  gyro_z = Wire.read()<<8 | Wire.read(); // reading registers: 0x47 (GYRO_ZOUT_H) and 0x48 (GYRO_ZOUT_L)
  
  // print out data
  Serial.print("aX = "); Serial.print(convert_int16_to_str(accelerometer_x));
  Serial.print(" aY = "); Serial.print(convert_int16_to_str(accelerometer_y));
  Serial.print(" aZ = "); Serial.print(convert_int16_to_str(accelerometer_z));
  // the following equation was taken from the documentation [MPU-6000/MPU-6050 Register Map and Description, p.30]
  //Serial.print(" tmp = "); Serial.print(temperature/340.00+36.53);
  //Serial.print(" gX = "); Serial.print(convert_int16_to_str(gyro_x));
  //Serial.print(" gY = "); Serial.print(convert_int16_to_str(gyro_y));
  //Serial.print(" gZ = "); Serial.print(convert_int16_to_str(gyro_z));
  Serial.println();
  
  // delay
  delay(50);
}



void receiveEvent(){
  Serial.println("received");
  int counter = 0;
  while(Wire.available()){
    i2cdata[counter] = Wire.read();
    counter++;
    if(counter >= 10){counter = 0;}
    Serial.println(i2cdata[counter-1]);
    Serial.println("wire available");
  }
  if(i2cdata[0] == 'J'){
    if(i2cdata[3] == 'A'){
      if(i2cdata[7] == 'B'){
        inputt = i2cdata[2] - '0';
        sped = (i2cdata[4] - '0')*100 + (i2cdata[5] - '0')*10 + (i2cdata[6] - '0')*1;
        Serial.println("Correct data flow");
      }
    }
  }
  
}
