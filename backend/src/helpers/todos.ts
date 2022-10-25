import { TodoAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import { APIGatewayProxyEvent } from 'aws-lambda'
// import { getUserId } from '../lambda/utils'
// import { parseUserId } from '../auth/utils';
// import { TodoUpdate } from '../models/TodoUpdate';
// import * as createError from 'http-errors'

// // TODO: Implement businessLogic
// const uuidv4 = require('uuid/v4');
const todoAccess = new TodoAccess();
const attachmentUtils = new AttachmentUtils()


export async function getAllTodo(userId: string): Promise<TodoItem[]> {
    // const userId = parseUserId(jwtToken);
    return todoAccess.getAllTodoItemsForUser(userId);
}

export async function createTodo(todo: CreateTodoRequest, userId: string): Promise<TodoItem> {
    // const userId = parseUserId(jwtToken);
    const todoId =  uuid.v4();
    const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;
    const createdAt = new Date().getTime().toString()
    
    const todoItem = {
        userId,
        todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        done: false,
        createdAt,
        ...todo
    }
    const newItem = todoAccess.createTodo(todoItem)

    return newItem
}

export async function updateTodo(updateTodo: UpdateTodoRequest, todoId: string, userId: string) {
    // const userId = parseUserId(jwtToken);
    const validTodo = await todoAccess.getTodoByIDAndUserId(todoId, userId)
    
    if(!validTodo){
        return null
    }

    await todoAccess.updateTodo(updateTodo, todoId, userId);
}

export async function deleteTodo(todoId: string, userId: string) {
    // const userId = parseUserId(jwtToken);
    const validTodo = await todoAccess.getTodoByIDAndUserId(todoId, userId)

    if(!validTodo){
        return null
    }

    await todoAccess.deleteTodo(todoId, userId);
}

export function createAttachmentPresignedUrl(todoId: string): Promise<string> {
    return attachmentUtils.getUploadUrl(todoId);
}








// export function todoBuilder(
//     todoRequest: CreateTodoRequest, 
//     event: APIGatewayProxyEvent
//     ) {
//     const todoId = uuid.v4()
//     const todo = {
//       todoId: todoId,
//       userId: getUserId(event),
//       createdAt: new Date().toISOString(),
//       done: false,
//       attachmentUrl: "",
//       ...todoRequest
//      }
//      return todo
// }


// export function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
//   const userId = parseUserId(jwtToken);
//   const todoId =  uuid.v4();
//   const s3BucketName = process.env.S3_BUCKET_NAME;
  
//   return todoAccess.createTodo({
//     userId: userId,
//     todoId: todoId,
//     attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
//     createdAt: new Date().getTime().toString(),
//     done: false,
//     ...createTodoRequest,
// });
// }