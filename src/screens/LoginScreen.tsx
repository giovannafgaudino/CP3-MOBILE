import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { LoginData, LoginErrors } from '../types';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    senha: ''
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!loginData.senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (loginData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (): Promise<void> => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulação de login
    setTimeout(() => {
      setIsLoading(false);
      
      // Credenciais de exemplo (em um app real, isso viria de uma API)
      if (loginData.email === 'admin@fiap.com' && loginData.senha === '123456') {
        onLogin();
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos');
      }
    }, 1500);
  };

  const updateLoginData = (field: keyof LoginData, value: string): void => {
    setLoginData({...loginData, [field]: value});
    if (errors[field]) {
      setErrors({...errors, [field]: undefined});
    }
  };

  const getInputStyle = (hasError: boolean) => {
    return hasError ? [styles.input, styles.inputError] : styles.input;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>FIAP</Text>
          <Text style={styles.subtitle}>Sistema de Cadastro</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Login</Text>
          
          <TextInput
            style={getInputStyle(!!errors.email)}
            placeholder="Email"
            value={loginData.email}
            onChangeText={(text) => updateLoginData('email', text)}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <TextInput
            style={getInputStyle(!!errors.senha)}
            placeholder="Senha"
            value={loginData.senha}
            onChangeText={(text) => updateLoginData('senha', text)}
            secureTextEntry
            autoComplete="password"
          />
          {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <View style={styles.demoInfo}>
            <Text style={styles.demoText}>Demo:</Text>
            <Text style={styles.demoText}>Email: admin@fiap.com</Text>
            <Text style={styles.demoText}>Senha: 123456</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: 'red',
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: 'red',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoInfo: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#1890ff',
  },
  demoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});

export default LoginScreen;