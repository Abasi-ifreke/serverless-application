import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../helpers/todos';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'


// TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {  console.log("Processing Event ", event);
//   const authorization = event.headers.Authorization;
//   const split = authorization.split(' ');
//   const jwtToken = split[1];

  const todoId = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);

  const todoItem = await updateTodo(updatedTodo, todoId, getUserId(event));

  if(todoItem === null){
    return {
      statusCode: 404,
      body: JSON.stringify({message: 'Todo not found'})
    }
  }

  return {
      statusCode: 200,
    //   headers: {
    //       "Access-Control-Allow-Origin": "*",
    //   },
      body: ''
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



// export const handler = middy(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     //const todoId = event.pathParameters.todoId
//     const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
//     console.log(updatedTodo)

//     return undefined
//   }
// )

