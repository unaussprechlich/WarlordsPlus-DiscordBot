if(process.env.NODE_ENV === "development"){
    require("dotenv").config()
}

import {CommandoClient} from 'discord.js-commando';
import * as Path from "path"
import Logger from "./util/Logger";
import * as GoogleApi from "./teambalancer/GoogleApi";

if(!process.env.BOT_TOKEN){
    throw Error("The environment variable BOT_TOKEN has not been specified! Please add a token to authenticate your bot.")
}

if(!process.env.BOT_OWNER){
    throw Error("The environment variable BOT_OWNER has not been specified! Please add the discord id of the user " +
    "having full control over all bot features. If you have multiple, separate them with ','.")
}

if(!process.env.BOT_SUPPORT_INVITE){
    throw Error("The environment variable BOT_SUPPORT_INVITE has not been specified! Please add a permanent invite link" +
    "to a Discord server, where users can receive support.")
}

export const discordClient = new CommandoClient({
    commandPrefix: process.env.BOT_PREFIX ?? "-",
    owner: function (){
        if(process.env.BOT_OWNER.includes(",")){
            return process.env.BOT_OWNER.split(",")
        } else {
            return process.env.BOT_OWNER
        }
    }(),
    invite: process.env.BOT_SUPPORT_INVITE
});

discordClient.registry
    .registerDefaultTypes()
    .registerGroups([["mod", "Moderation Group"], ["teambalancer", "Balancer Group"], ["general", "General Group"], ["owneronly", "Owneronly Group"]])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(Path.join(__dirname, "commands"))

discordClient.once('ready', () => {
    Logger.info('Successfully connected to Discord.');
    GoogleApi.init()
    discordClient.user.setActivity("NOFUN.mp4").catch(Logger.error)
});

discordClient.on('message', async message => {
    try {
        if (message.author.bot) return;

        //TODO you can add custom message handling here

    } catch (err) {
        Logger.error(err);
    }
})

discordClient.on("error", function (err) {
    Logger.error(err)
})

discordClient.login(process.env.BOT_TOKEN).catch(reason =>{
    Logger.error(reason)
    //Exit with failure
    process.exit(1)
});


