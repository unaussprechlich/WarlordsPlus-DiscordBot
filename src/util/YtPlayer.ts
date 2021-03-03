import {Message, VoiceConnection} from "discord.js";
import {Readable} from "stream";
import * as ytdl from "ytdl-core"
import UserError from "./UserError";


const voiceMap : { [guild : string]: VoiceConnection} = {};

export async function playYoutube(msg : Message, url : string, showMessage : boolean = true, volume? : number){
    if(!url.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/)){
        throw new UserError(`The ${url} is not a YouTube link!`);
    } else {
        if(showMessage) await msg.channel.send("Playing: " + url)
        const ytStream = ytdl(url, { filter : 'audioonly'})
        await playStream(msg, ytStream, volume)
    }
}

async function playStream(msg : Message, stream : Readable, volume? : number | 1){
    await joinVoice(msg);
    const dispatcher = voiceMap[msg.guild.id].play(stream, {
        volume : volume,
        bitrate : "auto"
    });
    dispatcher.once("end", reason => {
        if(reason === undefined) return;
        voiceMap[msg.guild.id].disconnect();
        delete voiceMap[msg.guild.id];
    });
}

export async function leaveVoice(msg : Message){
    voiceMap[msg.guild.id].disconnect();
    delete voiceMap[msg.guild.id];
}

export async function joinVoice(msg : Message){
    if (msg.member.voice.channel){
        voiceMap[msg.guild.id] = await msg.member.voice.channel.join();
        return voiceMap[msg.guild.id];
    } else {
        throw new UserError("You are not in a voice channel");
    }
}
