import 'source-map-support/register'
import { getTokenFromAuthorizationHeader } from '../utils';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteToDo } from '../../helpers/todosAcess';

//import { deleteTodo } from '../../businessLogic/todos'
//import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TODO item by id

    console.log("Processing Deletion of Event ", event)
    const todoId = event.pathParameters.todoId
    const token = getTokenFromAuthorizationHeader(event.headers.Authorization);
    const deleteResult = await deleteToDo(todoId, token);
    
    return {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin": "*",
          'Access-Control-Allow-Credentials': true
      },
      body: deleteResult,
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
