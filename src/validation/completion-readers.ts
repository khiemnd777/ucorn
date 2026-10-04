import type { CompletionMetadata } from '../domain/completion-types';

export type ObjectValue = Record<string, unknown>;
export interface CompletionReaders {
  object: (v: unknown, path: string) => ObjectValue;
  string: (v: unknown, path: string) => string;
  quantity: (v: unknown, path: string, dimension: 'length' | 'diameter', positive?: boolean) => number;
  metadata: (c: ObjectValue, path: string) => CompletionMetadata;
  allowedKeys: (c: ObjectValue, keys: string[], path: string) => void;
  issue: (code: string, path: string, message: string, id?: string, severity?: 'error' | 'warning') => void;
}
