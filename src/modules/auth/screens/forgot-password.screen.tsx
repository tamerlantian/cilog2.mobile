import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthNavigation } from '../../../navigation/hooks';
import { ForgotPasswordFormValues } from '../models/Auth';
import { useForgotPassword } from '../view-models/forgot-password.view-model';

export const ForgotPasswordScreen = () => {
  const { forgotPassword, isLoading } = useForgotPassword();
  const navigation = useAuthNavigation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      username: '',
    },
    mode: 'onChange',
  });

  // Los errores son manejados por el view-model (toast + Sentry); aquí solo iniciamos el flujo
  const onSubmit = (data: ForgotPasswordFormValues) => forgotPassword(data);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Recuperar contraseña
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Ingresa tu correo electrónico y te enviaremos instrucciones para
            restablecer tu contraseña
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

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isLoading}
            loading={isLoading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Enviar instrucciones
          </Button>

          <Button
            mode="text"
            icon="arrow-left"
            onPress={() => navigation.navigate('Login')}
            style={styles.backButton}
          >
            Volver a iniciar sesión
          </Button>
        </View>
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
    marginBottom: 12,
  },
  subtitle: {
    color: '#666',
    lineHeight: 22,
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
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  backButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
});
