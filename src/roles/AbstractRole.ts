import {Guild, ColorResolvable} from "discord.js"
import {CommandoGuild, CommandoMessage} from "discord.js-commando";


export default abstract class AbstractRole{

    readonly name
    readonly color
    readonly reason

    protected constructor(name : string, reason : string, color : ColorResolvable = "GREY") {
        this.name = name
        this.color = color
        this.reason = reason
    }

    async addToGuild(guild : Guild){
        return guild.roles.create({
            data : {
                name : this.name,
                color : this.color,
                mentionable : true
            },
            reason : this.reason
        })
    }

    get(guild: Guild){
        return guild.roles.cache.find(role => role.name === this.name)
    }

    id(guild: Guild){
        return this.get(guild).id
    }

    isCreated(guild: CommandoGuild){
        return guild.roles.cache.some(role => role.name === this.name);
    }

    async hasRolePermission(message : CommandoMessage){
        if(!this.isCreated(message.guild)){
            await this.addToGuild(message.guild)
            await message.reply(`This command requires role based permissions. I have added the role 
            ${this.name} for you. Apply them to a member and they are able to use this command.`)
        }
        return message.member.hasPermission("ADMINISTRATOR") ||
        message.member.roles.cache.has(this.name)
    }

}
