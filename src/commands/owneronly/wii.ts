import PlayCommand from "../../basecommands/PlayCommand";

module.exports = class WiiCommand extends PlayCommand{
    constructor(discordClient) {
        super(discordClient, "wii", "Wii.", "https://youtu.be/LYN6DRDQcjI");
    }
}
