import { Sharp } from 'sharp'
import ImageCommand, {
  ImageCommandConfiguration,
  ImageManipulator
} from '../ImageCommand'

const configuration: ImageCommandConfiguration = {
  name: 'hirvitys',
  admin: false,
  syntax: 'hirvitys',
  desc: 'pelottaa kauhiasti',
  triggers: ['hirvitys'],
  type: ['image'],
  imageName: 'hirvitys',
  imageTitle: 'hirvityshirvityshirvitys'
}

const manipulator: ImageManipulator = (sharp: Sharp): Sharp =>
  sharp
    .resize(512, 512)
    .sharpen(2, 0, 500)
    .convolve({ width: 3, height: 3, kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1] })

export default new ImageCommand({
  configuration,
  manipulator
})
