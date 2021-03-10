import {OptionsBuilder } from "@bothaven/common";


console.log(process.env.AUTH)
export const optionsBuilder = new OptionsBuilder({
        "Authorization": "Bearer "+ process.env.AUTH,
        "Content-Type":"application/json",
        "Accepts":"application/json",
        "credentials": "include",
        "User-Agent":`discord ${process.env.AUTH} / node-fetch`
})
export default optionsBuilder;