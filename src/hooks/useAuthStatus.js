import { useSelector } from "react-redux";

/**
 * Custom Hook to get the current authentication status based on the JWT token in Redux.
 * This hook provides a reactive boolean value that updates when the login state changes.
 *
 * @returns {boolean} True if the user is logged in (JWT token exists), false otherwise.
 */
export const useAuthStatus = () => {
  // Subscribe to the jwtToken in the Redux store's User slice
  // Add null checks to prevent "Cannot destructure property 'auth' of 'e' as it is undefined" error
  const jwtToken = useSelector((state) => {
    // Handle case where state or state.User might be undefined during initial hydration
    if (!state || !state.User) {
      return null;
    }
    return state.User.jwtToken;
  });

  // Return true if the token exists, otherwise false
  // The '!!' converts the token value (string or undefined) into a boolean
  return !!jwtToken;
};
