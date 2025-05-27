import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const CadastroPaciente = ({ navigation }: any) => {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [descricao, setDescricao] = useState('');
  const [gravidade, setGravidade] = useState('');

  const [mensagem, setMensagem] = useState('');
  const [corMensagem, setCorMensagem] = useState('green');

  // Cores atualizadas para gravidade: azul, verde, amarelo, laranja, vermelho
  const coresGravidade = ['#007bff', '#28a745', '#ffc107', '#fd7e14', '#dc3545'];

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  const validarEEnviar = async () => {
    if (!nome.trim() || !idade.trim() || !descricao.trim() || !gravidade.trim()) {
      setCorMensagem('red');
      setMensagem('Preencha todos os campos.');
      return;
    }

    const idadeNum = Number(idade);
    const gravidadeNum = Number(gravidade);

    if (isNaN(idadeNum) || idadeNum <= 0) {
      setCorMensagem('red');
      setMensagem('Informe uma idade válida.');
      return;
    }

    if (isNaN(gravidadeNum) || gravidadeNum < 1 || gravidadeNum > 5) {
      setCorMensagem('red');
      setMensagem('Gravidade deve ser entre 1 e 5.');
      return;
    }

    const paciente = {
      nome: nome.trim(),
      idade: idadeNum.toString(),
      descricao: descricao.trim(),
      gravidade: gravidadeNum,
    };

    try {
      await firestore().collection('pacientes').add(paciente);
      setCorMensagem('green');
      setMensagem('Paciente cadastrado com sucesso.');

      setNome('');
      setIdade('');
      setDescricao('');
      setGravidade('');
    } catch (error) {
      setCorMensagem('red');
      setMensagem('Erro ao salvar no banco.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Cadastro de Paciente</Text>

        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input}
          value={idade}
          onChangeText={setIdade}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Descrição da enfermidade</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          value={descricao}
          onChangeText={setDescricao}
        />

        <Text style={styles.label}>Gravidade (1 a 5)</Text>
        <View style={styles.gravidadeContainer}>
          {[1, 2, 3, 4, 5].map((num) => {
            const isSelected = num === Number(gravidade);
            return (
              <TouchableOpacity
                key={num}
                onPress={() => setGravidade(num.toString())}
                style={[
                  styles.gravidadeButton,
                  {
                    backgroundColor: isSelected ? coresGravidade[num - 1] : '#e6f0ff',
                    borderColor: coresGravidade[num - 1],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.gravidadeButtonText,
                    { color: isSelected ? '#fff' : coresGravidade[num - 1] },
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={validarEEnviar}>
          <Text style={styles.buttonText}>Adicionar à Fila</Text>
        </TouchableOpacity>

        {mensagem ? (
          <Text style={[styles.feedback, { color: corMensagem }]}>{mensagem}</Text>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CadastroPaciente;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f0ff',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#003366',
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#003366',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#b3cde0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  gravidadeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gravidadeButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  gravidadeButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#0066cc',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  feedback: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
