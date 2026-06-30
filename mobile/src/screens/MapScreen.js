import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Mapbox from '@rnmapbox/maps';
import Slider from '@react-native-community/slider';
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
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(16);
  const [radius, setRadius] = useState(5000); // Raio de busca em metros
  const [showRadiusSlider, setShowRadiusSlider] = useState(false);
  const [radiusPress, setRadiusPress] = useState(false);
  const [radiusPressTimeout, setRadiusPressTimeout] = useState(null);
  const [radiusPressStart, setRadiusPressStart] = useState(null);
  const [radiusPressDuration, setRadiusPressDuration] = useState(0);
  const [radiusPressInterval, setRadiusPressInterval] = useState(null);
  const [radiusPressDirection, setRadiusPressDirection] = useState(null);
  const [radiusPressLastValue, setRadiusPressLastValue] = useState(radius);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        setIsDragging(true);
        setDragStartY(gestureState.y0);
        setDragCurrentY(gestureState.moveY);
      },
      onPanResponderMove: (evt, gestureState) => {
        setDragCurrentY(gestureState.moveY);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        setDragStartY(0);
        setDragCurrentY(0);
      },
    })
  ).current;

  const handleRadiusPressIn = () => {
    setRadiusPress(true);
    setRadiusPressStart(Date.now());
    setRadiusPressLastValue(radius);

    const interval = setInterval(() => {
      const duration = Date.now() - radiusPressStart;
      let newRadius = radiusPressLastValue;

      if (duration > 2000) {
        newRadius += 100; // Aumenta mais rápido após 2 segundos
      } else if (duration > 1000) {
        newRadius += 50; // Aumenta mais rápido após 1 segundo
      } else {
        newRadius += 10; // Aumenta lentamente no início
      }

      if (newRadius > 10000) newRadius = 10000; // Limite máximo
      setRadius(newRadius);
      setRadiusPressLastValue(newRadius);
    }, 100);

    setRadiusPressInterval(interval);
  };

  const handleRadiusPressOut = () => {
    setRadiusPress(false);
    clearInterval(radiusPressInterval);
    setRadiusPressInterval(null);
    setRadiusPressStart(null);
    setRadiusPressDuration(0);
  };

  const handleRadiusSet = () => {
    setShowRadiusSlider(!showRadiusSlider);
  }

  const [selectedEvent, setSelectedEvent] = useState(null);
  const mapRef = useRef(null);
  const cameraRef = useRef(null);
  const isZoomedIn = zoomLevel >= 15.5;
  const heatmapZoomCap = 15;

  // Converter eventos em GeoJSON para heatmap
  const getHeatmapGeoJSON = () => {
    if (!eventStore.allEvents || eventStore.allEvents.length === 0) {
      return { type: 'FeatureCollection', features: [] };
    }

    const features = eventStore.allEvents
      .filter(event => event.location?.coordinates?.[0] && event.location?.coordinates?.[1])
      .map(event => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: event.location.coordinates,
        },
        properties: {
          id: event.id,
          title: event.title,
          intensity: 1, // Peso uniforme, pode variar por tipo de evento
        },
      }));

    return { type: 'FeatureCollection', features };
  };

  // Obter localização real do usuário ao inicializar
  useEffect(() => {
    const getLocation = async () => {
      try {
        setIsLoading(true);
        console.log('Solicitando localização do usuário...');
        
        const location = await LocationService.getCurrentLocation();
        console.log('✅ Localização obtida:', location);
        setUserLocation(location);
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
        radius
      ).catch(error => {
        console.error('Erro ao buscar eventos próximos:', error);
      });
    }
  }, [userLocation, radius]);

  const handleCreateEvent = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCenterOnUser = () => {
    if (userLocation && cameraRef.current) {
      console.log('🎯 Recentrando no usuário:', userLocation);
      cameraRef.current.setCamera({
        centerCoordinate: [userLocation.longitude, userLocation.latitude],
        animationDuration: 300, // animação de 300ms
        zoomLevel: 16
      });
    }
  };

  const handleHeatmapPress = (event) => {
    const coords =
      event?.features?.[0]?.geometry?.coordinates ||
      event?.geometry?.coordinates ||
      event?.coordinates?.coordinates;

    const featureEventId = event?.features?.[0]?.properties?.id;
    if (featureEventId && eventStore.allEvents) {
      const match = eventStore.allEvents.find(item => item.id === featureEventId);
      if (match) {
        setSelectedEvent(match);
      }
    }

    if (coords && cameraRef.current) {
      console.log('🔥 Centralizando no heatmap:', coords);
      const targetZoom = Math.max(zoomLevel, 16.5);
      cameraRef.current.setCamera({
        centerCoordinate: coords,
        zoomLevel: targetZoom,
        animationDuration: 350,
      });
    }
  };

  const handlePinPress = (eventItem) => {
    if (!eventItem?.location?.coordinates || !cameraRef.current) return;

    const coords = eventItem.location.coordinates;
    setSelectedEvent(eventItem);
    cameraRef.current.setCamera({
      centerCoordinate: coords,
      zoomLevel: Math.max(zoomLevel, 17),
      animationDuration: 300,
    });
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
        styleURL="mapbox://styles/mapbox/standard"
        scaleBarEnabled={false}
        onDidFinishLoadingMap={() => {
          console.log('📍 Mapa Mapbox Standard carregado');
          setCameraReady(true);
          // Centraliza no usuário assim que o mapa terminar de carregar em tela
          handleCenterOnUser();
        }}
        onCameraChanged={(event) => {
          const zoom = event?.properties?.zoom;
          if (typeof zoom === 'number') {
            setZoomLevel(zoom);
          }
        }}
      >
        {/* Câmera para controlar visualização */}
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [userLocation?.longitude || -47.9, userLocation?.latitude || -15.8],
            zoomLevel: 16,
            pitch: 60,
            animationDuration: 0,
          }}
        />

        <Mapbox.StyleImport
          id="basemap"
          existing
          config={{
            lightPreset: 'dusk',
            show3dBuildings: 'true',
            showPointOfInterestLabels: 'true',
          }}
        />

        {/* Heatmap de eventos */}
        {showHeatmap && (
          <Mapbox.ShapeSource
            id="eventHeatmapSource"
            shape={getHeatmapGeoJSON()}
            onPress={handleHeatmapPress}
            hitbox={{ width: 24, height: 24 }}
          >
            <Mapbox.CircleLayer
              id="eventHeatmapHitbox"
              style={{
                circleRadius: [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  10, 10,
                  14, 16,
                  18, 20,
                ],
                circleColor: '#000000',
                circleOpacity: 0.01,
              }}
            />
            <Mapbox.HeatmapLayer
              id="eventHeatmap"
              style={{
                heatmapRadius: [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  10, 20,
                  12, 40,
                  14, 70,
                  heatmapZoomCap, 90,
                  18, 90,
                ],
                heatmapWeight: ['get', 'intensity'],
                heatmapIntensity: [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  10, 0.4,
                  12, 0.6,
                  heatmapZoomCap, 0.9,
                  18, 0.9,
                ],
                heatmapColor: [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(0, 0, 255, 0)',      // Transparente
                  0.2, 'rgba(65, 105, 225, 0.8)',    // Azul
                  0.4, 'rgba(124, 58, 237, 0.8)',    // Roxo
                  0.6, 'rgba(236, 72, 153, 0.8)',    // Rosa
                  0.8, 'rgba(239, 68, 68, 0.8)',     // Vermelho
                  1, 'rgba(159, 18, 57, 1)',         // Vermelho escuro
                ],
                heatmapOpacity: 0.7,
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {/* Pins 3D quando zoom estiver proximo */}
        {isZoomedIn && eventStore.allEvents && eventStore.allEvents.map((event) => {
          const coords = event.location?.coordinates;
          if (!coords || !coords[0] || !coords[1]) return null;

          return (
            <Mapbox.MarkerView
              key={`pin-${event.id}`}
              coordinate={[coords[0], coords[1]]}
              anchor={{ x: 0.5, y: 1 }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handlePinPress(event)}
                style={styles.pin3dContainer}
              >
                {selectedEvent?.id === event.id && (
                  <View style={styles.eventPopup}
                    pointerEvents="none"
                  >
                    <View style={styles.eventPopupImageContainer}>
                      <Image 
                        source={require('../../assets/backgrounds/login-background.png')} 
                        style={styles.eventPopupImage} 
                      />
                    </View>
                    <Text style={styles.eventPopupTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                    <View style={styles.eventPopupContentArea}>
                      <Text style={styles.eventPopupDesc} numberOfLines={3}>
                        {event.description || 'Informações gerais do evento:\nNenhum detalhe adicional fornecido.'}
                      </Text>
                    </View>
                    <View style={styles.eventPopupArrow} />
                  </View>
                )}
                <View style={styles.pin3dShadow} />
                <LinearGradient
                  colors={['#a855f7', '#7c3aed', '#5b21b6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.pin3dHead}
                >
                  <View style={styles.pin3dInner} />
                </LinearGradient>
                <View style={styles.pin3dStem} />
              </TouchableOpacity>
            </Mapbox.MarkerView>
          );
        })}

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

      {/* Botão para toggle heatmap */}
      <TouchableOpacity 
        onPress={() => setShowHeatmap(!showHeatmap)}
        style={[styles.heatmapButton, !showHeatmap && styles.heatmapButtonInactive]}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={showHeatmap ? ['#c13584', '#833ab4'] : ['#6b7280', '#4b5563']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heatmapButtonGradient}
        >
          <Ionicons name={showHeatmap ? "flame" : "flame-outline"} size={20} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.radiusButton]} 
        activeOpacity={1}
        onPress={handleRadiusSet}
      >
        <LinearGradient
          colors={['#7c3aed', '#6d28d9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.radiusButtonGradient}
        >
          <Ionicons name="options" size={28} color="#fff" /> 
        </LinearGradient>
      </TouchableOpacity>
      <View 
        style={{ position: 'absolute', top: 80, left: 20, right: 20, alignItems: 'center' }}
        visible={showRadiusSlider}
      >
          <LinearGradient
            colors={['#7c3aed', '#6d28d9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: '100%', borderRadius: 8, paddingVertical: 4, marginBottom: 8 }}
          >
            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: '600' }}>
              Raio de busca: {radius} metros
            </Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              onPressIn={handleRadiusPressIn}
              onPressOut={handleRadiusPressOut}
              panResponder={panResponder.panHandlers}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#d1d5db"
              thumbTintColor="#fff"
              step={10}
              minimumValue={1000}
              maximumValue={10000}
              value={radius}
              onValueChange={setRadius}
              thumbStyle={styles.sliderThumb}
              trackStyle={styles.sliderTrack}
            />
          </LinearGradient>
        </View>
      

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
  heatmapButton: {
    position: 'absolute',
    top: 80,
    right: 20,
    zIndex: 10,
  },
  heatmapButtonInactive: {
    opacity: 0.6,
  },
  heatmapButtonGradient: {
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
  pin3dContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  eventPopup: {
    position: 'absolute',
    bottom: 50,
    width: 200,
    paddingTop: 45,
    paddingBottom: 15,
    borderRadius: 16,
    backgroundColor: '#737373',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  eventPopupImageContainer: {
    position: 'absolute',
    top: -30,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#e11d48',
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  eventPopupImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  eventPopupTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  eventPopupContentArea: {
    backgroundColor: '#d4d4d8',
    width: '100%',
    padding: 12,
    minHeight: 80,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  eventPopupDesc: {
    color: '#1f2937',
    fontSize: 10,
    textAlign: 'center',
  },
  eventPopupArrow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 12,
    backgroundColor: '#d4d4d8',
    transform: [{ rotate: '45deg' }],
  },
  pin3dShadow: {
    position: 'absolute',
    bottom: -2,
    width: 22,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    transform: [{ scaleX: 1.1 }],
  },
  pin3dHead: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  pin3dInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f5f3ff',
    opacity: 0.9,
  },
  pin3dStem: {
    width: 8,
    height: 14,
    borderRadius: 4,
    marginTop: -4,
    backgroundColor: '#4c1d95',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
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
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d1d5db',
  },
  radiusButton: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    zIndex: 10,
  },
  radiusButtonGradient: {
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
});
