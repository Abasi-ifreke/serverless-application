import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
// const AWSXRay = require('aws-xray-sdk')


// // TODO: Implement the fileStogare logic
const logger = createLogger('AttachmentUtils')

export class AttachmentUtils {

  constructor(
      private readonly s3Client: AWS.S3 = new AWS.S3({ signatureVersion: 'v4' }),
      private readonly attachmentS3Bucket = process.env.ATTACHMENT_S3_BUCKET,
      private readonly signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {}

  async getUploadUrl(todoId: string): Promise<string> {
      logger.info('Generating pre-signed URL')

      const attachmentUrl = this.s3Client.getSignedUrl('putObject', {
          Bucket: this.attachmentS3Bucket,
          Key: todoId,
          Expires: parseInt(this.signedUrlExpiration)
      })

      return attachmentUrl as string 
  }
}









// const XAWS = AWSXRay.captureAWS(AWS)

// const s3 = new XAWS.S3({
//     signatureVersion: 'v4'
// })
// const bucketname = process.env.ATTACHMENT_S3_BUCKET
// export function generateUploadUrl(imageId: string) {
//     return s3.getSignedUrl('putObject', {
//       Bucket: bucketname,
//       Key: imageId,
//       Expires: 300
//     })
// }