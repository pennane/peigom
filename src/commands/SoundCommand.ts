import Discord from 'discord.js'
import playSound from '../../dist/sound_handling/playSound'
import { CustomSoundCommandData } from './command_files/admin_createsound'

type SoundCommandExecutor = (
    message: Discord.Message,
    client: Discord.Client,
    args: Array<string>,
    customSoundCommandData: CustomSoundCommandData
) => Promise<any>

export const executor: SoundCommandExecutor = async (message, client, args, sound) => {
    const guild = message.guild
    if (!guild) return
    const fileName = `./assets/createsound/files/${sound.file}`
    playSound({ soundfile: fileName, message })
}
