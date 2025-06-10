import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface BottomNavProps {
  activeTab: 'home' | 'alerts' | 'saved' | 'settings';
  onTabPress: (tab: 'home' | 'alerts' | 'saved' | 'settings') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabPress }) => {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onTabPress('home')}
      >
        {activeTab === 'home' && <View style={styles.activeIndicator} />}
        <Ionicons 
          name="home" 
          size={24} 
          color={activeTab === 'home' ? '#FF6B00' : '#808080'} 
        />
        <Text style={[styles.navText, activeTab === 'home' && styles.activeText]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onTabPress('alerts')}
      >
        {activeTab === 'alerts' && <View style={styles.activeIndicator} />}
        <Ionicons 
          name="notifications" 
          size={24} 
          color={activeTab === 'alerts' ? '#FF6B00' : '#808080'} 
        />
        <Text style={[styles.navText, activeTab === 'alerts' && styles.activeText]}>
          Alerts
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onTabPress('saved')}
      >
        {activeTab === 'saved' && <View style={styles.activeIndicator} />}
        <Ionicons 
          name="bookmark" 
          size={24} 
          color={activeTab === 'saved' ? '#FF6B00' : '#808080'} 
        />
        <Text style={[styles.navText, activeTab === 'saved' && styles.activeText]}>
          Saved
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => onTabPress('settings')}
      >
        {activeTab === 'settings' && <View style={styles.activeIndicator} />}
        <Ionicons 
          name="settings-outline" 
          size={24} 
          color={activeTab === 'settings' ? '#FF6B00' : '#808080'} 
        />
        <Text style={[styles.navText, activeTab === 'settings' && styles.activeText]}>
          Settings
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: -10,
    width: '50%',
    height: 3,
    backgroundColor: '#FF6B00',
    borderRadius: 3,
  },
  navText: {
    fontSize: 12,
    color: '#808080',
    marginTop: 5,
  },
  activeText: {
    color: '#FF6B00',
  },
});

export default BottomNav; 