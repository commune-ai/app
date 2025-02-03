
export type KeyType =  {
  address: string;
  crypto_type: 'sr25519' | 'ecdsa';
  publicKey: string;
  privateKey: string;
}


export type ModuleType = {
    name: string
    key: string // address 
    url: string // the url of the server
    app: string // the app name
    desc: string // description
    hash: string  // hash of the module code
    network: string // network of the module
    code: string // code of the module
    tags: string[] // tags of the module
    comments: string[] // comments of the module
    founder: string // founder of the module
    time: number // time of the module
  }

export const DefaultModule: ModuleType = {
    name: 'agi',
    key: '',
    url: 'agi.com',
    desc: 'agi module',
    hash: '0x1234567890',
    network: 'commune',
    code: '0x1234567890',
    tags: ['tag1', 'tag2'],
    comments: ['comment1', 'comment2'],
    founder: 'founder',
    time: 0
    
  }
  