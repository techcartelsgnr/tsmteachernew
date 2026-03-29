// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   ActivityIndicator,
//   Image,
// } from "react-native";

// import AppHeader from "../../components/AppHeader";
// import commanServices from "../../redux/services/commanServices";

// import {
//   useTheme,
//   Spacing,
//   BorderRadius,
//   FontSizes,
//   TextStyles,
//   ThemeUtils,
// } from "../../theme/theme";

// const GetFullAttendanceDetails = ({ route }) => {
//   const { attendanceId } = route.params || {};

//   const { colors } = useTheme();

//   const [loading, setLoading] = useState(true);
//   const [attendance, setAttendance] = useState(null);
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     fetchAttendance();
//   }, []);

//   const fetchAttendance = async () => {
//     setLoading(true);

//     const res = await commanServices.getAttendanceFullDetail(attendanceId);

//     if (res.success) {
//       setAttendance(res.attendance);
//       setStudents(res.students);
//     }

//     setLoading(false);
//   };

//   /* ================= RENDER STUDENT ================= */

//   const renderItem = ({ item, index }) => {
//     const isPresent = item.status === "Present";

//     return (
//       <View
//         style={[
//           styles.card,
//           {
//             backgroundColor: colors.cardBackground,
//             borderColor: colors.border,
//           },
//         ]}
//       >
//         {/* LEFT: IMAGE */}
//         <View style={styles.left}>
//           {item.image ? (
//             <Image source={{ uri: item.image }} style={styles.avatar} />
//           ) : (
//             <View
//               style={[
//                 styles.avatar,
//                 {
//                   backgroundColor: ThemeUtils.withOpacity(
//                     colors.primary,
//                     0.2
//                   ),
//                 },
//               ]}
//             >
//               <Text style={{ color: colors.primary }}>
//                 {item.name?.charAt(0)}
//               </Text>
//             </View>
//           )}
//         </View>

//         {/* CENTER: INFO */}
//         <View style={styles.center}>
//           <Text
//             style={[
//               TextStyles.title,
//               { color: colors.textPrimary },
//             ]}
//           >
//             {item.name}
//           </Text>

//           <Text
//             style={[
//               TextStyles.caption,
//               { color: colors.textSecondary },
//             ]}
//           >
//             Roll No: {item.roll_no}
//           </Text>

//           {item.remark ? (
//             <Text
//               style={[
//                 TextStyles.caption,
//                 { color: colors.textTertiary },
//               ]}
//             >
//               Remark: {item.remark}
//             </Text>
//           ) : null}
//         </View>

//         {/* RIGHT: STATUS */}
//         <View
//           style={[
//             styles.statusBadge,
//             {
//               backgroundColor: isPresent
//                 ? ThemeUtils.withOpacity(colors.success, 0.2)
//                 : ThemeUtils.withOpacity(colors.error, 0.2),
//             },
//           ]}
//         >
//           <Text
//             style={[
//               TextStyles.caption,
//               {
//                 color: isPresent ? colors.success : colors.error,
//               },
//             ]}
//           >
//             {item.status}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   /* ================= LOADING ================= */

//   if (loading) {
//     return (
//       <View style={{ flex: 1, backgroundColor: colors.background }}>
//         <AppHeader title="Attendance Details" />

//         <View style={styles.loaderContainer}>
//           <ActivityIndicator size="large" color={colors.primary} />
//         </View>
//       </View>
//     );
//   }

//   /* ================= MAIN ================= */

//   return (
//     <View
//       style={[
//         styles.container,
//         { backgroundColor: colors.background },
//       ]}
//     >
//       <AppHeader title="Attendance Details" />

//       {/* HEADER INFO */}
//       {attendance && (
//         <View
//           style={[
//             styles.headerCard,
//             {
//               backgroundColor: colors.cardBackground,
//               borderColor: colors.border,
//             },
//           ]}
//         >
//           <Text
//             style={[
//               TextStyles.title,
//               { color: colors.textPrimary },
//             ]}
//           >
//             {attendance.class_name}
//           </Text>

//           <Text
//             style={[
//               TextStyles.caption,
//               { color: colors.textSecondary },
//             ]}
//           >
//             Date: {attendance.date}
//           </Text>
//         </View>
//       )}

//       {/* LIST */}
//       <FlatList
//         data={students}
//         keyExtractor={(item) => item.student_id.toString()}
//         renderItem={renderItem}
//         contentContainerStyle={{
//           padding: Spacing.md,
//           paddingBottom: Spacing.xl,
//         }}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// export default GetFullAttendanceDetails;

// /* =====================================================
//    STYLES
// ===================================================== */

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   headerCard: {
//     margin: Spacing.md,
//     padding: Spacing.md,
//     borderRadius: BorderRadius.large,
//     borderWidth: 1,
//   },

//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: Spacing.md,
//     borderRadius: BorderRadius.large,
//     borderWidth: 1,
//     marginBottom: Spacing.sm,
//   },

//   left: {
//     marginRight: Spacing.md,
//   },

//   center: {
//     flex: 1,
//   },

//   avatar: {
//     width: 45,
//     height: 45,
//     borderRadius: 50,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   statusBadge: {
//     paddingHorizontal: Spacing.sm,
//     paddingVertical: 4,
//     borderRadius: BorderRadius.pill,
//   },
// });


import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import AppHeader from "../../components/AppHeader";
import commanServices from "../../redux/services/commanServices";

import {
  useTheme,
  Spacing,
  BorderRadius,
  FontSizes,
  TextStyles,
  ThemeUtils,
} from "../../theme/theme";

const GetFullAttendanceDetails = ({ route }) => {
  const { attendanceId } = route.params || {};

  const { colors } = useTheme();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);

    const res = await commanServices.getAttendanceFullDetail(attendanceId);

    console.log("📥 Full Attendance Detail:", res);

    if (res.success) {
      setAttendance(res.attendance);
      setStudents(res.students);
    }

    setLoading(false);
  };

  /* ================= EDIT CONDITION ================= */

  const todayDate = new Date().toISOString().split("T")[0];
  const isToday = attendance?.date === todayDate;

  /* ================= HANDLE EDIT ================= */

  const handleEdit = () => {

    console.log("✏️ Editing Attendance ID:", attendance?.id);

    navigation.navigate("AttendanceScreen", {
      attendanceId: attendance?.id,
      class_mapping_id: attendance?.class_mapping_id,
    });
  };

  /* ================= RENDER STUDENT ================= */

  const renderItem = ({ item }) => {
    const isPresent = item.status === "Present";

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
          },
        ]}
      >
        {/* LEFT: IMAGE */}
        <View style={styles.left}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: ThemeUtils.withOpacity(
                    colors.primary,
                    0.2
                  ),
                },
              ]}
            >
              <Text style={{ color: colors.primary }}>
                {item.name?.charAt(0)}
              </Text>
            </View>
          )}
        </View>

        {/* CENTER: INFO */}
        <View style={styles.center}>
          <Text
            style={[
              TextStyles.title,
              { color: colors.textPrimary },
            ]}
          >
            {item.name}
          </Text>

          <Text
            style={[
              TextStyles.caption,
              { color: colors.textSecondary },
            ]}
          >
            Roll No: {item.roll_no}
          </Text>

          {item.remark ? (
            <Text
              style={[
                TextStyles.caption,
                { color: colors.textTertiary },
              ]}
            >
              Remark: {item.remark}
            </Text>
          ) : null}
        </View>

        {/* RIGHT: STATUS */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: isPresent
                ? ThemeUtils.withOpacity(colors.success, 0.2)
                : ThemeUtils.withOpacity(colors.error, 0.2),
            },
          ]}
        >
          <Text
            style={[
              TextStyles.caption,
              {
                color: isPresent ? colors.success : colors.error,
              },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppHeader title="Attendance Details" />

        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  /* ================= MAIN ================= */

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* HEADER WITH EDIT BUTTON */}
      <AppHeader
        title="Attendance Details"
      />

      {/* HEADER INFO */}
      {attendance && (
        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <View>
            <Text
              style={[
                TextStyles.title,
                { color: colors.textPrimary },
              ]}
            >
              {attendance.class_name}
            </Text>

            <Text
              style={[
                TextStyles.caption,
                { color: colors.textSecondary },
              ]}
            >
              Date: {attendance.date}
            </Text>
          </View>

          <View>
            <TouchableOpacity onPress={handleEdit} disabled={!isToday}>
              <Text
                style={{
                  color: isToday ? colors.primary : colors.textSecondary,
                  fontWeight: "600",
                  opacity: isToday ? 1 : 0.4, // optional fade effect
                }}
              >
                {isToday ? "Edit" : ""}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}



      {/* LIST */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.student_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: Spacing.md,
          paddingBottom: Spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default GetFullAttendanceDetails;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerCard: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    marginBottom: Spacing.sm,
  },

  left: {
    marginRight: Spacing.md,
  },

  center: {
    flex: 1,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.pill,
  },
});