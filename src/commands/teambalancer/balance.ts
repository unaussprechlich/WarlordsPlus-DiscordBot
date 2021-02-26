import {Command, CommandoMessage} from "discord.js-commando";
import Logger from "../../util/Logger";
import {newBalance} from "../../teambalancer/TeamBalancer";
import BalancerRole from "../../roles/TeamBalancerRole";

module.exports = class BalanceCommand extends Command{

    constructor(discordClient) {
        super(discordClient,{
            name : "balance",
            description: "Balances the teams",
            group: "teambalancer",
            memberName: "balance",
            guildOnly : true,
            args : [
                {
                    key : "players",
                    prompt : "List of players that should be balanced.",
                    type: "string",
                    parse : function (players : string) {
                        return players.trim().replace(" ", "").split(",")
                    },
                    validate: function (players : string) {
                        if(players.trim().replace(" ", "").match("^([a-zA-Z0-9_]{1,16}),(([a-zA-Z0-9_]{1,16}),)*([a-zA-Z0-9_]{1,16})$")){
                            return true
                        } else {
                            return "The list of players is in the wrong format. It should be 'username,...,username'!"
                        }
                    }
                }
            ],
            throttling:{
                usages: 2,
                duration : 10
            }
        });
    }

    async run(message: CommandoMessage, {players}) {
        try{
            //checks if the user has the right role, will bypass if he is the bot owner
            if(!await BalancerRole.hasRolePermission(message) && !this.client.isOwner(message.author)){
                return null;
            }

            const balance = await newBalance(players, message);

            await message.delete();
            await message.channel.send(balance);

            return null;
        }catch (e) {
            Logger.error(e)
            console.error(e)
        }
    }
}
