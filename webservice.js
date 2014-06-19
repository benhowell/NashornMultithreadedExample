/**
 * Crude example script.
 * 
 * Javascript has no native threading so there is a bit of cool hackery
 * going on in this script using Java threads and concurrency.
 *
 */

load('sleep.js')

var Thread = Java.type("java.lang.Thread");
var Runnable = Java.type("java.lang.Runnable");

function WebService(endpoint){
  this.endpoint = endpoint;
  this.sleeper = new Sleeper();
};

/**
* This is the entry point for this script.
* Return the running script instance.
*/
WebService.prototype.run = function(){
  var self = this;
  
  this.threadCancelled = false;
  this.thread = new Thread(new Runnable(){
    run: self.main(self.sleeper, self.endpoint)
  });
  this.thread.start();
  return;
};


/**
* Allows script to perform its own cleanup routine before shutting down.
*/
WebService.prototype.shutdown = function(){
  this.threadCancelled = true;
  this.sleeper.waken();
  //block while waiting for thread to terminate
  while (this.thread.isAlive()){
    try {
      Thread.sleep(1000);
    }
    catch (e) {
      self.threadCancelled = true;
    }
  }
  return true;
};


WebService.prototype.main = function(sleeper, endpoint){
  var self = this;
  var JavaScanner = new JavaImporter(
    java.util.Scanner,
    java.net.URL
  );
  function inner(){
    while(!self.threadCancelled){
      with(JavaScanner){
	var scanner = new Scanner(new URL(endpoint).openStream(), "UTF-8");
	while (scanner.hasNextLine()) {
	  print(scanner.nextLine());
	}
	scanner.close();
      }
      sleeper.sleep(Math.random()*10); // just wait around a bit...
    }
  }
  return inner;
};
