import {getBalancerSpreadSheet} from "./GoogleApi";
import {GuildChannel, GuildMember, MessageEmbed, VoiceChannel} from "discord.js";
import {CommandoMessage} from "discord.js-commando";
import {DateTime} from "luxon"
import UserError from "../util/UserError";

require("../util/Extensions")

export interface Player {
    uuid: string
    member: GuildMember
}

interface PlayerToBeBalance extends Player {
    weight: number
}

export async function newBalance(players: Array<Player>, message: CommandoMessage,
                                 voiceChannels: { red: GuildChannel, lobby: GuildChannel, blue: GuildChannel }, threshold: number) {

    const sheet = (await getBalancerSpreadSheet()).data.values

    function findWeightForPlayerInSheet(player: Player) {
        for (const row of sheet) {
            if (player.uuid.toLowerCase().replace(" ", "").replace("-", "") == row[0].toLowerCase().replace(" ", "").replace("-", "")) {
                return Number.parseFloat(row[2])
            }
        }
        throw new UserError(`Can't the weight for <@${player.member.id}> please add them to the "inclusive" sheet.`)
    }

    const playersToBalance: Array<PlayerToBeBalance> = players.map(it => {
        it["weight"] = findWeightForPlayerInSheet(it)
        return it as PlayerToBeBalance
    })

    const totalWeights = playersToBalance.sum("weight")
    const indexArray: Array<number> = playersToBalance.map((value, index) => index)

    type BlueAndRedArray = {
        blueTeam: Array<PlayerToBeBalance>
        redTeam: Array<PlayerToBeBalance>
        iteration: number
    }

    async function findRandomTeam(maxIterations: number, iteration: number = 0): Promise<BlueAndRedArray> {
        //Execute 1000 iterations per event loop
        for (let i = 0; i < 1000; i++) {
            iteration++;
            //Exit recursion if we have used up all iterations
            if (iteration >= maxIterations) {
                throw new UserError(`The Balancer used ${iteration} iterations and couldn't find a balanced result. Either adjust the weight difference or get more players.`)
            }
            indexArray.shuffle()
            let blueWeights = 0
            for (let j = 0; j < indexArray.length; j++) {
                if (j % 2 === 0) {
                    blueWeights += playersToBalance[j].weight
                }
            }
            if (blueWeights >= totalWeights / 2 - threshold && blueWeights <= totalWeights / 2) {
                const blueTeam: Array<PlayerToBeBalance> = []
                const redTeam: Array<PlayerToBeBalance> = []
                for (let j = 0; j < indexArray.length; j++) {
                    if (j % 2 === 0) {
                        blueTeam.push(playersToBalance[j])
                    } else {
                        redTeam.push(playersToBalance[j])
                    }
                }
                return {blueTeam, redTeam, iteration}
            }
        }

        /*
         * We use this thing to spread out the recursion across multiple event loops.
         */
        return new Promise<BlueAndRedArray>(function (resolve, reject) {
            setImmediate(async () => {
                try {
                    resolve(await findRandomTeam(maxIterations, iteration))
                } catch (e) {
                    reject(e)
                }

            })
        });
    }

    const {redTeam, blueTeam, iteration} = await findRandomTeam(1_000_000)

    redTeam.sort(function (a, b) {
        return b.weight - a.weight
    })
    blueTeam.sort(function (a, b) {
        return b.weight - a.weight
    })

    const blueWeight = blueTeam.sum("weight")
    const redWeight = redTeam.sum("weight")

    await Promise.all(redTeam.map(async it => it.member.voice.setChannel(voiceChannels.red)))
    await Promise.all(blueTeam.map(async it => it.member.voice.setChannel(voiceChannels.blue)))

    return message.embed(new MessageEmbed({
            title: DateTime.now().toISO() + " | " + iteration,
            color: 2123412,
            fields: [
                {
                    name: "**__Blue Team__** - " + blueWeight,
                    value: "```" + blueTeam.reduce((a, b) => a + b.member.displayName + "\n", "") + "```",
                    inline: true
                },
                {
                    "name": "**__Red Team__** - " + redWeight,
                    "value": "```" + redTeam.reduce((a, b) => a + b.member.displayName + "\n", "") + "```",
                    "inline": true
                }
            ]
        }
    ));
}


/*
export async function newBalance(players: Array<{uuid : string, member : GuildMember}>, message : CommandoMessage,
                                 voiceChannels : {red : GuildChannel, lobby : GuildChannel, blue : GuildChannel}) {

    const data = await getBalancerSpreadSheet()
    const sheet = data.data.values

    let playersToBeBalanced: Array<Player> = []
    var blueTeam: Array<Player> = []
    var redTeam: Array<Player> = []
    var preAssignBlue = []
    var preAssignRed = []
    var totalWeights = 0


    var preAssign = false
    var maxWeightDiff = sheet[4][9]

    var blueTeamString = ""
    var redTeamString = ""

    for (let player of players) {
        playersToBeBalanced.push(getPlayer(data, player.uuid, true))
    }

    playersToBeBalanced.forEach(function (player) {
        console.log(player.getName() + " - " + player.getWeight());
        totalWeights += +player.getWeight()
    })

    totalWeights = Math.round(totalWeights * 100) / 100

    let counter = 0
    do {
        counter++
        blueTeam = []
        redTeam = []
        if (preAssign) {
            blueTeam.push(...preAssignBlue)
            blueTeam.push(...preAssignRed)
        }

        shuffle(playersToBeBalanced)
        if (preAssign) {
            if (preAssignBlue.length >= preAssignRed.length) {
                for (var i = 0; i < preAssignBlue.length - preAssignRed.length; i++) {
                    redTeam.push(playersToBeBalanced[i])
                }
                for (var i = preAssignBlue.length - preAssignRed.length; i < playersToBeBalanced.length; i++) {
                    if (i % 2 == 0)
                        blueTeam.push(playersToBeBalanced[i])
                    else
                        redTeam.push(playersToBeBalanced[i])
                }
            } else {
                for (var i = 0; i < preAssignRed.length - preAssignBlue.length; i++) {
                    blueTeam.push(playersToBeBalanced[i])
                }
                for (var i = preAssignRed.length - preAssignBlue.length; i < playersToBeBalanced.length; i++) {
                    if (i % 2 == 0)
                        blueTeam.push(playersToBeBalanced[i])
                    else
                        redTeam.push(playersToBeBalanced[i])
                }
            }
        } else {
            for (var i = 0; i < playersToBeBalanced.length; i++) {
                if (i % 2 == 0)
                    blueTeam.push(playersToBeBalanced[i])
                else
                    redTeam.push(playersToBeBalanced[i])

            }
        }
    }
    while (balancedWeights(blueTeam, redTeam, maxWeightDiff) || balancedTalkers(blueTeam, redTeam) && counter < 10000000);

    if (counter == 10000000)
        return "TOO UNBALANCED"

    var sortedBlueTeam = blueTeam.slice().sort(function (a, b) { return b.getWeight() - a.getWeight() })
    var sortedRedTeam = redTeam.slice().sort(function (a, b) { return b.getWeight() - a.getWeight() })

    for (var i = 0; i < sortedBlueTeam.length; i++) {
        //console.log(sortedBlueTeam[i].getName() + " - " + sortedBlueTeam[i].getWeight() + " - " + sortedBlueTeam[i].getTalker())
        blueTeamString += sortedBlueTeam[i].getName() + " - \n"
    }
    for (var i = 0; i < sortedRedTeam.length; i++) {
        //console.log(sortedRedTeam[i].getName() + " - " + sortedRedTeam[i].getWeight() + " - " + sortedRedTeam[i].getTalker())
        redTeamString += sortedRedTeam[i].getName() + " - \n"
    }


    console.log(getTotalWeightFromTeam(sortedBlueTeam))
    console.log(getTotalWeightFromTeam(sortedRedTeam))
    console.log(maxWeightDiff)



    // blueTeamString += Math.round(getTotalWeightFromTeam(sortedBlueTeam) * 100) / 100
    // redTeamString += Math.round(getTotalWeightFromTeam(sortedRedTeam) * 100) / 100


    //blue
    for (const user of message.guild.channels.cache.get("776596486963462164").members) {
        if (sortedRedTeam.some(p => p.getName() == user[1].nickname) || sortedRedTeam.some(p => p.getName() == user[1].user.username)) {
            console.log("Moving " + user[1].nickname + " from blue to red");
            await message.guild.member(user[1].id).voice.setChannel("776596447289933854")
        }
    }
    //red
    for (const user of message.guild.channels.cache.get("776596447289933854").members) {
        if (sortedBlueTeam.some(p => p.getName() == user[1].nickname) || sortedBlueTeam.some(p => p.getName() == user[1].user.username)) {
            console.log("Moving " + user[1].nickname + " from red to blue");
            await message.guild.member(user[1].id).voice.setChannel("776596486963462164")
        }
    }

    //general
    for (const user of message.guild.channels.cache.get("776590423501045764").members) {
        if (sortedBlueTeam.some(p => p.getName() == user[1].nickname) || sortedBlueTeam.some(p => p.getName() == user[1].user.username)) {
            console.log("Moving " + user[1].nickname + " from general to blue");
            await message.guild.member(user[1].id).voice.setChannel("776596486963462164")
        } else if (sortedRedTeam.some(p => p.getName() == user[1].nickname) || sortedRedTeam.some(p => p.getName() == user[1].user.username)) {
            console.log("Moving " + user[1].nickname + " from general to red");
            await message.guild.member(user[1].id).voice.setChannel("776596447289933854")
        }
    }

    //waiting list
    for (const user of message.guild.channels.cache.get("802654876470345781").members) {
        if (sortedBlueTeam.some(p => p.getName() == user[1].nickname) || sortedBlueTeam.some(p => p.getName() == user[1].user.username)) {
            console.log("Moving " + user[1].nickname + " from waiting list to blue");
            await message.guild.member(user[1].id).voice.setChannel("776596486963462164")
        } else if (sortedRedTeam.some(p => p.getName() == user[1].nickname) || sortedRedTeam.some(p => p.getName() == user[1].user.username)) {
            console.log("Moving " + user[1].nickname + " from waiting list to red");
            await message.guild.member(user[1].id).voice.setChannel("776596447289933854")
        }
    }

    return {
        embed: {
            title: new Date() + "",
            color: 2123412,
            fields: [
                {
                    "name": "**__Blue Team__** - " + getTotalWeightFromTeam(sortedBlueTeam) + "  |  " + getTotalTalkers(blueTeam),
                    "value": "```" + blueTeamString + "```",
                    "inline": true
                },
                {
                    "name": "**__Red Team__** - " + getTotalWeightFromTeam(sortedRedTeam) + "  |  " + getTotalTalkers(sortedRedTeam),
                    "value": "```" + redTeamString + "```",
                    "inline": true
                }
            ]
        }
    }

}
function balancedWeights(blueTeam: Array<Player>, redTeam: Array<Player>, maxWeightDiff: number) {
    return Math.abs(getTotalWeightFromTeam(blueTeam) - getTotalWeightFromTeam(redTeam)) > maxWeightDiff
}

function balancedTalkers(blueTeam: Array<Player>, redTeam: Array<Player>) {
    return Math.abs(getTotalTalkers(blueTeam) - getTotalTalkers(redTeam)) > 2
}

function getTotalWeightFromTeam(array: Array<Player>) {
    if (array.length == 0)
        return 0
    else {
        return array.reduce((accumulator, currentPlayer) => +accumulator + +currentPlayer.getWeight(), 0);
    }
}

function getTotalTalkers(array: Array<Player>) {
    if (array.length == 0)
        return 0
    else
        return array.reduce((accumulator, currentPlayer) => +accumulator + +currentPlayer.getTalker(), 0);
}


function weightDiff(team1: Array<Player>, team2: Array<Player>) {
    return Math.abs(getTotalWeightFromTeam(team1) - getTotalWeightFromTeam(team2))
}



function getPlayer(data, args: String, adjusted: Boolean) {
    let playerToFind = String(args).toLowerCase();
    let returnPlayer: Player

    for (const player of data.data.values) {
        let currentPlayer = player[2].toLowerCase();
        if (currentPlayer == playerToFind) {
            if (adjusted) {
                returnPlayer = new Player(player[1], player[3], player[7] == "TRUE" ? 1 : 0)
            }
            else {
                returnPlayer = new Player(player[1], player[2], player[7] == "TRUE" ? 1 : 0)
            }
            break;
        }
    }
    return returnPlayer
}*/

