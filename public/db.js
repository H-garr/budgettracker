// decided to use indexedDB here since it is very user friendly and very syntax is very straight forward
let db;
// indexedDB is pretty self explanitory if you read the function names.
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
    // creating this early so i can call it for later.
    const transaction = db.transaction(["pending"], "readwrite");

    const storeobj = transaction.objectStore("pending");

    storeobj.add(record);
};

function checkDatabase(){
    const transaction = db.transaction(["pending"], "readwrite");

    const storeobj = transaction.objectStore("pending");

    const getAll = storeobj.getAll();

    getAll.onsuccess = function() {
        // a grab all when sucessful 
        if (getAll.result.length > 0){
            // validation of if the the get all has any data in it.
            fetch("/api/transaction/bulk", {
                // CRUD post event.
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            // coverts lang into json
            .then(()=>{
                // opens a transaction into your "pending" database.
                const transaction = db.transaction(["pending"], "readwrite");
                // accesses the "pending" objectStore
                const storeobj = transaction.objectStore("pending");
                // clears the storedobj
                storeobj.clear();
            });
        };
    };
};
window.addEventListener('online', checkDatabase);
// forgot to add this call back for the check database function hence why it was not working last commit.
// this checks if the user is online/when they come back online and when that happens it runs/calls the function checkDatabase.