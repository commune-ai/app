export type ModuleType = {
    name: string
    key: string
    url: string
    description: string
    network: string
  }

export const defaultModule: ModuleType = {
    name: 'agi',
    key: 'agi',
    url: 'agi.com',
    description: 'agi module',
    network: 'eth',
  }
  