#include <Servo.h>

#define Servo_PWM 6

String val;  // Data received from serial port
int ledPin_1 = 8;  // Arduino built-in LED
int ledPin_2 = 13; 
bool ledState = false;
Servo MG995_Servo; 

void setup() {
  pinMode(ledPin_1, OUTPUT);
  pinMode(ledPin_2, OUTPUT);
  Serial.begin(9600);
  MG995_Servo.attach(Servo_PWM);
}

void loop() {
  if (Serial.available()) {
    val = Serial.readStringUntil('\n');
    val.trim();
  }

  if (val == "50!") {
    digitalWrite(ledPin_1, HIGH);
    digitalWrite(ledPin_2, HIGH); 

    for (int angle = 45; angle <= 60; angle++) {
      MG995_Servo.write(angle);
      delay(15); // set delay between steps to 5ms for faster movement
    }
  }  else if (val == "0!") {
    digitalWrite(ledPin_1, LOW);
    digitalWrite(ledPin_2, LOW); 
    MG995_Servo.write(45);
  }
}
