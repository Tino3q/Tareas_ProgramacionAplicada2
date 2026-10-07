import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, TextInput } from 'react-native';

export default function  LoginScreen() {
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      alert('polfavol inglesa el coleo y la contlasenia.');
      return;
    }
    router.push('/home');
  };

return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Iniciar Sesión</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Ingresar" onPress={handleLogin} />
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
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});