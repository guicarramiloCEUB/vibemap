import React from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import GradientBackground from './GradientBackground';

export default function AuthLayout({
  children, // renderiza os componentes filhos dentro do layout, que no caso são os inputs e o botão de login
  logo = true, // por padrão, o logo é mostrado, mas pode ser desabilitado passando logo={false} como prop
}) {
  return (
    <GradientBackground>
      {/* componente de fundo com gradiente, que envolve todo o layout */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
      {/* KeyboardAvoidingView é um componente do React Native que ajusta 
      automaticamente a posição dos elementos na tela quando o 
      teclado é aberto, para evitar que os inputs fiquem escondidos 
      atrás do teclado. O comportamento é diferente entre iOS e Android, 
      por isso usamos uma condição para definir o comportamento correto para cada plataforma. */}
        
      
        <View style={styles.container}>
          
          {/* container principal que ocupa a tela toda, englobando todos os elementos */}
          {logo && (
            <View style={styles.logoContainer}>
              {/* container para o logo */}
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          )}

          <View style={styles.content}>
            {/* container onde os elementos filhos 
            são renderizados, que no caso são os componentes de login */}
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  content: {
    width: '100%',
  },
});