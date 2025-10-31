import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import StudentRegistration from './src/screens/StudentRegistration';
import TeacherRegistration from './src/screens/TeacherRegistration';

const Tab = createBottomTabNavigator();

// Componente das Tabs principais (após login)
function MainTabs({ onLogout }: { onLogout: () => void }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Alunos') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Professores') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: 'red',
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        options={{ title: 'Início' }}
      >
        {() => <HomeScreen onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Alunos" 
        component={StudentRegistration}
        options={{ title: 'Cadastro de Alunos' }}
      />
      <Tab.Screen 
        name="Professores" 
        component={TeacherRegistration}
        options={{ title: 'Cadastro de Professores' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Se não estiver logado, mostra a tela de Login
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Se estiver logado, mostra as tabs com navegação
  return (
    <NavigationContainer>
      <MainTabs onLogout={handleLogout} />
    </NavigationContainer>
  );
}