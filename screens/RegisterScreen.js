import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

// Função principal que define a tela de registro
export default function RegisterScreen({ navigation }) {
  // Estado para armazenar o nome de usuário e senha inseridos pelo usuário
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    try {
      // Faz uma requisição POST para a url do servidor de registro  
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      // Verifica se a resposta do servidor foi bem-sucedida
      if (response.ok) {
        navigation.navigate('LoginScreen');
      } else {
        setErrorMessage(data.message || 'Erro no registro');
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar-se ao servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Registrar</Text>
      {/* Exibe a mensagem de erro */}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {/* Campo de entrada para o nome de usuário */}
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername} // Atualzia o estado com o nome de usuário digitado
      />

      {/* Campo de entrada para a senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry // Oculta a senha digitada
        value={password}
        onChangeText={setPassword} // Atualiza o estado com a senha digitada
      />
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}
// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingLeft: 10 },
  error: { color: 'red' },
});