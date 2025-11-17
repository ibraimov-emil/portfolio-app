'use client'
import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

interface FiltersContextType {
  selectedSkills: Set<string | number>;
  setSelectedSkills: (value: string | number) => void;
  clearSkills: () => void;
}

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const skillsParam = searchParams.get('skills');
  
  // Create Set from URL params (for initial load and external navigation)
  const skillsFromUrl = useMemo(() => {
    return skillsParam 
      ? new Set<string | number>(skillsParam.split(',').filter(Boolean))
      : new Set<string | number>();
  }, [skillsParam]);

  // Local state - updates immediately, not waiting for URL
  const [selectedSkills, setSelectedSkillsState] = useState<Set<string | number>>(skillsFromUrl);
  
  // Track if we're initialized from URL
  const isInitialized = useRef(false);
  const previousSkillsParam = useRef(skillsParam);
  // Track the state we're syncing to URL to avoid sync loops
  const pendingUrlState = useRef<string | null>(null);
  // Flag to prevent sync during URL updates
  const isUpdatingUrl = useRef(false);

  // Initialize state from URL only on mount or external navigation
  useEffect(() => {
    if (!isInitialized.current) {
      // First load - initialize from URL
      setSelectedSkillsState(skillsFromUrl);
      isInitialized.current = true;
      previousSkillsParam.current = skillsParam;
      pendingUrlState.current = skillsParam || '';
      return;
    }
    
    // Skip if URL hasn't changed
    if (previousSkillsParam.current === skillsParam) {
      return;
    }
    
    // Skip if we're currently updating URL ourselves
    if (isUpdatingUrl.current) {
      // Check if URL matches what we expect
      const currentUrlState = skillsParam || '';
      if (currentUrlState === pendingUrlState.current) {
        // URL updated correctly, stop flagging
        isUpdatingUrl.current = false;
        previousSkillsParam.current = skillsParam;
        return;
      }
      // URL update is still pending or failed, keep waiting
      previousSkillsParam.current = skillsParam;
      return;
    }
    
    // URL changed externally (browser back/forward or direct URL change)
    // Sync state with URL
    setSelectedSkillsState(skillsFromUrl);
    pendingUrlState.current = skillsParam || '';
    previousSkillsParam.current = skillsParam;
  }, [skillsParam, skillsFromUrl]);

  // Update URL when selectedSkills changes (for shareable links)
  useEffect(() => {
    if (!isInitialized.current) return;
    if (isUpdatingUrl.current) return; // Skip if already updating
    
    const skillsArray = Array.from(selectedSkills).map(String).sort();
    const expectedState = skillsArray.join(',');
    const currentUrlState = skillsParam || '';
    
    // Only update URL if state differs from URL (user action, not external navigation)
    if (expectedState !== currentUrlState) {
      isUpdatingUrl.current = true;
      pendingUrlState.current = expectedState;
      
      const params = new URLSearchParams();
      if (skillsArray.length > 0) {
        params.set('skills', expectedState);
      }
      
      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      
      router.replace(newUrl, { scroll: false });
    }
  }, [selectedSkills, pathname, router, skillsParam]);

  const toggleSkills = useCallback((value: string | number) => {
    // Update state immediately for instant UI feedback
    setSelectedSkillsState(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  }, []);

  const clearSkills = useCallback(() => {
    // Update state immediately
    setSelectedSkillsState(new Set<string | number>());
    // Update URL immediately
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const value = useMemo(
    () => ({
      selectedSkills,
      setSelectedSkills: toggleSkills,
      clearSkills,
    }),
    [selectedSkills, toggleSkills, clearSkills],
  );

  return (
    <FiltersContext.Provider value={value}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = (): FiltersContextType => {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
};

