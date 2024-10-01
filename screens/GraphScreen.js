import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Line } from 'react-chartjs-2'; // Importa o componente de gráfico de linha
import 'chart.js/auto'; // Importa automaticamente todos os componentes do Chart.js

// Função principal que define a tela de gráficos
export default function GraphScreen({ route }) {
  const [sensorData, setSensorData] = useState([]); // Estado para armazenar os dados dos sensores
  const { token } = route.params; // Recupera o token JWT enviado pela tela anterior

  // useEffect para buscar os dados dos sensores quando o componente é montado
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        // Faz uma requisição GET para buscar os dados dos sensores do servidor
        const response = await fetch('http://localhost:3000/dados-sensores', {
          headers: {
            Authorization: `Bearer ${token}`, // Adiciona o token JWT no cabeçalho da requisição para autenticação
          },
        });
        const data = await response.json(); // Converte a resposta em JSON
        setSensorData(data); // Atualiza o estado com os dados recebidos
      } catch (error) {
        console.error('Erro ao buscar dados dos sensores:', error); // Exibe erros no console
      }
    };

    fetchSensorData(); // Chama a função para buscar os dados dos sensores
  }, [token]); // Dependência do token para que o useEffect seja executado ao montar o componente

  // Configuração dos dados e estrutura do gráfico
  const data = {
    labels: sensorData.map(item => new Date(item.timestamp).toLocaleTimeString()), // Mapeia os timestamps para exibir o tempo
    datasets: [
      {
        label: 'Temperatura', // Nome do conjunto de dados
        data: sensorData.map(item => item.temperatura), // Dados de temperatura
        borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha do gráfico
        fill: false, // Não preencher a área sob o gráfico
        tension: 0.1, // Suaviza a curva do gráfico
      },
    ],
  };

  // Configurações das escalas e responsividade do gráfico
  const options = {
    responsive: true, // Torna o gráfico responsivo
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tempo', // Texto do eixo X
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperatura (°C)', // Texto do eixo Y
        },
        beginAtZero: true, // Inicia o eixo Y em zero
      },
    },
  };

  // Retorna a interface da tela, exibindo o gráfico e um título
  return (
    <View style={styles.container}>
      <Text>Gráfico de Dados dos Sensores</Text>
      <Line data={data} options={options} /> {/* Exibe o gráfico de linha */}
    </View>
  );
}

// Estilos para a tela do gráfico
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' // Centraliza o conteúdo
  },
});
