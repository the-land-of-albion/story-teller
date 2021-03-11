export interface Person {
    name: string,
    health: number;
    defense: number;
    attack: number;
    oauth_id: string;
}
export class Rogue implements Person{
    name: string;
    health: number;
    defense: number;
    attack: number;
    oauth_id: string;
    constructor(name: string, oauth_id: string){
        this.name = name;
        this.health = 100;
        this.defense = 0.85;
        this.attack = 12.5;
        this.oauth_id = oauth_id;
    }
}

export class Warrior implements Person {
    name: string;
    health: number;
    defense: number;
    attack: number;
    oauth_id: string;
    constructor(name: string, oauth_id: string){
        this.name = name;
        this.oauth_id = oauth_id;
        this.health = 100;
        this.defense = 0.95;
        this.attack = 18.25;
    }
}

export class Archer implements Person {
    name: string;
    health: number;
    defense: number;
    attack: number;
    oauth_id: string;
    constructor(name: string, oauth_id: string){
        this.name = name;
        this.health = 100;
        this.defense = 0.8;
        this.attack = 23.0;
        this.oauth_id = oauth_id;
    }
}