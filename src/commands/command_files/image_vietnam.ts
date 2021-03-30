import { Sharp } from 'sharp'
import ImageCommand, { ImageCommandConfiguration, ImageManipulator } from '../ImageCommand'

const configuration: ImageCommandConfiguration = {
    name: 'vietnam',
    admin: false,
    syntax: 'vietnam',
    desc: 'Lähettää kanavalle vietnam fläshbäkkejä.',
    triggers: ['vietnam', 'nam'],
    type: ['image'],
    imageName: 'nam',
    imageTitle: 'fläshback'
}

const manipulator: ImageManipulator = (sharp: Sharp): Sharp => {
    const flashback = './assets/images/flashback.png'

    const s = sharp
        .resize(256, 256)
        .grayscale()
        .composite([{ input: flashback, gravity: 'southeast' }])
        .jpeg({ quality: 60 })

    return s
}

export default new ImageCommand({
    configuration,
    manipulator
})
