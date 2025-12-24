import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import apiService from '@/services/api';

export default function CreateSurveyScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const updateQuestion = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = text;
    setQuestions(newQuestions);
  };

  const handleCreate = async () => {
    if (!title) {
      Alert.alert('Error', 'Please enter survey title');
      return;
    }

    if (questions[0].trim() === '' || questions[1].trim() === '') {
      Alert.alert('Error', 'Please enter both questions');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setLoading(true);
    try {
      // Create survey
      const survey = await apiService.createSurvey({
        title,
        description,
        created_by: user.id,
      });

      // Create questions
      for (let i = 0; i < questions.length; i++) {
        await apiService.createQuestion({
          survey_id: survey.id,
          question_text: questions[i],
          order: i + 1,
        });
      }

      Alert.alert('Success', 'Survey created successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Create New Survey</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Survey Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter survey title"
              value={title}
              onChangeText={setTitle}
              editable={!loading}
            />

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter survey description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              editable={!loading}
            />

            <Text style={styles.sectionTitle}>Questions (2 questions)</Text>
            <Text style={styles.sectionSubtitle}>
              Responders will answer: Setuju / Tidak Setuju
            </Text>

            <Text style={styles.label}>Question 1 *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter first question"
              value={questions[0]}
              onChangeText={(text) => updateQuestion(0, text)}
              multiline
              numberOfLines={2}
              editable={!loading}
            />

            <Text style={styles.label}>Question 2 *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter second question"
              value={questions[1]}
              onChangeText={(text) => updateQuestion(1, text)}
              multiline
              numberOfLines={2}
              editable={!loading}
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleCreate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Survey</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
