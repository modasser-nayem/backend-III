class ConcurrentHashTable {
   constructor() {
      this.map = new Map();
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

   async set(key, value) {
      await this.acquireLock();
      this.map.set(key, value);
      this.releaseLock();
   }

   async get(key) {
      return this.map.get(key);
   }

   async delete(key) {
      await this.acquireLock();
      this.map.delete(key);
      this.releaseLock();
   }

   async display() {
      console.log(this.map);
   }
}

// Example Usage:
const hashTable = new ConcurrentHashTable();
hashTable.set("name", "Ali");
hashTable.set("age", 21);
hashTable.get("name").then(console.log); // "Ali"
hashTable.display();
