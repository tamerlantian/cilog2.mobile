import { FormButton } from '../../../shared/components/ui/button/FormButton';
import { FormInputController } from '../../../shared/components/ui/form/FormInputController';
import { PasswordInputController } from '../../../shared/components/ui/form/PasswordInputController';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginFormValues } from '../interfaces/auth.interface';
import { loginStyles } from '../styles/login.style';
import { useLogin } from '../hooks/useLogin';
import { useAuthNavigation } from '../../../navigation/hooks';
import appInfoService from '../../../shared/services/app-info.service';

export const LoginScreen = () => {
  const { login, isLoading } = useLogin();
  const navigation = useAuthNavigation();

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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={loginStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 30,
          }}
        >
          <Text style={loginStyles.title}>Iniciar sesión</Text>
        </View>

        <FormInputController<LoginFormValues>
          control={control}
          name="username"
          label="Correo electrónico"
          placeholder="john.doe@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.username}
          rules={{
            required: 'El correo electrónico es obligatorio',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Correo electrónico inválido',
            },
          }}
        />

        <PasswordInputController<LoginFormValues>
          control={control}
          name="password"
          label="Contraseña"
          placeholder="**************"
          error={errors.password}
          rules={{
            required: 'La contraseña es obligatoria',
            minLength: {
              value: 6,
              message: 'La contraseña debe tener al menos 6 caracteres',
            },
          }}
        />

        <TouchableOpacity
          style={loginStyles.forgotPassword}
          onPress={() => {
            navigation.navigate('ForgotPassword');
          }}
        >
          <Text style={loginStyles.forgotPasswordText}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        <FormButton
          title="Iniciar sesión"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
          isLoading={isLoading}
        />

        <View style={loginStyles.footer}>
          <Text style={loginStyles.footerText}>¿No tienes una cuenta?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Register');
            }}
          >
            <Text style={loginStyles.footerLink}>Regístrate</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignSelf: 'center', marginTop: 16 }}>
          <Text style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>
            {appInfoService.getFormattedVersion()}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
