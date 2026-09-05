import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Mapbox from '@rnmapbox/maps';
import { observer } from 'mobx-react-lite';
import CreateEventModal from '../components/CreateEventModal';
import LocationService from '../services/location';
import { eventStore } from '../stores';

// Calcula a distância em metros entre duas coordenadas
const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Raio da terra em metros
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dp/2) * Math.sin(dp/2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl/2) * Math.sin(dl/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

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
  const [showRadiusMenu, setShowRadiusMenu] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragCurrentY, setDragCurrentY] = useState(0);



  const radiusOptions = [
    { label: '3km', value: 3000 },
    { label: '5km', value: 5000 },
    { label: '7km', value: 7000 },
    { label: '10km', value: 10000 },
  ];

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

  const handleRadiusToggle = () => {
    setShowRadiusMenu((current) => !current);
  };

  const handleRadiusSelect = (value) => {
    setRadius(value);
    setShowRadiusMenu(false);
  };

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
          intensity: 1,
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

      eventStore.fetchPendingNearbyEvents(userLocation.latitude, userLocation.longitude, radius);
    }
  }, [userLocation, radius]);

  const [eventToVote, setEventToVote] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('ws://192.168.15.101:8000/ws/events/'); // Lembre do seu IP

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);

        if (data.type === 'pending_event_created' && data.event) {
          console.log('🤫 Evento pendente recebido:', data.event.title);
          eventStore.addPendingEvent(data.event);
        } 
        else if (data.type === 'event_approved' && data.event) {
          console.log('📢 Evento APROVADO recebido:', data.event.title);
          eventStore.addRealtimeEvent(data.event);
          eventStore.removePendingEvent(data.event.id); // Tira da fila de pendentes
        }
      } catch (error) {
        console.error('Erro no WS:', error);
      }
    };
    return () => ws.close();
  }, []); // Array vazio para conectar apenas ao abrir o mapa

  useEffect(() => {
    if (!userLocation || eventStore.pendingEvents.length === 0 || eventToVote) return;

    for (const pending of eventStore.pendingEvents) {
      // GeoJSON padrão é [longitude, latitude]
      console.log(pending)
      const [lon, lat] = pending.location.coordinates; 
      const distance = getDistanceInMeters(userLocation.latitude, userLocation.longitude, lat, lon);

      if (distance <= 30) {
        setEventToVote(pending); // Dispara o popup
        break; // Mostra um por vez
      }
    }
  }, [userLocation, eventStore.pendingEvents.length, eventToVote]);

  const handleVote = async (isConfirmed) => {
    if (!eventToVote) return;

    try {
      // Aqui você chamará o seu EventStore para bater na API do Django
      await eventStore.voteOnEvent(eventToVote.id, isConfirmed);

      console.log(`Votou ${isConfirmed ? 'SIM' : 'NÃO'} no evento ${eventToVote.title}`);
    } catch (error) {
      console.error("Erro ao votar:", error);
    } finally {
      // Remove da fila local para não perguntar de novo
      eventStore.removePendingEvent(eventToVote.id);
      setEventToVote(null);
    }
  };

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
        animationDuration: 500, // animação de 300ms
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

  const handleMapPress = () => {
    if (selectedEvent) {
      setSelectedEvent(null);
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
        onPress={handleMapPress}
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

      <View style={styles.radiusMenuContainer} pointerEvents="box-none">
        {showRadiusMenu && (
          <View style={styles.radiusOptionsPanel}>
            <View style={styles.radiusOptionsHeader}>
              <Text style={styles.radiusOptionsTitle}>Filtrar raio</Text>
              <TouchableOpacity onPress={handleRadiusToggle} style={styles.radiusCloseButton}>
                <Ionicons name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            {radiusOptions.map((option) => {
              const isActive = radius === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.radiusOption, isActive && styles.radiusOptionActive]}
                  onPress={() => handleRadiusSelect(option.value)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.radiusOptionText, isActive && styles.radiusOptionTextActive]}>
                    {option.label}
                  </Text>
                  {isActive && <Ionicons name="checkmark" size={18} color="#5b21b6" />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <TouchableOpacity
          style={styles.radiusButton}
          activeOpacity={1}
          onPress={handleRadiusToggle}
        >
          <LinearGradient
            colors={['#7c3aed', '#6d28d9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.radiusButtonGradient}
          >
            <Ionicons name={showRadiusMenu ? 'close' : 'options'} size={28} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
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
      {eventToVote && (
        <View style={[styles.radiusOptionsPanel, { position: 'absolute', top: 100, alignSelf: 'center', width: '80%', zIndex: 100 }]}>
          <Text style={[styles.radiusOptionsTitle, { textAlign: 'center', marginBottom: 15, fontSize: 16 }]}>
            Você está perto de: {eventToVote.title}
          </Text>
          <Text style={{ color: '#e5e7eb', textAlign: 'center', marginBottom: 20 }}>
            Este evento realmente está acontecendo aqui?
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <TouchableOpacity 
              style={[styles.radiusCloseButton, { width: 60, height: 40, borderRadius: 8, backgroundColor: '#ef4444' }]}
              onPress={() => handleVote(false)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Não</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.radiusCloseButton, { width: 60, height: 40, borderRadius: 8, backgroundColor: '#10b981' }]}
              onPress={() => handleVote(true)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sim</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  radiusMenuContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    zIndex: 20,
    alignItems: 'flex-start',
  },
  radiusOptionsPanel: {
    marginBottom: 12,
    width: 160,
    borderRadius: 18,
    backgroundColor: 'rgba(17, 24, 39, 0.92)',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 14,
    elevation: 12,
  },
  radiusOptionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radiusOptionsTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  radiusCloseButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(124, 58, 237, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 8,
  },
  radiusOptionActive: {
    backgroundColor: '#ffffff',
  },
  radiusOptionText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
  },
  radiusOptionTextActive: {
    color: '#4c1d95',
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
    zIndex: 21,
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
