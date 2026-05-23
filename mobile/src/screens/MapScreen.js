import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Mapbox from '@rnmapbox/maps';
import { observer } from 'mobx-react-lite';
import CreateEventModal from '../components/CreateEventModal';
import LocationService from '../services/location';
import { eventStore } from '../stores/EventStore';

// Configurar token do Mapbox
Mapbox.setAccessToken('pk.eyJ1IjoiZ3VpY2FycmFtaWxvIiwiYSI6ImNtaXFhODNqZjBkcm4zY3B2bzFiZTkxNGEifQ.uMWfSP6tLfHIdBmDDN0d9g');

export default observer(function MapScreen() {
  const [showModal, setShowModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const mapRef = useRef(null);
  const cameraRef = useRef(null);

  // Obter localização real do usuário ao inicializar
  useEffect(() => {
    const getLocation = async () => {
      try {
        setIsLoading(true);
        console.log('Solicitando localização do usuário...');
        
        const location = await LocationService.getCurrentLocation();
        console.log('✅ Localização obtida:', location);
        setUserLocation(location);
        
        // Tentar centralizar assim que temos localização
        setTimeout(() => {
          handleCenterOnUser();
        }, 500);
      } catch (error) {
        console.error('❌ Erro ao obter localização:', error);
        // Fallback: Brasília
        console.log('Usando fallback: Brasília');
        setUserLocation({
          latitude: -15.8,
          longitude: -47.9,
        });
      } finally {
        setIsLoading(false);
      }
    };

    getLocation();
  }, []);

  // Buscar eventos próximos quando localização mudar
  useEffect(() => {
    if (userLocation) {
      console.log('Buscando eventos próximos a:', userLocation);
      eventStore.fetchNearbyEvents(
        userLocation.latitude,
        userLocation.longitude,
        5000 // 5km
      ).catch(error => {
        console.error('Erro ao buscar eventos próximos:', error);
      });
    }
  }, [userLocation]);

  const handleCreateEvent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCenterOnUser = () => {
    if (userLocation && cameraRef.current) {
      console.log('🎯 Recentrando no usuário:', userLocation);
      cameraRef.current.moveTo(
        [userLocation.longitude, userLocation.latitude],
        300 // animação de 300ms
      );
    }
  };

  if (isLoading || !userLocation) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={Mapbox.StyleURL.Street}
        onDidFinishLoadingMap={() => {
          console.log('📍 Mapa Mapbox carregado');
          setCameraReady(true);
        }}
      >
        {/* Câmera para controlar visualização */}
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [userLocation?.longitude || -47.9, userLocation?.latitude || -15.8],
            zoomLevel: 14,
            animationDuration: 0,
          }}
        />
        {/* Marcador de localização do usuário */}
        {userLocation && (
          <Mapbox.MarkerView
            coordinate={[userLocation.longitude, userLocation.latitude]}
          >
            <View style={styles.userMarkerContainer}>
              <View style={styles.userMarker} />
              <View style={styles.userMarkerPulse} />
            </View>
          </Mapbox.MarkerView>
        )}

        {/* Markers dos eventos */}
        {eventStore.allEvents && eventStore.allEvents.map((event) => {
          const coords = event.location?.coordinates;
          if (!coords || !coords[0] || !coords[1]) return null;

          return (
            <Mapbox.MarkerView
              key={event.id}
              coordinate={[coords[0], coords[1]]}
            >
              <View style={styles.markerContainer}>
                <View style={styles.marker}>
                  <Ionicons name="radio-button-on" size={32} color="#7c3aed" />
                </View>
              </View>
            </Mapbox.MarkerView>
          );
        })}
      </Mapbox.MapView>

      {/* Loading indicator */}
      {eventStore.loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      )}

      {/* Botão para recentrar no usuário */}
      <TouchableOpacity 
        onPress={handleCenterOnUser}
        style={styles.centerButton}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['#7c3aed', '#6d28d9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.centerButtonGradient}
        >
          <Ionicons name="locate" size={24} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Botão flutuante para criar evento */}
      <View style={styles.fabContainer}>
        <TouchableOpacity 
          onPress={handleCreateEvent}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#c13584', '#833ab4', '#405de6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={32} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Modal para criar evento */}
      <CreateEventModal 
        visible={showModal} 
        onClose={handleCloseModal}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    
  },
  userMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  userMarkerPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  centerButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
  centerButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 80,
    right: 20,
  },
  fabGradient: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -25,
    marginTop: -25,
    zIndex: 100,
  },
});
