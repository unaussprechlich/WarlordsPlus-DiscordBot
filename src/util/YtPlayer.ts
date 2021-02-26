import {Message, VoiceConnection} from "discord.js";
import {Readable} from "stream";
import * as ytdl from "ytdl-core"

const voiceMap : { [guild : string]: VoiceConnection} = {};

export async function playYoutube(msg : Message, url : string, volume? : number){
    if(!url.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/)){
        await msg.reply("This is not a youtube link!");
        return;
    } else {
        await msg.reply("Playing: " + url)
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

async function joinVoice(msg : Message){
    if (msg.member.voice.channel){
        voiceMap[msg.guild.id] = await msg.member.voice.channel.join();
        return voiceMap[msg.guild.id];
    } else {
        await msg.reply("You are not in a voice channel");
        return null;
    }
}
