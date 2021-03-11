"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Archer = exports.Warrior = exports.Rogue = void 0;
class Rogue {
    constructor(name, oauth_id) {
        this.name = name;
        this.health = 100;
        this.defense = 0.85;
        this.attack = 12.5;
        this.oauth_id = oauth_id;
    }
}
exports.Rogue = Rogue;
class Warrior {
    constructor(name, oauth_id) {
        this.name = name;
        this.oauth_id = oauth_id;
        this.health = 100;
        this.defense = 0.95;
        this.attack = 18.25;
    }
}
exports.Warrior = Warrior;
class Archer {
    constructor(name, oauth_id) {
        this.name = name;
        this.health = 100;
        this.defense = 0.8;
        this.attack = 23.0;
        this.oauth_id = oauth_id;
    }
}
exports.Archer = Archer;
//# sourceMappingURL=classes.js.map