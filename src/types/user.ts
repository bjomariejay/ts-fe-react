export interface AppUser {
  id: number;
  name: string;
  age: number;
  address: string;
  username: string;
  passwordHash?: string;
}

export interface CreateUserPayload {
  name: string;
  age: number;
  address: string;
  username: string;
  password: string;
}

export interface UpdateUserPayload {
  name: string;
  age: number;
  address: string;
  username: string;
  password?: string;
}
