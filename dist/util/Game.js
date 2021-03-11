"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    constructor(title, players) {
        this.score = {};
        players.forEach((p) => this.addPlayer(p));
    }
    addPlayer(player, score) {
        if (player) {
            this.score[player] = score || 0;
        }
    }
    build() {
        return this.score;
    }
}
exports.default = Game;
//# sourceMappingURL=Game.js.map