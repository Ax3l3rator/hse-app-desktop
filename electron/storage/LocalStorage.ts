// TODO: Make unified localStorage interface or class, the main purpose of wich is to dynamically store cached data on local machine
// TODO: Not only here, invent the way of checking internet connection when drawing the page
import Store from 'electron-store';
import { SECRET_KEY } from '../config';
export class BaseLocalStorage<DataStructure extends Record<string, any>> {
  protected store;
  public name;

  constructor(storage_name: string, defaults?: DataStructure) {
    this.name = storage_name;
    this.store = new Store<DataStructure>({
      name: storage_name,
      watch: true,
      fileExtension: 'json',
      encryptionKey: SECRET_KEY,
      defaults: defaults,
    });
  }

  public get(parameter_name: keyof DataStructure) {
    return this.store.get(parameter_name);
  }

  public set(parameter_name: keyof DataStructure, parameter_value: DataStructure[keyof DataStructure]) {
    return this.store.set(parameter_name, parameter_value);
  }
}
