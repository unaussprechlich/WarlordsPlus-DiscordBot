import {Command, CommandoMessage} from "discord.js-commando";
import BalancerRole from "../../roles/TeamBalancerRole";
import Logger from "../../util/Logger";
import {getBalancerSpreadSheet} from "../../teambalancer/GoogleApi";

module.exports = class WeightCommand extends Command{

    constructor(discordClient) {
        super(discordClient,{
            name : "weight",
            description: "Returns weight of player",
            group: "teambalancer",
            memberName: "weight",
            guildOnly : true,
            args : [
                {
                    key : "player",
                    prompt : "Playername.",
                    type: "string"
                }
            ],
            throttling:{
                usages: 2,
                duration : 10
            }
        });
    }

    async run(message: CommandoMessage, {player}) {

        //checks if the user has the right role, will bypass if he is the bot owner
        if(!await BalancerRole.hasRolePermission(message) && !this.client.isOwner(message.author)){
            return null;
        }


        Logger.info({
            message, player
        })

        const data = await getBalancerSpreadSheet()

        let weight = getWeight(data, player)
        if (weight == -1)
            await message.channel.send("Cannot find weight");
        else {
            for (const player of data.data.values) {
                let currentPlayer = player[1].toLowerCase();
                if (currentPlayer.indexOf(String(player).toLowerCase()) != -1) {
                    await message.channel.send(player[1] + "'s weight is " + weight);
                    break;
                }
            }
        }

        return null;
    }
}


function getWeight(data, playerName : string) {
    let playerToFind = String(playerName).toLowerCase();
    let weight = -1;

    for (const player of data.data.values) {
        let currentPlayer = player[1].toLowerCase();
        if (currentPlayer == playerToFind || currentPlayer.indexOf(playerToFind) != -1) {
            weight = player[2];
            break;
        }
    }
    return weight
}
