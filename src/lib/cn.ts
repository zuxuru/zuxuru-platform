import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Joins conditional class values and resolves conflicting Tailwind utilities.
 *
 * @param inputs - Class names, conditional class maps, or nested class values.
 * @returns A normalized class string with conflicting utilities merged.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
