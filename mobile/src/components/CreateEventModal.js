import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, ScrollView, TextInput, ActivityIndicator, Alert, PanResponder } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import AuthInput from './AuthInput';
import { eventStore } from '../stores/EventStore';
import LocationService from '../services/location';

export default observer(function CreateEventModal({ visible, onClose }) {
  const [fadeAnimation] = useState(new Animated.Value(0));
  const [heightAnimation] = useState(new Animated.Value(0.5)); // 0.5 = 50%, 0.85 = 85%
  const panResponderRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type_id: null,
  });

  useEffect(() => {
    // Setup PanResponder para drag
    panResponderRef.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Movimento negativo = para cima (aumenta height)
        const newHeight = Math.min(0.85, Math.max(0.4, 0.5 - gestureState.dy / 2000));
        heightAnimation.setValue(newHeight);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Snap para 50% ou 85% baseado na velocidade/posição
        const finalHeight = gestureState.dy < -30 ? 0.85 : 0.5;
        Animated.spring(heightAnimation, {
          toValue: finalHeight,
          useNativeDriver: false,
          friction: 8,
        }).start();
      },
    });
  }, [heightAnimation]);

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Carregar tipos de eventos quando modal abrir
      eventStore.fetchEventTypes();
    } else {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnimation]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validar campos obrigatórios
    if (!formData.title.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o título do evento');
      return;
    }

    try {
      // Obter localização do usuário
      const location = await LocationService.getCurrentLocation();

      // Preparar dados do evento
      const eventData = {
        title: formData.title,
        description: formData.description,
        event_type_id: formData.event_type_id,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      // Criar evento via store
      await eventStore.createEvent(eventData);

      // Limpar formulário e fechar modal
      setFormData({ title: '', description: '', event_type_id: null });
      Alert.alert('Sucesso', 'Evento criado com sucesso!');
      onClose();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o evento. Tente novamente.');
      console.error('Erro ao criar evento:', error);
    }
  };

  return (
    <>
      {/* Overlay com Fade Animation - Separado do Modal */}
      <Animated.View 
        style={[
          styles.overlayWrapper,
          { opacity: fadeAnimation }
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Modal com Slide Animation */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalContent}>
          <Animated.View 
            style={[
              styles.container,
              { 
                height: heightAnimation.interpolate({
                  inputRange: [0.4, 0.85],
                  outputRange: ['40%', '85%'],
                })
              }
            ]}
          >
            {/* Drag Handle */}
            <View 
              style={styles.dragHandle}
              {...panResponderRef.current?.panHandlers}
            >
              <View style={styles.dragIndicator} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Criar Evento</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Formulário */}
            <ScrollView 
              style={styles.form}
              showsVerticalScrollIndicator={false}
            >
              <AuthInput
                icon="document-text"
                placeholder="Título do evento"
                value={formData.title}
                onChangeText={(text) => handleChange('title', text)}
              />
              
              {/* Picker de Tipo de Evento */}
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Tipo de evento</Text>
                {eventStore.loadingTypes ? (
                  <View style={styles.pickerLoading}>
                    <ActivityIndicator color="#999" />
                  </View>
                ) : (
                  <Picker
                    style={styles.picker}
                    selectedValue={formData.event_type_id}
                    onValueChange={(value) => handleChange('event_type_id', value)}
                  >
                    <Picker.Item label="Selecione um tipo" value={null} />
                    {eventStore.eventTypes.map((type) => (
                      <Picker.Item 
                        key={type.id} 
                        label={type.name} 
                        value={type.id} 
                      />
                    ))}
                  </Picker>
                )}
              </View>
              
              <View style={styles.descriptionInputWrapper}>
                <Ionicons
                  name="reader"
                  size={20}
                  color="#999"
                  style={styles.descriptionIcon}
                />
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Descrição"
                  value={formData.description}
                  onChangeText={(text) => handleChange('description', text)}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#ccc"
                />
              </View>
              <View style={styles.footer}>
                <TouchableOpacity 
                  style={[
                    styles.submitButton,
                    eventStore.loading && styles.submitButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={eventStore.loading}
                >
                  {eventStore.loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Criar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
        </Animated.View>
        </View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  overlayWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  overlay: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 30,
  },
  dragHandle: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  form: {
    flex: 1,
    paddingVertical: 10,
  },
  pickerContainer: {
    backgroundColor: '#f0f0f055',
    borderRadius: 15,
    marginVertical: 8,
    borderColor: '#333',
    borderWidth: 1,
    overflow: 'hidden',
  },
  pickerLabel: {
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  picker: {
    width: '100%',
  },
  pickerLoading: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionInputWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f055',
    borderRadius: 15,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderColor: '#333',
    borderWidth: 1,
    paddingTop: 12,
    paddingBottom: 12,
  },
  descriptionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  descriptionInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    padding: 0,
    textAlignVertical: 'top',
    maxHeight: 120,
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: '#fd1d1d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
