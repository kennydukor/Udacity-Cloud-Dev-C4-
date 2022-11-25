import 'source-map-support/register'
import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {CreateTodoRequest} from '../../requests/CreateTodoRequest';
import {_create} from "../../auth/helper/todos";
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const newTodo: CreateTodoRequest = JSON.parse(event.body)
        // TODO: Implement creating a new TODO item
        const dataObject = await _create(newTodo, event);
        return {
            statusCode: 201,
            body: JSON.stringify({
                item: dataObject
            }),
        }
    }
  )
  
  handler.use(
    cors({
      credentials: true
    })
  )