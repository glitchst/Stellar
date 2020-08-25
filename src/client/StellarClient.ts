import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { join } from 'path';
import { prefix, owners, commandCooldown, commandUtilLifetime, commandRetries, commandRetryWaitTime } from '../Config';
import { Message } from 'discord.js';

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler,
    listenerHandler: ListenerHandler
  }
}

interface BotOptions {
  token?: string;
  owners?: string | string[];
}

export default class StellarClient extends AkairoClient {
  public config: BotOptions;

  // Set up akairo's listener handler
  public listenerHandler = new ListenerHandler(this, {
    directory: join(__dirname, '..', 'listeners')
  });

  // Set up akairo's command handler
  public commandHandler = new CommandHandler(this, {
    directory: join(__dirname, '..', 'commands'),
    prefix: prefix,
    allowMention: true,
    handleEdits: true,
    commandUtil: true,
    commandUtilLifetime: commandUtilLifetime,
    defaultCooldown: commandCooldown,
    ignorePermissions: owners,
    ignoreCooldown: owners,
    argumentDefaults: {
      prompt: {
        modifyStart: (_: Message, str: string): string => `${str}\n\nType 'cancel' to cancel the command...`,
        modifyRetry: (_: Message, str: string): string => `${str}\n\nType 'cancel' to cancel the command...`,
        timeout: 'You took too long to respond, so your command has been cancelled.',
        ended: 'You have exceeded the maximum number of tries for this command.',
        cancel: 'This command has been cancelled',
        retries: commandRetries,
        time: commandRetryWaitTime
      }
    }
  });

  constructor(config: BotOptions) {
    super({
      ownerID: config.owners
    });

    this.config = config;
  }

  private async _init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process
    });

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }

  public async start(): Promise<string> {
    await this._init();
    return this.login(this.config.token);
  }
}
