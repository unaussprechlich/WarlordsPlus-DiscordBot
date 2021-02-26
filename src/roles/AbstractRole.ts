import {Guild, GuildMember, ColorResolvable} from "discord.js"
import {CommandoMessage} from "discord.js-commando";


export default abstract class AbstractRole{

    readonly name
    readonly color
    readonly reason

    protected constructor(name : string, reason : string, color : ColorResolvable = "GREY") {
        this.name = name
        this.color = color
        this.reason = reason
    }

    async addRole(guild : Guild){
        return guild.roles.create({
            data : {
                name : this.name,
                color : this.color,
                mentionable : false
            },
            reason : this.reason
        })
    }

    async hasRolePermission(message : CommandoMessage){
        if(!message.guild.roles.cache.some(role => role.name === this.name)){
            await this.addRole(message.guild)
            await message.reply(`This command requires role based permissions. I have added the role 
            ${this.name} for you. Apply them to a member and they are able to use this command.`)
        }
        return message.member.hasPermission("ADMINISTRATOR") ||
        message.member.roles.cache.some(role => role.name === this.name)
    }

}
