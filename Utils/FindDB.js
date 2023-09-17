/**
 * Cherche des éléments dans une collection de la Database "kika"
 * @param {Promise<Promise<MongoClient> & void>} con
 * @param {String} collection
 * @param {Object} find
 */
module.exports = (con, collection, find) => {
    return con.db('kika').collection(collection).find(find).toArray();
};

