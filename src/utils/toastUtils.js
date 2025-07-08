import { toast } from 'react-toastify';
import { Slide } from 'react-toastify';

const commonOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Slide,
  theme: 'dark',
};

export const showSuccessToast = (message) => {
  toast.success(`✅ ${message}`, commonOptions);
};

export const showErrorToast = (message) => {
  toast.error(`❌ ${message}`, commonOptions);
};

export const showWarningToast = (message) => {
  toast.warn(`⚠️ ${message}`, commonOptions);
};
