import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MOCK_DESTAQUES = [
  { id: '1', title: 'Festa 1', description: 'Curta o melhor da noite com muita música e luzes.' },
  { id: '2', title: 'Festa 2', description: 'A melhor experiência VIP que você pode ter.' },
  { id: '3', title: 'Festa 3', description: 'Beats eletrônicos até o nascer do sol.' },
];

const MOCK_NOW = [
  { id: '1', title: 'Agora 1', description: 'O sambinha tá comendo solto por aqui.' },
  { id: '2', title: 'Agora 2', description: 'Roda de rima começando, encosta!' },
  { id: '3', title: 'Agora 3', description: 'Últimos ingressos na porta, corre.' },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Top Header Background */}
      <View style={[styles.headerContainer, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.topBar}>
          <TouchableOpacity>
            <Ionicons name="menu" size={28} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>VibeMap</Text>
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={30} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6b4c8f" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#9ca3af"
          />
          <Ionicons name="mic-outline" size={20} color="#6b4c8f" style={styles.micIcon} />
        </View>

        {/* Destaques Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Destaques</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
          >
            {MOCK_DESTAQUES.map((item, index) => (
              <View key={item.id} style={[styles.card, index === 0 && { marginLeft: 20 }]}>
                <ImageBackground
                  source={require('../../assets/backgrounds/login-background.png')}
                  style={styles.cardImageBackground}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.cardOverlay}
                  >
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>HOT</Text>
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.cardSubtitle} numberOfLines={2}>{item.description}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Acontecendo Agora Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Acontecendo agora</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselContainer}
          >
            {MOCK_NOW.map((item, index) => (
              <View key={item.id} style={[styles.card, index === 0 && { marginLeft: 20 }]}>
                <ImageBackground
                  source={require('../../assets/backgrounds/login-background.png')}
                  style={styles.cardImageBackground}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.cardOverlay}
                  >
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>HOT</Text>
                    </View>
                    <View style={styles.cardTextContainer}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.cardSubtitle} numberOfLines={2}>{item.description}</Text>
                    </View>
                  </LinearGradient>
                </ImageBackground>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    backgroundColor: '#5b21b6',
    paddingBottom: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f1235',
  },
  micIcon: {
    marginLeft: 10,
  },
  sectionContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f1235',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  carouselContainer: {
    paddingRight: 20,
  },
  card: {
    width: width * 0.45,
    height: 250,
    marginRight: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#e6d8ff',
    elevation: 4, // Shadow for android
    shadowColor: '#000', // Shadow for ios
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImageBackground: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 12,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffe8d6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#ea580c',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardTextContainer: {
    marginTop: 'auto',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#e5e7eb',
    fontSize: 12,
  },
});
