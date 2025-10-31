import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StyleSheet
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StudentFormData, FormErrors } from '../types';
import { Ionicons } from '@expo/vector-icons';

const StudentRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [photo, setPhoto] = useState<string | null>(null);
  const [skipPhoto, setSkipPhoto] = useState<boolean>(false);
  const [formData, setFormData] = useState<StudentFormData>({
    nome: '',
    rm: '',
    telefone: '',
    email: '',
    endereco: '',
    turma: '',
    semestre: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const getInputStyle = (hasError: boolean) => {
    return hasError ? [styles.input, styles.inputError] : styles.input;
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1 && !photo && !skipPhoto) {
      newErrors.photo = 'Selecione uma foto ou marque para adicionar depois';
    }

    if (step === 2) {
      if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
      if (!formData.rm.trim()) newErrors.rm = 'RM é obrigatório';
      if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    }

    if (step === 3) {
      if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
      if (!formData.endereco.trim()) newErrors.endereco = 'Endereço é obrigatório';
    }

    if (step === 4) {
      if (!formData.turma.trim()) newErrors.turma = 'Turma é obrigatória';
      if (!formData.semestre.trim()) newErrors.semestre = 'Semestre é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async (): Promise<void> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
        setSkipPhoto(false); // Desmarca o checkbox se selecionar foto
        setErrors({...errors, photo: undefined});
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a imagem');
    }
  };

  const handleSkipPhotoChange = (): void => {
    setSkipPhoto(!skipPhoto);
    if (!skipPhoto) {
      // Se está marcando o checkbox, limpa possíveis erros de foto
      setErrors({...errors, photo: undefined});
    }
  };

  const handleNext = (): void => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = (): void => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (): void => {
    if (validateStep(currentStep)) {
      Alert.alert('Sucesso!', 'Aluno cadastrado com sucesso!');
      console.log('Dados do aluno:', { 
        photo: skipPhoto ? 'Foto adicionará depois' : photo, 
        ...formData 
      });
      // Reset form
      setCurrentStep(1);
      setPhoto(null);
      setSkipPhoto(false);
      setFormData({
        nome: '',
        rm: '',
        telefone: '',
        email: '',
        endereco: '',
        turma: '',
        semestre: ''
      });
    }
  };

  const updateFormData = (field: keyof StudentFormData, value: string): void => {
    setFormData({...formData, [field]: value});
    if (errors[field as keyof FormErrors]) {
      const newErrors = {...errors};
      delete newErrors[field as keyof FormErrors];
      setErrors(newErrors);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Passo 1: Foto do Aluno</Text>
            
            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
              <Text style={styles.photoButtonText}>
                {photo ? 'Alterar Foto' : 'Selecionar Foto'}
              </Text>
            </TouchableOpacity>
            
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photoPreview} />
            ) : null}

            <View style={styles.checkboxContainer}>
              <TouchableOpacity 
                style={styles.checkbox} 
                onPress={handleSkipPhotoChange}
              >
                {skipPhoto ? (
                  <Ionicons name="checkbox" size={24} color="red" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="#666" />
                )}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                Adicionar foto depois
              </Text>
            </View>

            {errors.photo ? <Text style={styles.errorText}>{errors.photo}</Text> : null}
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Passo 2: Informações Pessoais</Text>
            
            <TextInput
              style={getInputStyle(!!errors.nome)}
              placeholder="Nome Completo"
              value={formData.nome}
              onChangeText={(text: string) => updateFormData('nome', text)}
            />
            {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}

            <TextInput
              style={getInputStyle(!!errors.rm)}
              placeholder="RM"
              value={formData.rm}
              onChangeText={(text: string) => updateFormData('rm', text)}
              keyboardType="numeric"
            />
            {errors.rm ? <Text style={styles.errorText}>{errors.rm}</Text> : null}

            <TextInput
              style={getInputStyle(!!errors.telefone)}
              placeholder="Telefone"
              value={formData.telefone}
              onChangeText={(text: string) => updateFormData('telefone', text)}
              keyboardType="phone-pad"
            />
            {errors.telefone ? <Text style={styles.errorText}>{errors.telefone}</Text> : null}
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Passo 3: Contato</Text>
            
            <TextInput
              style={getInputStyle(!!errors.email)}
              placeholder="Email"
              value={formData.email}
              onChangeText={(text: string) => updateFormData('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

            <TextInput
              style={getInputStyle(!!errors.endereco)}
              placeholder="Endereço"
              value={formData.endereco}
              onChangeText={(text: string) => updateFormData('endereco', text)}
            />
            {errors.endereco ? <Text style={styles.errorText}>{errors.endereco}</Text> : null}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Passo 4: Informações Acadêmicas</Text>
            
            <TextInput
              style={getInputStyle(!!errors.turma)}
              placeholder="Turma"
              value={formData.turma}
              onChangeText={(text: string) => updateFormData('turma', text)}
            />
            {errors.turma ? <Text style={styles.errorText}>{errors.turma}</Text> : null}

            <TextInput
              style={getInputStyle(!!errors.semestre)}
              placeholder="Semestre"
              value={formData.semestre}
              onChangeText={(text: string) => updateFormData('semestre', text)}
            />
            {errors.semestre ? <Text style={styles.errorText}>{errors.semestre}</Text> : null}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Passo {currentStep} de 4</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / 4) * 100}%` }]} />
        </View>
      </View>

      {renderStep()}

      <View style={styles.buttonContainer}>
        {currentStep > 1 ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>
        ) : null}
        
        {currentStep < 4 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.buttonText}>Próximo</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Cadastrar Aluno</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    color: '#666',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'red',
  },
  stepContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'red',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  photoButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  photoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  photoPreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  backButton: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentRegistration;