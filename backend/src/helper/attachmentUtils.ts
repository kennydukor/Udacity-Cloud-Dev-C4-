import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
import { createLogger } from '../utils/logger'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

export const bucketName = process.env.S3_BUCKET_NAME
export const urlExpiration = process.env.SIGNED_URL_EXPIRATION
export const s3Bucket = process.env.S3_BUCKET_NAME

const s3 = new XAWS.S3({ signatureVersion: 'v4' })

const logger = createLogger('Attachment Handler')

export class AttachmentHandler {
    private readonly docDbClient: DocumentClient;
    private readonly table: string;
    constructor(_userId=null, _todoId=null) {
      this.docDbClient = new XAWS.DynamoDB.DocumentClient(),
      this.table = process.env.TODOS_TABLE
    }
  
    async createAttachmentUrl(todoId: string, userId: string): Promise<string> {
        let signedUrl: string;
        try {
            
        logger.info('Creating attachment URL')
        signedUrl = s3.getSignedUrl('putObject', {
            Bucket: bucketName,
            Key: todoId,
            Expires: +urlExpiration
        })
    
        logger.log(s3Bucket, todoId, signedUrl)
    
        const param = {
            TableName: this.table,
            Key: {
              userId: userId,
              todoId: todoId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
              ":attachmentUrl": `https://${s3Bucket}.s3.amazonaws.com/${todoId}`
            }
          }
          await this.docDbClient.update(param).promise()
    
          return signedUrl;
        }
    
        catch (err) {
        logger.error(err)
        }
    } 
}