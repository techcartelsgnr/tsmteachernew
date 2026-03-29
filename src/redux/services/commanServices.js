import apiClient from "./apiClient";
import Toast from "react-native-toast-message";

/* =====================================================
   GET SLIDER
===================================================== */

const getSlider = async () => {
  try {

    const res = await apiClient.get("/slider");

    const sliderList = res.data?.data || [];

    const images = sliderList.map((item) => ({
      id: item.id,
      img: item.image_url,
    }));

    return { images };

  } catch (error) {
    console.log("Slider API Error:", error);
    return { images: [] };
  }
};

/* =====================================================
   GET NOTIFICATIONS
===================================================== */

const getNotifications = async () => {
  try {

    const res = await apiClient.get("/student/notifications/today");

    const data = res.data || {};

    return {
      count: data.count || 0,
      notifications: (data.notifications || []).map((item) => ({
        id: item.id,
        title: item.title,
        message: item.message,
        image: item.attachment_url
          ? "https://theschoolmate.in" + item.attachment_url
          : null,
        time: item.created_at,
        isNew: item.is_new,
        delivery: item.delivery_status,
      })),
    };

  } catch (error) {
    console.log("Notifications API Error:", error);
    return { count: 0, notifications: [] };
  }
};

/* =====================================================
   SUBMIT FEEDBACK
===================================================== */

const submitFeedback = async (payload) => {
  try {

    const res = await apiClient.post("/feedback-submit", {
      problem_type: payload.problem_type,
      feedback_text: payload.feedback_text,
    });

    return {
      success: true,
      message: res.data.message || "Submitted",
      feedback: res.data.data || null,
    };

  } catch (error) {
    console.log("Feedback Submit API Error:", error);

    return {
      success: false,
      message: "Something went wrong",
      feedback: null,
    };
  }
};

/* =====================================================
   GET TEACHER CLASSES
===================================================== */

const getTeacherClasses = async () => {
  try {

    const res = await apiClient.get("/teacher/classes");

    const classes = (res.data.classes || []).map((item) => ({
      id: item.class_mapping_id,
      className: item.class_name,
      section: item.section,
      isClassTeacher: item.is_class_teacher,
    }));

    return { classes };

  } catch (error) {
    console.log("Teacher Classes API Error:", error);
    return { classes: [] };
  }
};

/* =====================================================
   GET CLASS SUBJECTS
===================================================== */

const getClassSubjects = async (class_mapping_id) => {
  try {

    const res = await apiClient.get(
      `/teacher/class-subjects/${class_mapping_id}`
    );

    const subjects = (res.data.subjects || []).map((item) => ({
      id: item.subject_id,
      name: item.subject_name,
    }));

    return { subjects };

  } catch (error) {
    console.log("Class Subjects API Error:", error);
    return { subjects: [] };
  }
};

/* =====================================================
   SUBMIT HOMEWORK
===================================================== */
const submitHomeworkData = async (payload) => {

  try {

    const formData = new FormData();

    formData.append("title", payload.title);
    formData.append("class_mapping_id", payload.class_mapping_id);
    formData.append("subject_id", payload.subject_id);
    formData.append("short_description", payload.short_description);
    formData.append("homework_date", payload.homework_date);

    if (payload.file) {
      formData.append("file", {
        uri: payload.file.uri,
        type: payload.file.type,
        name: payload.file.name,
      });
    }

    console.log("FORM DATA:", formData);

    const res = await apiClient.post(
      "/teacher/homework/store",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: true,
      message: res.data.message,
      data: res.data.data,
    };

  } catch (error) {

    console.log("Submit Homework API Error:", error?.response?.data);

    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to submit homework",
    };

  }

};

/* =====================================================
   GET TEACHER HOMEWORKS
===================================================== */

const getTeacherHomeworks = async () => {

  try {

    const res = await apiClient.get("/teacher/homework");

    const data = res.data || {};

    const classSubjects = (data.class_subjects || []).map((item) => ({
      class_mapping_id: item.class_mapping_id,
      class_name: `${item.class_name} ${item.section}`,
      subjects: (item.subjects || []).map((sub) => ({
        subject_id: sub.subject_id,
        subject_name: sub.subject_name,
      })),
    }));

    const homeworks = (data.homeworks || []).map((item) => ({
      id: item.id,
      class_mapping_id: item.class_mapping_id,
      class_name: `${item.class_name} ${item.section}`,
      subject_id: item.subject_id,
      subject_name: item.subject_name,
      title: item.title,
      short_description: item.short_description,
      homework_date: item.homework_date,
      file_url: item.file_url,
    }));

    return {
      success: true,
      classSubjects,
      homeworks,
    };

  } catch (error) {

    console.log("Teacher Homework API Error:", error);

    return {
      success: false,
      classSubjects: [],
      homeworks: [],
    };
  }
};

/* =====================================================
   HOMEWORK DETAIL
===================================================== */

const getHomeworkDetail = async (homeworkId) => {

  try {

    const res = await apiClient.get(
      `/teacher/homework/edit/${homeworkId}`
    );

    const data = res.data?.data || null;

    return {
      success: true,
      homework: data
        ? {
            id: data.id,
            class_mapping_id: data.class_mapping_id,
            class_name: `${data.class_name} ${data.section}`,
            subject_id: data.subject_id,
            subject_name: data.subject_name,
            title: data.title,
            short_description: data.short_description,
            homework_date: data.homework_date,
            file_url: data.file_url,
          }
        : null,
    };

  } catch (error) {

    console.log("Homework Detail API Error:", error);

    return {
      success: false,
      homework: null,
    };
  }
};

/* =====================================================
   UPDATE HOMEWORK
===================================================== */

const updateHomeworkData = async (payload) => {

  try {

    const formData = new FormData();

    formData.append("title", payload.title);
    formData.append("class_mapping_id", payload.class_mapping_id);
    formData.append("subject_id", payload.subject_id);
    formData.append("short_description", payload.short_description);
    formData.append("homework_date", payload.homework_date);

    if (payload.file) {
      formData.append("file", {
        uri: payload.file.uri,
        name: payload.file.name,
        type: payload.file.type,
      });
    }

    const res = await apiClient.post(
      `/teacher/homework/update/${payload.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: true,
      message: res.data.message || "Homework updated successfully",
      data: res.data.data || null,
    };

  } catch (error) {

    console.log("Update Homework API Error:", error);

    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to update homework",
      data: null,
    };
  }
};

/* =====================================================
   DELETE HOMEWORK
===================================================== */

const deleteHomework = async (homeworkId) => {

  try {

    const res = await apiClient.post(
      `/teacher/homework/delete/${homeworkId}`
    );

    return {
      success: true,
      message: res.data.message || "Homework deleted successfully",
      data: res.data.data || null,
    };

  } catch (error) {

    console.log("Delete Homework API Error:", error);

    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to delete homework",
      data: null,
    };
  }
};


/* =====================================================
   GET STUDENTS FOR ATTENDANCE
===================================================== */

const getAttendanceStudents = async (class_mapping_id) => {

  try {

    const res = await apiClient.get(
      `/teacher/attendance/students/${class_mapping_id}`
    );

    const students = (res.data.students || []).map((item) => ({
      id: item.id,
      name: item.name,
      roll_no: item.roll_no,
    }));

    return {
      success: true,
      students,
    };

  } catch (error) {

    console.log("Attendance Students API Error:", error);
    console.log("Response:", error?.response?.data);

    return {
      success: false,
      students: [],
    };

  }

};

/* =====================================================
   STORE ATTENDANCE (Teacher)
===================================================== */

const storeAttendance = async (payload) => {

  try {

    const res = await apiClient.post(
      "/teacher/attendance/store",
      payload
    );

    return {
      success: true,
      message: res?.data?.message || "Attendance saved successfully",
      data: res?.data?.data || null,
    };

  } catch (error) {

    console.log("Store Attendance API Error:", error);
    console.log("Response:", error?.response?.data);

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Failed to submit attendance",
      data: null,
    };

  }

};


/* =====================================================
   GET ATTENDANCE LIST (CLASS WISE)
===================================================== */

const getAttendanceList = async (class_mapping_id) => {
  try {

    const res = await apiClient.get(
      `/teacher/attendance/list/${class_mapping_id}`
    );

    const data = res.data || {};

    const attendanceList = (data.attendance || []).map((item) => {

      // ✅ calculate present / absent count
      const total = item.details?.length || 0;
      const presentCount = (item.details || []).filter(
        (d) => d.status === "Present"
      ).length;

      const absentCount = total - presentCount;

      return {
        id: item.id,
        class_mapping_id: item.class_mapping_id,
        class_name: `${item.class_name} ${item.section}`,
        date: item.date,

        total,
        present: presentCount,
        absent: absentCount,
      };
    });

    return {
      success: true,
      attendanceList,
    };

  } catch (error) {

    console.log("Attendance List API Error:", error);
    console.log("Response:", error?.response?.data);

    return {
      success: false,
      attendanceList: [],
    };

  }
};


/* =====================================================
   GET ATTENDANCE DETAIL (FULL DETAIL VIEW)
===================================================== */

const getAttendanceFullDetail = async (attendanceId) => {
  try {

    const res = await apiClient.get(
      `/teacher/attendance/detail/${attendanceId}`
    );

    const data = res.data || {};
    const attendance = data.attendance || null;

    return {
      success: true,

      attendance: attendance
        ? {
            id: attendance.id,
            class_mapping_id: attendance.class_mapping_id,
            class_name: `${attendance.class_name} ${attendance.section}`,
            date: attendance.date,
            status: attendance.status,
          }
        : null,

      students: (attendance?.details || []).map((item) => ({
        id: item.id,
        student_id: item.student_id,
        name: item.student?.name,
        roll_no: item.student?.sr_no, // ⚠️ important mapping
        status: item.status,
        remark: item.remark,
        image: item.student?.image
          ? `https://theschoolmate.in/${item.student.image}`
          : null,
      })),
    };

  } catch (error) {

    console.log("Attendance Full Detail API Error:", error);
    console.log("Response:", error?.response?.data);

    return {
      success: false,
      attendance: null,
      students: [],
    };

  }
};


/* =====================================================
   GET ATTENDANCE DETAIL (EDIT)
===================================================== */

const editAttendanceDetail = async (attendanceId) => {
  try {

    const res = await apiClient.get(
      `/teacher/attendance/edit/${attendanceId}`
    );

    const data = res.data || {};

    return {
      success: true,

      attendance: data.attendance
        ? {
            master_id: data.attendance.master_id,
            class_mapping_id: data.attendance.class_mapping_id,
            date: data.attendance.date,
          }
        : null,

      students: (data.students || []).map((item) => ({
        student_id: item.student_id,
        name: item.name,
        roll_no: item.roll_no,
        status: item.status, // Present / Absent
        remark: item.remark,
      })),
    };

  } catch (error) {

    console.log("Attendance Detail API Error:", error);
    console.log("Response:", error?.response?.data);

    return {
      success: false,
      attendance: null,
      students: [],
    };

  }
};


const updateAttendance = async (attendanceId, payload) => {

  try {

    console.log("📤 Updating Attendance ID:", attendanceId);
    console.log("📤 Payload:", JSON.stringify(payload, null, 2));

    const res = await apiClient.post(
      `/teacher/attendance/update/${attendanceId}`,
      payload
    );

    console.log("📥 Update Response:", res?.data);

    return {
      success: true,
      message: res?.data?.message || "Attendance updated successfully",
      data: res?.data?.data || null,
    };

  } catch (error) {

    console.log("❌ Update Attendance API Error:", error);
    console.log("❌ Response:", error?.response?.data);

    return {
      success: false,
      message:
        error?.response?.data?.message || "Failed to update attendance",
      data: null,
    };

  }
};



/* =====================================================
   TOAST
===================================================== */

const showToast = (message) => {

  Toast.show({
    type: "success",
    text1: message,
    visibilityTime: 5000,
  });

};

/* =====================================================
   EXPORT
===================================================== */

const commanServices = {
  showToast,
  getSlider,
  getNotifications,
  submitFeedback,
  getTeacherClasses,
  getClassSubjects,
  submitHomeworkData,
  getTeacherHomeworks,
  getHomeworkDetail,
  updateHomeworkData,
  deleteHomework,
  getAttendanceStudents,
  storeAttendance,
  getAttendanceFullDetail,
  getAttendanceList,
  editAttendanceDetail,
  updateAttendance,
};

export default commanServices;