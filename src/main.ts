import * as mongoose from "mongoose";

if(process.env.NODE_ENV === "development"){
    require("dotenv").config()
}

import {CommandoClient} from 'discord.js-commando';
import * as Path from "path"
import Logger from "./util/Logger";
import * as GoogleApi from "./teambalancer/GoogleApi";
import {DiscordToMinecraftModel} from "./database/DiscordToMinecraft";
import {getGuildSettingsForMessage} from "./database/GuildSettings";
import CompetitiveRole from "./roles/CompetitiveRole"
import RainbowDisagree2Command from "./commands/owneronly/rainbowsiagree2";
import NoFunCommand from "./commands/owneronly/nofun";
import * as Status from "./resources/Status"

require("mongoose").Promise = global.Promise;

if(!process.env.MONGODB_URI) throw "Missing MongoDB connection string, please provide it with the environment variable 'MONGO_DB'!";
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser : true, useUnifiedTopology : true }).then( _ => {
    Logger.info("Successfully connected to MongoDB.")
});

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
    .registerGroups([["mod", "Moderation Group"], ["competitive", "Balancer Group"], ["warlordssr", "WarlordsSR Group"], ["general", "General Group"], ["owneronly", "Owneronly Group"]])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(Path.join(__dirname, "commands"))

discordClient.once('ready', () => {
    Logger.info('Successfully connected to Discord.');
    GoogleApi.init()
    Status.init()
});

discordClient.on('message', async message => {
    try {
        if (message.author.bot) return;

        await RainbowDisagree2Command.onMessage(message)
        await NoFunCommand.onMessage(message)

        //TODO you can add custom message handling here

    } catch (err) {
        Logger.error(err);
    }
})

discordClient.on("guildMemberAdd", async function (member){
    const guildSettings = await getGuildSettingsForMessage(member.guild);
    if(!guildSettings.competitive.enabled) return;
    const uuid = await DiscordToMinecraftModel.findOne({client_id : member.id}).exec()
    if(uuid && uuid.minecraft_uuid){
        await member.roles.add(CompetitiveRole.id(member.guild))
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


