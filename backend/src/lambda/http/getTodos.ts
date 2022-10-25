import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllTodo } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

//import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
//import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
const logger = createLogger('GetTodosHandler')

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // console.log("Processing Event ", event);
    // const authorization = event.headers.Authorization;
    // const split = authorization.split(' ');
    // const jwtToken = split[1];
    logger.info('Processing event: ', {event: event})
    const todos = await getAllTodo(getUserId(event));

    return {
        statusCode: 200,
        // headers: {
        //     "Access-Control-Allow-Origin": "*",
        // },
        body: JSON.stringify({
            items: todos
        }),
    }
}
)
handler.use(
    cors({
      credentials: true
    })
)



// export const handler = middy(
//   async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//     // Write your code here
//     const todos = await getAllTodosByUserId(getUserId(event))

//     return {
//       statusCode: 201,
//       body: JSON.stringify({
//         items: todos
//       })
//     }
//   }
// )


