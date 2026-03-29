import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import commanServices from '../services/commanServices';
import authService from '../services/authServices';

/* =====================================================
   INITIAL STATE
===================================================== */

const initialState = {
  isInitial: false,
  pending: false,
  error: false,
  message: null,   // ⭐ add this

  token: null,

  // Teacher
  user_id: null,
  teacher_id: null,
  name: '',
  email: '',
  mobile: '',
  image: '',
  school_id: '',
  school_name: '',
  schoollogo: '',
  assigned_classes: [],

  // system
  isLoading: false,
  isOtp: false,
  isLogout: false,
  firstTime: true,
  helpline_number: '',
  fcmToken: null,
};

/* =====================================================
   CHECK LOGIN (RESTORE SESSION)
===================================================== */

export const chkLogin = createAsyncThunk(
  'auth/chkLogin',
  async (_, thunkAPI) => {
    try {
      const user = await AsyncStorage.getItem('teacher_info');
      const first = await AsyncStorage.getItem('firstTime');

      return {
        user,
        firstTime: first,
      };
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

/* =====================================================
   TEACHER LOGIN
===================================================== */

export const fetchTeacherLogin = createAsyncThunk(
  'auth/teacherLogin',
  async ({ email, password, fcmToken }, thunkAPI) => {
    try {
      return await authService.teacherLogin({
        email,
        password,
        fcmToken,
      });
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/* =====================================================
   LOGOUT
===================================================== */

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      return await authService.logout();
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/* =====================================================
   UPDATE PROFILE PIC
===================================================== */

export const updateProfilePic = createAsyncThunk(
  'auth/updateProfilePic',
  async ({ formData }, thunkAPI) => {
    try {
      return await authService.updateProfilePic({ formData });
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/* =====================================================
   SUGGESTIONS
===================================================== */

export const suggestions = createAsyncThunk(
  'auth/suggestions',
  async ({ service_type, suggestion }, thunkAPI) => {
    try {
      return await authService.suggestions({
        service_type,
        suggestion,
      });
    } catch (e) {
      return thunkAPI.rejectWithValue(
        e.response?.data?.message || e.message
      );
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    // Save FCM token
    setFcmToken: (state, action) => {
      console.log('🔥 Saved FCM token:', action.payload);
      state.fcmToken = action.payload;
    },

  },

  extraReducers: builder => {

    /* ================= LOGIN ================= */

    builder.addCase(fetchTeacherLogin.pending, state => {
      state.pending = true;
      state.message = null; // clear old error
    });

    builder.addCase(fetchTeacherLogin.fulfilled, (state, action) => {

      if (!action.payload?.errors) {
        authService.commanTask(state, action);
      } else {
        commanServices.showToast(action.payload.errors);
      }

      state.pending = false;
    });

    builder.addCase(fetchTeacherLogin.rejected, (state, action) => {
      state.pending = false;
      state.error = true;
      state.token = null;
      state.message = action.payload; // ⭐ store API message
      
    });

    /* ================= RESTORE LOGIN ================= */

    builder.addCase(chkLogin.pending, state => {
      state.isLoading = true;
      state.pending = true;
    });

    builder.addCase(chkLogin.fulfilled, (state, action) => {

      if (!action.payload.user) {
        state.isLoading = false;
        state.pending = false;
        state.isInitial = false;
        return;
      }

      const data = JSON.parse(action.payload.user);

      if (data) {

        state.token = data.token;

        state.teacher_id = data.teacher.teacher_id;
        state.user_id = data.teacher.user_id;
        state.name = data.teacher.name;
        state.email = data.teacher.email;
        state.mobile = data.teacher.mobile;
        state.image = data.teacher.image;

        state.school_name = data.school?.school_name || '';
        state.academic_session = data.academic_session?.name || '';
        state.assigned_classes = data.assigned_classes || [];
      }

      state.firstTime = JSON.parse(action.payload.firstTime || 'true');

      state.isLoading = false;
      state.pending = false;
      state.isInitial = false;
    });

    builder.addCase(chkLogin.rejected, state => {
      state.isInitial = false;
      state.pending = false;
    });

    /* ================= LOGOUT ================= */

    builder.addCase(logout.pending, state => {
      state.pending = true;
    });

    builder.addCase(logout.fulfilled, state => {

      state.token = null;

      state.teacher_id = null;
      state.user_id = null;
      state.name = '';
      state.email = '';
      state.mobile = '';
      state.image = '';

      state.school_name = '';
      state.assigned_classes = [];

      state.pending = false;
      state.error = false;
      state.isLogout = true;
    });

    builder.addCase(logout.rejected, state => {
      state.pending = false;
      state.error = true;
      state.token = null;
    });

    /* ================= SUGGESTIONS ================= */

    builder.addCase(suggestions.pending, state => {
      state.pending = true;
    });

    builder.addCase(suggestions.fulfilled, (state, action) => {
      commanServices.showToast(action.payload.message);
      state.pending = false;
    });

    builder.addCase(suggestions.rejected, state => {
      state.pending = false;
      state.error = true;
    });

  },

});

export const { setFcmToken } = authSlice.actions;
export default authSlice.reducer;