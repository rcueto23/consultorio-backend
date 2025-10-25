export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  password: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  created_at?: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserResponse;
}
