import Discord from 'discord.js'
import playSound from '../sound_handling/playSound'
import { CustomSoundCommandData } from './command_files/admin_createsound'

type SoundCommandExecutor = (
  message: Discord.Message,
  client: Discord.Client,
  args: Array<string>,
  customSoundCommandData: CustomSoundCommandData
) => Promise<unknown>

export const executor: SoundCommandExecutor = async (
  message,
  _client,
  _args,
  sound
) => {
  const guild = message.guild
  if (!guild) return
  const fileName = `./assets/createsound/guilds/${guild.id}/${sound.file}`
  playSound({ soundfile: fileName, message, exitAfter: true })
}
