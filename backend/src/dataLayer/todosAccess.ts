import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from "../models/TodoItem";
import { TodoUpdate } from "../models/TodoUpdate";

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
export class ToDoAccess {
  private readonly docDbClient: DocumentClient;
  private readonly table: string;
  constructor(_userId=null, _todoId=null) {
    this.docDbClient = new XAWS.DynamoDB.DocumentClient(),
    this.table = process.env.TODOS_TABLE
  }

  async getAll(userId: string): Promise<TodoItem[]> {
    logger.info('Retreiving records from DB')
    try {
        const result = await this.docDbClient.query({
          TableName: this.table,
          KeyConditionExpression: '#userId = :userId',
          ExpressionAttributeNames: {
            '#userId': 'userId'
          },
          ExpressionAttributeValues: {
            ':userId': userId
          }
        }).promise()
      return result.Items as TodoItem[]
    }
    catch(err) {
      logger.error(err)
    }
  }

  async create(todoObject: TodoItem): Promise<TodoItem> {
    logger.info('Inserting record to DB')
    try {
        await this.docDbClient.put({
          TableName: this.table,
          Item: todoObject
        })
        .promise()
      return todoObject as TodoItem
    }
    catch(err) {
      logger.error(err)
    }
  }

  async update(todoUpdate: TodoUpdate, todoId: string, userId: string): Promise<TodoUpdate> {
    logger.info('Updating DB records')
    try {
      const result = await this.docDbClient.update({
        TableName: this.table,
        Key: {
          userId,
          todoId
        },
        UpdateExpression:
          'set #name = :name, #dueDate = :dueDate, #done = :done',
        ExpressionAttributeNames: {
          '#name': 'todoItemName',
          '#dueDate': 'ItemDueDate',
          '#done': 'itemStatus'
        },
        ExpressionAttributeValues: {
          ':name': todoUpdate.name,
          ':dueDate': todoUpdate.dueDate,
          ':done': todoUpdate.done
        }}).promise()
        return result.Attributes as TodoUpdate
    }
    catch(err) {
      logger.error(err)
    }
  }

  async delete(todoId: string, userId: string): Promise<boolean> {
    logger.info('Deleting todo: ' + todoId)
    try {
      await this.docDbClient.delete({ TableName: this.table, Key: {
        userId: userId,
        todoId: todoId
        }}).promise()
      return true;
    }
    catch(err){
      logger.error(err)
      return false;
    }
  }

}
