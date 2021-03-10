export default class Game{
    score: Record<string, number>;
    constructor(title: string, players: string[]){
        this.score = {};
        
        players.forEach((p) => this.addPlayer(p));
    }
    addPlayer(player?:string, score?: number) {
        if(player) {
            this.score[player] = score || 0;
        }
    }
    build(){
        return this.score;
    }
}