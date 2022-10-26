import * as AWS from 'aws-sdk'
// import { Types } from 'aws-sdk/clients/s3';
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')
// const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
// const docClient: DocumentClient = createDynamoDBClient()
// const uuidv4 = require('uuid/v4');
// const todoAccess = new todoAccess()

// // // TODO: Implement the dataLayer logic
export class TodoAccess {
    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        // private readonly s3Client: Types = new AWS.S3({ signatureVersion: 'v4' }),
        private readonly todoTable = process.env.TODOS_TABLE,
        // private readonly s3BucketName = process.env.S3_BUCKET_NAME
        ) {}

    async getAllTodo(userId: string): Promise<TodoItem[]> {
        logger.info('Getting all todo items for user: ', {userId: userId})

        const result = await this.docClient.query({
            TableName: this.todoTable,
            KeyConditionExpression: 'userId = :userId',
            // ExpressionAttributeNames: {
            //     "#userId": "userId"
            // },
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        // console.log(result);
        const items = result.Items

        return items as TodoItem[]
    }

    async getTodoById(todoId: string): Promise<TodoItem> {
        logger.info("Getting todo by Id");
    
        const result = await this.docClient
          .query({
            TableName: this.todoTable,
            IndexName: index,
            KeyConditionExpression: "todoId = :todoId",
            ExpressionAttributeValues: {
              ":todoId": todoId,
            },
          })
          .promise();
    
        const items = result.Items;
    
        if (items.length !== 0) {
          return items[0] as TodoItem;
        }
      }

    async createTodo(todoItem: TodoItem): Promise<TodoItem> {
        // console.log("Creating new todo");
        logger.info('Creating todo item: ', {item: todoItem})

        await this.docClient.put({
            TableName: this.todoTable,
            Item: todoItem,
        }).promise();
        // console.log(result);

        return todoItem as TodoItem;
    }

    async updateTodo(todoItem: TodoUpdate, todoId: string, userId: string) {
        logger.info('Updating todo item', {item: todoItem})

        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
            UpdateExpression: "set #name = :name, #dueDate = :dueDate, #done = :done",
            ExpressionAttributeNames: {
                '#name': 'name',
                '#dueDate': 'dueDate',
                '#done': 'done'
            },
            ExpressionAttributeValues: {
                ':name': todoItem.name,
                ':dueDate': todoItem.dueDate,
                ':done': todoItem.done
            }
            // ReturnValues: "ALL_NEW"
        }).promise();
        // console.log(result);
        // const attributes = result.Attributes;
        // return attributes as TodoUpdate;
    }

    async deleteTodo(todoId: string, userId: string) {
        // console.log("Deleting todo");
        logger.info('Deleting todo item', {todoId: todoId})

        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                "userId": userId,
                "todoId": todoId
            },
        }).promise();
        // console.log(result);
        // return "" as string;
    }


    async getTodoByIDAndUserId(todoId: string, userId: string) {
        logger.info('Getting todo item for user: ', { userId: userId })
        
        const result = await this.docClient.get({
            TableName: this.todoTable,
            Key: { todoId: todoId, userId: userId }
        }).promise()

        return !!result.Item
    }
}

// function createDynamoDBClient() {
//   return new XAWS.DynamoDB.DocumentClient();
// }

    // async generateUploadUrl(todoId: string): Promise<string> {
    //     console.log("Generating URL");

    //     const url = this.s3Client.getSignedUrl('putObject', {
    //         Bucket: this.s3BucketName,
    //         Key: todoId,
    //         Expires: 1000,
    //     });
    //     console.log(url);

    //     return url as string;
    // }










// export function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
//     const userId = parseUserId(jwtToken);
//     const todoId =  uuidv4();
//     const s3BucketName = process.env.S3_BUCKET_NAME;
    
//     return todoAccess.createTodo({
//         userId: userId,
//         todoId: todoId,
//         attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
//         createdAt: new Date().getTime().toString(),
//         done: false,
//         ...createTodoRequest,
//     });
// }

// export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]>{
//     const result = await docClient.query({
//         TableName : todosTable,
//         KeyConditionExpression: 'userId = :userId',
//         ExpressionAttributeValues: {
//             ':userId': userId
//         }
//     }).promise()
//     return result.Items as TodoItem[] 
// }

// export async function getTodoById(todoId: string): Promise<TodoItem>{
//     const result = await docClient.query({
//         TableName : todosTable,
//         IndexName: index,
//         KeyConditionExpression: 'todoId = :todoId',
//         ExpressionAttributeValues: {
//             ':todoId': todoId
//         }
//     }).promise()
//     const items = result.Items
//     if (items.length !== 0) return result.Items[0] as TodoItem

//     return null
// }

// export async function updatedTodo(todo: TodoItem): Promise<TodoItem>{
//     const result = await docClient.update({
//         TableName : todosTable,
//         Key: {
//             userId: todo.userId,
//             todoId: todo.todoId
//         },
//         UpdateExpression: 'set attachmentUrl = :attachmentUrl',
//         ExpressionAttributeValues: {
//             ':attachmentUrl': todo.attachmentUrl
//         }
//     }).promise()

//     return result.Attributes as TodoItem
// }

// export async function deleteToDo(todoId: string, userId: string): Promise<string> {
//         const params = {
//             TableName: todosTable,
//             Key: {
//                 "userId": userId,
//                 "todoId": todoId
//             },
//         };

//         const result = await docClient.delete(params).promise();
//         console.log(result);

//         return "" as string;
//     }

// function createDynamoDBClient() {
//     if (process.env.IS_OFFLINE) {
//       console.log('Creating a local DynamoDB instance')
//       return new XAWS.DynamoDB.DocumentClient({
//         region: 'localhost',
//         endpoint: 'http://localhost:8000'
//       })
//     }
  
//     return new XAWS.DynamoDB.DocumentClient()
//   }

