import React from 'react';
import { Filters } from './use-filters';
import { useRouter, usePathname } from 'next/navigation';

export const useQueryFilters = (filters: Filters) => {
  const isMounted = React.useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (isMounted.current) {
      const skillsArray = Array.from(filters.selectedSkills);
      
      const params = new URLSearchParams();
      if (skillsArray.length > 0) {
        params.set('skills', skillsArray.join(','));
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      // Use replace instead of push for faster updates without adding to history
      router.replace(newUrl, {
        scroll: false,
      });
    }

    isMounted.current = true;
  }, [filters.selectedSkills, router, pathname]);
};
