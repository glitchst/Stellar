import { Command } from "discord-akairo";
import { MessageEmbed, Message } from 'discord.js';
import { stripIndents } from 'common-tags';
import { CommandCategories } from '../CommandCategories';

export default class HelpCommand extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'commands'],
      category: CommandCategories.Standard,
      ratelimit: 3,
      description: {
        content: 'Get a list of all the available commands or get help on a specific command',
        usage: 'help [command]',
        examples: [
          'help',
          'help ping'
        ]
      },
      args: [
        {
          id: 'command',
          type: 'commandAlias',
          default: null
        }
      ]
    });
  }

  public exec(message: Message, { command }: { command: Command }): Promise<Message> {
    // If there's an argument, we need to process the help for that specific command
    // the user requested.
    if (command) {
      // Get the example string ready before building the main embed
      const examples: string = command.description.examples
        ? command.description.examples.map(ex => `\`${ex}\``).join(', ')
        : 'No examples provided';

      // Use discord.js' MessageEmbed class to create a good looking embed
      const embed = new MessageEmbed()
        .setColor('#8e24aa')
        .setAuthor(`Help for ${command}`, this.client.user.displayAvatarURL())
        .setDescription(stripIndents`
          **Description**:
          ${command.description.content || 'No description provided'}

          **Usage**:
          ${command.description.usage || 'No usage provided'}

          **Examples**:
          ${examples}
        `);

        return message.util.send(embed);
    }

    // If there is no argument, we need to show the user all the available commands
    // in their categories
    const embed = new MessageEmbed()
      .setColor('#8e24aa')
      .setAuthor(`Help for ${this.client.user.username}`, this.client.user.displayAvatarURL())
      .setFooter(`${this.client.commandHandler.prefix}help [command] for more information on a specific command`);

    // Loop through the categories and get the commands on each one to display to the user
    for (const category of this.handler.categories.values()) {
      if (!['default'].includes(category.id)) {
        const commands = category
          .filter(cmd => cmd.aliases.length > 0)
          .map(cmd => `**\`${cmd}\``)
          .join(', ') || 'No commands in this category';

        embed.addField(category.id, commands);
      }
    }

    return message.util.send(embed);
  }
}
