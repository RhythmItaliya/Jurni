'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { ReactNode } from 'react';

interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * Redux provider component for global state management
 * @param {ReactNode} children - Child components
 * @returns {JSX.Element} Redux provider wrapper
 */
export default function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
