import { Sharp } from 'sharp'
import ImageCommand, {
  ImageCommandConfiguration,
  ImageManipulator
} from '../ImageCommand'

const configuration: ImageCommandConfiguration = {
  name: 'invert',
  admin: false,
  syntax: 'invert',
  desc: 'upsidedöwn',
  triggers: ['invert'],
  type: ['image'],
  imageName: 'invert',
  imageTitle: 'invertti'
}

const manipulator: ImageManipulator = (sharp: Sharp): Sharp =>
  sharp.resize(512, 512).negate()

export default new ImageCommand({
  configuration,
  manipulator
})
