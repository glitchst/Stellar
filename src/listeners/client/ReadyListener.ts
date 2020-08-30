import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'client'
    });
  }

  public exec(): void {
    const now = new Date().toDateString();
    console.log(`[${now}] Stellar Bot logged in as ${this.client.user.tag}`);

    this.client.user.setActivity({
      type: 'LISTENING',
      name: 'Dame da ne, dame yo'
    });
  }
}
