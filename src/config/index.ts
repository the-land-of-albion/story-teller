const {NODE_ENV} = process.env;
const prefix = NODE_ENV == "production" ? "!room" :  "?room";
export default {
    bot: {
        prefix,
        name: "Lord Brom",
        iconURL: "https://raw.githubusercontent.com/BotHaven/static/main/img/three-wise-men/baltazar.png"
    },
    api: {
        prefix: "http://localhost:3000"
    }
}