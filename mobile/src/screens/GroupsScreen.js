import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GroupsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock de dados do usuário
  const [userProfile, setUserProfile] = useState({
    name: 'Guilherme Carramilo',
    username: '@guicarramilo',
    bio: 'Desenvolvedor e apreciador de bons rolês na cidade. 🗺️🚀\nVamos explorar os melhores eventos!',
    email: 'guicarramilo@nearvibe.com'
  });

  const [form, setForm] = useState(userProfile);

  const handleSave = () => {
    setUserProfile(form);
    setIsEditing(false);
  };

  const handleLogout = () => {
    console.log('Logout pressed');
    // logout logic later...
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Meu Perfil</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)} style={styles.headerBtn}>
            <Ionicons name={isEditing ? "close" : "create-outline"} size={22} color="#5b21b6" />
          </TouchableOpacity>
        </View>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <LinearGradient colors={['#8b5cf6', '#5b21b6']} style={styles.avatarBorder}>
            <Image 
              source={require('../../assets/backgrounds/login-background.png')}
              style={styles.avatarImage}
            />
          </LinearGradient>
          <TouchableOpacity style={styles.changeAvatarBtn}>
            <Ionicons name="camera" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Content Toggle */}
        {!isEditing ? (
          <View style={styles.infoSection}>
            <Text style={styles.nameText}>{userProfile.name}</Text>
            <Text style={styles.usernameText}>{userProfile.username}</Text>
            <Text style={styles.bioText}>{userProfile.bio}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Eventos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>145</Text>
                <Text style={styles.statLabel}>Seguindo</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>89</Text>
                <Text style={styles.statLabel}>Seguidores</Text>
              </View>
            </View>

            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={styles.actionIconBg}>
                  <Ionicons name="settings-outline" size={20} color="#5b21b6" />
                </View>
                <Text style={styles.actionText}>Configurações</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIconBg, { backgroundColor: '#fdf4ff' }]}>
                  <Ionicons name="bookmark-outline" size={20} color="#c026d3" />
                </View>
                <Text style={styles.actionText}>Eventos Salvos</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
                <View style={[styles.actionIconBg, { backgroundColor: '#fee2e2' }]}>
                  <Ionicons name="log-out-outline" size={20} color="#e11d48" />
                </View>
                <Text style={[styles.actionText, { color: '#e11d48' }]}>Sair da Conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.formSection}>
            <Text style={styles.label}>Nome</Text>
            <TextInput 
              style={styles.input}
              value={form.name}
              onChangeText={(text) => setForm({...form, name: text})}
              placeholder="Seu nome"
            />

            <Text style={styles.label}>Username</Text>
            <TextInput 
              style={styles.input}
              value={form.username}
              onChangeText={(text) => setForm({...form, username: text})}
              placeholder="@username"
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput 
              style={[styles.input, styles.bioInput]}
              multiline
              numberOfLines={3}
              value={form.bio}
              onChangeText={(text) => setForm({...form, bio: text})}
              placeholder="Fale um sobre você..."
            />

            <Text style={styles.label}>Email</Text>
            <TextInput 
              style={[styles.input, styles.disabledInput]}
              value={form.email}
              editable={false}
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <LinearGradient colors={['#8b5cf6', '#5b21b6']} style={styles.saveGradient}>
                <Text style={styles.saveButtonText}>Salvar Alterações</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e293b',
  },
  headerBtn: {
    padding: 8,
    backgroundColor: '#ede9fe',
    borderRadius: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  avatarBorder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#f8fafc',
  },
  changeAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#5b21b6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#f8fafc',
  },
  infoSection: {
    alignItems: 'center',
  },
  nameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
  },
  usernameText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8b5cf6',
    marginTop: 2,
  },
  bioText: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e2e8f0',
  },
  actionsSection: {
    width: '100%',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  actionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  logoutButton: {
    marginTop: 10,
  },
  formSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#f8fafc',
    color: '#94a3b8',
    borderColor: '#f1f5f9',
  },
  saveButton: {
    marginTop: 32,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#5b21b6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  }
});
