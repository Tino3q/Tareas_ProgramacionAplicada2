import { useRouter } from 'expo-router';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  const router = useRouter();

  const datosLista = [
    { id: '1', titulo: 'Elemento 1: React Native' },
    { id: '2', titulo: 'Elemento 2: Expo Router' },
    { id: '3', titulo: 'Elemento 3: StyleSheet' },
    { id: '4', titulo: 'Elemento 4: FlatList' },
    { id: '5', titulo: 'Elemento 5: Componentes Nativos' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.subtituloSeccion}>Lista de Elementos</Text>

      <FlatList
        data={datosLista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemLista}>
            <Text style={styles.textoItem}>{item.titulo}</Text>
          </View>
        )}
      />

      {/* Botón para regresar a Home */}
      <View style={styles.botonVolver}>
        <Button 
          title="Volver a Inicio" 
          onPress={() => router.push('/')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  subtituloSeccion: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  itemLista: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  textoItem: {
    fontSize: 15,
    color: '#333',
  },
  botonVolver: {
    marginTop: 15,
    marginBottom: 20,
  },
});