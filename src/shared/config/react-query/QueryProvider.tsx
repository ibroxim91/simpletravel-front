'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


const QueryProvider = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 1000 * 60 * 5,
            refetchOnReconnect: false,
            refetchOnMount: false,
            refetchInterval: 1000 * 60 * 5,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      {children}
       {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
  );
};

export default QueryProvider;
