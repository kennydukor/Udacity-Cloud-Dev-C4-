import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
import { createLogger } from '../../utils/logger'

export const bucketName = process.env.S3_BUCKET_NAME
export const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const s3 = new XAWS.S3({ signatureVersion: 'v4' })

const logger = createLogger('Attachment Handler')

export class AttachmentHandler {
    constructor(_userId=null, _todoId=null) { }
  
    async createAttachmentUrl(todoId: string): Promise<string> {
        let signedUrl: string;
        try {
        logger.info('Creating attachment URL')
        signedUrl = s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: todoId,
            Expires: +urlExpiration
        })
        return signedUrl;
        }
        catch (err) {
        logger.error(err)
        }
    }
}