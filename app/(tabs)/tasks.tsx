import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AppConstants from "@/constants/AppConstants";
import { Colors } from "@/constants/Colors";
import { ScrollView, StyleSheet, useColorScheme, View, TouchableOpacity, Alert, TextInput } from "react-native";
import { useAppStore } from "@/store/useAppStore";
import { useState } from "react";

export default function TabTasks() {
  const colorScheme = useColorScheme();
  const { tasks, addTask, toggleTask, deleteTask } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  
  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') {
      Alert.alert('Error', 'Por favor, escribe un título para la tarea.');
      return;
    }
    
    addTask(newTaskTitle.trim(), newTaskDescription.trim());
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowAddForm(false);
  };
  
  const handleToggleTask = (taskId: string) => {
    toggleTask(taskId);
  };
  
  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    Alert.alert(
      'Eliminar Tarea',
      `¿Estás seguro de que quieres eliminar "${taskTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteTask(taskId) },
      ]
    );
  };

    return (
        <ThemedView>
            <ScrollView style={style.mainView}>
                <View style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>

                    <ThemedText type="title" style={{marginBottom: 10, width: "100%"}}>Mis Pendientes</ThemedText>

                    {/* Formulario para agregar nueva tarea */}
                    {showAddForm && (
                        <View style={style.addTaskForm}>
                            <TextInput
                                style={[style.input, { color: Colors[colorScheme ?? 'light'].text }]}
                                placeholder="Título de la tarea"
                                placeholderTextColor={Colors[colorScheme ?? 'light'].textDisabled}
                                value={newTaskTitle}
                                onChangeText={setNewTaskTitle}
                            />
                            <TextInput
                                style={[style.input, style.textArea, { color: Colors[colorScheme ?? 'light'].text }]}
                                placeholder="Descripción (opcional)"
                                placeholderTextColor={Colors[colorScheme ?? 'light'].textDisabled}
                                value={newTaskDescription}
                                onChangeText={setNewTaskDescription}
                                multiline
                                numberOfLines={3}
                            />
                            <View style={style.buttonRow}>
                                <TouchableOpacity 
                                    style={[style.button, style.cancelButton]} 
                                    onPress={() => setShowAddForm(false)}
                                >
                                    <ThemedText style={style.buttonText}>Cancelar</ThemedText>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[style.button, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]} 
                                    onPress={handleAddTask}
                                >
                                    <ThemedText style={style.buttonText}>Agregar</ThemedText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <View style={style.taskContainer}>
                        {tasks.length === 0 ? (
                            <View style={style.emptyState}>
                                <ThemedText style={style.emptyStateText}>No tienes tareas pendientes</ThemedText>
                                <ThemedText style={style.emptyStateSubtext}>¡Crea tu primera tarea!</ThemedText>
                            </View>
                        ) : (
                            tasks.map((task) => (
                                <TouchableOpacity
                                    key={task.id}
                                    style={style.taskComponent}
                                    onPress={() => handleToggleTask(task.id)}
                                    onLongPress={() => handleDeleteTask(task.id, task.title)}
                                >
                                    <TouchableOpacity 
                                        style={style.checkbox}
                                        onPress={() => handleToggleTask(task.id)}
                                    >
                                        {task.completed && (
                                            <View style={[style.checkboxFilled, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]} />
                                        )}
                                    </TouchableOpacity>
                                    <View style={style.taskContent}>
                                        <ThemedText 
                                            type="subtitle" 
                                            style={[task.completed && style.completedText]}
                                        >
                                            {task.title}
                                        </ThemedText>
                                        {task.description && (
                                            <ThemedText 
                                                style={[style.taskDescription, task.completed && style.completedText]}
                                            >
                                                {task.description}
                                            </ThemedText>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                    <TouchableOpacity 
                        style={{
                            backgroundColor: Colors[colorScheme ?? 'light'].accent,
                            padding: 15,
                            borderRadius: AppConstants.borderRadius,
                            marginTop: 10,
                        }}
                        onPress={() => setShowAddForm(!showAddForm)}
                    >
                        <ThemedText style={{fontWeight: "600"}}>
                            {showAddForm ? 'Cancelar' : '+ Crear Tarea'}
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </ThemedView>
    )
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
        alignItems: "center",
        width: "100%", 
        paddingVertical: 20, 
        paddingHorizontal: 20, 
        borderColor: "#ffffff20", 
        borderStyle: "solid", 
        borderWidth: 1, 
        borderRadius: AppConstants.borderRadius,
        gap: 8
    },

    addTaskForm: {
        width: "100%",
        marginBottom: 20,
        padding: 20,
        borderColor: "#ffffff20",
        borderWidth: 1,
        borderRadius: AppConstants.borderRadius,
        gap: 12,
    },

    input: {
        padding: 12,
        borderColor: "#ffffff20",
        borderWidth: 1,
        borderRadius: AppConstants.borderRadius,
        fontSize: 16,
    },

    textArea: {
        minHeight: 80,
        textAlignVertical: "top",
    },

    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 8,
    },

    button: {
        flex: 1,
        padding: 12,
        borderRadius: AppConstants.borderRadius,
        alignItems: "center",
    },

    cancelButton: {
        backgroundColor: "#ffffff20",
    },

    buttonText: {
        fontWeight: "600",
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

    checkbox: {
        width: 25,
        height: 25,
        borderColor: "#ffffff30",
        borderWidth: 1,
        borderRadius: 100,
        padding: 4,
    },

    checkboxFilled: {
        width: "100%",
        height: "100%",
        borderRadius: 100,
    },

    taskContent: {
        flexDirection: "column",
        flex: 1,
        paddingRight: 40,
    },

    taskDescription: {
        marginTop: 4,
        opacity: 0.8,
    },

    completedText: {
        textDecorationLine: "line-through",
        opacity: 0.6,
    },
})
