import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import apiService, { Survey, Question } from '@/services/api';

export default function TakeSurveyScreen() {
  const { id } = useLocalSearchParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadSurvey();
  }, [id]);

  const loadSurvey = async () => {
    try {
      const data = await apiService.getSurvey(Number(id));
      setSurvey(data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load survey');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId: number, answer: boolean) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const handleSubmit = async () => {
    if (!survey || !user) return;

    // Check if all questions are answered
    const unansweredQuestions = survey.questions?.filter(
      (q) => answers[q.id] === undefined
    );

    if (unansweredQuestions && unansweredQuestions.length > 0) {
      Alert.alert('Error', 'Please answer all questions');
      return;
    }

    setSubmitting(true);
    try {
      // Create response
      const response = await apiService.createResponse({
        survey_id: survey.id,
        user_id: user.id,
      });

      // Submit answers
      for (const question of survey.questions || []) {
        await apiService.createAnswer({
          response_id: response.id,
          question_id: question.id,
          answer: answers[question.id],
        });
      }

      Alert.alert('Success', 'Your response has been submitted!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      if (error.message.includes('already responded')) {
        Alert.alert('Already Submitted', 'You have already responded to this survey');
        router.back();
      } else {
        Alert.alert('Error', error.message || 'Failed to submit response');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!survey) {
    return (
      <View style={styles.centerContainer}>
        <Text>Survey not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{survey.title}</Text>
        {survey.description && (
          <Text style={styles.description}>{survey.description}</Text>
        )}

        <View style={styles.questionsContainer}>
          {survey.questions?.map((question, index) => (
            <View key={question.id} style={styles.questionCard}>
              <Text style={styles.questionNumber}>Question {index + 1}</Text>
              <Text style={styles.questionText}>{question.question_text}</Text>

              <View style={styles.answersContainer}>
                <TouchableOpacity
                  style={[
                    styles.answerButton,
                    answers[question.id] === true && styles.answerButtonSelected,
                  ]}
                  onPress={() => selectAnswer(question.id, true)}
                  disabled={submitting}
                >
                  <View
                    style={[
                      styles.radio,
                      answers[question.id] === true && styles.radioSelected,
                    ]}
                  />
                  <Text
                    style={[
                      styles.answerText,
                      answers[question.id] === true && styles.answerTextSelected,
                    ]}
                  >
                    Setuju
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.answerButton,
                    answers[question.id] === false && styles.answerButtonSelected,
                  ]}
                  onPress={() => selectAnswer(question.id, false)}
                  disabled={submitting}
                >
                  <View
                    style={[
                      styles.radio,
                      answers[question.id] === false && styles.radioSelected,
                    ]}
                  />
                  <Text
                    style={[
                      styles.answerText,
                      answers[question.id] === false && styles.answerTextSelected,
                    ]}
                  >
                    Tidak Setuju
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Response</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  questionsContainer: {
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumber: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 22,
  },
  answersContainer: {
    gap: 10,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  answerButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E6F4FF',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  answerText: {
    fontSize: 16,
    color: '#333',
  },
  answerTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
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
