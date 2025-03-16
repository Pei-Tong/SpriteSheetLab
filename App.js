import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import entities from './src/entities';
import Physics from './src/Physics';
import { useState, useEffect } from 'react';

export default function App() {
  const [gameEngine, setGameEngine] = useState(null);

  useEffect(() => {
    if (gameEngine) {
      gameEngine.swap(entities());
    }
  }, [gameEngine]);

  return (
    <View style={styles.container}>
      <GameEngine
        ref={(ref) => {
          setGameEngine(ref);
        }}
        style={styles.gameContainer}
        systems={[Physics]}
        entities={entities()}
      >
        <StatusBar style="auto" hidden={true} />
      </GameEngine>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gameContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
});