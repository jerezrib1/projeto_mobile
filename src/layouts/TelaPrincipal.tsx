import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { PrincipalProps } from '../navigator/HomeNavigator';

const { width } = Dimensions.get('window');
const numColumns = 6;
const numRows = 12;
const squareSize = width / numColumns;

const TelaPrincipal = ({ navigation }: PrincipalProps) => {
  const squares = Array.from({ length: numRows * numColumns }, (_, index) => {
    const isRed = (Math.floor(index / numColumns) + index) % 2 === 0;
    return (
      <View
        key={index}
        style={[
          styles.square,
          { backgroundColor: isRed ? '#ff4d4d' : '#fff' },
        ]}
      />
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.background}>{squares}</View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CadastroPaciente')}
        >
          <Text style={styles.buttonText}>Cadastrar Paciente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('FilaAtendimento')}
        >
          <Text style={styles.buttonText}>Ver Fila de Atendimento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TelaPrincipal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  square: {
    width: squareSize,
    height: squareSize,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 20,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
