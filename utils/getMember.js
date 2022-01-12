const send = require("./sendMessage.js")
module.exports = async (bot, args, options, message, author, self, botUsersFetch, num, dont_return) => {
    var member;
    //if there are slash commands
    if (message.type == "APPLICATION_COMMAND") {
        //if options are specified
        if (options[num] !== undefined) {

            var user;
            if (options[num].startsWith('<@') && options[num].endsWith('>')) {
                user = options[num].slice(2, -1);
                if (user.startsWith('!')) {
                    user = user.slice(1);
                }
                // console.log(user)
                if (botUsersFetch) {
                    member = await message.guild.members.fetch(user).catch(error => console.log()) || await bot.users.fetch(user).catch(error => console.log())
                } else {
                    member = await message.guild.members.fetch(user).catch(error => console.log())
                }
                if (dont_return == false) {
                    if (!member) {
                        send(message, { content: `<@${author.id}>, Invalid User! using Application cmd` });
                        return;
                    }
                }
            } else {
                if (botUsersFetch) {
                    member = await message.guild.members.fetch(options[num]).catch(error => console.log()) || await bot.users.fetch(options[num]).catch(error => console.log())
                } else {
                    member = await message.guild.members.fetch(options[num]).catch(error => console.log())
                }
                if (dont_return == false) {
                    if (!member) {
                        send(message, { content: `<@${author.id}>, Invalid User! using Application cmd` });
                        return;
                    }
                }
            }
        } else {
            //if options are not specified then check if user can also be sent
            if (self) {
                member = await message.guild.members.fetch(author).catch(error => console.log())
            } else {
                send(message, { content: "Please specify the user!" })
                return;
            }
        }
    } else {
        //pls fix the reply gltich from this line, also pls dont edit code of any other file, and if there is a need to then ask me first
        // console.log(options)
        if (options[0]) {
            var user;
            try {
                if (message.mentions.repliedUser) {
                    if (options[0].startsWith('<@') && options[0].endsWith('>')) {
                        user = options[0].slice(2, -1);

                        if (user.startsWith('!')) {
                            user = user.slice(1);
                        }
                        member = await message.guild.members.fetch(user)
                    } else {
                        // console.log(`arg ` + options[0] + `\n`)
                        member = message.mentions.members.get(Array.from(message.mentions.members.keys())[1]) || await message.guild.members.fetch(options[0]).catch(error => console.log())
                    }
                } else {
                    // console.log(`args ` + options[0])
                    member = message.mentions.members.first() || await message.guild.members.fetch(options[0]).catch(error => console.log())
                }

                if (dont_return == false) {
                    if (!member) {
                        send(message, { content: `<@${message.author.id}>, Invalid User!` });
                        return;
                    }
                }

            } catch (error) {
                console.log(error)
                if (!member) return send(message, { content: `<@${message.author.id}>, Invalid User!` });
            }
        } else {
            if (self) {
                member = await message.guild.members.fetch(author).catch(error => console.log())
            } else {
                send(message, { content: "Please specify the user!" })
                return;
            }
        };
    }
    if (!member) return
    return member;
}