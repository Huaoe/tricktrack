export enum ValidationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum TrickType {
  OLLIE = 'ollie',
  KICKFLIP = 'kickflip',
  HEELFLIP = 'heelflip',
  SHUVIT = 'shuvit',
  POP_SHUVIT = 'pop-shuvit',
  FRONTSIDE_180 = 'frontside-180',
  BACKSIDE_180 = 'backside-180',
  VARIAL_KICKFLIP = 'varial-kickflip',
  HARDFLIP = 'hardflip',
  TREFLIP = 'treflip',
}

export interface ValidationScore {
  validatorId: string;
  landing: number; // 0-50
  style: number; // 0-30
  difficulty: number; // 0-20
  feedback?: string;
}

export interface Validation {
  id: string;
  skaterId: string;
  trickType: TrickType;
  videoUrl: string;
  status: ValidationStatus;
  scores: ValidationScore[];
  finalScore?: number;
  tokensEarned?: number;
  createdAt: Date;
  completedAt?: Date;
}
