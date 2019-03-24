const { MongoClient, ObjectId } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = '1810';

// 连接mongodb数据库
let connect = () => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function (err, client) {
            if (err) {
                reject(err);
            } else {
                console.log("Connected successfully to server");
                const db = client.db(dbName);
                resolve({db, client});
            }
        });
    })

}

//插入语句
let insert = (table, arr) => {
    return new Promise(async (resolve, reject) => {
        let { db, client } = await connect();
        const collection = db.collection(table);
        collection.insertMany(arr, (err, result) => {
            err ? reject(err) : resolve(result);
            client.close();
        });
    })
}

//查询语句
let find = (table, obj) => {
    return new Promise(async (resolve, reject) => {
        let { db, client } = await connect();
        const collection = db.collection(table);
        collection.find({ ...obj }).toArray((err, docs) => {
            err ? reject(err) : resolve(docs);
            client.close();
        });
    })
}

//修改语句(obj1要修改的数据，obj2要修改数据的条件)
let update = (table, obj1, obj2) => {
    return new Promise(async (resolve, reject) => {
        let { db, client } = await connect();
        const collection = db.collection(table);
        collection.updateOne({ ...obj2 }, { $set: { ...obj1 } }, (err, result) => {
            err ? reject(err) : resolve(result);
            client.close();
        });
    })
}

//删除语句
let del = (table, obj) => {
    return new Promise(async (resolve, reject) => {
        let { db, client } = await connect();
        const collection = db.collection(table);
        collection.deleteOne({ ...obj }, (err, result) => {
            err ? reject(err) : resolve(result);
            client.close();
        });
    })
}

module.exports = {
    connect,
    insert,
    find,
    update,
    del,
    ObjectId
}