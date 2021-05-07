export const LocalStorageApi = {
  EXPORT_TASK_KEY: 'EXPORT_PDF_TASK_ID',

  set<T>(key: string, value: T) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },

  get<T>(key: string): T | null {
    const strValue = window.localStorage.getItem(key);
    return typeof strValue === 'string' ? (JSON.parse(strValue) as T) : null;
  },

  remove(key: string) {
    window.localStorage.removeItem(key);
  }
};
