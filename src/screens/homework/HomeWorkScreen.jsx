import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  StatusBar,
  Modal,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import InputAuthField from "../../components/InputAuthField";

import { Camera, Image as ImageIcon, FileText } from "lucide-react-native";
import { Dropdown } from "react-native-element-dropdown";

import { useDispatch, useSelector } from "react-redux";

import {
  fetchTeacherClasses,
  fetchClassSubjects,
} from "../../redux/slices/commonSlice";

import commanServices from "../../redux/services/commanServices";

import AppHeader from "../../components/AppHeader";
import ButtonWithLoader from "../../components/ButtonWithLoader";

import {
  useTheme,
  DeviceSize,
  BorderRadius,
  Spacing,
  FontSizes,
  Fonts,
} from "../../theme/theme";

const HomeWorkScreen = () => {

  const dispatch = useDispatch();
  const { colors, isDarkMode } = useTheme();

  const { teacherClasses, subjects } = useSelector((state) => state.common);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [classDropdown, setClassDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];

  /* ================= FETCH CLASSES ================= */

  useEffect(() => {
    dispatch(fetchTeacherClasses());
  }, []);

  /* ================= SET CLASS DROPDOWN ================= */

  useEffect(() => {
    if (teacherClasses.length > 0) {
      setClassDropdown(
        teacherClasses.map((item) => ({
          label: `${item.className} ${item.section}`,
          value: item.id,
        }))
      );
    }
  }, [teacherClasses]);

  /* ================= SET SUBJECT DROPDOWN ================= */

  useEffect(() => {
    if (subjects.length > 0) {
      setSubjectDropdown(
        subjects.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      );
    }
  }, [subjects]);

  /* ================= CAMERA ================= */

  const openCamera = () => {

    launchCamera({ mediaType: "photo", quality: 0.8 }, (response) => {

      if (response.didCancel) return;

      const file = response.assets?.[0];
      if (!file) return;

      setImageFile({
        uri: file.uri,
        name: file.fileName || `image_${Date.now()}.jpg`,
        type: file.type || "image/jpeg",
      });

      setPdfFile(null);
    });
  };

  /* ================= GALLERY ================= */

  const openGallery = () => {

    launchImageLibrary({ mediaType: "photo" }, (response) => {

      if (response.didCancel) return;

      const file = response.assets?.[0];
      if (!file) return;

      setImageFile({
        uri: file.uri,
        name: file.fileName || `image_${Date.now()}.jpg`,
        type: file.type || "image/jpeg",
      });

      setPdfFile(null);
    });
  };

  /* ================= PDF PICKER ================= */

  const pickPDF = () => {

    launchImageLibrary({ mediaType: "mixed" }, (response) => {

      if (response.didCancel) return;

      const file = response.assets?.[0];
      if (!file) return;

      setPdfFile({
        uri: file.uri,
        name: file.fileName || `file_${Date.now()}.pdf`,
        type: file.type || "application/pdf",
      });

      setImageFile(null);
    });
  };

  /* ================= PREVIEW ================= */

  const openPreview = () => {

    if (!title.trim()) {
      Alert.alert("Validation", "Please enter homework title");
      return;
    }

    if (!selectedClass) {
      Alert.alert("Validation", "Please select class");
      return;
    }

    if (!selectedSubject) {
      Alert.alert("Validation", "Please select subject");
      return;
    }

    setPreviewVisible(true);
  };

  /* ================= SUBMIT ================= */

  const submitHomework = async () => {

    setPreviewVisible(false);
    setLoading(true);

    let fileObject = null;

    if (imageFile) fileObject = imageFile;
    if (!fileObject && pdfFile) fileObject = pdfFile;

    const payload = {
      title: title.trim(),
      class_mapping_id: selectedClass,
      subject_id: selectedSubject,
      short_description: description || "",
      homework_date: todayDate,
      file: fileObject,
    };

    console.log("Submitting Homework Payload:", payload);

    try {

      const res = await commanServices.submitHomeworkData(payload);

      if (res.success) {

        Alert.alert("Success", res.message);

        setTitle("");
        setDescription("");
        setImageFile(null);
        setPdfFile(null);
        setSelectedClass(null);
        setSelectedSubject(null);

      } else {

        Alert.alert("Error", res.message);

      }

    } catch (error) {

      console.log("Homework Submit Error:", error);
      Alert.alert("Error", "Failed to submit homework");

    }

    setLoading(false);
  };

  /* ================= PREVIEW LABELS ================= */

  const selectedClassLabel =
    classDropdown.find((c) => c.value === selectedClass)?.label || "";

  const selectedSubjectLabel =
    subjectDropdown.find((s) => s.value === selectedSubject)?.label || "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <AppHeader title="Add Homework" />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={[styles.label, { color: colors.textPrimary }]}>Date of Homework</Text>

        <View style={styles.input}>
          <Text style={[styles.dateText, { color: colors.textPrimary }]}>{todayDate}</Text>
        </View>

        <InputAuthField
          label="Homework Title"
          value={title}
          onChangeText={setTitle}
        />

        {/* CLASS */}

        <Text style={[styles.label, { color: colors.textPrimary }]}>Select Class</Text>

        <Dropdown
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.surface,
              borderColor: colors.divider,
            },
          ]}
          data={classDropdown}
          labelField="label"
          valueField="value"
          value={selectedClass}
          placeholder="Select Class"
          onChange={(item) => {
            setSelectedClass(item.value);
            dispatch(fetchClassSubjects({ class_mapping_id: item.value }));
          }}

          containerStyle={{
            backgroundColor: colors.surface,
            borderRadius: BorderRadius.large,
            borderColor: colors.divider,
            borderWidth: 1,
          }}

          itemContainerStyle={{ backgroundColor: colors.surface }}
          activeColor={colors.cardBackground}

          placeholderStyle={{
            fontFamily: Fonts.quicksand.bold,
            fontSize: FontSizes.small,
            color: colors.textTertiary,
          }}

          selectedTextStyle={{
            fontFamily: Fonts.quicksand.bold,
            fontSize: FontSizes.small,
            color: colors.textPrimary,
          }}

          itemTextStyle={{
            fontFamily: Fonts.quicksand.bold,
            fontSize: FontSizes.small,
            color: colors.textPrimary,
          }}
        />

        {/* SUBJECT */}

        <Text style={[styles.label, { color: colors.textPrimary }]}>Select Subject</Text>

        <Dropdown
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.surface,
              borderColor: colors.divider,
            },
          ]}
          data={subjectDropdown}
          labelField="label"
          valueField="value"
          value={selectedSubject}
          placeholder="Select Subject"
          onChange={(item) => setSelectedSubject(item.value)}

          containerStyle={{
            backgroundColor: colors.surface,
            borderRadius: BorderRadius.large,
            borderColor: colors.divider,
            borderWidth: 1,
          }}

          itemContainerStyle={{ backgroundColor: colors.surface }}
          activeColor={colors.cardBackground}

          placeholderStyle={{
            fontFamily: Fonts.quicksand.bold,
            fontSize: FontSizes.small,
            color: colors.textTertiary,
          }}

          selectedTextStyle={{
            fontFamily: Fonts.quicksand.bold,
            fontSize: FontSizes.small,
            color: colors.textPrimary,
          }}

          itemTextStyle={{
            fontFamily: Fonts.quicksand.bold,
            fontSize: FontSizes.small,
            color: colors.textPrimary,
          }}
        />

        {/* FILE UPLOAD */}

        <Text style={[styles.label, { color: colors.textPrimary }]}>Attach File</Text>

        <View style={styles.row}>

          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface }]} onPress={openCamera}>
            <Camera size={20} color={colors.primary} />
            <Text style={[styles.label, { color: colors.textPrimary }]}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface }]} onPress={openGallery}>
            <ImageIcon size={20} color={colors.primary} />
            <Text style={[styles.label, { color: colors.textPrimary }]}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface }]} onPress={pickPDF}>
            <FileText size={20} color={colors.primary} />
            <Text style={[styles.label, { color: colors.textPrimary }]}>PDF</Text>
          </TouchableOpacity>

        </View>

        {imageFile && (
          <Image source={{ uri: imageFile.uri }} style={styles.previewImg} />
        )}

        {pdfFile && <Text>PDF: {pdfFile.name}</Text>}

        {/* DESCRIPTION */}

        <Text style={[styles.label, { color: colors.textPrimary }]}>Description</Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Write homework details here..."
          placeholderTextColor={colors.textPrimary}
          multiline
          textAlignVertical="top"
          style={[
            styles.textArea,
            {
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              borderColor: colors.divider,
            },
          ]}
        />
        <ButtonWithLoader text="Preview Homework" onPress={openPreview} />
      </ScrollView>

      {/* PREVIEW MODAL */}

      <Modal visible={previewVisible} transparent animationType="slide">
        <View style={styles.previewModal}>
          <Text style={styles.previewTitle}>Preview</Text>
          <Text>Title: {title}</Text>
          <Text>Class: {selectedClassLabel}</Text>
          <Text>Subject: {selectedSubjectLabel}</Text>
          <Text>Date: {todayDate}</Text>
          <Text>Description: {description}</Text>
          <ButtonWithLoader
            text="Submit Homework"
            isLoading={loading}
            onPress={submitHomework}
          />
          <TouchableOpacity onPress={() => setPreviewVisible(false)}>
            <Text style={{ marginTop: 20 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeWorkScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({

  scrollContent: { padding: 16, paddingBottom: 120 },

  label: {
    marginBottom: 6,
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.medium,
  },

  input: {
    padding: 0,
    borderRadius: 8,
    marginBottom: 16,
  },

  dateText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.bold,
  },

  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: BorderRadius.large,
    paddingHorizontal: 12,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  btn: {
    alignItems: "center",
    padding: 20,
    borderRadius: 8,
  },

  previewImg: {
    width: 90,
    height: 90,
    marginTop: 10,
    borderRadius: 8,
  },

  textArea: {
    height: DeviceSize.hp(25),
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    padding: Spacing.sm,
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.bold,
    marginBottom: Spacing.md,
  },

  previewModal: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 30,
    justifyContent: "center",
  },

  previewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});