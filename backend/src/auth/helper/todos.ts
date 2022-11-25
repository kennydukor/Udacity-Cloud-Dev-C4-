import {TodoItem} from "../../models/TodoItem";
import { getUserId } from '../../lambda/utils';
import { APIGatewayProxyEvent } from 'aws-lambda';
import {CreateTodoRequest} from "../../requests/CreateTodoRequest";
import {UpdateTodoRequest} from "../../requests/UpdateTodoRequest";
import {TodoUpdate} from "../../models/TodoUpdate";
import { ToDoAccess } from "./todosAccess";
import { AttachmentHandler } from "./attachmentUtils";
import * as uuid from 'uuid'

const todoAccess = new ToDoAccess();
const attachmentHandler = new AttachmentHandler();

export function _create(createTodoRequest: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem> {
    const userId = getUserId(event);
    const todoId =  uuid.v4();
    const s3Bucket = process.env.S3_BUCKET_NAME;
    
    return todoAccess.create({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3Bucket}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    });
}

export async function _getAll(event: APIGatewayProxyEvent): Promise<TodoItem[]> {
    const userId = getUserId(event);
    return todoAccess.getAll(userId);
}

export function _update(updateTodoRequest: UpdateTodoRequest, todoId: string, event: APIGatewayProxyEvent): Promise<TodoUpdate> {
    const userId = getUserId(event);
    return todoAccess.update(updateTodoRequest, todoId, userId);
}

export function _delete(todoId: string, event: APIGatewayProxyEvent): Promise<boolean> {
    const userId = getUserId(event);
    return todoAccess.delete(todoId, userId);
}

export function generateUploadUrl(todoId: string): Promise<string> {
    return attachmentHandler.createAttachmentUrl(todoId);
}