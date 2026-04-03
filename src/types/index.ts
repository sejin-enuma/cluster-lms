export type UserRole = 'enuma_admin' | 'cluster_admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  clusterId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Institution {
  id: string;
  name: string;
}

export interface Cluster {
  id: string;
  name: string;
  institutionId: string;
  institutionName: string;
}

export interface School {
  id: string;
  name: string;
  clusterId: string;
  clusterName: string;
  institutionId: string;
  institutionName: string;
  licenseName: string;
  licenseIssued: number;
  licenseInUse: number;
}

export interface Account {
  id: string;
  email: string;
  rights: string;
  password: string;
  deleted?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  sortable?: boolean;
  width?: string;
  render?: (row: T) => React.ReactNode;
}
