import 'source-map-support/register'

import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import {generateUploadUrl} from "../../auth/helper/todos";

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const todoId = event.pathParameters.todoId
      // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
      const uploadUrl = await generateUploadUrl(todoId);

      return {
        statusCode: 202,
        body: JSON.stringify({
            uploadUrl: uploadUrl,
        })
    };
    }
  )
  
  handler
    .use(httpErrorHandler())
    .use(
      cors({
        credentials: true
      })
    )