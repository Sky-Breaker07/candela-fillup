// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import authService, { LoginCredentials, RegistrationData, UserProfile } from '~/src/utils/authService';
import { getAuthErrorMessage } from '~/src/utils/firebaseErrorHandler';

interface GoogleUserProfile {
  email: string;
  name: string;
  picture: string;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  user: UserProfile | GoogleUserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false, // Start with false so user has to authenticate
  isOnboarded: false,
  user: null,
  isLoading: false,
  error: null,
};

// Async thunks for authentication actions
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const token = await authService.login(credentials);
      const user = await authService.getUserProfile();
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(getAuthErrorMessage(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (registerData: RegistrationData, { rejectWithValue }) => {
    try {
      const token = await authService.register(registerData);
      const user = await authService.getUserProfile();
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(getAuthErrorMessage(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return;
    } catch (error: any) {
      return rejectWithValue(getAuthErrorMessage(error));
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        const token = await authService.getToken();
        const user = await authService.getUserProfile();
        return { token, user };
      }
      
      return { token: null, user: null };
    } catch (error: any) {
      return rejectWithValue(getAuthErrorMessage(error));
    }
  }
);

export const sendPasswordReset = createAsyncThunk(
  'auth/sendPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(getAuthErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Manual setters (useful for testing and quick actions)
    login: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.isOnboarded = true;
      state.error = null;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    completeOnboarding: (state) => {
      state.isOnboarded = true;
    },
    resetOnboarding: (state) => {
      state.isOnboarded = false;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    googleLogin: (state, action: PayloadAction<GoogleUserProfile>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Login failed';
    });
    
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Registration failed';
    });
    
    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.user = null;
    });
    
    // Check auth status
    builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
      state.isAuthenticated = !!action.payload.token;
      state.token = action.payload.token;
      state.user = action.payload.user;
    });

    // Password reset
    builder.addCase(sendPasswordReset.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(sendPasswordReset.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(sendPasswordReset.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string || 'Password reset failed';
    });
  },
});

export const { login, logout, completeOnboarding, resetOnboarding, setError, clearError, googleLogin } = authSlice.actions;
export default authSlice.reducer;
