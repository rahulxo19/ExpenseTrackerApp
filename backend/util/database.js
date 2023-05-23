const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = () => {
  MongoClient.connect(
    "mongodb://btree:Qawsed@ac-ikgx6e8-shard-00-00.0aajqa9.mongodb.net:27017,ac-ikgx6e8-shard-00-01.0aajqa9.mongodb.net:27017,ac-ikgx6e8-shard-00-02.0aajqa9.mongodb.net:27017/expenseTracker?ssl=true&replicaSet=atlas-izr0i8-shard-0&authSource=admin&retryWrites=true&w=majority",
    function (err, client) {
      if (err) {
        console.log(err);
        return;
      }
      const db = client.db();
      console.log(db);
    }
  );
};

module.exports = {
  mongoConnect: mongoConnect,
};
