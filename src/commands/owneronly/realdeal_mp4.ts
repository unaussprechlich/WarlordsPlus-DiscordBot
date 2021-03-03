import PlayCommand from "../../basecommands/PlayCommand";

module.exports = class RealDealCommand extends PlayCommand{
    constructor(discordClient) {
        super(discordClient, "realdeal.mp4", "_RealDeal_.mp4.", "https://youtu.be/MH_t2NIklMg");
    }
}
