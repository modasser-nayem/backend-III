class Node {
   constructor(key, value) {
      this.key = key;
      this.value = value;
      this.prev = null;
      this.next = null;
   }
}

class LRUCache {
   constructor(capacity) {
      this.capacity = capacity;
      this.cache = new Map(); // Stores key → Node
      this.head = new Node(null, null); // Dummy head
      this.tail = new Node(null, null); // Dummy tail
      this.head.next = this.tail;
      this.tail.prev = this.head;
   }

   // Move node to the front (Most Recently Used)
   _moveToFront(node) {
      this._remove(node);
      this._addToFront(node);
   }

   // Remove node from linked list
   _remove(node) {
      node.prev.next = node.next;
      node.next.prev = node.prev;
   }

   // Add node to front (Most Recently Used)
   _addToFront(node) {
      node.next = this.head.next;
      node.prev = this.head;
      this.head.next.prev = node;
      this.head.next = node;
   }

   // Get value from cache
   get(key) {
      if (!this.cache.has(key)) return -1; // Key not found

      let node = this.cache.get(key);
      this._moveToFront(node);
      return node.value;
   }

   // Insert/update value in cache
   put(key, value) {
      if (this.cache.has(key)) {
         let node = this.cache.get(key);
         node.value = value;
         this._moveToFront(node);
      } else {
         if (this.cache.size >= this.capacity) {
            let lruNode = this.tail.prev;
            this._remove(lruNode);
            this.cache.delete(lruNode.key);
         }
         let newNode = new Node(key, value);
         this.cache.set(key, newNode);
         this._addToFront(newNode);
      }
   }

   // Display cache state
   display() {
      let current = this.head.next;
      let result = [];
      while (current !== this.tail) {
         result.push(`[${current.key}: ${current.value}]`);
         current = current.next;
      }
      console.log(result.join(" -> "));
   }
}

// Example Usage:
const lru = new LRUCache(3);
lru.put(1, "A");
lru.put(2, "B");
lru.put(3, "C");
lru.display(); // Output: [3: C] -> [2: B] -> [1: A]

console.log(lru.get(2)); // Output: B
lru.display(); // Output: [2: B] -> [3: C] -> [1: A]

lru.put(4, "D"); // 1 (LRU) is evicted
lru.display(); // Output: [4: D] -> [2: B] -> [3: C]

console.log(lru.get(1)); // Output: -1 (1 was evicted)
