import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { DancingScript_700Bold } from '@expo-google-fonts/dancing-script';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Pacifico_400Regular,
    DancingScript_700Bold,
  });

  const startGame = (target: number) => {
    router.push({
      pathname: '/game',
      params: { target }
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#1a237e', '#311b92']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={[styles.logoText, { transform: [{ rotate: '-5deg' }] }]}>
            Juega
          </Text>
          <Text style={[styles.logoText, { transform: [{ rotate: '5deg' }], fontFamily: 'DancingScript_700Bold' }]}>
            Dominó
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.gameButton}
            onPress={() => startGame(200)}
          >
            <Ionicons name="game-controller" size={32} color="#fff" />
            <Text style={styles.buttonText}>Juego a 200</Text>
            <Text style={styles.buttonSubtext}>Partida rápida</Text>
          </Pressable>

          <Pressable
            style={[styles.gameButton, styles.gameButtonAlt]}
            onPress={() => startGame(500)}
          >
            <Ionicons name="trophy" size={32} color="#fff" />
            <Text style={styles.buttonText}>Juego a 500</Text>
            <Text style={styles.buttonSubtext}>Con bonificación</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 64,
    fontFamily: 'Pacifico_400Regular',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginVertical: -10,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 20,
  },
  gameButton: {
    backgroundColor: '#4527a0',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameButtonAlt: {
    backgroundColor: '#5e35b1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  buttonSubtext: {
    color: '#e0e0e0',
    fontSize: 16,
    marginTop: 4,
  },
});