import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StyleSheet, useColorScheme, View, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import AppConstants from "@/constants/AppConstants";
import { router } from "expo-router";

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const { login, isAuthenticated } = useAppStore();
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);
  
  const handleLogin = () => {
    if (userName.trim() === '') {
      Alert.alert('Error', 'Por favor, ingresa tu nombre.');
      return;
    }
    
    login(userName.trim());
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.mainView}>
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require('@/assets/images/amity-banner.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Título de bienvenida */}
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>¡Bienvenido a Amity!</ThemedText>
          <ThemedText style={styles.subtitle}>
            Tu compañero personal para organizar tareas, notas y eventos
          </ThemedText>
        </View>
        
        {/* Formulario de entrada */}
        <View style={styles.formContainer}>
          <ThemedText type="subtitle" style={styles.formLabel}>
            ¿Cómo te gustaría que te llamemos?
          </ThemedText>
          
          <TextInput
            style={[styles.input, { 
              color: Colors[colorScheme ?? 'light'].text,
              borderColor: Colors[colorScheme ?? 'light'].textDisabled
            }]}
            placeholder="Escribe tu nombre"
            placeholderTextColor={Colors[colorScheme ?? 'light'].textDisabled}
            value={userName}
            onChangeText={setUserName}
            autoCapitalize="words"
            autoCorrect={false}
          />
          
          <TouchableOpacity 
            style={[styles.loginButton, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]}
            onPress={handleLogin}
          >
            <ThemedText style={styles.loginButtonText}>Comenzar</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Mensaje de funcionalidades */}
        <View style={styles.featuresContainer}>
          <ThemedText style={styles.featuresTitle}>Con Amity puedes:</ThemedText>
          <View style={styles.featuresList}>
            <ThemedText style={styles.featureItem}>📝 Gestionar tus tareas diarias</ThemedText>
            <ThemedText style={styles.featureItem}>📒 Crear y organizar notas</ThemedText>
            <ThemedText style={styles.featureItem}>📅 Planificar eventos en tu calendario</ThemedText>
            <ThemedText style={styles.featureItem}>📊 Seguir tu progreso y productividad</ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  mainView: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 40,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
    lineHeight: 20,
  },
  formContainer: {
    width: "100%",
    marginBottom: 40,
  },
  formLabel: {
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 2,
    borderRadius: AppConstants.borderRadius,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  loginButton: {
    width: "100%",
    padding: 15,
    borderRadius: AppConstants.borderRadius,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  featuresContainer: {
    width: "100%",
    alignItems: "center",
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  featuresList: {
    gap: 10,
  },
  featureItem: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
})
