import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Modal,
    Image,
    ActivityIndicator
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { FileText, X, Pencil, Trash2, BookOpen } from "lucide-react-native";
import Pdf from "react-native-pdf";

import { useNavigation } from "@react-navigation/native";

import AppHeader from "../../components/AppHeader";
import EmptyState from "../../components/EmptyState";
import commanServices from "../../redux/services/commanServices";

import {
    useTheme,
    Spacing,
    BorderRadius,
    FontSizes,
} from "../../theme/theme";

const GetHomeWorks = () => {

    const navigation = useNavigation();
    const { colors } = useTheme();

    const [homeworks, setHomeworks] = useState([]);
    const [classSubjects, setClassSubjects] = useState([]);

    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);

    const [refreshing, setRefreshing] = useState(false);

    /* ================= PDF MODAL ================= */

    const [pdfModal, setPdfModal] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    /* ================= DELETE MODAL ================= */

    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const isImage = (url) => {
        return url?.match(/\.(jpeg|jpg|png|gif|webp)$/i);
    };

    /* ================= FETCH HOMEWORK ================= */

    const fetchHomeworks = async () => {

        setRefreshing(true);

        try {

            const res = await commanServices.getTeacherHomeworks();

            if (res.success) {
                setHomeworks(res.homeworks || []);
                setClassSubjects(res.classSubjects || []);
            }

        } catch (error) {
            console.log("Fetch Homework Error:", error);
        }

        setRefreshing(false);
    };

    useEffect(() => {
        fetchHomeworks();
    }, []);

    /* ================= DELETE HOMEWORK ================= */

    const handleDeleteHomework = async () => {

        if (!deleteId) return;

        setDeleteLoading(true);

        try {

            const res = await commanServices.deleteHomework(deleteId);

            if (res.success) {

                setHomeworks((prev) =>
                    prev.filter((item) => item.id !== deleteId)
                );

                setDeleteModal(false);
                setDeleteId(null);
            }

        } catch (error) {
            console.log("Delete Homework Error:", error);
        }

        setDeleteLoading(false);
    };

    /* ================= FILTER ================= */

    const filteredHomeworks = homeworks.filter((item) => {

        if (selectedClass && item.class_mapping_id !== selectedClass) return false;

        if (selectedSubject && item.subject_id !== selectedSubject) return false;

        return true;
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <AppHeader title="Homeworks" />
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchHomeworks} />
                }
            >

                {/* ================= CLASS FILTER ================= */}

                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                    Filter by Class
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                    <TouchableOpacity
                        style={[
                            styles.filterBtn,
                            {
                                backgroundColor:
                                    selectedClass === null
                                        ? colors.primary
                                        : colors.cardBackground,
                            },
                        ]}
                        onPress={() => {
                            setSelectedClass(null);
                            setSelectedSubject(null);
                        }}
                    >
                        <Text style={{
                            color: colors.textPrimary, fontSize: FontSizes.small,
                            fontFamily: 'Quicksand-Bold',
                        }}>All</Text>
                    </TouchableOpacity>

                    {classSubjects.map((item) => (

                        <TouchableOpacity
                            key={item.class_mapping_id}
                            style={[
                                styles.filterBtn,
                                {
                                    backgroundColor:
                                        selectedClass === item.class_mapping_id
                                            ? colors.primary
                                            : colors.cardBackground,
                                },
                            ]}
                            onPress={() => {
                                setSelectedClass(item.class_mapping_id);
                                setSelectedSubject(null);
                            }}
                        >

                            <Text style={{
                                color: colors.textPrimary, fontSize: FontSizes.small,
                                fontFamily: 'Quicksand-Bold',
                            }}>
                                {item.class_name}
                            </Text>

                        </TouchableOpacity>
                    ))}

                </ScrollView>

                {/* ================= SUBJECT FILTER ================= */}

                {selectedClass && (

                    <>
                        <Text style={[styles.sectionTitleBS, { color: colors.textPrimary }]}>
                            Filter by Subject
                        </Text>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                            <TouchableOpacity
                                style={[
                                    styles.filterBtn,
                                    {
                                        backgroundColor:
                                            selectedSubject === null
                                                ? colors.primary
                                                : colors.cardBackground,
                                    },
                                ]}
                                onPress={() => setSelectedSubject(null)}
                            >
                                <Text
                                    style={{
                                        color:
                                            selectedSubject === null
                                                ? "#fff"
                                                : colors.textPrimary,
                                    }}
                                >
                                    All
                                </Text>
                            </TouchableOpacity>

                            {classSubjects
                                .find((c) => c.class_mapping_id === selectedClass)
                                ?.subjects?.map((sub) => (
                                    <TouchableOpacity
                                        key={sub.subject_id}
                                        style={[
                                            styles.filterBtn,
                                            {
                                                backgroundColor:
                                                    selectedSubject === sub.subject_id
                                                        ? colors.primary
                                                        : colors.cardBackground,
                                            },
                                        ]}
                                        onPress={() => setSelectedSubject(sub.subject_id)}
                                    >

                                        <Text style={{ color: colors.textPrimary }}>
                                            {sub.subject_name}
                                        </Text>
                                    </TouchableOpacity>

                                ))}

                        </ScrollView>
                    </>
                )}

                {/* ================= HOMEWORK LIST ================= */}

                {filteredHomeworks.map((item) => (

                    <View
                        key={item.id}
                        style={[styles.card, { backgroundColor: colors.cardBackground }]}
                    >

                        <View style={styles.headerRow}>

                            <Text style={[styles.title, { color: colors.textPrimary }]}>
                                {item.title}
                            </Text>

                            <View style={{ flexDirection: "row" }}>

                                <TouchableOpacity
                                    style={{ marginRight: 10 }}
                                    onPress={() =>
                                        navigation.navigate("EditHomeWork", {
                                            homeworkId: item.id,
                                        })
                                    }
                                >
                                    <Pencil size={18} color={colors.primary} />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => {
                                        setDeleteId(item.id);
                                        setDeleteModal(true);
                                    }}
                                >
                                    <Trash2 size={18} color="#ff4444" />
                                </TouchableOpacity>

                            </View>

                        </View>

                        <Text style={{ color: colors.textSecondary }}>
                            {item.class_name} • {item.subject_name}
                        </Text>

                        <Text style={{ color: colors.textSecondary }}>
                            {item.homework_date}
                        </Text>

                        {item.file_url && (

                            <TouchableOpacity
                                style={styles.fileRow}
                                onPress={() => {
                                    setPdfUrl(item.file_url);
                                    setPdfModal(true);
                                }}
                            >
                                <FileText size={18} color={colors.primary} />

                                <Text style={{ marginLeft: 6, color: colors.primary }}>
                                    View Attachment
                                </Text>

                            </TouchableOpacity>

                        )}

                    </View>

                ))}

                {filteredHomeworks.length === 0 && (
                    <EmptyState
                        icon={BookOpen}
                        title="No Homework Found"
                        iconColor={colors.textSecondary}
                        animationType="bounce"
                    />
                )}

            </ScrollView>

            {/* ================= PDF MODAL ================= */}

            <Modal visible={pdfModal} animationType="slide">

                <View style={{ flex: 1, backgroundColor: "#000" }}>

                    <View style={styles.modalHeader}>

                        <Text style={{ color: "#fff", fontSize: 16 }}>
                            Homework Attachment
                        </Text>

                        <TouchableOpacity onPress={() => setPdfModal(false)}>
                            <X size={22} color="#fff" />
                        </TouchableOpacity>

                    </View>

                    {pdfUrl && (

                        isImage(pdfUrl) ? (

                            <Image
                                source={{ uri: pdfUrl }}
                                style={{ flex: 1 }}
                                resizeMode="contain"
                            />

                        ) : (

                            <Pdf
                                source={{ uri: pdfUrl }}
                                style={{ flex: 1 }}
                                trustAllCerts={false}
                            />

                        )

                    )}

                </View>

            </Modal>

            {/* ================= DELETE CONFIRM MODAL ================= */}

            <Modal
                visible={deleteModal}
                transparent
                animationType="fade"
            >

                <View style={styles.deleteOverlay}>

                    <View style={[styles.deleteBox, { backgroundColor: colors.cardBackground }]}>

                        <Text style={[styles.deleteTitle, { color: colors.textPrimary }]}>
                            Delete Homework
                        </Text>

                        <Text style={{ color: colors.textSecondary, marginBottom: 20 }}>
                            Are you sure you want to delete this homework?
                        </Text>

                        <View style={styles.deleteActions}>

                            <TouchableOpacity
                                style={[styles.cancelBtn]}
                                onPress={() => setDeleteModal(false)}
                            >
                                <Text>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.deleteBtn]}
                                onPress={handleDeleteHomework}
                                disabled={deleteLoading}
                            >

                                {deleteLoading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={{ color: "#fff" }}>Delete</Text>
                                )}

                            </TouchableOpacity>

                        </View>

                    </View>

                </View>

            </Modal>

        </SafeAreaView>
    );
};

export default GetHomeWorks;


/* ================= STYLES ================= */

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    content: {
        padding: 16,
        paddingBottom: 100,
    },

    sectionTitle: {
        fontSize: FontSizes.small,
        fontFamily: 'Quicksand-Medium',
        marginBottom: 8,
        marginTop: 0,
    },
    sectionTitleBS: {
        fontSize: FontSizes.small,
        fontFamily: 'Quicksand-Medium',
        marginBottom: 8,
        marginTop: 10,
    },

    filterBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: BorderRadius.large,
        marginRight: 8,

    },

    card: {
        padding: 16,
        borderRadius: BorderRadius.large,
        marginTop: 14,
    },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 4,
    },

    title: {
        fontSize: FontSizes.normal,
        fontFamily: "Quicksand-Bold",
        textTransform: 'capitalize',
    },

    fileRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },

    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#111",
    },

    deleteOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    deleteBox: {
        width: "85%",
        padding: 20,
        borderRadius: BorderRadius.large,
    },

    deleteTitle: {
        fontSize: 18,
        fontFamily: "Quicksand-Bold",
        marginBottom: 8,
    },

    deleteActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },

    cancelBtn: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 10,
    },

    deleteBtn: {
        backgroundColor: "#ff4444",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
});