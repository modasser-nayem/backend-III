class ConcurrentQueue {
   constructor() {
      this.queue = [];
      this.lock = false;
   }

   async acquireLock() {
      while (this.lock) {
         await new Promise((resolve) => setTimeout(resolve, 10));
      }
      this.lock = true;
   }

   releaseLock() {
      this.lock = false;
   }

   async enqueue(item) {
      await this.acquireLock();
      this.queue.push(item);
      this.releaseLock();
   }

   async dequeue() {
      await this.acquireLock();
      let item = this.queue.shift();
      this.releaseLock();
      return item;
   }

   async display() {
      console.log(this.queue);
   }
}

// Example Usage:
const queue = new ConcurrentQueue();
queue.enqueue("Task 1");
queue.enqueue("Task 2");
queue.dequeue().then(console.log); // "Task 1"
queue.display(); // ["Task 2"]
