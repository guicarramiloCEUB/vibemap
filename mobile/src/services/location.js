import * as Location from 'expo-location';

const LocationService = {
  /**
   * Solicita permissão de localização
   */
  async requestPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  },

  /**
   * Verifica se tem permissão de localização
   */
  async hasPermission() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return false;
    }
  },

  /**
   * Pega a localização atual do usuário
   * @returns { { latitude, longitude, accuracy } } coordenadas
   */
  async getCurrentLocation() {
    try {
      const hasPermission = await this.hasPermission();
      if (!hasPermission) {
        const granted = await this.requestPermission();
        if (!granted) {
          throw new Error('Permissão de localização negada');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      throw error;
    }
  },

  /**
   * Inicia monitoramento contínuo de localização
   * @param {Function} onLocationChange - callback chamado quando localização muda
   * @returns {Function} função para parar monitoramento
   */
  startLocationTracking(onLocationChange) {
    const subscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 1000, // atualiza a cada 1 segundo
        distanceInterval: 10, // ou quando se move 10 metros
      },
      (location) => {
        onLocationChange({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy,
        });
      }
    );

    // Retorna função para parar tracking
    return async () => {
      const sub = await subscription;
      sub.remove();
    };
  },

  /**
   * Geocode: converte coordenadas em endereço
   */
  async getAddressFromCoords(latitude, longitude) {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results.length > 0) {
        const address = results[0];
        return `${address.street}, ${address.city}`;
      }
      return 'Localização desconhecida';
    } catch (error) {
      console.error('Erro ao fazer geocode reverso:', error);
      return null;
    }
  },
};

export default LocationService;
