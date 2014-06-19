/**
* An interruptable sleep routine.
*/

function Sleeper(){
  var self = this;
  this.lock = new java.util.concurrent.locks.ReentrantLock();
  this.wake = this.lock.newCondition();

  /**
  * Starts a thread containing a sleep routine.
  * @param interval the sleep interval in seconds.
  */
  this.sleep = function(interval){
    self.thread = new Thread(new Runnable(){run: self.sleeper(self, interval)});
    self.thread.start();
    self.lock.lock();
    self.wake.await();
    self.lock.unlock();
  };


  /**
  * Interruptable sleep thread.
  * @param self a reference to our containing self who spawned this thread
  * routine (i.e. Sleeper().this).
  * @param interval the sleep interval in seconds
  * @return the inner function declaration.
  */
  this.sleeper = function(self, interval){
    function inner(){
      try {
	Thread.sleep(interval * 1000);
      }
      catch (e) {
	if (!(e instanceof java.lang.InterruptedException)) {
	  print("Unexpected error " + e.toString())
	}
      }
      finally{
	self.lock.lock();
	self.wake.signalAll();
	self.lock.unlock();
      }
    }
    return inner;
  };


  /**
  * Interrupts the sleep thread. This breaks sleep without waiting for sleep
  * interval to complete.
  */
  this.waken = function(){
    self.thread.interrupt();
  };
};