#include <Wire.h>


int sped = 255;

float cspedx = 0;
float cspedy = 0;
float cspedr = 0;
float cdenom = 255;

float spedfl;
float spedfr;
float spedbl;
float spedbr;

int rotweight =1;


int inputt = 0;
bool IsDiscreteControl = true;
int fldir = 7;
int flpwm = 6;
int frdir = 12;
int frpwm = 10;
int bldir = 13;
int blpwm = 5;
int brdir = 8;
int brpwm = 11;

char i2cdata[20];//should only contain 8 : START'J' + DIR1(DONT CARE - for redundancy) + DIR2 + SPLIT'A' + SPED1 + SPED2 + SPED3 + END'B' => e.g. forward 255 = 'J01B255A'

char serialmessage = 0;

void frontleft(int sped, bool isForward){
  digitalWrite(fldir, (sped>0)&&isForward);
  analogWrite(flpwm, abs(sped));
}

void frontright(int sped, bool isForward){
  digitalWrite(frdir, (sped>0)&&isForward);
  analogWrite(frpwm, abs(sped));
}

void backleft(int sped, bool isForward){
  digitalWrite(bldir, (sped>0)&&isForward);
  analogWrite(blpwm, abs(sped));
}

void backright(int sped, bool isForward){
  digitalWrite(brdir, (sped>0)&&isForward);
  analogWrite(brpwm, abs(sped));
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
  Serial.println("finish");
  
}

void loop() {
  
  //Serial Control Starts Here
  Serial.readBytes(&serialmessage,1);
  if(serialmessage == 'w'){
    Serial.println("readw");
    inputt=1;
    frontleft(sped,HIGH);
    delay(3000);
    frontleft(sped,LOW);


  }
  if(serialmessage == 'a'){
    Serial.println("reada");
    inputt=4;
    frontright(sped,HIGH);
    delay(3000);
    frontright(sped,LOW);
  }
  if(serialmessage == 's'){
    Serial.println("reads");
    inputt=2;
    backleft(sped,HIGH);
    delay(3000);
    backleft(sped,LOW);

  }
  if(serialmessage == 'd'){
    Serial.println("readd");
    inputt=3;
    backright(sped,HIGH);
    delay(3000);
    backright(sped,LOW);
  }
  if(serialmessage == 'q'){
    Serial.println("readq");
    inputt=0;
    clockwise(sped,LOW);
  }
  if(serialmessage == 'e'){
    Serial.println("reade");
    inputt=0;
    clockwise(sped,HIGH);
  }
  if(serialmessage == 'x'){
    Serial.println("readx");
    inputt=0;
    halt();
  }
  /*
  if(IsDiscreteControl){
    if(inputt==1){
      Serial.println("FO");
      front(sped, HIGH);
    } 
    else if(inputt==2){
      Serial.println("BK");
      front(sped, LOW);
    }
    else if(inputt==3){
      Serial.println("RT");
      left(sped, LOW);
    }
    else if(inputt==4){
      Serial.println("LF");
      left(sped,HIGH);
    }
    else if(inputt==0){
      //Serial.println("ST");
      halt();
    }
    else if (inputt == 5){
      Serial.println("SCW");
      clockwise(sped, HIGH);
    } else if (inputt == 6){
      Serial.println("SAW");
      clockwise(sped, LOW);
    }
  }
  */

}

void receiveEvent(){
  Serial.println("received");
  int counter = 0;
  while(Wire.available()){
    i2cdata[counter] = Wire.read();
    counter++;
    if(counter >= 20){counter = 0;}
    //Serial.println(i2cdata[counter-1]);
    //Serial.println("wire available");
  }
  if(i2cdata[0] == 'J'){
    if(i2cdata[3] == 'A'){
      if(i2cdata[7] == 'B'){
        IsDiscreteControl = true;
        inputt = i2cdata[2] - '0';
        sped = (i2cdata[4] - '0')*100 + (i2cdata[5] - '0')*10 + (i2cdata[6] - '0')*1;
        //Serial.println("Correct data flow");
      }
    }
    else{
      if(i2cdata[4] == 'A'){
        if(i2cdata[14] == 'B'){
          IsDiscreteControl = false;
          rotweight = 2.9;
          if(i2cdata[1] == '0'){//rotation
            cspedr = 0;
          }else if(i2cdata[1] == '1'){
            cspedr = ((i2cdata[11] - '0')*100 + (i2cdata[12] - '0')*10 + (i2cdata[13] - '0')*1)*rotweight;
          }else if(i2cdata[1] == '2'){
            cspedr = -((i2cdata[11] - '0')*100 + (i2cdata[12] - '0')*10 + (i2cdata[13] - '0')*1)*rotweight;
          }

          if(i2cdata[2] == '0'){//motion 1
            cspedy = 0;
          }else if(i2cdata[2] == '1'){
            cspedy = ((i2cdata[5] - '0')*100 + (i2cdata[6] - '0')*10 + (i2cdata[7] - '0')*1);
          }else if(i2cdata[2] == '2'){
            cspedy = -((i2cdata[5] - '0')*100 + (i2cdata[6] - '0')*10 + (i2cdata[7] - '0')*1);
          }

          if(i2cdata[3] == '0'){//motion 2
            cspedx = 0;
          }else if(i2cdata[3] == '3'){
            cspedx = ((i2cdata[8] - '0')*100 + (i2cdata[9] - '0')*10 + (i2cdata[10] - '0')*1);
          }else if(i2cdata[3] == '4'){
            cspedx = -((i2cdata[8] - '0')*100 + (i2cdata[9] - '0')*10 + (i2cdata[10] - '0')*1);
          }
          Serial.println(i2cdata);
          Serial.println(cspedx);
          Serial.println(cspedy);
          Serial.println(cspedr);
          
          
          cdenom = max(abs(cspedy) + abs(cspedx) + abs(cspedr), 255);
          Serial.println(cdenom);
          Serial.println("==============");
          spedfl = ((cspedy + cspedx + cspedr)/cdenom)*255.0;
          spedbl = ((cspedy - cspedx + cspedr)/cdenom)*255.0;
          spedfr = ((cspedy - cspedx - cspedr)/cdenom)*255.0;
          spedbr = ((cspedy + cspedx - cspedr)/cdenom)*255.0;
          Serial.println("==============");
          Serial.println(spedfl);
          Serial.println(spedbl);
          Serial.println(spedfr);
          Serial.println(spedbr);
          
          frontleft(int(spedfl), HIGH);
          backleft(int(spedbl), HIGH);
          frontright(int(spedfr), HIGH);
          backright(int(spedbr), HIGH);


          
        }//B
      }//A
    }//else
  }//J
  
}
