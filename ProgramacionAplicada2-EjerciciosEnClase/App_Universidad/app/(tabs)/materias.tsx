import { useRouter } from 'expo-router';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

export default function MateriasScreen() {
  const router = useRouter();

  const materias = [
    { id: '1', nombre: 'Programación Aplicada II' },
    { id: '2', nombre: 'Diseño de Sistemas' },
    { id: '3', nombre: 'Teleprocesos y Redes' },
    { id: '4', nombre: 'Bases de Datos Avanzadas' },
    { id: '5', nombre: 'Ingeniería de Software' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Materias Cursadas</Text>

      <FlatList
        data={materias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nombreMateria}>{item.nombre}</Text>
          </View>
        )}
      />

      <View style={styles.botonVolver}>
        <Button title="Volver al Inicio" onPress={() => router.push('/home')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  item: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  nombreMateria: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  codigoMateria: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  botonVolver: {
    marginTop: 15,
    marginBottom: 20,
  },
});