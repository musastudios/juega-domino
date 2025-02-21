import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, Modal, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';

interface Score {
  id: string;
  ellos: string;
  nosotros: string;
  disabled?: boolean;
}

export default function GameScreen() {
  const { target } = useLocalSearchParams<{ target: string }>();
  const targetScore = parseInt(target, 10);
  const [scores, setScores] = useState<Score[]>([{ id: '1', ellos: '', nosotros: '' }]);
  const [totalEllos, setTotalEllos] = useState(0);
  const [totalNosotros, setTotalNosotros] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const leftConfettiRef = useRef<ConfettiCannon>(null);
  const rightConfettiRef = useRef<ConfettiCannon>(null);
  const listRef = useRef<FlashList<Score>>(null);
  const [awardedBonuses, setAwardedBonuses] = useState<string[]>([]);
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState('');
  const [winningScore, setWinningScore] = useState(0);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const getNextBonus = () => {
    const bonuses = [100, 75, 50, 25];
    return bonuses[awardedBonuses.length] || 0;
  };

  const calculateTotals = () => {
    let sumEllos = 0;
    let sumNosotros = 0;

    scores.forEach((score) => {
      const ellosValue = parseInt(score.ellos || '0', 10);
      const nosotrosValue = parseInt(score.nosotros || '0', 10);
      
      const ellosBonus = getScoreBonus(score.id, 'ellos');
      const nosotrosBonus = getScoreBonus(score.id, 'nosotros');
      
      sumEllos += ellosValue + ellosBonus;
      sumNosotros += nosotrosValue + nosotrosBonus;
    });

    setTotalEllos(sumEllos);
    setTotalNosotros(sumNosotros);

    if ((sumEllos >= targetScore || sumNosotros >= targetScore) && !gameEnded) {
      const winnerName = sumEllos >= targetScore ? 'Ellos' : 'Nosotros';
      const finalScore = sumEllos >= targetScore ? sumEllos : sumNosotros;
      
      setGameEnded(true);
      setWinner(winnerName);
      setWinningScore(finalScore);

      setTimeout(() => {
        setShowWinner(true);
        leftConfettiRef.current?.start();
        setTimeout(() => {
          rightConfettiRef.current?.start();
        }, 250);
        
        setTimeout(() => {
          showAdAndNewGame();
        }, 5000);
      }, 1000);
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [scores]);

  const addNewRow = () => {
    setScores(prev => [...prev, { id: String(prev.length + 1), ellos: '', nosotros: '' }]);
    // Scroll to the new row
    setTimeout(() => {
      listRef.current?.scrollToEnd();
    }, 100);
  };

  const updateScore = (id: string, team: 'ellos' | 'nosotros', value: string) => {
    if (gameEnded) return;
    
    const numericValue = value.replace(/[^0-9]/g, '');
    setScores(prev => {
      const newScores = prev.map(score =>
        score.id === id ? { ...score, [team]: numericValue } : score
      );
      
      // Award bonus if this is a new score and we haven't given out all bonuses
      const scoreKey = `${id}-${team}`;
      if (numericValue && 
          targetScore === 500 && 
          awardedBonuses.length < 4 && 
          !awardedBonuses.includes(scoreKey)) {
        setAwardedBonuses(prev => [...prev, scoreKey]);
      }
      
      // Add new row if any score is filled in the last row
      const lastScore = newScores[newScores.length - 1];
      if (lastScore.ellos || lastScore.nosotros) {
        newScores.push({ id: String(newScores.length + 1), ellos: '', nosotros: '' });
      }
      
      return newScores;
    });
  };

  const getScoreBonus = (id: string, team: string) => {
    const scoreKey = `${id}-${team}`;
    const bonusIndex = awardedBonuses.indexOf(scoreKey);
    if (bonusIndex === -1) return 0;
    return [100, 75, 50, 25][bonusIndex];
  };

  const renderScoreRow = ({ item }: { item: Score; index: number }) => {
    const ellosBonus = getScoreBonus(item.id, 'ellos');
    const nosotrosBonus = getScoreBonus(item.id, 'nosotros');
    
    return (
      <View style={styles.row}>
        <View style={styles.scoreColumn}>
          <TextInput
            style={[styles.input, gameEnded && styles.inputDisabled]}
            keyboardType="numeric"
            value={item.ellos}
            onChangeText={(value) => updateScore(item.id, 'ellos', value)}
            placeholder="0"
            editable={!gameEnded}
          />
          {ellosBonus > 0 && <Text style={styles.bonusText}>+{ellosBonus}</Text>}
        </View>
        <View style={styles.scoreColumn}>
          <TextInput
            style={[styles.input, gameEnded && styles.inputDisabled]}
            keyboardType="numeric"
            value={item.nosotros}
            onChangeText={(value) => updateScore(item.id, 'nosotros', value)}
            placeholder="0"
            editable={!gameEnded}
          />
          {nosotrosBonus > 0 && <Text style={styles.bonusText}>+{nosotrosBonus}</Text>}
        </View>
      </View>
    );
  };

  const handlePremiumPurchase = async () => {
    try {
      // TODO: Implement actual in-app purchase
      Alert.alert(
        '☕ Premium Version',
        'Gracias por apoyarnos!\nLos anuncios han sido removidos.',
        [{ text: 'OK', onPress: () => setIsPremium(true) }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo procesar el pago. Intente nuevamente.');
    }
  };

  const showAdAndNewGame = () => {
    setShowWinner(false);
    if (isPremium) {
      setShowNewGameModal(true);
    } else {
      setShowAd(true);
      setTimeout(() => {
        setShowAd(false);
        setShowNewGameModal(true);
      }, 4000);
    }
  };

  return (
    <LinearGradient colors={['#1a237e', '#311b92']} style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title}>Juego a {targetScore}</Text>
      </View>

      <View style={styles.scoreHeader}>
        <Text style={styles.teamHeader}>ELLOS</Text>
        <Text style={styles.teamHeader}>NOSOTROS</Text>
      </View>

      <View style={styles.listContainer}>
        <FlashList
          ref={listRef}
          data={scores}
          renderItem={renderScoreRow}
          estimatedItemSize={50}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalScore}>{totalEllos}</Text>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalScore}>{totalNosotros}</Text>
        </View>
      </View>

      {/* Confetti Layer - Only show when there's a winner */}
      {showWinner && (
        <View style={styles.confettiContainer}>
          <ConfettiCannon
            ref={leftConfettiRef}
            count={100}
            origin={{x: 0, y: -10}}
            autoStart={false}
            fadeOut={true}
            fallSpeed={2500}
            explosionSpeed={300}
            angle={45}
            colors={['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98']}
          />
          <ConfettiCannon
            ref={rightConfettiRef}
            count={100}
            origin={{x: Dimensions.get('window').width, y: -10}}
            autoStart={false}
            fadeOut={true}
            fallSpeed={2500}
            explosionSpeed={300}
            angle={135}
            colors={['#FFD700', '#FFA500', '#FF69B4', '#87CEEB', '#98FB98']}
          />
        </View>
      )}

      {/* Winner Celebration Modal */}
      <Modal visible={showWinner} transparent={true} animationType="fade">
        <View style={styles.celebrationContainer}>
          <View style={styles.winnerCard}>
            <Ionicons name="trophy" size={80} color="#FFD700" />
            <Text style={styles.winnerText}>{winner}</Text>
            <Text style={styles.winnerSubtext}>¡HAN GANADO!</Text>
            <Text style={styles.winnerScore}>{winningScore} puntos</Text>
          </View>
        </View>
      </Modal>

      {/* Existing Ad Modal */}
      <Modal visible={showAd} transparent={true}>
        <View style={styles.adContainer}>
          <Text style={styles.adText}>Anuncio</Text>
          <Text style={styles.adSubtext}>Este es un anuncio de ejemplo</Text>
        </View>
      </Modal>

      {/* New Game Modal */}
      <Modal visible={showNewGameModal} transparent={true} animationType="fade">
        <View style={styles.newGameContainer}>
          <View style={styles.newGameCard}>
            <Ionicons name="game-controller" size={60} color="#4527a0" />
            <Text style={styles.newGameTitle}>¿Juego Nuevo?</Text>
            
            <Pressable
              style={styles.gameTypeButton}
              onPress={() => router.replace({
                pathname: '/game',
                params: { target: 200 }
              })}
            >
              <Ionicons name="flash" size={24} color="#fff" />
              <Text style={styles.gameTypeText}>Juego a 200</Text>
              <Text style={styles.gameTypeSubtext}>Partida rápida</Text>
            </Pressable>

            <Pressable
              style={[styles.gameTypeButton, styles.gameTypeButtonAlt]}
              onPress={() => router.replace({
                pathname: '/game',
                params: { target: 500 }
              })}
            >
              <Ionicons name="trophy" size={24} color="#fff" />
              <Text style={styles.gameTypeText}>Juego a 500</Text>
              <Text style={styles.gameTypeSubtext}>Con bonificación</Text>
            </Pressable>

            <Pressable
              style={styles.premiumButton}
              onPress={handlePremiumPurchase}
            >
              <Text style={styles.premiumText}>☕ Cómpranos un cafecito</Text>
              <Text style={styles.premiumSubtext}>y quita los anuncios</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '25%',
    marginBottom: 15,
  },
  teamHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    maxWidth: '35%',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: '25%',
  },
  scoreColumn: {
    flex: 1,
    alignItems: 'center',
    maxWidth: '35%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    fontSize: 23,
    textAlign: 'center',
    fontWeight: '500',
  },
  inputDisabled: {
    backgroundColor: '#e0e0e0',
    color: '#666',
  },
  bonusText: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  totalContainer: {
    alignItems: 'center',
    flex: 1,
  },
  totalLabel: {
    color: '#e0e0e0',
    fontSize: 16,
    marginBottom: 4,
  },
  totalScore: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  adContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  adSubtext: {
    color: '#e0e0e0',
    fontSize: 18,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)', // Slight blur effect
    pointerEvents: 'none', // Allow interaction with elements behind
  },
  celebrationContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerCard: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backdropFilter: 'blur(10px)', // Add blur effect behind the card
  },
  winnerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4527a0',
    marginTop: 20,
    fontFamily: 'DancingScript_700Bold',
  },
  winnerSubtext: {
    fontSize: 24,
    color: '#311b92',
    marginTop: 10,
    fontWeight: 'bold',
  },
  winnerScore: {
    fontSize: 32,
    color: '#4527a0',
    marginTop: 10,
    fontWeight: '500',
  },
  newGameContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  newGameCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    gap: 20,
  },
  newGameTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4527a0',
    marginBottom: 10,
    fontFamily: 'DancingScript_700Bold',
  },
  gameTypeButton: {
    backgroundColor: '#4527a0',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameTypeButtonAlt: {
    backgroundColor: '#5e35b1',
  },
  gameTypeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  gameTypeSubtext: {
    color: '#e0e0e0',
    fontSize: 16,
    marginTop: 4,
  },
  premiumButton: {
    padding: 15,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#4527a0',
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  premiumText: {
    color: '#4527a0',
    fontSize: 18,
    fontWeight: '600',
  },
  premiumSubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
});