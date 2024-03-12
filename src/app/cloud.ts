import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../plugins/aws';
import { Readable } from 'node:stream';
import sharp from 'sharp';
import { contentType } from 'mime-types'

export class Cloud {

  static async getImg(req: any, res: any) {

    res.set('Cross-Origin-Resource-Policy', 'cross-origin')

    const dir = req.params.dir
    const filename = req.params.img
    const resolution = req.params.resolution
    const filekey = `${dir}/${filename}`


    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: filekey
    })

    try {

      const dataStream: any = await s3.send(command)
      const mimeType = contentType(filename); // Get the MIME Type from the file name

      if (mimeType) {
        res.set('Content-Type', mimeType); // Set the Content-Type header
      }

      if (resolution) {

        const resolutionArray = resolution.split('x')
        const width = Number(resolutionArray[0])
        const height = Number(resolutionArray[1])
        const transformer = sharp().resize(width, height);

        (dataStream.Body as Readable).pipe(transformer).pipe(res)

      } else {

        (dataStream.Body as Readable).pipe(res)

      }

    } catch (error) {

      res.status(404).send({ error: 'Image not found' })

    }

  }

}