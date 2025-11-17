import { type ReactNode } from 'react';
import { state } from 'reactish-state';

interface ToastState {
  show?: boolean;
  type?: 'success' | 'error';
  message?: ReactNode;
}

export const toast$ = state({} as ToastState, (set) => {
  let timerId: number;

  const showToast = (type: ToastState['type'], message: ReactNode) => {
    set({ show: true, type, message });
    clearTimeout(timerId);
    timerId = setTimeout(() => set({ show: false }), 3000);
  };

  return {
    success: (message: ReactNode) => showToast('success', message),
    error: (message: ReactNode) => showToast('error', message)
  };
});
