#include <Wire.h>
int sped = 200;
int inputt = 0;

int val3 =0;
int val4 =0;

char Mymessage[10];
char serialmessage = 0;

void setup() {
  Serial.begin(9600);
  pinMode(8,OUTPUT);
  pinMode(9,OUTPUT);
  pinMode(10,OUTPUT);
  pinMode(6,OUTPUT);
  pinMode(3,INPUT);
  pinMode(4,INPUT);
  Wire.begin(4);
  Wire.onReceive(receiveEvent);

 
  
}

void loop() {
  Serial.readBytes(&serialmessage,1);
  if(serialmessage == 'w'){
    Serial.println("readw");
    inputt=1;
  }
  if(serialmessage == 'a'){
    Serial.println("reada");
    inputt=4;
  }
  if(serialmessage == 's'){
    Serial.println("reads");
    inputt=2;
  }
  if(serialmessage == 'd'){
    Serial.println("readd");
    inputt=3;
  }
  if(serialmessage == 'q'){
    Serial.println("readq");
    inputt=0;
  }
  if(inputt==1){
  Serial.println("FO");
  digitalWrite(8, HIGH);
  analogWrite(9, sped);
  digitalWrite(6, HIGH);
  analogWrite(10, sped); 
  }
  if(inputt==2){
  Serial.println("BK");
  digitalWrite(8, LOW);
  analogWrite(9, sped);
  digitalWrite(6, LOW);
  analogWrite(10, sped);
  }
  if(inputt==3){
  Serial.println("RT");
  digitalWrite(8, LOW);
  analogWrite(9, sped);
  digitalWrite(6, HIGH);
  analogWrite(10, sped);
  }
  if(inputt==4){
  Serial.println("LF");
  digitalWrite(8, HIGH);
  analogWrite(9, sped);
  digitalWrite(6, LOW);
  analogWrite(10, sped);
  }
  if(inputt==0){
  Serial.println("ST");
  digitalWrite(8, HIGH);
  analogWrite(9, 0);
  digitalWrite(6, HIGH);
  analogWrite(10, 0);
  }
}

void receiveEvent(){
  Serial.println("received");
  while(Wire.available()){
    inputt = Wire.read();
    Serial.println(inputt);
    Serial.println("wire available");
  }
  
}
