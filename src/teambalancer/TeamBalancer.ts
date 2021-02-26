import {getBalancerSpreadSheet} from "./GoogleApi";

class Player {
    name: String
    weight: number
    talker: number
    constructor(name: String, weight: number, talker: number) {
        this.name = name
        this.weight = weight
        this.talker = talker
    }
    getName() {
        return this.name
    }
    getWeight() {
        return this.weight
    }
    getTalker() {
        return this.talker
    }

    toString(){
        return `${this.name}:${this.getWeight()}`
    }
}

export async function newBalance(players: Array<String>, message) {

    const data = await getBalancerSpreadSheet()
    const sheet = data.data.values

    const playersToBeBalanced: Array<Player> = players.map(value => getPlayer(data, value, true));

    return playersToBeBalanced.map(value => value.toString())

    /*

    let blueTeam: Array<Player> = [];
    let redTeam: Array<Player> = [];
    let preAssignBlue = [];
    let preAssignRed = []
    let totalWeights = playersToBeBalanced.reduce((previousValue, currentValue) => previousValue + currentValue.getWeight(), 0)
    totalWeights = Math.round(totalWeights * 100) / 100

    let preAssign = false
    let maxWeightDiff = sheet[4][9]

    let blueTeamString = ""
    let redTeamString = ""

    let counter = 0
    do {
        counter++
        blueTeam = []
        redTeam = []
        if (preAssign) {
            for (const player of preAssignBlue) {
                blueTeam.push(player)
            }
            for (const player of preAssignRed) {
                redTeam.push(player)
            }
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
    while (balancedWeights(blueTeam, redTeam, maxWeightDiff) || balancedTalkers(blueTeam, redTeam) && counter < 1000);

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

    for (const user of message.guild.channels.cache.get("776590423501045764").members) {
        if(sortedBlueTeam.some(p => p.getName() == user[1].nickname)) {
            message.guild.member(user[1].id).voice.setChannel("776596486963462164")
        } else if(sortedRedTeam.some(p => p.getName() == user[1].nickname)) {
            message.guild.member(user[1].id).voice.setChannel("776596447289933854")
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
     */
    // new Date().toLocaleString() + " EST",
    // blueTeamString,
    // redTeamString,
    // "Weight Diff: " + Math.round(Math.abs(getTotalWeightFromTeam(sortedBlueTeam) - getTotalWeightFromTeam(sortedRedTeam)) * 100) / 100 +
    // " Talker Diff: " + Math.abs(getTotalTalkers(sortedBlueTeam) - getTotalTalkers(sortedRedTeam))

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

function equalWeights(blue, red, green, yellow, maxWeightDiff) {
    return weightDiff(blue, red) < maxWeightDiff &&
        weightDiff(red, green) < maxWeightDiff &&
        weightDiff(green, yellow) < maxWeightDiff &&
        weightDiff(yellow, blue) < maxWeightDiff
}

function weightDiff(team1: Array<Player>, team2: Array<Player>) {
    return Math.abs(getTotalWeightFromTeam(team1) - getTotalWeightFromTeam(team2))
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

function getPlayer(data, args: String, adjusted: Boolean) {
    let playerToFind = String(args).toLowerCase();
    let returnPlayer: Player

    for (const player of data.data.values) {
        let currentPlayer = player[1].toLowerCase();
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
}

