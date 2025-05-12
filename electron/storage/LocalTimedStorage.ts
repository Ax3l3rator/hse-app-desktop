import { BaseLocalStorage } from './LocalStorage';

export class LocalTimedStorage<
  DataStructure extends Record<string, any> & { last_save: Date },
> extends BaseLocalStorage<DataStructure> {
  override set(parameter_name: keyof DataStructure, parameter_value: DataStructure[keyof DataStructure]): void {
    this.store.set('last_save', Date.now());
    this.store.set(parameter_name, parameter_value);
  }

  public getLastSave(): Date {
    return this.store.get('last_save');
  }

  public getHoursSinceLastSave(): number {
    return Math.abs(Date.now() - this.getLastSave().getTime()) / 36e5;
  }
}
