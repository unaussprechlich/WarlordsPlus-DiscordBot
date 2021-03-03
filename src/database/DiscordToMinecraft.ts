import * as mongoose from "mongoose";
import {GuildMember} from "discord.js";

export async function getDiscordToMinecraftForMember(member: GuildMember) {
    let discordToMinecraft = await DiscordToMinecraftModel.findOne({client_id : member.id}).exec()

    if(!discordToMinecraft){
        discordToMinecraft = new DiscordToMinecraftModel({
            client_id : member.id
        })
    }

    return discordToMinecraft
}

export const DiscordToMinecraftSchema = new mongoose.Schema({
    client_id : {
        type : String,
        unique : true
    },
    minecraft_uuid : String
})

export const DiscordToMinecraftModel = mongoose.model<IDiscordToMinecraft>('DiscordToMinecraft', DiscordToMinecraftSchema);

export interface IDiscordToMinecraft extends mongoose.Document{
    client_id : string,
    minecraft_uuid : string
}
