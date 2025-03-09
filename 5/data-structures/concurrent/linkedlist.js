class Node {
   constructor(value) {
      this.value = value;
      this.next = null;
   }
}

class ConcurrentLinkedList {
   constructor() {
      this.head = null;
      this.lock = false;
   }

   async acquireLock() {
      while (this.lock) {
         await new Promise((resolve) => setTimeout(resolve, 10)); // Wait if locked
      }
      this.lock = true;
   }

   releaseLock() {
      this.lock = false;
   }

   async insert(value) {
      await this.acquireLock();
      let newNode = new Node(value);
      newNode.next = this.head;
      this.head = newNode;
      this.releaseLock();
   }

   async display() {
      let current = this.head;
      while (current) {
         console.log(current.value);
         current = current.next;
      }
   }
}

// Example Usage:
const list = new ConcurrentLinkedList();
list.insert(10);
list.insert(20);
list.insert(30);
list.display(); // Output: 30 → 20 → 10
