class RWMutex {
   constructor() {
      this.readers = 0;
      this.writeLocked = false;
      this.readQueue = [];
      this.writeQueue = [];
   }

   async readLock() {
      return new Promise((resolve) => {
         if (!this.writeLocked) {
            this.readers++;
            resolve();
         } else {
            this.writeQueue.push(resolve);
         }
      });
   }

   readUnlock() {
      this.readers--;
      if (this.readers === 0 && this.writeQueue.length > 0) {
         this.writeLocked = true;
         const next = this.writeQueue.shift();
         next();
      }
   }

   async writeLock() {
      return new Promise((resolve) => {
         if (!this.writeLocked && this.readers === 0) {
            this.writeLocked = true;
            resolve();
         } else {
            this.writeQueue.push(resolve);
         }
      });
   }

   writeUnlock() {
      this.writeLocked = false;
      if (this.writeQueue.length > 0) {
         this.writeLocked = true;
         const next = this.writeQueue.shift();
         next();
      } else {
         while (this.readQueue.length > 0) {
            const next = this.readQueue.shift();
            this.readers++;
            next();
         }
      }
   }
}

const rwMutex = new RWMutex();

async function readTask(id) {
   await rwMutex.readLock();
   console.log(`Reader ${id} is reading`);
   await new Promise((resolve) => setTimeout(resolve, 1000));
   console.log(`Reader ${id} is done`);
   rwMutex.readUnlock();
}

async function writeTask(id) {
   await rwMutex.writeLock();
   console.log(`Writer ${id} is writing`);
   await new Promise((resolve) => setTimeout(resolve, 2000));
   console.log(`Writer ${id} is done`);
   rwMutex.writeUnlock();
}

// Simultaneous reads but exclusive writes
readTask(1);
readTask(2);
writeTask(1);
readTask(3);
writeTask(2);
