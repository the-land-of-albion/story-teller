"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Requests;
(function (Requests) {
    Requests[Requests["GET"] = 0] = "GET";
    Requests[Requests["POST"] = 1] = "POST";
    Requests[Requests["PUT"] = 2] = "PUT";
    Requests[Requests["PATCH"] = 3] = "PATCH";
    Requests[Requests["DELETE"] = 4] = "DELETE";
})(Requests || (Requests = {}));
class Options {
    constructor(request, body, headers) {
        this.request = request;
        this.body = body || null;
        this.headers = headers || Options.fallbackOptions;
        this.transform();
    }
    transform() {
        if (this.body) {
            return {
                method: this.request,
                body: JSON.stringify(this.body),
                headers: this.headers
            };
        }
        else {
            return {
                method: this.request,
                headers: this.headers
            };
        }
    }
}
exports.default = Options;
Options.fallbackOptions = {
    "Authorization": "Bearer " + "mypassword",
    "Content-Type": "application/json",
    "Accepts": "application/json"
};
//# sourceMappingURL=Options.js.map