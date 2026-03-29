import AsyncStorage from "@react-native-async-storage/async-storage";
import apiClient from "./apiClient";

/* =====================================================
   TEACHER LOGIN
===================================================== */

const teacherLogin = async ({ email, password, fcmToken }) => {
  const response = await apiClient.post("/teacher/login", {
    email,
    password,
    fcm_token: fcmToken || "",
  });

  console.log("Teacher login response:", response.data);

  if (response.data?.status === 200) {
    await AsyncStorage.setItem(
      "teacher_info",
      JSON.stringify(response.data)
    );

    // Debug check
    const check = await AsyncStorage.getItem("teacher_info");
    console.log("Saved teacher_info =>", check);
  }

  return response.data;
};

/* =====================================================
   LOGOUT
===================================================== */

const logout = async () => {
  const response = await apiClient.post("/teacher/logout");

  await AsyncStorage.removeItem("teacher_info");
  await AsyncStorage.removeItem("user_type");

  console.log("Logout Successfully");

  return response.data;
};

/* =====================================================
   UPDATE PROFILE IMAGE
===================================================== */

const updateProfilePic = async ({ formData }) => {
  const response = await apiClient.post(
    "/user_image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  console.log("Profile update response:", response.data);

  const strUserInfo = await AsyncStorage.getItem("teacher_info");

  if (strUserInfo) {
    const parsUserInfo = JSON.parse(strUserInfo);

    if (response.data?.user) {
      parsUserInfo.teacher = response.data.user;
    }

    await AsyncStorage.setItem(
      "teacher_info",
      JSON.stringify(parsUserInfo)
    );
  }

  return response.data;
};

/* =====================================================
   SUGGESTIONS
===================================================== */

const suggestions = async ({ service_type, suggestion }) => {
  const response = await apiClient.post("/suggestions", {
    service_type,
    suggestion,
  });

  console.log("Suggestion response:", response.data);

  return response.data;
};

/* =====================================================
   COMMON TASK (MAP API RESPONSE → REDUX STATE)
===================================================== */

const commanTask = (state, action) => {
  const data = action.payload;

  if (data?.status === 200 && data.teacher) {
    state.token = data.token;

    state.teacher_id = data.teacher.teacher_id;
    state.user_id = data.teacher.user_id;
    state.name = data.teacher.name;
    state.email = data.teacher.email;
    state.mobile = data.teacher.mobile;
    state.image = data.teacher.image;

    state.school_name = data.school?.school_name || "";
    state.academic_session = data.academic_session?.name || "";
    state.assigned_classes = data.assigned_classes || [];

    state.pending = false;
    state.error = false;
    state.isAuthenticated = true;
  }
};

/* =====================================================
   EXPORT SERVICE
===================================================== */

const authService = {
  teacherLogin,
  logout,
  updateProfilePic,
  suggestions,
  commanTask,
};

export default authService;