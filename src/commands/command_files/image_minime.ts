import { Sharp } from 'sharp'
import ImageCommand, {
  ImageCommandConfiguration,
  ImageManipulator
} from '../ImageCommand'

const configuration: ImageCommandConfiguration = {
  name: 'minime',
  admin: false,
  syntax: 'minime',
  desc: 'Lähettää kanavalle mini sinut.',
  triggers: ['minime'],
  type: ['image'],
  imageName: 'mini',
  imageTitle: 'mini sinä'
}

const manipulator: ImageManipulator = (sharp: Sharp): Sharp =>
  sharp.resize(16, 16).jpeg({ quality: 80 })

export default new ImageCommand({
  configuration,
  manipulator
})
