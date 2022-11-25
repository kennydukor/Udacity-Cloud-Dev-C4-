import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import {UpdateTodoRequest} from '../../requests/UpdateTodoRequest'
import {_update} from "../../auth/helper/todos";


export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  
      const todoObject = await _update(updatedTodo, todoId, event);

    return {
        statusCode: 200,
        body: JSON.stringify({
            item: todoObject
        }),
    }
})
  
handler
.use(httpErrorHandler())
.use(
    cors({
    credentials: true
    })
)