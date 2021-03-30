import { Sharp } from 'sharp'
import ImageCommand, { ImageCommandConfiguration, ImageManipulator } from '../ImageCommand'

const configuration: ImageCommandConfiguration = {
    name: 'jpeg',
    admin: false,
    syntax: 'jpeg',
    desc: 'Luulekko et mä tiedän mikä jpeg on? Haluun vaa kuvan mun hodarista.',
    triggers: ['jpeg', 'jpg'],
    type: ['image'],
    imageName: 'jpeg',
    imageTitle: 'näytänkö mä siltä et mä tiedän mikä jpeg on?'
}

const manipulator: ImageManipulator = (sharp: Sharp): Sharp => sharp.resize(512, 512).jpeg({ quality: 1 })

export default new ImageCommand({
    configuration,
    manipulator
})
