import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Certifique-se de importar o 'chart.js/auto' para registrar todos os componentes do gráfico.

export default function GraphScreen({ route }) {
  const [sensorData, setSensorData] = useState([]);
  const [chartType, setChartType] = useState('line'); // Estado para armazenar o tipo de gráfico
  const { token } = route.params;

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('http://localhost:3000/dados-sensores', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error('Erro ao buscar dados dos sensores:', error);
      }
    };

    fetchSensorData();
  }, [token]);

  const data = {
    labels: sensorData.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperatura',
        data: sensorData.map(item => item.temperatura),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1, // Suavizar a linha do gráfico
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tempo',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperatura (°C)',
        },
        beginAtZero: true,
      },
    },
  };

  // Componente do gráfico baseado no tipo selecionado
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={data} options={options} />;
      case 'bar':
        return <Bar data={data} options={options} />;
      default:
        return <Line data={data} options={options} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráfico de Dados dos Sensores</Text>
      <Picker
        selectedValue={chartType}
        style={styles.picker}
        onValueChange={(itemValue) => setChartType(itemValue)}
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Linha" value="line" />
        <Picker.Item label="Barra" value="bar" />
      </Picker>
      {renderChart()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  picker: { height: 40, width: 150, marginBottom: 20, borderColor: '#ccc', borderWidth: 1, borderRadius: 5 },
  pickerItem: { height: 40 },
});