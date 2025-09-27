import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/toastSlice';

/**
 * Custom hook for managing toasts with Redux
 * @returns {Object} Toast management functions
 */
export const useReduxToast = () => {
  const dispatch = useAppDispatch();

  /**
   * Show a success toast
   * @param {string} title - Toast title
   * @param {string} message - Toast message
   * @param {number} [duration] - Toast duration in milliseconds
   */
  const showSuccess = (title: string, message: string, duration?: number) => {
    dispatch(
      addToast({
        type: 'success',
        title,
        message,
        duration,
      })
    );
  };

  /**
   * Show an error toast
   * @param {string} title - Toast title
   * @param {string} message - Toast message
   * @param {number} [duration] - Toast duration in milliseconds
   */
  const showError = (title: string, message: string, duration?: number) => {
    dispatch(
      addToast({
        type: 'error',
        title,
        message,
        duration,
      })
    );
  };

  /**
   * Show a warning toast
   * @param {string} title - Toast title
   * @param {string} message - Toast message
   * @param {number} [duration] - Toast duration in milliseconds
   */
  const showWarning = (title: string, message: string, duration?: number) => {
    dispatch(
      addToast({
        type: 'warning',
        title,
        message,
        duration,
      })
    );
  };

  /**
   * Show an info toast
   * @param {string} title - Toast title
   * @param {string} message - Toast message
   * @param {number} [duration] - Toast duration in milliseconds
   */
  const showInfo = (title: string, message: string, duration?: number) => {
    dispatch(
      addToast({
        type: 'info',
        title,
        message,
        duration,
      })
    );
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
