import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthNavigation } from '../../../navigation/hooks';
import appInfoService from '../../../shared/services/app-info.service';
import { useLogin } from '../hooks/useLogin';
import { LoginFormValues } from '../interfaces/auth.interface';

export const LoginScreen = () => {
  const { login, isLoading } = useLogin();
  const navigation = useAuthNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({
    defaultValues: {
      username: '',
      password: '',
      proyecto: 'RUTEOAPP',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
    } catch (error) {
      console.error('Error durante el login:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Iniciar sesión
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Ingresa tus credenciales para continuar
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="username"
            rules={{
              required: 'El correo electrónico es obligatorio',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo electrónico inválido',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Correo electrónico"
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={!!errors.username}
                style={styles.input}
                left={<TextInput.Icon icon="email-outline" />}
              />
            )}
          />
          {errors.username && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.username.message}
            </Text>
          )}

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Contraseña"
                mode="outlined"
                secureTextEntry={!passwordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={!!errors.password}
                style={styles.input}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setPasswordVisible(v => !v)}
                  />
                }
              />
            )}
          />
          {errors.password && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.password.message}
            </Text>
          )}

          <Button
            mode="text"
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            ¿Olvidaste tu contraseña?
          </Button>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isLoading}
            loading={isLoading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Iniciar sesión
          </Button>

          <View style={styles.footer}>
            <Text variant="bodyMedium" style={styles.footerText}>
              ¿No tienes una cuenta?
            </Text>
            <Button
              mode="text"
              compact
              onPress={() => navigation.navigate('Register')}
            >
              Regístrate
            </Button>
          </View>
        </View>

        <Text variant="bodySmall" style={styles.version}>
          {appInfoService.getFormattedVersion()}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    color: '#666',
  },
  form: {
    gap: 4,
  },
  input: {
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#B00020',
    marginBottom: 8,
    marginLeft: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#555',
    alignSelf: 'center',
  },
  version: {
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
  },
});
