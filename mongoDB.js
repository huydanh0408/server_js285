const mongoClient = require("mongodb").MongoClient;
const dbname = process.env.DBNAME;
const uri = process.env.URI;
class mongoDB {
  getAll(collectionName, filter = {}) {
    return mongoClient.connect(uri).then(client=> {
      let collection = client.db(dbname).collection(collectionName);
      return collection.find(filter).toArray();
    }).catch (err => {
        console.log(err);
    })
  }
  getOne(collectionName, filter = {}) {
    return mongoClient.connect(uri).then(client=> {
      let collection = client.db(dbname).collection(collectionName);
      return collection.findOne(filter);
    }).catch (err => {
        console.log(err);
    })
  }
  insertOne(collectionName, doc){
    return mongoClient.connect(uri).then(client=> {
        let collection = client.db(dbname).collection(collectionName);
        return collection.insertOne(doc);
      }).catch (err => {
          console.log(err);
      })
  }
  updateOne(collectionName, filter, doc) {
    return mongoClient.connect(uri).then(client=> {
        let collection = client.db(dbname).collection(collectionName);
        return collection.updateOne(filter,doc);
      }).catch (err => {
          console.log(err);
      })
  }
  deleteOne(collectionName, filter){
    return mongoClient.connect(uri).then(client=> {
        let collection = client.db(dbname).collection(collectionName);
        return collection.deleteOne(filter);
      }).catch (err => {
          console.log(err);
      })
  }
}

let db=new mongoDB();
module.exports = db;
