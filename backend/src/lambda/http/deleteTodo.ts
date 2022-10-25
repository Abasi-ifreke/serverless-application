import 'source-map-support/register'
// import { getTokenFromAuthorizationHeader } from '../utils';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { deleteTodo } from '../../helpers/todos';
// import { deleteTodo } from '../../helpers/todosAcess';

//import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TODO item by id

    console.log("Processing Deletion of Event ", event)
    const todoId = event.pathParameters.todoId
    // const token = getTokenFromAuthorizationHeader(event.headers.Authorization);
    const deleteResult = await deleteTodo(todoId, getUserId(event))

    if(deleteResult === null){
      return {
        statusCode: 404,
        body: JSON.stringify({message: 'Todo not found'})
      }
    }
    
    return {
      statusCode: 200,
      // headers: {
      //     "Access-Control-Allow-Origin": "*",
      //     'Access-Control-Allow-Credentials': true
      // },
      body: '',
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
