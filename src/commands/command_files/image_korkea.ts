import { Sharp } from 'sharp'
import ImageCommand, { ImageCommandConfiguration, ImageManipulator } from '../ImageCommand'

const configuration: ImageCommandConfiguration = {
    name: 'korkea',
    admin: false,
    syntax: 'korkea',
    desc: 'korkeaucco',
    triggers: ['korkea', 'tallboi'],
    type: ['image'],
    imageName: 'korkea',
    imageTitle: 'yes'
}

const manipulator: ImageManipulator = (sharp: Sharp): Sharp => sharp.resize(80, 300, { fit: 'fill' })

export default new ImageCommand({
    configuration,
    manipulator
})
