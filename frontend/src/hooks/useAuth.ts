import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { login, register, logout, getMe, clearError } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = (email: string, password: string) => {
    return dispatch(login({ email, password }));
  };

  const handleRegister = (name: string, email: string, password: string) => {
    return dispatch(register({ name, email, password }));
  };

  const handleLogout = () => {
    return dispatch(logout());
  };

  const handleGetMe = () => {
    return dispatch(getMe());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getMe: handleGetMe,
    clearError: handleClearError,
  };
};