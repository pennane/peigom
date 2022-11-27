import { Sharp } from 'sharp'
import ImageCommand, {
  ImageCommandConfiguration,
  ImageManipulator
} from '../ImageCommand'

const configuration: ImageCommandConfiguration = {
  name: 'leveä',
  admin: false,
  syntax: 'leveä',
  desc: 'wideboi',
  triggers: ['leveä', 'wide'],
  type: ['image'],
  imageName: 'wide',
  imageTitle: 'niinistö on kävelemässä'
}

const manipulator: ImageManipulator = (sharp: Sharp): Sharp =>
  sharp.resize(512, 135, { fit: 'fill' })

export default new ImageCommand({
  configuration,
  manipulator
})
