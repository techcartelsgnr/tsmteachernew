// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     FlatList,
//     TouchableOpacity,
//     StatusBar,
//     Switch,
//     Alert,
// } from 'react-native';

// import { SafeAreaView } from 'react-native-safe-area-context';
// import { ChevronLeft } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useSelector } from 'react-redux';

// import commanServices from '../../redux/services/commanServices';

// import {
//     useTheme,
//     Spacing,
//     BorderRadius,
//     DeviceSize,
//     Fonts,
//     TextStyles,
//     FontSizes,
// } from '../../theme/theme';

// const AttendanceScreen = ({ route }) => {

//     const { class_mapping_id } = route.params || {};

//     const { colors, isDarkMode } = useTheme();
//     const navigation = useNavigation();

//     const [students, setStudents] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const todayDate = new Date().toISOString().split("T")[0];

//     /* =====================================================
//        FETCH STUDENTS
//     ===================================================== */

//     // const fetchStudents = async () => {

//     //     try {

//     //         const res = await commanServices.getAttendanceStudents(class_mapping_id);

//     //         if (res.success) {

//     //             const formatted = res.students.map((item) => ({
//     //                 id: item.id,
//     //                 name: item.name,
//     //                 roll: item.roll_no,
//     //                 status: "Present",
//     //                 remark: null
//     //             }));

//     //             setStudents(formatted);
//     //         }

//     //     } catch (error) {
//     //         console.log("Students fetch error:", error);
//     //     }

//     // };

//     const fetchStudents = async () => {

//     try {

//         // ✅ FIRST CHECK TODAY ATTENDANCE
//         const listRes = await commanServices.getAttendanceList(class_mapping_id);

//         console.log("📥 Checking Today's Attendance:", listRes);

//         if (listRes.success) {

//             const alreadySubmitted = listRes.attendanceList.find(
//                 (item) => item.date === todayDate
//             );

//             // 🚫 IF ALREADY SUBMITTED → REDIRECT
//             if (alreadySubmitted) {

//                 console.log("⛔ Attendance already submitted for today");

//                 Alert.alert("Already Submitted", "Today's attendance already marked");

//                 navigation.replace("GetAllAttendance", {
//                     class_mapping_id: class_mapping_id
//                 });

//                 return; // ⛔ STOP EXECUTION
//             }
//         }

//         // ✅ IF NOT SUBMITTED → LOAD STUDENTS
//         const res = await commanServices.getAttendanceStudents(class_mapping_id);

//         if (res.success) {

//             const formatted = res.students.map((item) => ({
//                 id: item.id,
//                 name: item.name,
//                 roll: item.roll_no,
//                 status: "Present",
//                 remark: null
//             }));

//             setStudents(formatted);
//         }

//     } catch (error) {
//         console.log("Students fetch error:", error);
//     }

// };

//     useEffect(() => {
//         fetchStudents();
//     }, []);

//     /* =====================================================
//        SUMMARY
//     ===================================================== */

//     const presentCount = students.filter(s => s.status === "Present").length;
//     const absentCount = students.length - presentCount;

//     /* =====================================================
//        TOGGLE ATTENDANCE
//     ===================================================== */

//     const toggleAttendance = (studentId) => {

//         setStudents(prev =>
//             prev.map(item =>
//                 item.id === studentId
//                     ? {
//                         ...item,
//                         status: item.status === "Present" ? "Absent" : "Present"
//                     }
//                     : item
//             )
//         );

//     };

//     /* =====================================================
//        SUBMIT ATTENDANCE
//     ===================================================== */

//     // inside submitAttendance()

// const submitAttendance = async () => {

//     setLoading(true);

//     try {

//         const payload = {
//             class_mapping_id: class_mapping_id,
//             date: todayDate,
//             students: students.map((s) => ({
//                 student_id: s.id,
//                 status: s.status,
//                 remark: s.remark
//             }))
//         };

//         // ✅ LOG PAYLOAD
//         console.log("📤 Attendance Payload:", payload);

//         const res = await commanServices.storeAttendance(payload);

//         // ✅ LOG RESPONSE
//         console.log("📥 Attendance Response:", res);

//         if (res.success) {

//             console.log("✅ Submitted Students:", payload.students.length);

//             // ✅ SHOW TOAST / ALERT
//             Alert.alert("Success", res.message);

//             // ✅ NAVIGATE WITH REFRESH FLAG
//             navigation.navigate("GetAllAttendance", {
//                 refresh: true,
//                 class_mapping_id: class_mapping_id
//             });

//         } else {

//             Alert.alert("Error", res.message);

//         }

//     } catch (error) {

//         console.log("❌ Attendance submit error:", error);

//     }

//     setLoading(false);
// };

//     return (

//         <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

//             <StatusBar
//                 barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//                 backgroundColor={colors.primary}
//             />

//             {/* HEADER */}

//             <View style={[styles.header, { backgroundColor: colors.primary }]}>

//                 <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <ChevronLeft size={22} color="#fff" />
//                 </TouchableOpacity>

//                 <View>
//                     <Text style={styles.headerDate}>{todayDate}</Text>
//                     <Text style={styles.headerTitle}>Take Attendance</Text>
//                 </View>

//                 <View style={styles.headerCircle} />

//             </View>

//             {/* SUMMARY */}

//             <View style={styles.summaryRow}>

//                 <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
//                     <Text style={[styles.summaryNumber, { color: colors.success }]}>
//                         {presentCount}
//                     </Text>
//                     <Text style={{ color: colors.textSecondary, ...TextStyles.caption }}>
//                         Present
//                     </Text>
//                 </View>

//                 <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
//                     <Text style={[styles.summaryNumber, { color: colors.error }]}>
//                         {absentCount}
//                     </Text>
//                     <Text style={{ color: colors.textSecondary, ...TextStyles.caption }}>
//                         Absent
//                     </Text>
//                 </View>

//             </View>

//             {/* TABLE HEADER */}

//             <View style={[styles.tableHeader, { borderBottomColor: colors.divider }]}>

//                 <Text style={[styles.th, { color: colors.textSecondary, flex: 0.6 }]}>
//                     S.No
//                 </Text>

//                 <Text style={[styles.th, { color: colors.textSecondary, flex: 2 }]}>
//                     Name
//                 </Text>

//                 <Text style={[styles.th, { color: colors.textSecondary, flex: 1 }]}>
//                     Roll
//                 </Text>

//                 <Text style={[styles.th, { color: colors.textSecondary, flex: 1, textAlign: 'left' }]}>
//                     Status
//                 </Text>

//             </View>

//             {/* LIST */}

//             <FlatList
//                 data={students}
//                 keyExtractor={(item) => item.id.toString()}
//                 contentContainerStyle={{ paddingBottom: 120 }}
//                 renderItem={({ item, index }) => (

//                     <View style={[styles.row, { borderBottomColor: colors.divider }]}>

//                         <Text style={[styles.cell, { flex: 0.6, color: colors.textSecondary }]}>
//                             {index + 1}
//                         </Text>

//                         <Text style={[styles.cell, { flex: 2, color: colors.textPrimary }]}>
//                             {item.name}
//                         </Text>

//                         <Text style={[styles.cell, { flex: 1, color: colors.textSecondary }]}>
//                             {item.roll}
//                         </Text>

//                         <View style={styles.statusWrap}>

//                             <Switch
//                                 value={item.status === "Present"}
//                                 onValueChange={() => toggleAttendance(item.id)}
//                                 trackColor={{
//                                     false: '#fca5a5',
//                                     true: '#86efac',
//                                 }}
//                                 thumbColor="#fff"
//                             />

//                             <Text
//                                 style={{
//                                     fontSize: 12,
//                                     marginHorizontal: 5,
//                                     color: item.status === "Present" ? colors.success : colors.error,
//                                     fontFamily: Fonts.quicksand.bold,
//                                 }}
//                             >
//                                 {item.status}
//                             </Text>

//                         </View>

//                     </View>

//                 )}
//             />

//             {/* SUBMIT BUTTON */}

//             <View style={styles.footer}>

//                 <TouchableOpacity
//                     style={[styles.submitBtn, { backgroundColor: colors.primary }]}
//                     activeOpacity={0.9}
//                     onPress={submitAttendance}
//                 >
//                     <Text style={styles.submitText}>
//                         Confirm & Submit Attendance
//                     </Text>
//                 </TouchableOpacity>

//             </View>

//         </SafeAreaView>
//     );
// };

// export default AttendanceScreen;

// /* =====================================================
//    STYLES
// ===================================================== */

// const styles = StyleSheet.create({

//     container: { flex: 1, paddingBottom: 80 },

//     header: {
//         paddingBottom: Spacing.md,
//         paddingHorizontal: Spacing.md,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         borderBottomLeftRadius: BorderRadius.xl,
//         borderBottomRightRadius: BorderRadius.xl,
//     },

//     headerDate: { color: '#fff', fontSize: 12 },
//     headerTitle: { color: '#fff', fontSize: 15 },

//     headerCircle: {
//         width: 34,
//         height: 34,
//         borderRadius: 17,
//         backgroundColor: '#ffffff40',
//     },

//     summaryRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         marginTop: 20,
//         paddingHorizontal: Spacing.md,
//     },

//     summaryCard: {
//         width: '42%',
//         borderRadius: BorderRadius.large,
//         paddingVertical: Spacing.md,
//         alignItems: 'center',
//     },

//     summaryNumber: { fontSize: 22 },

//     tableHeader: {
//         flexDirection: 'row',
//         padding: Spacing.sm,
//         borderBottomWidth: 1,
//         marginTop: Spacing.md,
//         marginHorizontal: Spacing.tn,
//     },

//     th: { fontSize: 12, fontWeight: '600' },

//     row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: Spacing.sm,
//         borderBottomWidth: 1,
//         marginHorizontal: Spacing.tn,
//     },

//     cell: {
//         fontFamily: Fonts.quicksand.bold,
//         fontSize: FontSizes.xsmall,
//     },

//     statusWrap: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         flexDirection: 'row'
//     },

//     footer: {
//         position: 'absolute',
//         bottom: 0,
//         width: '100%',
//         padding: Spacing.md,
//     },

//     submitBtn: {
//         height: DeviceSize.hp(6),
//         borderRadius: BorderRadius.large,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },

//     submitText: {
//         color: '#fff',
//         fontSize: 15,
//         fontWeight: '600',
//     },

// });

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Switch,
    Alert,
} from 'react-native';

import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

import commanServices from '../../redux/services/commanServices';

import {
    useTheme,
    Spacing,
    BorderRadius,
    DeviceSize,
    FontSizes,
    Fonts,
} from '../../theme/theme';


const AttendanceScreen = ({ route }) => {

    const { attendanceId, class_mapping_id } = route.params || {};
    const isEditMode = !!attendanceId;

    const insets = useSafeAreaInsets();

    const { colors, isDarkMode } = useTheme();
    const navigation = useNavigation();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    const todayDate = new Date().toISOString().split("T")[0];

    /* =====================================================
       LOAD DATA
    ===================================================== */

    useEffect(() => {
        if (isEditMode) {
            loadEditData();
        } else {
            fetchStudents();
        }
    }, []);

    /* =====================================================
       FETCH STUDENTS (ADD MODE)
    ===================================================== */

    const fetchStudents = async () => {

        try {

            if (!isEditMode) {

                const listRes = await commanServices.getAttendanceList(class_mapping_id);

                const alreadySubmitted = listRes.attendanceList?.find(
                    (item) => item.date === todayDate
                );

                if (alreadySubmitted) {

                    Alert.alert("Already Submitted", "Today's attendance already marked");

                    navigation.replace("GetAllAttendance", {
                        class_mapping_id
                    });

                    return;
                }
            }

            const res = await commanServices.getAttendanceStudents(class_mapping_id);

            if (res.success) {

                const formatted = res.students.map((item) => ({
                    id: item.id,
                    name: item.name,
                    roll: item.roll_no,
                    status: "Present",
                    remark: null
                }));

                setStudents(formatted);
            }

        } catch (error) {
            console.log("❌ Students fetch error:", error);
        }
    };

    /* =====================================================
       LOAD EDIT DATA
    ===================================================== */

    const loadEditData = async () => {

        try {

            const res = await commanServices.editAttendanceDetail(attendanceId);

            console.log("📥 Edit Data:", res);

            if (res.success) {

                const formatted = res.students.map((item) => ({
                    id: item.student_id,
                    name: item.name,
                    roll: item.roll_no,
                    status: item.status,
                    remark: item.remark
                }));

                setStudents(formatted);
            }

        } catch (error) {
            console.log("❌ Edit Load Error:", error);
        }
    };

    /* =====================================================
       SUMMARY
    ===================================================== */

    const presentCount = students.filter(s => s.status === "Present").length;
    const absentCount = students.length - presentCount;

    /* =====================================================
       TOGGLE
    ===================================================== */

    const toggleAttendance = (studentId) => {
        setStudents(prev =>
            prev.map(item =>
                item.id === studentId
                    ? {
                        ...item,
                        status: item.status === "Present" ? "Absent" : "Present"
                    }
                    : item
            )
        );
    };

    /* =====================================================
       SUBMIT / UPDATE
    ===================================================== */

    const submitAttendance = async () => {

        setLoading(true);

        try {

            const payload = {
                class_mapping_id,
                date: todayDate,
                students: students.map((s) => ({
                    student_id: s.id,
                    status: s.status,
                    remark: s.remark
                }))
            };

            console.log("📤 Final Payload:", payload);

            let res;

            if (isEditMode) {
                console.log("✏️ Updating Attendance...");
                res = await commanServices.updateAttendance(attendanceId, payload);
            } else {
                console.log("🆕 Creating Attendance...");
                res = await commanServices.storeAttendance(payload);
            }

            console.log("📥 API Response:", res);

            if (res.success) {

                Alert.alert("Success", res.message);

                navigation.navigate("GetAllAttendance", {
                    refresh: true,
                    class_mapping_id
                });

            } else {
                Alert.alert("Error", res.message);
            }

        } catch (error) {
            console.log("❌ Submit Error:", error);
        }

        setLoading(false);
    };

    return (
        <View style={[styles.container]}>
            {/* TOP SAFE AREA (STATUS BAR COLOR) */}
            <SafeAreaView edges={['top']} style={{ backgroundColor: colors.primary }} />
            <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, }}>
                <StatusBar
                    barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                    backgroundColor={colors.primary}
                />
                {/* HEADER */}
                <View style={[styles.header, { backgroundColor: colors.primary }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <ChevronLeft size={22} color="#fff" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.headerDate}>{todayDate}</Text>
                        <Text style={styles.headerTitle}>
                            {isEditMode ? "Edit Attendance" : "Take Attendance"}
                        </Text>
                    </View>
                    <View style={styles.headerCircle} />
                </View>
                {/* SUMMARY */}
                <View style={styles.summaryRow}>
                    <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
                        <Text style={[styles.summaryNumber, { color: colors.success }]}>
                            {presentCount}
                        </Text>
                        <Text style={[styles.pCountText, { color: colors.textSecondary }]}>
                            Present
                        </Text>
                    </View>
                    <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
                        <Text style={[styles.summaryNumber, { color: colors.error }]}>
                            {absentCount}
                        </Text>
                        <Text style={[styles.pCountText, { color: colors.textSecondary }]}>
                            Absent
                        </Text>
                    </View>
                </View>
                {/* LIST */}
                <View style={[styles.tableHeader, { borderBottomColor: colors.divider }]}>
                    <Text style={[styles.th, { color: colors.textSecondary, flex: 0.6 }]}>
                        S.No
                    </Text>
                    <Text style={[styles.th, { color: colors.textSecondary, flex: 1.8 }]}>
                        Name
                    </Text>
                    <Text style={[styles.th, { color: colors.textSecondary, flex: 0.8 }]}>
                        Roll
                    </Text>
                    <Text style={[styles.th, { color: colors.textSecondary, flex: 1.2, textAlign: 'left' }]}>
                        Status
                    </Text>
                </View>

                <FlatList
                    data={students}
                    keyExtractor={(item) => item.id.toString()}

                    renderItem={({ item, index }) => (

                        <View style={[styles.row, { borderBottomColor: colors.divider }]}>

                            <Text style={[styles.cell, { flex: 0.6 }]}>
                                {index + 1}
                            </Text>

                            <Text style={[styles.cell, { flex: 1.8 }]}>
                                {item.name}
                            </Text>

                            <Text style={[styles.cell, { flex: 0.8 }]}>
                                {item.roll}
                            </Text>

                            <View style={styles.statusWrap}>
                                <Switch
                                    value={item.status === "Present"}
                                    onValueChange={() => toggleAttendance(item.id)}
                                    trackColor={{ false: '#d1d5db', true: '#22c55e' }} // FIXED
                                    thumbColor="#fff"
                                    ios_backgroundColor="#d1d5db" // 🔥 IMPORTANT for iOS
                                    style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.8 }] }} // resize for iOS
                                />

                                <Text
                                    style={[styles.cell, {
                                        marginHorizontal: 0,

                                        color: item.status === "Present" ? colors.success : colors.error,
                                    }]}
                                >
                                    {item.status}
                                </Text>

                            </View>

                        </View>

                    )}
                />

                {/* SUBMIT BUTTON */}

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 }]}
                        onPress={submitAttendance}
                        disabled={loading}
                    >
                        <Text style={styles.submitText}>
                            {isEditMode ? "Update Attendance" : "Submit Attendance"}
                        </Text>
                    </TouchableOpacity>

                </View>

            </SafeAreaView>
        </View>

    );
};

export default AttendanceScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    container: { flex: 1, },

    header: {
        paddingBottom: Spacing.md,
        paddingHorizontal: Spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: BorderRadius.xl,
        borderBottomRightRadius: BorderRadius.xl,
    },

    headerDate: {
        color: '#fff',
        fontSize: 12,
        fontFamily: Fonts.quicksand.bold,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 15,
        fontFamily: Fonts.quicksand.bold,
    },

    headerCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#ffffff40',
    },

    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        paddingHorizontal: Spacing.md,
    },

    summaryCard: {
        width: '42%',
        borderRadius: BorderRadius.large,
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },

    summaryNumber: {
        fontFamily: Fonts.quicksand.bold,
        fontSize: FontSizes.medium,
    },

    pCountText: {
        fontFamily: Fonts.quicksand.bold,
        fontSize: FontSizes.medium,
    },
    statusWrap: {
        flex: 1.3,
        flexDirection: 'row',
        alignItems: 'center',
    },

    footer: {
        width: '100%',
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.md,


    },

    submitBtn: {
        height: DeviceSize.hp(6),
        borderRadius: BorderRadius.large,
        justifyContent: 'center',
        alignItems: 'center',
    },

    submitText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    tableHeader: {
        flexDirection: 'row',
        padding: Spacing.sm,
        borderBottomWidth: 1,
        marginTop: Spacing.md,
        marginHorizontal: Spacing.tn,
    },

    th: { fontSize: 12, fontWeight: '600' },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.sm,
        borderBottomWidth: 1,
        marginHorizontal: Spacing.tn,
    },

    cell: {
        fontFamily: Fonts.quicksand.bold,
        fontSize: FontSizes.xsmall,
    },


});