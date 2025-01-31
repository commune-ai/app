
class Store {
    private static instance: Store;
    private storage: Record<string, string> = {};
  
    private constructor() {}
  
    static getInstance(): Store {
      if (!Store.instance) {
        Store.instance = new Store();
      }
      return Store.instance;
    }
  
    set(key: string, value: string): void {
      this.storage[key] = value;
    }
  
    get(key: string): string {
      let value =  this.storage[key];
      if (value === undefined) {
        return '';
      }
      return value;
    }
  
    remove(key: string): void {
      delete this.storage;
    }
  
    clear(): void {
      this.storage = {};
    }
  
    getAll(): Record<string, any> {
      return { ...this.storage };
    }
  }
  
  export default Store.getInstance();