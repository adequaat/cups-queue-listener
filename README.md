# cups-queue-listener
Enables node scripts to listen to CUPS specific events, like succesfull prints, errored prints and queue length.

# usage
The exported value from this module is an eventEmitter. You can add listeners to it to be notified of the following events `print-error` and `print-success`.  
When you add some file to the CUPS queue (for instance by `$ lp filename.pdf` or by using the `cups-print` module), you will get the job id and the destination it is queued for.  
Emit an `print-queued` event (see example below) on the `cups-queue-listener` with that `id` and `destination` to enable it sending the following events:
- `queue-update`, with the folling data; `queue`: the number of items currently in the queue, `queued`: the number of items in the queue which are not yet printed, `printed`: the number of printed items, `destination`: the printer for which these items are queued.  
- `queue-almost-empty`, with data; `destination`: the destination for which the queue is almost empty (5 items left).  
- `all-printed`, with data; `destination`: the destination for which the queue is all printed.

These events are also emitted as destination specific events. they have the same data as above but lack the destination property.
- `queue-update-${destination}`
- `queue-almost-empty-${destination}`
- `all-printed-${destination}`

```javascript
queueListener.on('queue-update-somePrinterName', (data) => {
  console.log(data);
});
```

# examples
```javascript
import queueListener from 'cups-queue-listener';
import print from 'cups-print';


queListener
  .on("print-error", (data) => {
     console.log("error printing", data);
   })
   .on("print-success", (data) => {
     console.log("\\o/", data);
   })
   .on("queue-update", (data) => {
     console.log(data);
   })
   .on("queue-almost-empty", ({ destination }) => {
     console.log(`${destination} queue is almost empty`);
   });


// do some print action
const { id, destination } = print('some-pdf-File.pdf');

queueListener.emit('print-queued', { id, destination });

```
 