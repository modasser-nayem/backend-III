const {
   Worker,
   isMainThread,
   parentPort,
   workerData,
} = require("worker_threads");

if (isMainThread) {
   const sharedBuffer = new SharedArrayBuffer(4); // 4 bytes for a single int32
   const counter = new Int32Array(sharedBuffer);

   const worker = new Worker(__filename, { workerData: sharedBuffer });

   worker.on("message", (msg) => console.log(msg));

   setTimeout(() => {
      console.log("Final Counter:", Atomics.load(counter, 0));
   }, 1000);
} else {
   const counter = new Int32Array(workerData);
   for (let i = 0; i < 10000; i++) {
      Atomics.add(counter, 0, 1); // Thread-safe increment
   }
   parentPort.postMessage("Worker finished counting.");
}
