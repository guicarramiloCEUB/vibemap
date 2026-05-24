import 'react-native-gesture-handler'; // necessario para detectar gestos de swipe, etc
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Navigation from './src/navigation';


// o app funciona como o tronco principal do nosso app
// a partir daqui, o app se ramifica para as outras telas, através do Navigation
export default function App() {
  return (
    <SafeAreaProvider> // garante que o app respeite as áreas seguras do dispositivo, como a notch, etc
      <SafeAreaView style={{ flex: 1 }}>
        <Navigation /> // componente de navegação, que gerencia as telas do app
      </SafeAreaView>
    </SafeAreaProvider>
  );
}