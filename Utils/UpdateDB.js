/**
 * Met à jour une collection de la Database "kika"
 * @param {Promise<Promise<MongoClient> & void>} con
 * @param {String} collection
 * @param {Object} set
 * @param {Object} value
 */
module.exports = (con, collection, set, value) => {
    con.db('kika').collection(collection).updateOne(set, value);
};


