#include <Wire.h>


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


void setup() {
  Serial.begin(9600);
  pinMode(fldir,OUTPUT);
  pinMode(flpwm,OUTPUT);
  pinMode(frdir,OUTPUT);
  pinMode(frpwm,OUTPUT);
  pinMode(bldir,OUTPUT);
  pinMode(blpwm,OUTPUT);
  pinMode(brdir,OUTPUT);
  pinMode(brpwm,OUTPUT);
  
  pinMode(3,INPUT);
  pinMode(4,INPUT);//digital communication abandoned
  
  Wire.begin(4);
  Wire.onReceive(receiveEvent);

  
}

void loop() {
//  Serial.readBytes(&serialmessage,1);
//  if(serialmessage == 'w'){
//    Serial.println("readw");
//    inputt=1;
//    /*frontleft(sped,HIGH);
//    delay(100);
//    frontleft(sped,LOW);*/
//    front(sped,HIGH);
//
//  }
//  if(serialmessage == 'a'){
//    Serial.println("reade");
//    inputt=4;
//    left(sped,HIGH);
//  }
//  if(serialmessage == 's'){
//    Serial.println("reads");
//    inputt=2;
//    front(sped,LOW);
//
//  }
//  if(serialmessage == 'd'){
//    Serial.println("readd");
//    inputt=3;
//    left(sped,LOW);
//  }
//  if(serialmessage == 'q'){
//    Serial.println("readq");
//    inputt=0;
//    clockwise(sped,LOW);
//  }
//  if(serialmessage == 'e'){
//    Serial.println("reade");
//    inputt=0;
//    clockwise(sped,HIGH);
//  }
//  if(serialmessage == 'x'){
//    Serial.println("readx");
//    inputt=0;
//    halt();
//  }
  
  
  if(inputt==1){
  Serial.println("FO");
  front(sped, HIGH);
  }
  if(inputt==2){
  Serial.println("BK");
  front(sped, LOW);
  }
  if(inputt==3){
  Serial.println("RT");
  left(sped, LOW);
  }
  if(inputt==4){
  Serial.println("LF");
  left(sped,HIGH);
  }
  if(inputt==0){
  Serial.println("ST");
  halt();
  }
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
