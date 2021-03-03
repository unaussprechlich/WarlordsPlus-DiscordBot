import {discordClient} from "../main";

const STATUS = [
    "Warlords is 💀",
    "NOFUN allowed",
    "-help",
    "24/7 baby",
    "🤤🤤🤤",
    "👉👌?",
    "3==✊==D 💦",
    "❤️🧡💛💚💙💜🖤🤎🤍",
    "1️⃣2️⃣3️⃣",
    "🔜™",
    "©"
]

export function init(){
    setInterval(() => {
        discordClient.user.setActivity("", {
            url: process.env.BOT_INVITE_LINK,
            name : STATUS[Math.floor(Math.random()*STATUS.length)],
            type : "PLAYING"
        }).catch(console.error)
    }, 1000 * 20);
}
