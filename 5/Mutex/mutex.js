class Mutex {
   constructor() {
      this.locked = false;
      this.queue = [];
   }

   async lock() {
      return new Promise((resolve) => {
         if (!this.locked) {
            this.locked = true;
            resolve();
         } else {
            this.queue.push(resolve);
         }
      });
   }

   unlock() {
      if (this.queue.length > 0) {
         const next = this.queue.shift();
         next();
      } else {
         this.locked = false;
      }
   }
}

// Usage Example
const mutex = new Mutex();

async function criticalSection(id) {
   await mutex.lock();
   console.log(`Task ${id} is running`);
   await new Promise((resolve) => setTimeout(resolve, 1000));
   console.log(`Task ${id} is done`);
   mutex.unlock();
}

criticalSection(1);
criticalSection(2);
criticalSection(3);
