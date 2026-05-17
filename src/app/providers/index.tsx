import React, { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: ProvidersProps) => {
  return (
    <>
      {children}
    </>
  );
};