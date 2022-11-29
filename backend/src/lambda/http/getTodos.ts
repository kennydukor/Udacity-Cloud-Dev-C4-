import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {_getAll} from "../../businessLogic/todos";

// TODO: Get all TODO items for a current user
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      // Write your code here
      const all_todos = await _getAll(event);
  
      return {
        statusCode: 200,
        body: JSON.stringify({
            items: all_todos
        }),
    }
})
  handler.use(
    cors({
      credentials: true
    })
  )