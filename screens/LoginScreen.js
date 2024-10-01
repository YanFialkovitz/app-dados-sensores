import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';

// função principal que define a tela de login
export default function LoginScreen({ navigation }) {
  //estado para armazenar o nome de usuário e senha inseriods pelo usuário  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); //Estado para armazenar mensagem de erro

  // Função que lida com o processo de login
  const handleLogin = async () => {
    try {
      // Faz uma requisição POST para a url do servidor de login
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      // Verifica se a resposta do servidor foi bem-sucedida
      if (response.ok) {
        // Armazenar token JWT
        console.log('Token JWT:', data.token);
        // Navegar para a tela de gráficos
        navigation.navigate('GraphScreen', { token: data.token });
      } else {
        setErrorMessage(data.message || 'Erro no login'); //Exibe uma mensagem de erro caso o login falhe
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar-se ao servidor.'); // Erro de conexão com o servidor
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      {/*Exibe uma mensagem de erro */}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {/*Campo de entrada para o nome de usuário */}
      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername} //Atualiza o estado com o nome de usuário digitado
      />
      {/*campo de entrada para senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry // oculta a senha digitada
        value={password}
        onChangeText={setPassword} // Atualiza o estado com a senha digitada
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
// Estilos
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingLeft: 10 },
  error: { color: 'red' },
});