import ImageCommand, {
  CommandBaseImageManipulator,
  ImageCommandConfiguration
} from '../ImageCommand'

const configuration: ImageCommandConfiguration = {
  name: 'image-eval',
  superadmin: true,
  syntax: 'image-eval <js-koodia>',
  desc: 'Lähettää kanavalle vaarallisesti muokatun kuvan',
  triggers: ['image-eval', 'ival'],
  type: ['image', 'superadmin'],
  imageName: 'eval',
  imageTitle: 'vaarallisesti tuotettu kuva'
}

const manipulator: CommandBaseImageManipulator = (
  sharp,
  message,
  client,
  args
) => {
  if (!args[1]) return sharp

  const stringToBeEvaluated = [...args].splice(2).join(' ')

  let s

  try {
    s = eval(stringToBeEvaluated)
  } catch {
    return sharp
  }

  return s
}

export default new ImageCommand({
  configuration,
  manipulator
})
