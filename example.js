#!/usr/bin/jjs

load('random_meme_generator.js')

var Thread = Java.type("java.lang.Thread");

var automeme = new WebService('http://api.automeme.net/text?lines=1');
var bitcoin = new WebService('https://www.bitstamp.net/api/ticker/');
var weather = new WebService('http://api.openweathermap.org/data/2.5/weather?q=Hobart,au');

print("starting weather thread...");
weather.run();
print("starting bitcoin thread...");
bitcoin.run();
print("starting automeme thread...");
automeme.run();


//run for 15 seconds
Thread.sleep(15000);

//shut down weather
print("stopping weather thread...");
weather.shutdown();

//run for 15 seconds
Thread.sleep(15000);

//shut down bitcoin
print("stopping bitcoin thread...");
bitcoin.shutdown();

//run for 10 seconds
Thread.sleep(10000);

//shut down automeme
print("stopping automeme thread...");
automeme.shutdown();

print("goodbye :)");