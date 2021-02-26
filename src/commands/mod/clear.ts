import {Command, CommandoMessage} from "discord.js-commando";
import {TextChannel} from "discord.js";

module.exports = class ClearCommand extends Command{
    constructor(discordClient) {
        super(discordClient, {
            name: "clear",
            description: "Clears x amount of messages",
            group: "mod",
            memberName: "clear",
            guildOnly: true,
            args: [
                {
                    key: "amount",
                    prompt: "The number of messages to delete.",
                    type: "integer"
                }
            ],
            throttling: {
                usages: 1,
                duration: 30
            }
        });
    }
    async run(message: CommandoMessage, {amount}){
        if(!message.channel.isText) return;
        const channel = message.channel as TextChannel;
        const messages =  await message.channel.messages.fetch({ limit: amount });
        await channel.bulkDelete(messages);
        return undefined;
    }
}
