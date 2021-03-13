// decided to use indexedDB here since it is very user friendly and very syntax is very straight forward
let db;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(e) {
     db = e.target.result;
    db.createObjectStore("pending", { autoIncrement: true});
};
// tests when triggered that when a data base has a bigger version number than the exisitng stored db is loaded.

request.onsuccess = function(e) {
    db = e.target.result;

    if (navigator.onLine) {
        checkDatabase();
        // gives back a boolean if online or not. if so check db, else do nothing. 
    };
};

request.onerror = function(e) {
    console.log("It appears something went wrong.");
};
function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");

    const storeobj = transaction.objectStore("pending");

    storeobj.add(record);
};