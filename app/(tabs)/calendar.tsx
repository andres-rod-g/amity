import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import AppConstants from "@/constants/AppConstants";
import { Colors } from "@/constants/Colors";
import { ScrollView, StyleSheet, useColorScheme, View, TouchableOpacity, Alert, TextInput, Modal } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import { useAppStore } from "@/store/useAppStore";
import { MenstrualCycle } from "@/types";

// Configuración del idioma para el calendario
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ],
  monthNamesShort: [
    'Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'
  ],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const SYMPTOMS_OPTIONS = [
  'Cólicos', 'Dolor de cabeza', 'Hinchazón', 'Sensibilidad en senos', 
  'Cambios de humor', 'Fatiga', 'Ansiedad', 'Acné', 'Antojos', 'Náuseas'
];

const MOOD_OPTIONS = [
  { key: 'muy_bien', label: '😄 Muy bien' },
  { key: 'bien', label: '🙂 Bien' },
  { key: 'normal', label: '😐 Normal' },
  { key: 'mal', label: '😔 Mal' },
  { key: 'muy_mal', label: '😭 Muy mal' },
];

const FLOW_OPTIONS = [
  { key: 'muy_ligero', label: '💧 Muy ligero' },
  { key: 'ligero', label: '💧💧 Ligero' },
  { key: 'normal', label: '💧💧💧 Normal' },
  { key: 'abundante', label: '💧💧💧💧 Abundante' },
  { key: 'muy_abundante', label: '💧💧💧💧💧 Muy abundante' },
];

export default function TabCalendar() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { 
    calendarEvents, 
    addCalendarEvent, 
    deleteCalendarEvent,
    menstrualCycles,
    menstrualSettings,
    addMenstrualCycle,
    deleteMenstrualCycle,
    getCurrentCycleDay,
    getPredictedNextPeriod
  } = useAppStore();

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showMenstrualModal, setShowMenstrualModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  
  // Estados para el ciclo menstrual
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<MenstrualCycle['mood']>('normal');
  const [selectedFlow, setSelectedFlow] = useState<MenstrualCycle['flow']>('normal');
  const [menstrualNotes, setMenstrualNotes] = useState('');

  // Crear fechas marcadas simple
  const createMarkedDates = () => {
    const marked: Record<string, any> = {};
    
    // Marcar eventos regulares
    calendarEvents.forEach(event => {
      marked[event.date] = { 
        marked: true, 
        dotColor: "#ffffff" 
      };
    });

    // Marcar períodos
    menstrualCycles.forEach(cycle => {
      const startDate = new Date(cycle.startDate);
      const periodLength = cycle.periodLength || 5;
      
      for (let i = 0; i < periodLength; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        marked[dateStr] = {
          ...marked[dateStr],
          selected: false,
          selectedColor: '#ae30d5',
          customStyles: {
            container: {
              backgroundColor: '#ae30d5',
              borderRadius: 16,
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
            },
          },
        };
      }
    });

    // Marcar día seleccionado
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: Colors[colorScheme ?? 'light'].accent,
    };

    return marked;
  };

  // Obtener información del día seleccionado
  const getSelectedDateInfo = () => {
    const events = calendarEvents.filter(event => event.date === selectedDate);
    
    // Buscar si hay registro menstrual para este día
    const currentCycle = menstrualCycles.find(cycle => {
      const startDate = new Date(cycle.startDate);
      const periodLength = cycle.periodLength || 5;
      const checkDate = new Date(selectedDate);
      
      for (let i = 0; i < periodLength; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        if (currentDate.toDateString() === checkDate.toDateString()) {
          return true;
        }
      }
      return false;
    });

    return { events, currentCycle };
  };

  const selectedInfo = getSelectedDateInfo();

  // Manejar agregar evento regular
  const handleAddEvent = () => {
    if (newEventTitle.trim() === '') {
      Alert.alert('Error', 'Por favor, escribe un título para el evento.');
      return;
    }
    
    addCalendarEvent(
      newEventTitle.trim(), 
      newEventDescription.trim(), 
      selectedDate, 
      newEventTime.trim() || undefined
    );
    
    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventTime('');
    setShowAddForm(false);
  };

  // Manejar registrar período
  const handleAddMenstrualData = () => {
    addMenstrualCycle(selectedDate, selectedSymptoms, selectedMood, selectedFlow, menstrualNotes.trim() || undefined);
    
    // Limpiar formulario
    setSelectedSymptoms([]);
    setSelectedMood('normal');
    setSelectedFlow('normal');
    setMenstrualNotes('');
    setShowMenstrualModal(false);
  };

  // Manejar eliminar evento
  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    Alert.alert(
      'Eliminar Evento',
      `¿Estás seguro de que quieres eliminar "${eventTitle}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => deleteCalendarEvent(eventId) },
      ]
    );
  };

  // Alternar síntoma
  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const cycleDay = getCurrentCycleDay();
  const nextPeriod = getPredictedNextPeriod();

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        {/* Header con información del ciclo */}
        {menstrualSettings.trackingEnabled && (
          <View style={styles.cycleHeader}>
            <ThemedText type="subtitle" style={styles.cycleTitle}>🌸 Mi Ciclo</ThemedText>
            <View style={styles.cycleInfo}>
              {cycleDay && (
                <View style={styles.cycleCard}>
                  <ThemedText style={styles.cycleLabel}>Día del ciclo</ThemedText>
                  <ThemedText style={styles.cycleValue}>{cycleDay}</ThemedText>
                </View>
              )}
              {nextPeriod && (
                <View style={styles.cycleCard}>
                  <ThemedText style={styles.cycleLabel}>Próximo período</ThemedText>
                  <ThemedText style={styles.cycleValue}>
                    {new Date(nextPeriod).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Calendario */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarWrapper}>
            <Calendar
              monthFormat="MMMM, yyyy"
              current={new Date(selectedDate)}
              markedDates={createMarkedDates()}
              onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
              markingType={'custom'}
              disableMonthChange={false}
              firstDay={1}
              hideDayNames={false}
              disableAllTouchEventsForDisabledDays={true}
              style={styles.calendar}
              theme={{
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                calendarBackground: Colors[colorScheme ?? 'light'].background,
                textSectionTitleColor: Colors[colorScheme ?? 'light'].text,
                selectedDayBackgroundColor: Colors[colorScheme ?? 'light'].accent,
                selectedDayTextColor: '#ffffff',
                todayTextColor: Colors[colorScheme ?? 'light'].accent,
                dayTextColor: Colors[colorScheme ?? 'light'].text,
                textDisabledColor: Colors[colorScheme ?? 'light'].textDisabled,
                arrowColor: Colors[colorScheme ?? 'light'].accent,
                monthTextColor: Colors[colorScheme ?? 'light'].text,
                indicatorColor: Colors[colorScheme ?? 'light'].accent,
                textDayFontFamily: 'System',
                textMonthFontFamily: 'System',
                textDayHeaderFontFamily: 'System',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 13,
              }}
            />
          </View>
        </View>

        {/* Leyenda */}
        <View style={styles.legend}>
          <ThemedText style={styles.legendTitle}>Categorías:</ThemedText>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#ae30d5' }]} />
              <ThemedText style={styles.legendText}>Período</ThemedText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]} />
              <ThemedText style={styles.legendText}>Eventos</ThemedText>
            </View>
          </View>
        </View>

        {/* Información del día */}
        <View style={styles.dayInfo}>
          <View style={styles.sectionHeader}>
            <ThemedText type="title">
              {(() => {
                const [year, month, day] = selectedDate.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                
                // Nombres de días y meses en español
                const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
                const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
                
                const diaSemana = diasSemana[date.getDay()];
                const mes = meses[date.getMonth()];
                
                // Capitalizar primera letra del día
                const diaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
                
                return `${diaCapitalizado}, ${day} de ${mes} de ${year}`;
              })()}
            </ThemedText>
            <View style={styles.actionButtons}>
              {menstrualSettings.trackingEnabled && (
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: '#ae30d5' }]}
                  onPress={() => setShowMenstrualModal(true)}
                >
                  <ThemedText style={styles.addButtonText}>🌸 Período</ThemedText>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.addButton, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]}
                onPress={() => setShowAddForm(!showAddForm)}
              >
                <ThemedText style={styles.addButtonText}>
                  {showAddForm ? 'Cancelar' : '+ Evento'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Registro menstrual */}
          {selectedInfo.currentCycle && (
            <View style={styles.menstrualRecord}>
              <View style={styles.recordHeader}>
                <ThemedText type="subtitle">Registro Menstrual</ThemedText>
                <TouchableOpacity onPress={() => deleteMenstrualCycle(selectedInfo.currentCycle!.id)}>
                  <ThemedText style={styles.deleteText}>Eliminar</ThemedText>
                </TouchableOpacity>
              </View>
              
              <View style={styles.recordContent}>
                <View style={styles.recordItem}>
                  <ThemedText style={styles.recordLabel}>Estado de ánimo:</ThemedText>
                  <ThemedText style={styles.recordValue}>
                    {MOOD_OPTIONS.find(m => m.key === selectedInfo.currentCycle!.mood)?.label}
                  </ThemedText>
                </View>
                
                <View style={styles.recordItem}>
                  <ThemedText style={styles.recordLabel}>Flujo:</ThemedText>
                  <ThemedText style={styles.recordValue}>
                    {FLOW_OPTIONS.find(f => f.key === selectedInfo.currentCycle!.flow)?.label}
                  </ThemedText>
                </View>

                {selectedInfo.currentCycle.symptoms.length > 0 && (
                  <View style={styles.recordItem}>
                    <ThemedText style={styles.recordLabel}>Síntomas:</ThemedText>
                    <View style={styles.symptomsContainer}>
                      {selectedInfo.currentCycle.symptoms.map((symptom, index) => (
                        <View key={index} style={styles.symptomTag}>
                          <ThemedText style={styles.symptomText}>{symptom}</ThemedText>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {selectedInfo.currentCycle.notes && (
                  <View style={styles.recordItem}>
                    <ThemedText style={styles.recordLabel}>Notas:</ThemedText>
                    <ThemedText style={styles.recordValue}>{selectedInfo.currentCycle.notes}</ThemedText>
                  </View>
                )}
              </View>
            </View>
          )}
          
          {/* Formulario para agregar evento */}
          {showAddForm && (
            <View style={styles.form}>
              <ThemedText type="subtitle" style={{ marginBottom: 10 }}>Nuevo Evento</ThemedText>
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
                placeholder="Título del evento"
                placeholderTextColor={Colors[colorScheme ?? 'light'].textDisabled}
                value={newEventTitle}
                onChangeText={setNewEventTitle}
              />
              <TextInput
                style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
                placeholder="Hora (opcional)"
                placeholderTextColor={Colors[colorScheme ?? 'light'].textDisabled}
                value={newEventTime}
                onChangeText={setNewEventTime}
              />
              <TextInput
                style={[styles.input, styles.textArea, { color: Colors[colorScheme ?? 'light'].text }]}
                placeholder="Descripción (opcional)"
                placeholderTextColor={Colors[colorScheme ?? 'light'].textDisabled}
                value={newEventDescription}
                onChangeText={setNewEventDescription}
                multiline
                numberOfLines={3}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setShowAddForm(false)}
                >
                  <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].accent }]} 
                  onPress={handleAddEvent}
                >
                  <ThemedText style={styles.buttonText}>Agregar</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Lista de eventos */}
          {selectedInfo.events.length > 0 && (
            <View style={styles.eventsSection}>
              <ThemedText type="subtitle" style={{ marginBottom: 10 }}>Eventos</ThemedText>
              {selectedInfo.events.map((event) => (
                <TouchableOpacity 
                  key={event.id} 
                  style={styles.eventItem}
                  onLongPress={() => handleDeleteEvent(event.id, event.title)}
                >
                  <View style={styles.eventIndicator} />
                  <View style={styles.eventContent}>
                    <View style={styles.eventHeader}>
                      <ThemedText type="subtitle">{event.title}</ThemedText>
                      {event.time && (
                        <ThemedText style={styles.eventTime}>{event.time}</ThemedText>
                      )}
                    </View>
                    {event.description && (
                      <ThemedText style={styles.eventDescription}>{event.description}</ThemedText>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Estado vacío */}
          {selectedInfo.events.length === 0 && !selectedInfo.currentCycle && (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyStateText}>No hay información para este día</ThemedText>
              <ThemedText style={styles.emptyStateSubtext}>¡Agrega un evento o registra tu período!</ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal para registro menstrual */}
      <Modal
        visible={showMenstrualModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMenstrualModal(false)}
      >
        <ThemedView style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText type="title">🌸 Registrar Período</ThemedText>
              <TouchableOpacity onPress={() => setShowMenstrualModal(false)}>
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Estado de ánimo */}
            <View style={styles.formSection}>
              <ThemedText type="subtitle" style={styles.formLabel}>¿Cómo te sientes?</ThemedText>
              <View style={styles.optionsGrid}>
                {MOOD_OPTIONS.map((mood) => (
                  <TouchableOpacity
                    key={mood.key}
                    style={[
                      styles.optionButton,
                      selectedMood === mood.key && styles.selectedOption
                    ]}
                    onPress={() => setSelectedMood(mood.key as MenstrualCycle['mood'])}
                  >
                    <ThemedText style={[
                      styles.optionText,
                      selectedMood === mood.key && styles.selectedOptionText
                    ]}>
                      {mood.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Flujo menstrual */}
            <View style={styles.formSection}>
              <ThemedText type="subtitle" style={styles.formLabel}>Intensidad del flujo</ThemedText>
              <View style={styles.optionsGrid}>
                {FLOW_OPTIONS.map((flow) => (
                  <TouchableOpacity
                    key={flow.key}
                    style={[
                      styles.optionButton,
                      selectedFlow === flow.key && styles.selectedOption
                    ]}
                    onPress={() => setSelectedFlow(flow.key as MenstrualCycle['flow'])}
                  >
                    <ThemedText style={[
                      styles.optionText,
                      selectedFlow === flow.key && styles.selectedOptionText
                    ]}>
                      {flow.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Síntomas */}
            <View style={styles.formSection}>
              <ThemedText type="subtitle" style={styles.formLabel}>Síntomas (opcional)</ThemedText>
              <View style={styles.symptomsGrid}>
                {SYMPTOMS_OPTIONS.map((symptom) => (
                  <TouchableOpacity
                    key={symptom}
                    style={[
                      styles.symptomButton,
                      selectedSymptoms.includes(symptom) && styles.selectedSymptom
                    ]}
                    onPress={() => toggleSymptom(symptom)}
                  >
                    <ThemedText style={[
                      styles.symptomButtonText,
                      selectedSymptoms.includes(symptom) && styles.selectedSymptomText
                    ]}>
                      {symptom}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notas */}
            <View style={styles.formSection}>
              <ThemedText type="subtitle" style={styles.formLabel}>Notas (opcional)</ThemedText>
              <TextInput
                style={[styles.input, styles.textArea, { color: Colors[colorScheme ?? 'light'].text }]}
                placeholder="Escribe cualquier observación adicional..."
                placeholderTextColor={Colors[colorScheme ?? 'light'].textDisabled}
                value={menstrualNotes}
                onChangeText={setMenstrualNotes}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Botones de acción */}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setShowMenstrualModal(false)}
              >
                <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, { backgroundColor: '#ae30d5' }]} 
                onPress={handleAddMenstrualData}
              >
                <ThemedText style={styles.buttonText}>Guardar</ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  cycleHeader: {
    marginBottom: 20,
    padding: 20,
    borderRadius: AppConstants.borderRadius,
    borderWidth: 1,
    borderColor: '#ae30d520',
    backgroundColor: '#ae30d510',
  },
  cycleTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  cycleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cycleCard: {
    alignItems: 'center',
  },
  cycleLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  cycleValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ae30d5',
  },
  calendarContainer: {
    marginBottom: 20,
  },
  calendarWrapper: {
    overflow: 'hidden',
    marginTop: -30,
  },
  calendar: {
    marginTop: 30,
  },
  legend: {
    marginBottom: 20,
    padding: 15,
    borderRadius: AppConstants.borderRadius,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
  },
  dayInfo: {
    gap: 15,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  addButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: AppConstants.borderRadius,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  menstrualRecord: {
    padding: 20,
    borderRadius: AppConstants.borderRadius,
    borderWidth: 2,
    borderColor: '#ae30d5',
    backgroundColor: '#ae30d510',
    marginBottom: 15,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  deleteText: {
    color: '#ae30d5',
    fontSize: 14,
    fontWeight: '600',
  },
  recordContent: {
    gap: 12,
  },
  recordItem: {
    gap: 4,
  },
  recordLabel: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  recordValue: {
    fontSize: 14,
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  symptomTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ae30d5',
    borderRadius: 12,
  },
  symptomText: {
    fontSize: 12,
    color: 'white',
  },
  form: {
    padding: 20,
    borderRadius: AppConstants.borderRadius,
    borderWidth: 1,
    borderColor: '#ffffff20',
    gap: 12,
    marginBottom: 15,
  },
  input: {
    padding: 12,
    borderColor: '#ffffff20',
    borderWidth: 1,
    borderRadius: AppConstants.borderRadius,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: AppConstants.borderRadius,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ffffff20',
  },
  buttonText: {
    fontWeight: '600',
  },
  eventsSection: {
    marginBottom: 15,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: AppConstants.borderRadius,
    borderWidth: 1,
    borderColor: '#ffffff20',
    marginBottom: 8,
    gap: 12,
  },
  eventIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ae30d5',
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  eventDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff20',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: 25,
  },
  formLabel: {
    marginBottom: 15,
  },
  optionsGrid: {
    gap: 10,
  },
  optionButton: {
    padding: 15,
    borderRadius: AppConstants.borderRadius,
    borderWidth: 1,
    borderColor: '#ffffff20',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#ae30d5',
    borderColor: '#ae30d5',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff20',
  },
  selectedSymptom: {
    backgroundColor: '#ae30d5',
    borderColor: '#ae30d5',
  },
  symptomButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectedSymptomText: {
    color: 'white',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 30,
    marginBottom: 40,
  },
});
