import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  Image,
  Modal,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import { Camera, Image as ImageIcon, FileText, X } from "lucide-react-native";
import { Dropdown } from "react-native-element-dropdown";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import {
  fetchTeacherClasses,
  fetchClassSubjects,
} from "../../../src/redux/slices/commonSlice";

import commanServices from "../../../src/redux/services/commanServices";

import AppHeader from "../../../src/components/AppHeader";
import ButtonWithLoader from "../../../src/components/ButtonWithLoader";
import InputAuthField from "../../components/InputAuthField";

import {
  useTheme,
  DeviceSize,
  BorderRadius,
  Spacing,
  FontSizes,
  Fonts,
} from "../../../src/theme/theme";

const EditHomeWork = ({ route }) => {

  const { homeworkId } = route.params;

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { colors, isDarkMode } = useTheme();

  const { teacherClasses, subjects } = useSelector((state) => state.common);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [classDropdown, setClassDropdown] = useState([]);
  const [subjectDropdown, setSubjectDropdown] = useState([]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [fileObject, setFileObject] = useState(null);
  const [existingFile, setExistingFile] = useState(null);

  const [previewModal, setPreviewModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];

  const isImage = (url) => {
    return url?.match(/\.(jpeg|jpg|png|gif|webp)$/i);
  };

  /* FETCH CLASSES */

  useEffect(() => {
    dispatch(fetchTeacherClasses());
  }, []);

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

  /* LOAD HOMEWORK */

  useEffect(() => {
    loadHomework();
  }, []);

  const loadHomework = async () => {

    try {

      const res = await commanServices.getHomeworkDetail(homeworkId);

      if (res.success) {

        const data = res.homework;

        setTitle(data.title);
        setDescription(data.short_description || "");
        setSelectedClass(data.class_mapping_id);
        setSelectedSubject(data.subject_id);
        setExistingFile(data.file_url);

        dispatch(
          fetchClassSubjects({
            class_mapping_id: data.class_mapping_id,
          })
        );
      }

    } catch (error) {
      console.log("Load homework error:", error);
    }
  };

  /* CAMERA */

  const openCamera = () => {

    launchCamera({ mediaType: "photo" }, (response) => {

      if (response.didCancel) return;

      const file = response.assets?.[0];
      if (!file) return;

      setFileObject({
        uri: file.uri,
        name: file.fileName || `image_${Date.now()}.jpg`,
        type: file.type || "image/jpeg",
      });

      setExistingFile(null);
    });
  };

  /* GALLERY */

  const openGallery = () => {

    launchImageLibrary({ mediaType: "photo" }, (response) => {

      if (response.didCancel) return;

      const file = response.assets?.[0];
      if (!file) return;

      setFileObject({
        uri: file.uri,
        name: file.fileName || `image_${Date.now()}.jpg`,
        type: file.type || "image/jpeg",
      });

      setExistingFile(null);
    });
  };

  /* PDF */

  const pickPDF = () => {

    launchImageLibrary({ mediaType: "mixed" }, (response) => {

      if (response.didCancel) return;

      const file = response.assets?.[0];
      if (!file) return;

      setFileObject({
        uri: file.uri,
        name: file.fileName || `file_${Date.now()}.pdf`,
        type: file.type || "application/pdf",
      });

      setExistingFile(null);
    });
  };

  /* VALIDATION */

  const validateForm = () => {

    if (!title) {
      Alert.alert("Validation", "Enter homework title");
      return false;
    }

    if (!selectedClass) {
      Alert.alert("Validation", "Select class");
      return false;
    }

    if (!selectedSubject) {
      Alert.alert("Validation", "Select subject");
      return false;
    }

    return true;
  };

  /* UPDATE */

  const updateHomework = async () => {

    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      id: homeworkId,
      title,
      class_mapping_id: selectedClass,
      subject_id: selectedSubject,
      short_description: description,
      homework_date: todayDate,
      file: fileObject,
    };

    try {

      const res = await commanServices.updateHomeworkData(payload);

      if (res.success) {

        Alert.alert("Success", res.message);
        navigation.goBack();

      } else {

        Alert.alert("Error", res.message);

      }

    } catch (error) {

      console.log("Update homework error:", error);
      Alert.alert("Error", "Failed to update homework");

    }

    setLoading(false);
  };

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>

      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <AppHeader title="Edit Homework" />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.label}>Date</Text>

        <View style={styles.input}>
          <Text>{todayDate}</Text>
        </View>

        <Text style={styles.label}>Homework Title</Text>

        <InputAuthField
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Select Class</Text>

        <Dropdown
          style={styles.dropdown}
          data={classDropdown}
          labelField="label"
          valueField="value"
          value={selectedClass}
          placeholder="Select Class"
          onChange={(item) => {

            setSelectedClass(item.value);

            dispatch(
              fetchClassSubjects({
                class_mapping_id: item.value,
              })
            );

          }}
        />

        <Text style={styles.label}>Select Subject</Text>

        <Dropdown
          style={styles.dropdown}
          data={subjectDropdown}
          labelField="label"
          valueField="value"
          value={selectedSubject}
          placeholder="Select Subject"
          onChange={(item) => setSelectedSubject(item.value)}
        />

        <Text style={styles.label}>Attach File</Text>

        <View style={styles.row}>

          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface }]} onPress={openCamera}>
            <Camera size={22} />
            <Text>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface }]} onPress={openGallery}>
            <ImageIcon size={22} />
            <Text>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.surface }]} onPress={pickPDF}>
            <FileText size={22} />
            <Text>PDF</Text>
          </TouchableOpacity>

        </View>

        {(fileObject || existingFile) && (

          <View style={[styles.fileCard, { backgroundColor: colors.surface }]}>

            <FileText size={26} color={colors.primary} />

            <View style={{ flex: 1, marginLeft: 10 }}>

              <Text numberOfLines={1}>
                {fileObject?.name || "Homework Attachment"}
              </Text>

            </View>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setPreviewModal(true)}
            >
              <Text style={styles.actionText}>VIEW</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#ff3b30" }]}
              onPress={() => {
                setFileObject(null);
                setExistingFile(null);
              }}
            >
              <Text style={[styles.actionText, { color: "#fff" }]}>
                REMOVE
              </Text>
            </TouchableOpacity>

          </View>

        )}

        <Text style={styles.label}>Description</Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Write homework details here..."
          placeholderTextColor={colors.textSecondary}
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

        <ButtonWithLoader
          text="Update Homework"
          isLoading={loading}
          onPress={updateHomework}
        />

      </ScrollView>

      <Modal visible={previewModal} animationType="slide">

        <View style={{ flex: 1, backgroundColor: "#000" }}>

          <TouchableOpacity
            style={{ position: "absolute", top: 50, right: 20, zIndex: 10 }}
            onPress={() => setPreviewModal(false)}
          >
            <X color="#fff" size={28} />
          </TouchableOpacity>

          {(fileObject?.type?.includes("image") || isImage(existingFile)) ? (

            <Image
              source={{ uri: fileObject?.uri || existingFile }}
              style={{ flex: 1 }}
              resizeMode="contain"
            />

          ) : (

            <Text style={{ color: "#fff", marginTop: 100, textAlign: "center" }}>
              PDF Preview (Use react-native-pdf if needed)
            </Text>

          )}

        </View>

      </Modal>

    </SafeAreaView>

  );
};

export default EditHomeWork;

const styles = StyleSheet.create({

  scrollContent: { padding: 16, paddingBottom: 120 },

  label: {
    marginBottom: 6,
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.medium,
  },

  input: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
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
    padding: 30,
    borderRadius: 8,
  },

  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: BorderRadius.large,
    marginTop: 10,
  },

  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 6,
    backgroundColor: "#e0e0e0",
  },

  actionText: {
    fontSize: 12,
    fontFamily: Fonts.quicksand.bold,
  },

  textArea: {
    height: DeviceSize.hp(25),
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    padding: Spacing.sm,
    fontSize: FontSizes.small,
    marginBottom: Spacing.md,
  },

});