import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import styles from './FilaAtendimento.styles.ts'; // importando estilos externos

export interface Paciente {
  id?: string;
  nome: string;
  idade: string;
  descricao: string;
  gravidade: number;
}

const gravidadeTextoECor = (nivel: number) => {
  switch (nivel) {
    case 1:
      return { texto: 'Leve', cor: '#0000FF' }; // azul
    case 2:
      return { texto: 'Menos Graves', cor: '#008000' }; // verde
    case 3:
      return { texto: 'Urgência', cor: '#FFD700' }; // amarelo
    case 4:
      return { texto: 'Muita Urgência', cor: '#FFA500' }; // laranja
    case 5:
      return { texto: 'Emergência', cor: '#FF0000' }; // vermelho
    default:
      return { texto: 'Desconhecido', cor: '#000' };
  }
};

const FilaAtendimento = ({ navigation, route }: any) => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacienteSelecionadoIndex, setPacienteSelecionadoIndex] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('pacientes')
      .onSnapshot(snapshot => {
        const lista: Paciente[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Paciente),
        }));
        setPacientes(lista);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const paciente = route.params?.paciente;
    if (paciente) {
      firestore().collection('pacientes').add(paciente);
    }
  }, [route.params]);

  const selecionarPaciente = (index: number) => {
    setPacienteSelecionadoIndex(index === pacienteSelecionadoIndex ? null : index);
  };

  const excluirPaciente = () => {
    if (pacienteSelecionadoIndex === null) {
      Alert.alert('Nenhum paciente selecionado', 'Por favor, selecione um paciente para excluir.');
      return;
    }

    const paciente = pacientes[pacienteSelecionadoIndex];

    Alert.alert(
      'Confirmação',
      'Deseja realmente excluir o paciente selecionado?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            if (paciente.id) {
              await firestore().collection('pacientes').doc(paciente.id).delete();
              setPacienteSelecionadoIndex(null);
            } else {
              Alert.alert('Erro', 'Paciente sem ID válido.');
            }
          },
        },
      ]
    );
  };

  const limparTodos = () => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente limpar todos os pacientes da fila?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar Todos',
          style: 'destructive',
          onPress: async () => {
            const batch = firestore().batch();
            pacientes.forEach(paciente => {
              if (paciente.id) {
                const docRef = firestore().collection('pacientes').doc(paciente.id);
                batch.delete(docRef);
              }
            });
            await batch.commit();
            setPacienteSelecionadoIndex(null);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {pacientes.length === 0 ? (
        <Text style={styles.semPacientes}>Nenhum paciente na fila de atendimento.</Text>
      ) : (
        <FlatList
          data={pacientes}
          keyExtractor={(item) => item.id!}
          renderItem={({ item, index }) => {
            const gravidade = gravidadeTextoECor(item.gravidade);
            const selecionado = index === pacienteSelecionadoIndex;
            return (
              <TouchableOpacity
                style={[styles.pacienteContainer, selecionado && styles.pacienteSelecionado]}
                onPress={() => selecionarPaciente(index)}
              >
                <Text style={styles.nome}>
                  {item.nome} ({item.idade} anos)
                </Text>
                <Text style={styles.descricao}>Descrição: {item.descricao}</Text>
                <Text style={[styles.gravidade, { color: gravidade.cor }]}>
                  Gravidade: {gravidade.texto}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      )}

      <View style={styles.botoesContainer}>
        <Button title="Limpar Todos" color="#FF3B30" onPress={limparTodos} />
        <Button
          title="Excluir Paciente"
          color={pacienteSelecionadoIndex !== null ? "#FF9500" : "#ccc"}
          onPress={excluirPaciente}
          disabled={pacienteSelecionadoIndex === null}
        />
        <Button title="Voltar" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
};

export default FilaAtendimento;
