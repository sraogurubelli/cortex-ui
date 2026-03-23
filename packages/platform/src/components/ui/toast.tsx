// @ts-nocheck
/**
 * Toast Component Integration
 *
 * Re-export Toast from Canary UI with convenience utilities.
 * Provides toast notifications for success, error, info, and warning messages.
 */

export { toast, Toaster } from '@harnessio/ui/components';

/**
 * Toast utility functions for common notification patterns
 */

export const showToast = {
  success: (message: string, description?: string) => {
    const { toast } = require('@harnessio/ui/components');
    return toast.success(message, { description });
  },

  error: (message: string, description?: string) => {
    const { toast } = require('@harnessio/ui/components');
    return toast.error(message, { description });
  },

  info: (message: string, description?: string) => {
    const { toast } = require('@harnessio/ui/components');
    return toast.info(message, { description });
  },

  warning: (message: string, description?: string) => {
    const { toast } = require('@harnessio/ui/components');
    return toast.warning(message, { description });
  },

  loading: (message: string) => {
    const { toast } = require('@harnessio/ui/components');
    return toast.loading(message);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    const { toast } = require('@harnessio/ui/components');
    return toast.promise(promise, messages);
  },
};
