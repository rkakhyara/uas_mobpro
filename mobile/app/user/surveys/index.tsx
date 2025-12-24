import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import apiService, { Survey } from '@/services/api';

export default function UserSurveysScreen() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { logout, user } = useAuth();

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const data = await apiService.getSurveys();
      // Only show active surveys
      const activeSurveys = data.filter((s) => s.is_active);
      setSurveys(activeSurveys);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load surveys');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSurveys();
  };

  const renderSurvey = ({ item }: { item: Survey }) => (
    <TouchableOpacity
      style={styles.surveyCard}
      onPress={() => router.push(`/user/surveys/${item.id}`)}
    >
      <View style={styles.surveyHeader}>
        <Text style={styles.surveyTitle}>{item.title}</Text>
        {item.description && (
          <Text style={styles.surveyDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
      <View style={styles.surveyFooter}>
        <Text style={styles.questionsCount}>
          {item.questions?.length || 0} questions
        </Text>
        <Text style={styles.takeButton}>Take Survey →</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Available Surveys</Text>
          <Text style={styles.headerSubtitle}>Welcome, {user?.name}!</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={surveys}
        renderItem={renderSurvey}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active surveys</Text>
            <Text style={styles.emptySubtext}>Check back later</Text>
          </View>
        }
      />
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 15,
  },
  surveyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  surveyHeader: {
    marginBottom: 12,
  },
  surveyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  surveyDescription: {
    fontSize: 14,
    color: '#666',
  },
  surveyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  questionsCount: {
    fontSize: 12,
    color: '#999',
  },
  takeButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
  },
});
