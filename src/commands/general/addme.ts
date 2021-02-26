import {Command, CommandoMessage} from "discord.js-commando";
import {TextChannel} from "discord.js";

module.exports = class ClearCommand extends Command{
    constructor(discordClient) {
        super(discordClient, {
            name: "addme",
            description: "Sends the invite link for the bot.",
            group: "general",
            memberName: "invitelink",
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 10
            }
        });
    }
    async run(message: CommandoMessage, {amount}){
        return message.reply(process.env.BOT_INVITE_LINK);
    }
}
