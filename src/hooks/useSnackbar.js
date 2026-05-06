import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { hideSnackbar, showSnackbar } from '../redux/features/snackbarSlice/snackbarSlice';

export const useSnackbar = () => {
    const dispatch = useDispatch();

    const show = useCallback((message, options = {}) => {
        dispatch(showSnackbar({
            message,
            vertical: options.vertical || 'top',
            horizontal: options.horizontal || 'center',
            variant: options.variant || 'info'
        }));
    }, [dispatch]);

    const methods = useMemo(() => ({
        success: (message, options = {}) => show(message, { ...options, variant: 'success' }),
        error: (message, options = {}) => show(message, { ...options, variant: 'error' }),
        warning: (message, options = {}) => show(message, { ...options, variant: 'warning' }),
        info: (message, options = {}) => show(message, { ...options, variant: 'info' }),
        default: (message, options = {}) => show(message, options),
    }), [show]);
    
    const hideMessage = useCallback(() => dispatch(hideSnackbar()), [dispatch]);

    return useMemo(() => ({
        toast: methods,
        hideMessage,
    }), [methods, hideMessage]);
}

