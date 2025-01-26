import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/context/AuthContext';

interface FormErrors {
  username?: string;
  name?: string;
  email?: string;
  password?: string;
}

export default function SignupForm() {
  const { signUp, isLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,72}$/;

    if (!formData.username.trim() || formData.username.length < 5) {
      errors.username = 'Username must be at least 5 characters';
    }

    if (!formData.name.trim() || formData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!passwordRegex.test(formData.password)) {
      errors.password = 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      await signUp(formData);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const renderField = (field: keyof typeof formData, label: string, options: any = {}) => (
    <View>
      <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
      <TextInput
        className={`w-full px-4 py-3 bg-white border rounded-lg ${
          formErrors[field] ? 'border-red-500' : 'border-gray-300'
        }`}
        value={formData[field]}
        onChangeText={(value) => updateField(field, value)}
        {...options}
      />
      {formErrors[field] && (
        <Text className="text-red-500 text-sm mt-1">{formErrors[field]}</Text>
      )}
    </View>
  );

  return (
    <View className="space-y-4">
      {authError && (
        <Text className="text-red-500 text-sm">{authError}</Text>
      )}
      
      {renderField('username', 'Username', {
        placeholder: 'Enter your username',
        autoCapitalize: 'none',
      })}
      
      {renderField('name', 'Name', {
        placeholder: 'Enter your full name',
      })}
      
      {renderField('email', 'Email', {
        placeholder: 'Enter your email',
        autoCapitalize: 'none',
        keyboardType: 'email-address',
      })}
      
      {renderField('password', 'Password', {
        placeholder: 'Create a password',
        secureTextEntry: true,
      })}

      <Pressable
        onPress={handleSignup}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg bg-indigo-600 
          ${isLoading ? 'opacity-50' : 'opacity-100'}`}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">Create Account</Text>
        )}
      </Pressable>
    </View>
  );
}