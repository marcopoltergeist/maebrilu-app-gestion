import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import logo from '../assets/picto/picto-maebrilu.png'; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const handleSubmit = () => {
    // Logique pour la soumission des données de connexion
    console.log("Email:", email, "Password:", password);
    navigation.navigate('Home'); // Navigation vers l'écran Home
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.loginForm}>
        <Text style={styles.loginTitle}>Connection</Text>
        <TextInput
          style={styles.loginInput}
          value={email}
          onChangeText={setEmail}
          placeholder="maebrily@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.loginInput}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={handleSubmit} style={styles.loginButton}>
          <Text style={styles.buttonText}>Connexion</Text>
        </TouchableOpacity>
        <View style={styles.loginIcon}>
          <Image source={logo} style={styles.flamingo} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7CAC9', // Couleur de fond rose clair
  },
  loginForm: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    width: '80%',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  loginInput: {
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginIcon: {
    marginTop: 20,
  },
  flamingo: {
    height: 120,
    width: 120, 
    resizeMode: 'contain',
  },
});

export default Login;
