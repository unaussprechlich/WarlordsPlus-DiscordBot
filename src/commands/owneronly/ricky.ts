import PlayCommand from "../../basecommands/PlayCommand";

module.exports = class ClearCommand extends PlayCommand{
    constructor(discordClient) {
        super(discordClient, "ricky", "Ricky.", "https://youtu.be/dQw4w9WgXcQ");
    }
}
