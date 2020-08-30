import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { CommandCategories } from '../CommandCategories';

export default class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      category: CommandCategories.Standard,
      ratelimit: 3,
      description: {
        content: 'Checks the latency of the bot to the Discord API',
        usage: 'ping',
        examples: [
          'ping'
        ]
      }
    });
  }

  public exec(message: Message): Promise<Message> {
    return message.util.send(`:ping_pong: Pong! (${this.client.ws.ping}ms)`);
  }
}
