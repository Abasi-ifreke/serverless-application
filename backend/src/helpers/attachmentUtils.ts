import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})
const bucketname = process.env.ATTACHMENT_S3_BUCKET

// // TODO: Implement the fileStogare logic

export function getUploadUrl(imageId: string) {
    return s3.getSignedUrl('putObject', {
      Bucket: bucketname,
      Key: imageId,
      Expires: 300
    })
}