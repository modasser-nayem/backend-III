class Semaphore {
   constructor(max) {
      this.max = max;
      this.count = 0;
      this.queue = [];
   }

   async acquire() {
      return new Promise((resolve) => {
         if (this.count < this.max) {
            this.count++;
            resolve();
         } else {
            this.queue.push(resolve);
         }
      });
   }

   release() {
      if (this.queue.length > 0) {
         const next = this.queue.shift();
         next();
      } else {
         this.count--;
      }
   }
}

// Usage Example
const semaphore = new Semaphore(2); // Allow 2 tasks to run concurrently

async function limitedTask(id) {
   await semaphore.acquire();
   console.log(`Task ${id} is running`);
   await new Promise((resolve) => setTimeout(resolve, 2000));
   console.log(`Task ${id} is done`);
   semaphore.release();
}

limitedTask(1);
limitedTask(2);
limitedTask(3);
limitedTask(4);
