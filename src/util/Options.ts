import { type } from "node:os";
import { Transform } from "node:stream";

enum Requests {
    GET, POST, PUT, PATCH, DELETE
}

type RequestKeys = keyof typeof Requests;
export default class Options {
    request: RequestKeys;
    body?: any;
    headers?: any;
    static fallbackOptions = {
        "Authorization": "Bearer "+ "mypassword",
        "Content-Type":"application/json",
        "Accepts":"application/json"
    }
    constructor(request: RequestKeys, body?: any, headers?: any){
        this.request = request;
        this.body = body || null;
        this.headers = headers || Options.fallbackOptions;

        this.transform()
    }
    transform() {
        if(this.body){
            return {
                method: this.request,
                body: JSON.stringify(this.body),
                headers: this.headers
            }
        }
        else {
            return {
                method: this.request,
                headers: this.headers
            }
        }
    }
} 