import 'source-map-support/register'

import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {_delete} from "../../businessLogic/todos";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    const deleteTodo = await _delete(todoId, event);

    if (deleteTodo){
        return {
            statusCode: 200,
            body: JSON.stringify({
                data: deleteTodo
            })
        }
    }
    else {
        return {
            statusCode: 400,
            body: JSON.stringify({
                data: []
            }),
        }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
)