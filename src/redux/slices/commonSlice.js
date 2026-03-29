import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import commanServices from "../services/commanServices";

/* =====================================================
   FETCH SCHOOL INFO
===================================================== */

export const fetchSchoolInfo = createAsyncThunk(
  "common/fetchSchoolInfo",
  async (_, { rejectWithValue }) => {
    try {
      const res = await commanServices.getSchoolInfo();
      return res.schoolInfo;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/* =====================================================
   MARKS SUMMARY
===================================================== */

export const getMarksSummaryData = createAsyncThunk(
  "common/getMarksSummaryData",
  async ({ exam_id }, { rejectWithValue }) => {
    try {
      const { marksSummary } = await commanServices.getMarksSummary(exam_id);
      return marksSummary;
    } catch (error) {
      console.log("Marks Summary Error:", error);
      return rejectWithValue("Unable to load marks summary");
    }
  }
);

/* =====================================================
   NOTIFICATIONS
===================================================== */

export const fetchNotifications = createAsyncThunk(
  "common/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const { count, notifications } =
        await commanServices.getNotifications();

      return { count, notifications };
    } catch (err) {
      return rejectWithValue("Unable to load notifications");
    }
  }
);

/* =====================================================
   TEACHER CLASSES
===================================================== */

export const fetchTeacherClasses = createAsyncThunk(
  "common/fetchTeacherClasses",
  async (_, { rejectWithValue }) => {
    try {
      const { classes } = await commanServices.getTeacherClasses();
      return classes;
    } catch (error) {
      return rejectWithValue("Unable to load teacher classes");
    }
  }
);

/* =====================================================
   CLASS SUBJECTS
===================================================== */

export const fetchClassSubjects = createAsyncThunk(
  "common/fetchClassSubjects",
  async ({ class_mapping_id }, { rejectWithValue }) => {
    try {
      const { subjects } =
        await commanServices.getClassSubjects(class_mapping_id);

      return subjects;
    } catch (error) {
      return rejectWithValue("Unable to load subjects");
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const commonSlice = createSlice({
  name: "common",

  initialState: {
    loading: false,
    schoolInfo: null,
    error: null,

    /* MARKS SUMMARY */

    marksSummary: {
      exams: [],
      exam: null,
      overall: null,
      subjects: [],
    },
    marksLoading: false,
    marksError: null,

    /* NOTIFICATIONS */

    notifications: [],
    notificationsLoading: false,
    unreadCount: 0,

    /* TEACHER CLASSES */

    teacherClasses: [],
    classesLoading: false,
    classesError: null,

    /* SUBJECTS */

    subjects: [],
    subjectsLoading: false,
    subjectsError: null,
  },

  reducers: {

    /* CLEAR SCHOOL INFO */

    clearSchoolInfo: (state) => {
      state.schoolInfo = null;
      state.error = null;
      state.loading = false;
    },

    /* CLEAR MARKS */

    clearMarks: (state) => {
      state.marksSummary = {
        exams: [],
        exam: null,
        overall: null,
        subjects: [],
      };

      state.marksError = null;
      state.marksLoading = false;
    },

    /* CLEAR UNREAD BADGE */

    clearUnreadCount: (state) => {
      state.unreadCount = 0;
    },

    /* CLEAR NOTIFICATIONS */

    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },

  extraReducers: (builder) => {

    /* ================= SCHOOL INFO ================= */

    builder
      .addCase(fetchSchoolInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSchoolInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.schoolInfo = action.payload;
      })

      .addCase(fetchSchoolInfo.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Unable to fetch school info";
      });

    /* ================= MARKS SUMMARY ================= */

    builder
      .addCase(getMarksSummaryData.pending, (state) => {
        state.marksLoading = true;
        state.marksError = null;
      })

      .addCase(getMarksSummaryData.fulfilled, (state, action) => {
        state.marksLoading = false;

        state.marksSummary = {
          exams: action.payload?.exams || [],
          exam: action.payload?.exam || null,
          overall: action.payload?.overall || null,
          subjects: action.payload?.subjects || [],
        };
      })

      .addCase(getMarksSummaryData.rejected, (state, action) => {
        state.marksLoading = false;
        state.marksError =
          action.payload || "Failed to fetch marks summary";
      });

    /* ================= NOTIFICATIONS ================= */

    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.notificationsLoading = true;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notificationsLoading = false;

        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.count;
      })

      .addCase(fetchNotifications.rejected, (state) => {
        state.notificationsLoading = false;
      });

    /* ================= TEACHER CLASSES ================= */

    builder
      .addCase(fetchTeacherClasses.pending, (state) => {
        state.classesLoading = true;
        state.classesError = null;
      })

      .addCase(fetchTeacherClasses.fulfilled, (state, action) => {
        state.classesLoading = false;
        state.teacherClasses = action.payload;
      })

      .addCase(fetchTeacherClasses.rejected, (state, action) => {
        state.classesLoading = false;
        state.classesError = action.payload;
      });

    /* ================= CLASS SUBJECTS ================= */

    builder
      .addCase(fetchClassSubjects.pending, (state) => {
        state.subjectsLoading = true;
        state.subjectsError = null;
      })

      .addCase(fetchClassSubjects.fulfilled, (state, action) => {
        state.subjectsLoading = false;
        state.subjects = action.payload;
      })

      .addCase(fetchClassSubjects.rejected, (state, action) => {
        state.subjectsLoading = false;
        state.subjectsError = action.payload;
      });

  },
});

export const {
  clearSchoolInfo,
  clearMarks,
  clearUnreadCount,
  clearNotifications,
} = commonSlice.actions;

export default commonSlice.reducer;