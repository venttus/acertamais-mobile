import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { AuthContext } from "../../context/AuthContext";
import { auth, db } from "../../service/firebase";
import Background from "../components/Background";
import Button from "../components/Button";
import Header from "../components/Header";
import Logo from "../components/Logo";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme"; // Usando o tema do seu app

// Função para aplicar a máscara no CPF
const maskCPF = (value) => {
  return value
    .replace(/\D/g, "") // Remove tudo o que não for número
    .replace(/^(\d{3})(\d)/, "$1.$2") // Adiciona o primeiro ponto
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3") // Adiciona o segundo ponto
    .replace(/\.(\d{3})(\d)/, ".$1-$2") // Adiciona o hífen
    .replace(/-(\d{2})\d+$/, "-$1"); // Limita a quantidade de dígitos após o hífen
};

// Função para validar o CPF (pode ser substituída por uma biblioteca específica de validação)
const isValidCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, "");
  if (cleaned.length !== 11) return false;
  return true; // Implementação simplificada, para uso real é recomendável uma biblioteca.
};

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [showPassword, setShowPassword] = useState(false); // Controle para mostrar/ocultar senha

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigation.navigate("HomeTabs");
    }
  }, [user, navigation]);

  const onLoginPressed = async () => {
    try {
      // Validação dos campos CPF e Senha
      if (!cpf.value) {
        setCpf({ ...cpf, error: "CPF não pode ser vazio" });
        return;
      }

      if (!isValidCPF(cpf.value)) {
        setCpf({ ...cpf, error: "CPF inválido" });
        return;
      }

      if (!password.value) {
        setPassword({ ...password, error: "Senha não pode ser vazia" });
        return;
      }

      // Consulta a coleção "funcionarios" no Firestore
      const funcionariosRef = collection(db, "funcionarios");
      const q = query(funcionariosRef, where("cpf", "==", cpf.value));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setCpf({ ...cpf, error: "CPF não encontrado" });
        return;
      }

      const funcionario = querySnapshot.docs[0].data();
      const userRef = collection(db, "users");
      const qUser = query(userRef, where("email", "==", funcionario.email));
      const querySnapshotUser = await getDocs(qUser);

      if (querySnapshotUser.empty) {
        setCpf({ ...cpf, error: "Usuário associado ao CPF não encontrado" });
        return;
      }

      const userInfo = querySnapshotUser.docs[0].data();
      console.log(userInfo)
      // Verifica se o usuário tem o papel (role) "user"
      if (userInfo.role !== "employee") {
        setCpf({ ...cpf, error: "Permissão negada" });
        return;
      }

      // Autentica o usuário no Firebase Auth
      await signInWithEmailAndPassword(auth, funcionario.email, password.value);

      // Redireciona para a tela inicial
      navigation.reset({
        index: 0,
        routes: [{ name: "HomeScreen" }],
      });
    } catch (error) {
      console.error(error);
      if (error.code === "auth/wrong-password") {
        setPassword({ ...password, error: "Senha incorreta" });
      } else if (error.code === "auth/user-not-found") {
        setCpf({ ...cpf, error: "Usuário não encontrado" });
      } else {
        setCpf({ ...cpf, error: "Erro ao tentar acessar a conta" });
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Background>
        <Logo />
        <Header>Acessar conta</Header>

        {/* Campo CPF com máscara */}
        <TextInput
          label="CPF"
          returnKeyType="next"
          value={cpf.value}
          onChangeText={(text) => setCpf({ value: maskCPF(text), error: "" })}
          error={!!cpf.error}
          errorText={cpf.error}
          autoCapitalize="none"
          keyboardType="number-pad"
          style={styles.textInput}
        />

        {/* Campo Senha */}
        <TextInput
          label="Senha"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry={!showPassword} // Controla visibilidade da senha
          style={styles.textInput}
        />

        <View style={styles.forgotPassword}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ResetPasswordScreen")}
          >
            <Text style={styles.forgot}>Esqueceu sua senha?</Text>
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={onLoginPressed}>
          Entrar
        </Button>
      </Background>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  textInput: {
    marginBottom: 6,  // Adicionando margem para separar os campos
  }
});
