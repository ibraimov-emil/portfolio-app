// Re-export useFilters from context for backward compatibility
export { useFilters } from '@/contexts/filters-context';

// Export Filters interface for type compatibility
export interface Filters {
  selectedSkills: Set<string | number>;
}
