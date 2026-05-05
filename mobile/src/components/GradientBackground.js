import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GradientBackground({ 
  children
}) {
  return (
    <LinearGradient
      colors={['#405de6', '#5851db', '#833ab4', '#c13584', '#e1306c', '#fd1d1d']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0.2, y: -0.5 }}
      style={styles.gradient}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
