import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppHeader from '../../components/AppHeader';
import InputField from '../../components/InputField';
import ButtonWithLoader from '../../components/ButtonWithLoader';

import {
  useTheme,
  Spacing,
  BorderRadius,
  FontSizes,
} from '../../theme/theme';

/* ---------------- MOCK DATA ---------------- */
const initialStudents = [
  { id: 1, name: 'Harsh', marks: '' },
  { id: 2, name: 'Parkash', marks: '' },
  { id: 3, name: 'Yogesh Kumar', marks: '' },
  { id: 4, name: 'Amit', marks: '' },
];

const MarksEntryScreen = () => {
  const { colors, isDarkMode } = useTheme();

  const [students, setStudents] = useState(initialStudents);
  const [loading, setLoading] = useState(false);

  /* ---------------- HANDLERS ---------------- */
  const updateMarks = (index, value) => {
    const updated = [...students];
    updated[index].marks = value;
    setStudents(updated);
  };

  const onSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log('Saved marks:', students);
    }, 1200);
  };

  const onClear = () => {
    const cleared = students.map(item => ({
      ...item,
      marks: '',
    }));
    setStudents(cleared);
  };

  /* ---------------- RENDER ROW ---------------- */
  const renderItem = ({ item, index }) => (
    <View
      style={[
        styles.row,
        { borderBottomColor: colors.divider },
      ]}
    >
      {/* Serial Number */}
      <Text style={[styles.roll, { color: colors.textSecondary }]}>
        {index + 1}
      </Text>

      {/* Student Name */}
      <Text style={[styles.name, { color: colors.textPrimary }]}>
        {item.name}
      </Text>

      {/* Marks Input */}
      <View style={styles.marksWrap}>
        <InputField
          label="Marks"
          keyboardType="numeric"
          value={item.marks}
          onChangeText={(text) => updateMarks(index, text)}
          width="100%"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <AppHeader title="Marks Entry" />

      {/* ================= CLASS & SUBJECT INFO ================= */}
      <View
        style={[
          styles.infoCard,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <Text style={[styles.classText, { color: colors.textPrimary }]}>
          Class 7th - A
        </Text>

        <Text style={[styles.subjectText, { color: colors.textSecondary }]}>
          Subject : Maths
        </Text>
      </View>

      {/* ================= TABLE HEADER ================= */}
      <View
        style={[
          styles.tableHeader,
          {
            backgroundColor: colors.cardBackground,
            borderBottomColor: colors.divider,
          },
        ]}
      >
        <Text style={[styles.hRoll, { color: colors.textSecondary }]}>#</Text>
        <Text style={[styles.hName, { color: colors.textSecondary }]}>
          Student
        </Text>
        <Text style={[styles.hMarks, { color: colors.textSecondary }]}>
          Marks
        </Text>
      </View>

      {/* ================= STUDENT LIST ================= */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      />

      {/* ================= BOTTOM ACTION ROW ================= */}
      <View
        style={[
          styles.bottomRow,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={{ flex: 1, marginRight: 8 }}>
          <ButtonWithLoader
            text="Save"
            isLoading={loading}
            onPress={onSave}
            bgColor={colors.success}
          />
        </View>

        <View style={{ flex: 1, marginLeft: 8 }}>
          <ButtonWithLoader
            text="Clear"
            isLoading={false}
            onPress={onClear}
            bgColor={colors.error}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MarksEntryScreen;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* -------- Info Card -------- */
  infoCard: {
    padding: Spacing.md,
    margin: Spacing.md,
    borderRadius: BorderRadius.large,
  },

  classText: {
    fontSize: FontSizes.large,
    fontFamily: 'Quicksand-Bold',
  },

  subjectText: {
    fontSize: FontSizes.small,
    marginTop: 4,
    fontFamily: 'Quicksand-Medium',
  },

  /* -------- Table Header -------- */
  tableHeader: {
    flexDirection: 'row',
    padding: Spacing.sm,
    borderBottomWidth: 1,
  },

  hRoll: {
    width: 35,
    textAlign: 'center',
    fontSize: FontSizes.xsmall,
  },

  hName: {
    flex: 1,
    fontSize: FontSizes.xsmall,
  },

  hMarks: {
    width: 120,
    textAlign: 'center',
    fontSize: FontSizes.xsmall,
  },

  /* -------- Rows -------- */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderBottomWidth: 1,
  },

  roll: {
    width: 35,
    textAlign: 'center',
    fontSize: FontSizes.small,
  },

  name: {
    flex: 1,
    fontSize: FontSizes.normal,
  },

  marksWrap: {
    width: 100,
  },

  /* -------- Bottom Buttons -------- */
  bottomRow: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    padding: Spacing.md,
  },
});
