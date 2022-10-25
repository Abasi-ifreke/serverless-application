import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { createTodo } from '../../helpers/todos'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils';
//import { createTodo } from '../../businessLogic/todos'

// import { createTodo } from '../../helpers/todosAcess'
// import { todoBuilder } from '../../helpers/todos'
// import { getTokenFromAuthorizationHeader } from '../utils'

const logger = createLogger('CreateTodosHandler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', {event: event})
    
    // TODO: Implement creating a new TODO item

  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  // const authorization = event.headers.Authorization
  // const split = authorization.split(' ')
  // const jwtToken = split[1]
  const todo = await createTodo(newTodo, getUserId(event))
    //  await createTodo(todo)
     
    return {
      statusCode: 201,
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     'Access-Control-Allow-Credentials': true
    // },
      body: JSON.stringify({
        item: todo
      })
    }
  }

)
handler.use(
  cors({
    credentials: true
  })
)