import { Listener } from 'discord-akairo';
import config from '../config';

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        console.log(`${config.bot.name} to your service.`);

    }
}

export default ReadyListener;