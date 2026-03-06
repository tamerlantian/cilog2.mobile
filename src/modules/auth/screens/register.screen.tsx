import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Checkbox, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthStackParamList } from '../../../navigation/types';
import { isValidPhoneNumber } from '../../../shared/utils/phone.util';
import { RegisterFormValues } from '../interfaces/auth.interface';
import { useRegister } from '../view-models/register.view-model';

// TODO: Reemplazar con las URLs reales de términos y privacidad de la app
const TERMS_URL = 'https://example.com/terminos_de_uso';
const PRIVACY_URL = 'https://example.com/politicas_privacidad';

type RegisterScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Register'
>;

const openUrl = async (url: string) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  } catch {
    // Si el sistema no puede abrir la URL, se ignora silenciosamente
  }
};

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useRegister();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      username: '',
      password: '',
      confirmarPassword: '',
      celular: '',
      aceptarTerminosCondiciones: false,
    },
    mode: 'onChange',
  });

  const password = watch('password');

  // Los errores son manejados por el view-model (toast + Sentry); aquí solo iniciamos el flujo
  const onSubmit = (data: RegisterFormValues) => register(data);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Crear cuenta
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Completa el formulario para registrarte
          </Text>
        </View>

        <View style={styles.form}>
          {/* Correo electrónico */}
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
                autoCorrect={false}
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

          {/* Contraseña */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: 'La contraseña es obligatoria',
              minLength: {
                value: 8,
                message: 'La contraseña debe tener al menos 8 caracteres',
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

          {/* Confirmar contraseña */}
          <Controller
            control={control}
            name="confirmarPassword"
            rules={{
              required: 'Debes confirmar tu contraseña',
              validate: (value: string) =>
                value === password || 'Las contraseñas no coinciden',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Confirmar contraseña"
                mode="outlined"
                secureTextEntry={!confirmPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={!!errors.confirmarPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock-check-outline" />}
                right={
                  <TextInput.Icon
                    icon={
                      confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'
                    }
                    onPress={() => setConfirmPasswordVisible(v => !v)}
                  />
                }
              />
            )}
          />
          {errors.confirmarPassword && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.confirmarPassword.message}
            </Text>
          )}

          {/* Número de celular */}
          <Controller
            control={control}
            name="celular"
            rules={{
              required: 'El número de celular es obligatorio',
              validate: value =>
                isValidPhoneNumber(value) ||
                'Ingresa un número de celular válido',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Celular"
                mode="outlined"
                keyboardType="phone-pad"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={!!errors.celular}
                style={styles.input}
                left={<TextInput.Icon icon="phone-outline" />}
              />
            )}
          />
          {errors.celular && (
            <Text variant="bodySmall" style={styles.errorText}>
              {errors.celular.message}
            </Text>
          )}

          {/* Términos y condiciones */}
          <Controller
            control={control}
            name="aceptarTerminosCondiciones"
            rules={{ required: 'Debes aceptar los términos y condiciones' }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={value ? 'checked' : 'unchecked'}
                  onPress={() => onChange(!value)}
                />
                <View style={styles.termsTextContainer}>
                  <Text variant="bodyMedium">
                    Acepto los{' '}
                    <Text
                      variant="bodyMedium"
                      style={styles.link}
                      onPress={() => openUrl(TERMS_URL)}
                    >
                      términos
                    </Text>
                    {' y '}
                    <Text
                      variant="bodyMedium"
                      style={styles.link}
                      onPress={() => openUrl(PRIVACY_URL)}
                    >
                      condiciones
                    </Text>
                  </Text>
                  {errors.aceptarTerminosCondiciones && (
                    <Text variant="bodySmall" style={styles.errorText}>
                      {errors.aceptarTerminosCondiciones.message}
                    </Text>
                  )}
                </View>
              </View>
            )}
          />

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isLoading}
            loading={isLoading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Registrarse
          </Button>

          <View style={styles.footer}>
            <Text variant="bodyMedium" style={styles.footerText}>
              ¿Ya tienes una cuenta?
            </Text>
            <Button
              mode="text"
              compact
              onPress={() => navigation.navigate('Login')}
            >
              Iniciar sesión
            </Button>
          </View>
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 12,
  },
  termsTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 8,
    paddingTop: 6,
  },
  link: {
    color: '#1976D2',
    textDecorationLine: 'underline',
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
});
