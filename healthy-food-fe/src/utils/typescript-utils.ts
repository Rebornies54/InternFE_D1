
import { UserId, FoodId, BlogId, Email, PhoneNumber } from '../types';

// Strict TypeScript Configuration
export const STRICT_TYPESCRIPT_CONFIG = {
  // Compiler options
  strict: true,
  noImplicitAny: true,
  noImplicitReturns: true,
  noImplicitThis: true,
  exactOptionalPropertyTypes: true,
  noUncheckedIndexedAccess: true,
  noPropertyAccessFromIndexSignature: true,
  
  // Best practices
  preferConst: true,
  noVar: true,
  noExplicitAny: true,
  preferNullishCoalescing: true,
  preferOptionalChain: true,
  
  // Type safety
  useBrandedTypes: true,
  explicitReturnTypes: true,
  strictNullChecks: true
};

// Type safety utilities
export const TypeUtils = {
  // Branded type creators
  createUserId: (id: number): UserId => id as UserId,
  createFoodId: (id: number): FoodId => id as FoodId,
  createBlogId: (id: number): BlogId => id as BlogId,
  
  // Null safety
  nonNull: <T>(value: T | null | undefined, message: string): T => {
    if (value === null || value === undefined) {
      throw new Error(message);
    }
    return value;
  },
  
  // Type guards
  isEmail: (value: string): value is Email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
  
  isPhoneNumber: (value: string): value is PhoneNumber => {
    return /^[+]?[\d\s-()]+$/.test(value);
  }
};
