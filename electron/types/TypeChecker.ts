export function checkType<T extends object>(obj: object, pattern: T): boolean {
  for (const param in pattern) {
    if (!(param in obj)) {
      return false;
    }
  }
  return true;
}

export interface TypeChecker {
  <T extends object>(obj: object, pattern: T): obj is T;
}
