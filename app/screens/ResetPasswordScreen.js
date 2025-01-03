import React, { useState } from "react";
import { Alert } from "react-native";

import { sendPasswordResetEmail } from "firebase/auth";
import BackButton from "../components/BackButton";
import Background from "../components/Background";
import Button from "../components/Button";
import Header from "../components/Header";
import Logo from "../components/Logo";
import TextInput from "../components/TextInput";
import { emailValidator } from "../helpers/emailValidator";

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });

  // Função para enviar o email de redefinição de senha
  const sendResetPasswordEmail = async () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    try {
      // Enviando o email de redefinição de senha com Firebase
      await sendPasswordResetEmail(email.value);
      // Exibindo uma mensagem de sucesso
      Alert.alert("Email enviado!", "Verifique sua caixa de entrada para redefinir a senha.");
      navigation.navigate("LoginScreen");
    } catch (error) {
      // Tratando erros
      if (error.code === 'auth/user-not-found') {
        setEmail({ ...email, error: "Este email não está registrado." });
      } else {
        console.log(error)
        Alert.alert("Erro", "Ocorreu um erro ao enviar o email de redefinição de senha. Tente novamente.");
      }
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Redefinir sua senha.</Header>
      <TextInput
        label="Email"
        returnKeyType="done"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
        description="Você receberá um email com o link para redefinir sua senha."
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Continuar
      </Button>
    </Background>
  );
}
