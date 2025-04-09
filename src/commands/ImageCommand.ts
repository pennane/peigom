import Discord, { ChannelType } from 'discord.js'
import fs from 'fs'
import sharp from 'sharp'
import activityLogger from '../lib/activityLogger'
import * as AppConfiguration from '../lib/config'
import { fetchFile } from '../lib/util'
import Command, { CommandConfiguration, CommandExecutor } from './Command'

export type ImageManipulator = (sharp: sharp.Sharp) => sharp.Sharp

export type CommandBaseImageManipulator = (
  sharp: sharp.Sharp,
  message: Discord.Message,
  client: Discord.Client,
  args: string[]
) => sharp.Sharp

export interface ImageCommandConfiguration extends CommandConfiguration {
  imageName: string
  imageTitle: string
}

export interface ImageCommandInitializer {
  configuration: ImageCommandConfiguration
  manipulator: ImageManipulator | CommandBaseImageManipulator
}

export type ImageCommandExecutor = (
  message: Discord.Message,
  client: Discord.Client,
  args: Array<string>,
  manipulator: ImageManipulator
) => Promise<unknown>

export class ImageCommand extends Command {
  manipulator: CommandBaseImageManipulator
  imageName: string
  imageTitle: string

  constructor(initializer: ImageCommandInitializer) {
    super({
      ...initializer,
      executor: async (
        _message: Discord.Message,
        _client: Discord.Client,
        _args: Array<string>
        // eslint-disable-next-line @typescript-eslint/no-empty-function
      ) => {}
    })

    const { configuration } = initializer

    this.manipulator = initializer.manipulator
    this.imageName = configuration.imageName
    this.imageTitle = configuration.imageTitle
  }

  executor: CommandExecutor = async (message, client, args) => {
    const channel = message.channel
    if (!message.guild || channel.type !== ChannelType.GuildText) return

    let targetUser: Discord.User

    if (args[1]) {
      const target = args[1].replace(/\D/g, '')
      const member = message.guild.members.cache.get(target)
      if (!member?.user) return channel.send('broidi kohdennettu ukko on rikki')
      targetUser = member.user
    } else {
      targetUser = message.author
    }

    const now = new Date()

    const identifier = `-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`

    const temporaryImage = `./assets/images/avatars/${this._name.toLowerCase()}-${
      targetUser.id
    }${identifier}.jpg`

    const embed = Command.createEmbed()

    embed.setTitle(this.imageTitle)
    embed.setImage(`attachment://${this.imageName}.jpg`)

    if (fs.existsSync(temporaryImage)) {
      await channel.send({
        embeds: [embed],
        files: [
          {
            attachment: temporaryImage,
            name: `${this.imageName}.jpg`
          }
        ]
      })
      return
    }

    const avatarFile = `./assets/images/avatars/avatar${targetUser.id}-${identifier}.jpg`

    if (!fs.existsSync(avatarFile)) {
      const avatar = targetUser.displayAvatarURL({
        extension: 'jpg',
        forceStatic: true,
        size: 512
      })
      await fetchFile({ url: avatar, target: avatarFile })
    }
    await this.manipulator(sharp(avatarFile), message, client, args).toFile(
      temporaryImage
    )

    await channel.send({
      embeds: [embed],
      files: [
        {
          attachment: temporaryImage,
          name: `${this.imageName}.jpg`
        }
      ]
    })

    return
  }
  async execute(
    message: Discord.Message,
    client: Discord.Client,
    args: Array<string>
  ): Promise<void> {
    if (this._requireGuild && !message.guild) return

    let adminAuthorization = false

    if (!client || !client.user) return

    if (this._adminCommand) {
      adminAuthorization = Command.isMemberAdminAuthorized(message)
    }

    if (this._adminCommand && !adminAuthorization) {
      return this.unauthorizedAction(message)
    }

    this.executor(message, client, args).catch((error) =>
      activityLogger.log({ id: 13, content: this.name, error })
    )

    activityLogger.log({
      id: 12,
      content:
        message.author.username +
        '#' +
        message.author.discriminator +
        ' @ ' +
        message.guild?.name +
        ':' +
        message.guild?.id +
        ' » ' +
        this.name +
        ' ' +
        AppConfiguration.PREFIX +
        args.join(' ')
    })
  }
}

export default ImageCommand
