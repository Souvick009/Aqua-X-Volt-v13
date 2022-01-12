module.exports = async (message, msg) => {
    if (message.type == "APPLICATION_COMMAND") {
        return
    } else {
        return msg.delete();

    }
}