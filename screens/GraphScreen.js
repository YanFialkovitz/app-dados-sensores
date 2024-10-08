import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Picker, ScrollView } from 'react-native';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import io from 'socket.io-client';

export default function GraphScreen({ route }) {
  const [sensorData, setSensorData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('lastHour');
  const { token } = route.params;

  // Mapeamento dos sensor_id para os nomes dos ambientes
  const sensorNames = {
    1: 'Cozinha',
    2: 'Sala',
    3: 'Quarto',
    4: 'Escritório',
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await fetch('http://localhost:3000/dados-sensores', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do servidor');
        }
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error('Erro ao buscar dados iniciais:', error);
      }
    };

    fetchInitialData();

    const socket = io('http://localhost:3000', {
      auth: {
        token: `Bearer ${token}`,
      }
    });

    socket.on('connect', () => {
      console.log('Conectado ao servidor:', socket.id);
    });

    socket.on('sensorDataUpdate', (newData) => {
      console.log('Dados de sensor recebidos:', newData);
      // Adiciona o novo dado ao estado
      setSensorData(prevData => [...prevData, newData]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const getFilteredData = () => {
    const now = new Date();
    return sensorData.filter(item => {
      const itemDate = new Date(item.timestamp);
      switch (timeRange) {
        case 'lastHour':
          return itemDate >= new Date(now - 60 * 60 * 1000);
        case 'last24Hours':
          return itemDate >= new Date(now - 24 * 60 * 60 * 1000);
        case 'lastWeek':
          return itemDate >= new Date(now - 7 * 24 * 60 * 60 * 1000);
        case 'last30Days':
          return itemDate >= new Date(now - 30 * 24 * 60 * 60 * 1000);
        case 'last60Seconds':
          return itemDate >= new Date(now - 60 * 1000);
        default:
          return true;
      }
    });
  };

  const getGroupedData = () => {
    const filteredData = getFilteredData();
    const groupedData = {};

    filteredData.forEach(item => {
      const { sensor_id } = item;
      if (!groupedData[sensor_id]) {
        groupedData[sensor_id] = [];
      }
      groupedData[sensor_id].push(item);
    });

    return groupedData;
  };

  const groupedData = getGroupedData();

  const renderCharts = () => {
    return Object.keys(groupedData).map(sensorId => {
      const data = {
        labels: groupedData[sensorId].map(item => new Date(item.timestamp).toLocaleTimeString()),
        datasets: [
          {
            label: `Temperatura (${sensorNames[sensorId]})`, // Usando o mapeamento para o nome do sensor
            data: groupedData[sensorId].map(item => item.temperatura),
            borderColor: 'rgb(205, 1, 1)',
            backgroundColor: 'rgb(221, 15, 15)',
            fill: false,
            tension: 0.1,
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

      return (
        <View key={sensorId} style={styles.chartContainer}>
          <Text style={styles.sensorTitle}>Gráfico do Sensor {sensorNames[sensorId]}</Text> {/* Usando o mapeamento para o título do gráfico */}
          {chartType === 'line' ? <Line data={data} options={options} /> : <Bar data={data} options={options} />}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráfico de Dados dos Sensores</Text>

      <Picker
        selectedValue={timeRange}
        style={styles.picker}
        onValueChange={(itemValue) => setTimeRange(itemValue)}
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Última Hora" value="lastHour" />
        <Picker.Item label="Últimas 24 Horas" value="last24Hours" />
        <Picker.Item label="Última Semana" value="lastWeek" />
        <Picker.Item label="Últimos 30 Dias" value="last30Days" />
        <Picker.Item label="Últimos 60 Segundos" value="last60Seconds" />
      </Picker>

      <Picker
        selectedValue={chartType}
        style={styles.picker}
        onValueChange={(itemValue) => setChartType(itemValue)}
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Linha" value="line" />
        <Picker.Item label="Barra" value="bar" />
      </Picker>

      {/* Adicionando o ScrollView aqui */}
      <ScrollView style={styles.scrollView}>
        {renderCharts()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-start', alignItems: 'flex-end', padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  picker: { height: 40, width: 150, marginBottom: 20, borderColor: '#ccc', borderWidth: 1, borderRadius: 5 },
  pickerItem: { height: 40 },
  chartContainer: { marginBottom: 20, width: '100%' },
  sensorTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  scrollView: { width: '100%' }, // Define a largura do ScrollView
});