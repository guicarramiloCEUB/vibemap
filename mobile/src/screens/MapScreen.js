import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker } from 'react-native-maps';
import CreateEventModal from '../components/CreateEventModal';
import LocationService from '../services/location';

export default function MapScreen() {
  const [showModal, setShowModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  // Obter localização real do usuário ao inicializar
  useEffect(() => {
    const getLocation = async () => {
      try {
        const location = await LocationService.getCurrentLocation();
        setUserLocation(location);
        
        // Animar para a localização com zoom
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 1000);
        }
      } catch (error) {
        console.error('Erro ao obter localização:', error);
        // Fallback: Brasília
        const fallbackLocation = {
          latitude: -15.8,
          longitude: -47.9,
        };
        setUserLocation(fallbackLocation);
        
        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: fallbackLocation.latitude,
            longitude: fallbackLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 1000);
        }
      }
    };

    getLocation();
  }, []);

  const handleCreateEvent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
        followsUserLocation={true}
        initialRegion={{
          latitude: userLocation?.latitude || -15.8,
          longitude: userLocation?.longitude || -47.9,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        {/* Markers dos eventos - a implementar quando backend tiver listagem */}
      </MapView>

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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    borderWidth: 5,
    borderColor: '#ffffff6a',
  },
});
