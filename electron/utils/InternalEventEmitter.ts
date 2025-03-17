import EventEmitter from 'events';

export class InternalEventEmitter extends EventEmitter {
  private static emitter = new EventEmitter();

  public static emitAuthEvent(): void {
    InternalEventEmitter.emitter.emit('internal-auth-browser');
  }

  public static getAuthEventHook(listener: (...args: any[]) => void) {
    InternalEventEmitter.emitter.on('internal-auth-browser', listener);
  }
}
