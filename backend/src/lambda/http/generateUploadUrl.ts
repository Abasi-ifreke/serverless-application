import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
// import { getTodoById, updateTodo } from '../../helpers/todos'
import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { TodoAccess } from '../../dataLayer/todosAcess'

import { getUserId } from '../utils'

//import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
//import { getUserId } from '../utils'

// const bucketname = process.env.ATTACHMENT_S3_BUCKET
const todosAccess = new TodoAccess()



export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const validTodo = await todosAccess.getTodoByIDAndUserId(todoId, getUserId(event))

    if(!validTodo){
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Todo not found'
        })
      }
    }
    // const todo = await getTodoById(todoId)
    // todo.attachmentUrl = `https://${bucketname}.s3.amazonaws.com/${todoId}`

    // updateTodo(todo);

    const url = await createAttachmentPresignedUrl(todoId)

    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: url
      })
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
