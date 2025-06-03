import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AppConstants from "@/constants/AppConstants";
import { Colors } from "@/constants/Colors";
import { ScrollView, StyleSheet, useColorScheme, View, TextInput, Alert, TouchableOpacity } from "react-native";
import { useAppStore } from "@/store/useAppStore";

export default function TabNotes() {
  const colorScheme = useColorScheme();
  const { notes, addNote, deleteNote } = useAppStore();
  const [newNoteContent, setNewNoteContent] = useState<string>("");

  // Función para agregar una nueva nota
  const handleAddNote = () => {
    if (newNoteContent.trim() === "") {
      Alert.alert("Error", "Por favor, escribe una nota antes de agregarla.");
      return;
    }
    addNote(newNoteContent.trim());
    setNewNoteContent(""); // Limpiar el campo de texto
  };

  // Función para eliminar una nota
  const handleDeleteNote = (noteId: string, noteContent: string) => {
    Alert.alert(
      "Eliminar Nota",
      `¿Estás seguro de que quieres eliminar esta nota?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => deleteNote(noteId) },
      ]
    );
  };

  return (
    <ThemedView>
      <ScrollView style={style.mainView}>
        <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          {/* Título de la pantalla */}
          <ThemedText type="title" style={{ marginBottom: 10, width: "100%" }}>
            Mis Notas
          </ThemedText>

          {/* Campo de texto para agregar una nueva nota */}
          <TextInput
            style={{
              width: "100%",
              padding: 15,
              borderColor: "#ffffff20",
              borderWidth: 1,
              borderRadius: AppConstants.borderRadius,
              marginBottom: 10,
              color: Colors[colorScheme ?? "light"].text,
              backgroundColor: Colors[colorScheme ?? "light"].background,
              minHeight: 100,
              textAlignVertical: "top",
            }}
            placeholder="Escribe una nueva nota..."
            placeholderTextColor={Colors[colorScheme ?? "light"].textDisabled}
            value={newNoteContent}
            onChangeText={setNewNoteContent}
            multiline
          />

          {/* Botón para agregar la nota */}
          <TouchableOpacity
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].accent,
              padding: 15,
              borderRadius: AppConstants.borderRadius,
              marginBottom: 20,
              width: "100%",
              alignItems: "center",
            }}
            onPress={handleAddNote}
          >
            <ThemedText style={{ fontWeight: "600" }}>
              + Agregar Nota
            </ThemedText>
          </TouchableOpacity>

          {/* Lista de notas */}
          <View style={style.taskContainer}>
            {notes.length === 0 ? (
              <View style={style.emptyState}>
                <ThemedText style={style.emptyStateText}>No tienes notas guardadas</ThemedText>
                <ThemedText style={style.emptyStateSubtext}>¡Crea tu primera nota!</ThemedText>
              </View>
            ) : (
              notes.map((note) => (
                <View key={note.id} style={style.taskComponent}>
                  <View style={style.noteContentContainer}>
                    <ThemedText type="subtitle" style={style.noteContent}>{note.content}</ThemedText>
                    <ThemedText style={style.noteDate}>
                      {new Date(note.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </ThemedText>
                  </View>
                  <TouchableOpacity
                    style={style.deleteButton}
                    onPress={() => handleDeleteNote(note.id, note.content)}
                  >
                    <ThemedText style={[style.deleteButtonText, { color: Colors[colorScheme ?? "light"].accent }]}>×</ThemedText>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const style = StyleSheet.create({
  mainView: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    paddingTop: 100,
    paddingHorizontal: 30,
  },

  taskContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 8,
  },

  taskComponent: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderColor: "#ffffff20",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: AppConstants.borderRadius,
    gap: 12,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },

  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.7,
  },

  noteContent: {
    marginBottom: 8,
    lineHeight: 22,
  },

  noteDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  
  noteContentContainer: {
    flexDirection: "column",
    flex: 1,
  },
  
  deleteButton: {
    width: 28,
    height: 28,
    borderColor: "#ffffff30",
    borderWidth: 1,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginTop: 2,
  },
  
  deleteButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
