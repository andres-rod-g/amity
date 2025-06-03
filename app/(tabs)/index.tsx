import { Image, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { stats, userName, isAuthenticated, updateStats, logout } = useAppStore();
  
  useEffect(() => {
    updateStats();
  }, []);
  
  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive', 
          onPress: () => {
            logout();
            router.replace('/(clean)/auth');
          }
        },
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FFE8F9', dark: '#452541' }}
      headerImage={
        <Image
          source={require('@/assets/images/amity-banner.png')}
          style={styles.reactLogo}
        />
      }>
      {/* Sección de bienvenida */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          {isAuthenticated && userName ? `¡Hola, ${userName}!` : '¡Bienvenid@!'}
        </ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Sección de estadísticas */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText type="subtitle">Tu Progreso</ThemedText>
        <ThemedView style={styles.statCard}>
          <ThemedText type="defaultSemiBold">Tareas Completadas</ThemedText>
          <ThemedText style={styles.statValue}>{stats.completedTasks}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statCard}>
          <ThemedText type="defaultSemiBold">Tareas Pendientes</ThemedText>
          <ThemedText style={styles.statValue}>{stats.pendingTasks}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statCard}>
          <ThemedText type="defaultSemiBold">Productividad</ThemedText>
          <ThemedText style={styles.statValue}>{stats.productivityPercentage}%</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Sección de instrucciones */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText>Es un gusto para nosotros tenerte aquí.</ThemedText>
        <ThemedText style={styles.welcomeText}>
          Tu información se guarda automáticamente en tu dispositivo, 
          así que no tienes que preocuparte por perder tus datos.
        </ThemedText>
        
        {/* Botón de cerrar sesión */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]}
          onPress={handleLogout}
        >
          <ThemedText style={styles.logoutButtonText}>Cerrar Sesión</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 20,
  },
  reactLogo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  statsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#ffffff20',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  welcomeText: {
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
  logoutButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
