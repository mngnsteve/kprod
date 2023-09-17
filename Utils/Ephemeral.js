/**
 * Met un message en éphémère.
 * @param {String} msg
*/
module.exports = (msg) => {
    let data = {
        content: msg,
        ephemeral: true
    }

    return data;
}
