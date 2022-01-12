
module.exports = async (message, roleName) => {
    if (message.type == "APPLICATION_COMMAND") {
        if (roleName.startsWith('<@&') && roleName.endsWith('>')) {
            roleName = roleName.slice(3, -1);
        }
        role = await message.guild.roles.cache.find(r => r.name == roleName) || message.guild.roles.cache.get(roleName)
    } else {
        role = await message.guild.roles.cache.find(r => r.name == roleName) || message.mentions.roles.first() || message.guild.roles.cache.get(roleName)
    }
    return role;
}