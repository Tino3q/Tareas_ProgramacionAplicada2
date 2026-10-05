import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';

export default function HomeScreen() {
  const [textoIngresado, setTextoIngresado] = useState('');
  const [textoMostrado, setTextoMostrado] = useState('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 1. Carnet con Foto, Nombre y Matrícula */}
      <View style={styles.carnetCard}>
        <Image 
            source={require('../../assets/images/foto.png')} 
            style={styles.fotoCarnet} 
            />
        <View style={styles.infoCarnet}>
          <Text style={styles.titulo}>Jose Hamlet Garcia Sanchez</Text>
          <Text style={styles.subtitulo}>Carnet: 2022-0332</Text>
        </View>
      </View>

      {/* 2. Formulario básico */}
      <View style={styles.seccionFormulario}>
        <TextInput
          style={styles.input}
          placeholder="Escribe algo aquí..."
          value={textoIngresado}
          onChangeText={setTextoIngresado}
        />
        <Button 
          title="Mostrar Texto" 
          onPress={() => setTextoMostrado(textoIngresado)} 
        />
        {textoMostrado !== '' && (
          <Text style={styles.resultadoText}>Ingresado: {textoMostrado}</Text>
        )}
      </View>

      {/* 3. Botón de navegación a la lista */}
      <View style={styles.seccionNavegacion}>
        <Button 
          title="Ver Lista de Elementos" 
          onPress={() => router.push('/two')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  carnetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    elevation: 3, // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fotoCarnet: {
    width: 70,
    height: 70,
    borderRadius: 35, // Hace la foto circular
    marginRight: 15,
  },
  infoCarnet: {
    flex: 1,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  seccionFormulario: {
    marginBottom: 25,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  resultadoText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '600',
    color: 'green',
  },
  seccionNavegacion: {
    marginTop: 10,
  },
});