export interface MemoryCredentials {
  uid: string;
  chain: string;
  id: string;
}

export interface interaction {
  message: string;
  response: string;
  timestamp?: number;
}
