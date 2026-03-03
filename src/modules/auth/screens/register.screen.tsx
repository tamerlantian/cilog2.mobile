import { FormButton } from '../../../shared/components/ui/button/FormButton';
import { FormInputController } from '../../../shared/components/ui/form/FormInputController';
import { PasswordInputController } from '../../../shared/components/ui/form/PasswordInputController';
import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, Text, TouchableOpacity, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RegisterFormValues } from '../interfaces/auth.interface';
import { loginStyles } from '../styles/login.style';
import { useRegister } from '../view-models/register.view-model';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../../navigation/types';

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useRegister();

  // TODO: Replace with your project's terms URL
  const handleOpenTerms = async () => {
    const url = 'https://example.com/terminos_de_uso';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('No se puede abrir la URL:', url);
      }
    } catch (error) {
      console.error('Error al abrir términos y condiciones:', error);
    }
  };

  // TODO: Replace with your project's privacy URL
  const handleOpenPrivacy = async () => {
    const url = 'https://example.com/politicas_privacidad';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('No se puede abrir la URL:', url);
      }
    } catch (error) {
      console.error('Error al abrir políticas de privacidad:', error);
    }
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      username: '',
      password: '',
      aplicacion: '',
      confirmarPassword: '',
      aceptarTerminosCondiciones: false,
    },
    mode: 'onChange',
  });

  const password = watch('password');

  const onSubmit = (data: RegisterFormValues) => {
    register({
      username: data.username,
      password: data.password,
      confirmarPassword: data.confirmarPassword,
      aceptarTerminosCondiciones: data.aceptarTerminosCondiciones,
      aplicacion: data.aplicacion,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={loginStyles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={loginStyles.title}>Crear cuenta</Text>

        <FormInputController<RegisterFormValues>
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

        <PasswordInputController<RegisterFormValues>
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

        <PasswordInputController<RegisterFormValues>
          control={control}
          name="confirmarPassword"
          label="Confirmar contraseña"
          placeholder="**************"
          error={errors.confirmarPassword}
          rules={{
            required: 'Debes confirmar tu contraseña',
            validate: (value: string) => value === password || 'Las contraseñas no coinciden',
          }}
        />

        <Controller
          control={control}
          name="aceptarTerminosCondiciones"
          rules={{ required: 'Debes aceptar los términos y condiciones' }}
          render={({ field: { onChange, value } }) => (
            <View style={loginStyles.checkboxContainer}>
              <CheckBox
                value={value}
                onValueChange={onChange}
                style={loginStyles.checkbox}
              />
              <View style={loginStyles.termsContainer}>
                <Text style={loginStyles.termsText}>
                  Acepto los{' '}
                  <Text style={loginStyles.termsLink} onPress={handleOpenTerms}>
                    términos
                  </Text>
                  <Text style={loginStyles.termsText}> y </Text>
                  <Text style={loginStyles.termsLink} onPress={handleOpenPrivacy}>
                    condiciones
                  </Text>
                </Text>
                {errors.aceptarTerminosCondiciones && (
                  <Text style={loginStyles.errorText}>
                    {errors.aceptarTerminosCondiciones.message}
                  </Text>
                )}
              </View>
            </View>
          )}
        />

        <FormButton
          title="Registrarse"
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
          isLoading={isLoading}
        />

        <View style={loginStyles.footer}>
          <Text style={loginStyles.footerText}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login');
            }}
          >
            <Text style={loginStyles.footerLink}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
