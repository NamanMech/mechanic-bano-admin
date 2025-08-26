import { toast } from 'react-toastify';
import { Slide } from 'react-toastify';

const commonOptions = Object.freeze({
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Slide,
  theme: 'dark',
});

const mergeOptions = (overrides) => ({
  ...commonOptions,
  ...overrides,
});

export const showSuccessToast = (message, options = {}) => {
  toast.success(`✅ ${message}`, mergeOptions(options));
};

export const showErrorToast = (message, options = {}) => {
  toast.error(`❌ ${message}`, mergeOptions(options));
};

export const showWarningToast = (message, options = {}) => {
  toast.warn(`⚠️ ${message}`, mergeOptions(options));
};

export const showInfoToast = (message, options = {}) => {
  toast.info(`ℹ️ ${message}`, mergeOptions(options));
};
