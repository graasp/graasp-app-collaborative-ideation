import { Author } from '@/interfaces/author';

export enum AppStateEventType {
  POST_RESPONSE = 'POST_RESPONSE',
  UPDATE_RESPONSE = 'UPDATE_RESPONSE',
  DELETE_RESPONSE = 'DELETE_RESPONSE',
  ALL_RESPONSES = 'ALL_RESPONSES',
  USER_RESPONSES = 'USER_RESPONSES',
  UPDATE_CONFIG = 'UPDATE_CONFIG',
  GET_CONFIG = 'GET-CONFIG',
  SEND_UPDATE = 'SEND_UPDATE',
  POST_UPDATE = 'POST_UPDATE',
}

export interface AppStateWorkerMessage {
  type: AppStateEventType;
  data: unknown;
}

export interface AppStateWorkerResponse<T> {
  type: AppStateEventType;
  isResponse: true;
  data: T;
}

export type AppStateWorkerConfig = {
  author: Author;
};
