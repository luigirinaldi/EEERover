#include <Arduino.h>


// can't use Arduino pins 5,7 and 10 because of wifi board
const byte signalInterruptPin = 0;

volatile int signalCounter;
int prevTime = 0;


// ISR (Interrupt Service Routines)

void signalISR() {
  signalCounter++;
}

void setup() {
  Serial.begin(9600);

  pinMode(signalInterruptPin, INPUT_PULLUP);

  attachInterrupt(digitalPinToInterrupt(signalInterruptPin), signalISR, RISING);
  prevTime = millis(); // Initialize prevTime
}

const int samplingPeriod = 1000; // 1 
double measuredFrequency = 0;

void loop() {
  if(millis() - prevTime >= samplingPeriod){
    // could disable interrupts during this section if this doesn't work properly
    measuredFrequency = 1000*(signalCounter/double(samplingPeriod)); //mulitply by 1000 because measurement in milliseconds

    signalCounter = 0;
    prevTime = millis();


    Serial.print(" Measured Frequency: ");
    Serial.println(measuredFrequency);
  }
}
