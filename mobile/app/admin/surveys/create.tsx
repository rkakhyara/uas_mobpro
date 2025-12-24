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
  const [questions, setQuestions] = useState(['']); // Start with 1 empty question
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const updateQuestion = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index] = text;
    setQuestions(newQuestions);
  };

  // Add new question field
  const addQuestion = () => {
    setQuestions([...questions, '']);
  };

  // Remove question field
  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter survey title');
      return;
    }

    // Validate all questions are filled
    const emptyQuestions = questions.filter(q => q.trim() === '');
    if (emptyQuestions.length > 0) {
      Alert.alert('Error', 'Please fill in all questions or remove empty ones');
      return;
    }

    if (questions.length === 0) {
      Alert.alert('Error', 'Please add at least one question');
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
          onPress: () => router.replace('/admin/surveys'),
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

            <Text style={styles.sectionTitle}>Questions ({questions.length} question{questions.length !== 1 ? 's' : ''})</Text>
            <Text style={styles.sectionSubtitle}>
              Responders will answer: Setuju / Tidak Setuju
            </Text>

            {questions.map((question, index) => (
              <View key={index} style={styles.questionContainer}>
                <View style={styles.questionHeader}>
                  <Text style={styles.label}>Question {index + 1} *</Text>
                  {questions.length > 1 && (
                    <TouchableOpacity
                      onPress={() => removeQuestion(index)}
                      disabled={loading}
                      style={styles.removeButton}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder={`Enter question ${index + 1}`}
                  value={question}
                  onChangeText={(text) => updateQuestion(index, text)}
                  multiline
                  numberOfLines={2}
                  editable={!loading}
                />
              </View>
            ))}

            <TouchableOpacity
              style={[styles.addQuestionButton, loading && styles.buttonDisabled]}
              onPress={addQuestion}
              disabled={loading}
            >
              <Text style={styles.addQuestionButtonText}>+ Add Question</Text>
            </TouchableOpacity>

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
  questionContainer: {
    marginBottom: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  addQuestionButton: {
    backgroundColor: '#34C759',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  addQuestionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
