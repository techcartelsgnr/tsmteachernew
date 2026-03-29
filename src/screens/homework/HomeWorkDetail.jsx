import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { FileText, Download, X } from "lucide-react-native";
import Pdf from "react-native-pdf";

import { useSelector } from "react-redux";

import AppHeader from "../../components/AppHeader";
import commanServices from "../../redux/services/commanServices";

import {
  useTheme,
  BorderRadius,
  FontSizes,
} from "../../theme/theme";

const HomeWorkDetail = ({ route }) => {
  const { homeworkId } = route.params;

  const { token } = useSelector((state) => state.auth);
  const { colors } = useTheme();

  const [loading, setLoading] = useState(true);
  const [homework, setHomework] = useState(null);

  const [pdfModal, setPdfModal] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);

  /* ================================
     LOAD HOMEWORK DETAIL
  ================================= */

  useEffect(() => {
    fetchHomework();
  }, []);

  const fetchHomework = async () => {
    try {
      const res = await commanServices.getHomeworkDetail(token, homeworkId);

      if (res.success) {
        setHomework(res.homework);
      }
    } catch (error) {
      console.log("Homework Detail Error:", error);
    }

    setLoading(false);
  };

  /* ================================
     FILE TYPE CHECK
  ================================= */

  const isImage = (url) => {
    return url?.match(/\.(jpeg|jpg|png|gif|webp)$/i);
  };

  /* ================================
     OPEN FILE MODAL
  ================================= */

  const openFile = () => {
    if (homework?.file_url) {
      setFileUrl(homework.file_url);
      setPdfModal(true);
    }
  };

  /* ================================
     LOADING STATE
  ================================= */

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Homework Detail" />

        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!homework) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <AppHeader title="Homework Detail" />

        <View style={styles.loader}>
          <Text style={{ color: colors.textPrimary }}>No homework found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Homework Detail" />

      <ScrollView contentContainerStyle={styles.content}>

        {/* TITLE */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {homework.title}
        </Text>

        {/* CLASS */}
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Class
          </Text>

          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {homework.class_name}
          </Text>
        </View>

        {/* SUBJECT */}
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Subject
          </Text>

          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {homework.subject_name}
          </Text>
        </View>

        {/* DATE */}
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Date
          </Text>

          <Text style={[styles.value, { color: colors.textPrimary }]}>
            {homework.homework_date}
          </Text>
        </View>

        {/* DESCRIPTION */}
        {homework.short_description ? (
          <View style={styles.descriptionBox}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Description
            </Text>

            <Text style={[styles.description, { color: colors.textPrimary }]}>
              {homework.short_description}
            </Text>
          </View>
        ) : null}

        {/* FILE */}
        {homework.file_url && (
          <TouchableOpacity
            style={[styles.fileCard, { backgroundColor: colors.cardBackground }]}
            onPress={openFile}
          >
            <FileText size={24} color={colors.primary} />

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ color: colors.textPrimary }}>
                View Attachment
              </Text>
            </View>

            <Download size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

      </ScrollView>

      {/* ================= FILE MODAL ================= */}

      <Modal visible={pdfModal} animationType="slide">

        <View style={{ flex: 1, backgroundColor: "#000" }}>

          {/* HEADER */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 15,
              backgroundColor: "#111",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>
              Homework Attachment
            </Text>

            <TouchableOpacity onPress={() => setPdfModal(false)}>
              <X size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* VIEWER */}

          {fileUrl && (
            isImage(fileUrl) ? (

              <Image
                source={{ uri: fileUrl }}
                style={{ flex: 1 }}
                resizeMode="contain"
              />

            ) : (

              <Pdf
                source={{ uri: fileUrl }}
                style={{ flex: 1 }}
                trustAllCerts={false}
              />

            )
          )}

        </View>

      </Modal>

    </SafeAreaView>
  );
};

export default HomeWorkDetail;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 16,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: FontSizes.large,
    fontFamily: "Quicksand-Bold",
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  label: {
    fontSize: FontSizes.small,
  },

  value: {
    fontSize: FontSizes.small,
    fontFamily: "Quicksand-SemiBold",
  },

  descriptionBox: {
    marginTop: 10,
  },

  description: {
    marginTop: 6,
    lineHeight: 22,
  },

  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
  },
});