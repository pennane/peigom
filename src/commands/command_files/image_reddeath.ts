import { Sharp } from 'sharp'
import ImageCommand, { ImageCommandConfiguration, ImageManipulator } from '../ImageCommand'

const configuration: ImageCommandConfiguration = {
    name: 'death',
    admin: false,
    syntax: 'death',
    desc: 'en voi hyvin',
    triggers: ['red', 'death', 'reddeath'],
    type: ['image'],
    imageName: 'ded',
    imageTitle: 'näytänkö mä siltä et mä voin hyvin?'
}

const manipulator: ImageManipulator = (sharp: Sharp): Sharp =>
    sharp.resize(512, 512).modulate({ saturation: 16 }).jpeg({ quality: 1 })

export default new ImageCommand({
    configuration,
    manipulator
})
