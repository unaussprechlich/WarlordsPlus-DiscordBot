import * as mongoose from "mongoose";
import {Guild} from "discord.js";

export async function getGuildSettingsForMessage(guild: Guild) {
    let guildSettings = await GuildSettingsModel.findOne({guild_id : guild.id}).exec()

    if(!guildSettings){
        guildSettings = new GuildSettingsModel({
            guild_id : guild.id
        })
    }

    return guildSettings
}

export const GuildSettingsSchema = new mongoose.Schema({
    guild_id : {
        type : String,
        unique : true
    },
    competitive : {
        enabled : Boolean,
        categorychannel : String,
        textchannel : String,
        voicechannels : {
            lobby : String,
            red : String,
            blue : String
        }
    }
})

export const GuildSettingsModel = mongoose.model<IGuildSettings>('GuildSettings', GuildSettingsSchema);

export interface IGuildSettings extends mongoose.Document{
    guild_id : String,
    competitive : {
        enabled : boolean,
        categorychannel : string,
        textchannel : string
        voicechannels : {
            lobby : string,
            red : string,
            blue : string
        }
    }
}
