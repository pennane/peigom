import { Sharp } from 'sharp'
import ImageCommand, {
  ImageCommandConfiguration,
  ImageManipulator
} from '../ImageCommand'

const configuration: ImageCommandConfiguration = {
  name: 'nightmare',
  admin: false,
  syntax: 'nightmare',
  desc: 'Lähettää kanavalle suurta kuumotusta.',
  triggers: ['nightmare', 'nitemare'],
  type: ['image'],
  imageName: 'nitemare',
  imageTitle: 'guumodus?'
}

const manipulator: ImageManipulator = (sharp: Sharp): Sharp =>
  sharp.resize(512, 512).threshold(120)

export default new ImageCommand({
  configuration,
  manipulator
})
