//Install board drivers, WiFiNINA, and ArduinoHttpClient

#include <WiFiNINA.h>
#include <ArduinoHttpClient.h>

//Define what pin my button is on
#define BUTTON_PIN_1 2

char ssid[] = "Network Name";  //WiFi network name
char pass[] = "Network Password";  //WiFi network password

//Server address
char serverAddress[] = "yourserveraddress.org";
int port = 80;

void setup() {
  Serial.begin(9600);

  //Prepare the button, can be removed if you aren't using a button
  pinMode(BUTTON_PIN_1, INPUT_PULLUP);

  //Connect to WiFi
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    Serial.println("Attempting to connect to WiFi...");
    delay(1000);
  }
  Serial.println("Connected to WiFi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  //Replace this with whatever you're using to trigger a database entry
  if (digitalRead(BUTTON_PIN_1) == LOW) {
    Serial.println("BUTTON_1_PRESSED");

    WiFiClient client;
    HttpClient httpClient = HttpClient(client, serverAddress, port);

    //Pass parameters here
    String val = "Value";
    String postData = "param1=" + val;

    //This should be your POST endpoint
    String path = "/addtodatabase/";

    //Make the actual POST request
    httpClient.beginRequest();
    httpClient.post(path);
    httpClient.sendHeader("Content-Type", "application/x-www-form-urlencoded"); //Or "application/json" for JSON
    httpClient.sendHeader("Content-Length", postData.length());
    httpClient.endRequest();
    httpClient.write((byte*)postData.c_str(), postData.length());

    //See what the server responds with
    int statusCode = httpClient.responseStatusCode();
    String response = httpClient.responseBody();

    //Print to the console when we receive a response from the client
    Serial.print("Status code: ");
    Serial.println(statusCode);
    Serial.print("Response: ");
    Serial.println(response);

    //Close the connection
    httpClient.stop();
  }
}