import React from 'react';
import { View, Text } from 'react-native';

export default function TicketsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 18 }}>🎟️ Meus Tickets</Text>
    </View>
  );
}
