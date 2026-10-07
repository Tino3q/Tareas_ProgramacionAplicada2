import { useRouter } from 'expo-router';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image 
            source={require('../../assets/images/foto.png')} 
            style={styles.fotoCarnet} 
            />
        <View style={styles.info}>
          <Text style={styles.nombre}>Jose Hamlet Garcia Sanchez</Text>
          <Text style={styles.matricula}>Matricula: 2022-0332</Text>
        </View>

        
      </View>
      <View style={styles.seccionBoton}>
        <Button 
          title="Ver Materias" 
          onPress={() => router.push('/materias')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fotoCarnet: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  matricula: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  seccionBoton: {
    marginTop: 10,
  },
});