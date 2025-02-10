import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Para ícones modernos
import { useFirestore } from '../../hooks/useFirestore';
import { AuthContext } from '../../context/AuthContext';
import { doc, getDoc, FieldValue, serverTimestamp } from 'firebase/firestore';
import { db } from '../../service/firebase';

export default function ServiceDetailsScreen({ route, navigation }) {
    const { service } = route.params; // Recebe os dados do serviço selecionado
    const { user } = useContext(AuthContext); // Pega os dados do usuário do AuthContext
    const [userData, setUserData] = useState(null); // Armazena dados do usuário
    const [loading, setLoading] = useState(true); // Estado para controle de carregamento de dados do usuário

    // UseFirestore hook para interagir com o Firestore
    const { addDocument } = useFirestore({
        collectionName: 'solicitacoes',
    });

    // Fetch dos dados do usuário
    useEffect(() => {
        if (!user) {
            navigation.navigate("LoginScreen");
            return;
        }

        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, "funcionarios", user.uid); // Referência do documento
                const userDoc = await getDoc(userDocRef); // Recupera o documento do Firestore

                if (userDoc.exists()) {
                    setUserData(userDoc.data()); // Armazena os dados do usuário
                } else {
                    console.error("Usuário não encontrado no Firestore.");
                }
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        };

        fetchUserData();
    }, [user, navigation]);

    // Função para solicitar o serviço
    const solicitarServico = async () => {
        try {
            if (!userData) {
                alert('Dados do usuário não carregados corretamente.');
                return;
            }
console.log(user.uid)
            // Envia a solicitação para o Firestore
            const solicitationData = await addDocument({
                clienteId: user.uid, // ID do cliente
                donoId: service.credenciado_id, // ID do dono do serviço
                nome_servico: service.nome_servico,
                descricao: service.descricao,
                preco: service.preco_com_desconto || service.preco_original,
                status: 'pendente', // Status inicial da solicitação
                createdAt: serverTimestamp(),
            });

            console.log("Enviando dados:", solicitationData); // 👈 Adicione este log

            alert('Solicitação enviada com sucesso!');
        } catch (error) {
            console.error('Erro ao solicitar serviço:', error);
            alert('Houve um erro ao enviar sua solicitação.');
        }
    };

    // Verifica se os dados estão carregando
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Imagem do serviço */}
            <Image
                source={{
                    uri: service.imagemUrl,
                }} // Substitua por uma imagem real
                style={styles.serviceImage}
            />

            {/* Nome do serviço */}
            <Text style={styles.serviceName}>{service.nome_servico}</Text>

            {/* Descrição do serviço */}
            <Text style={styles.serviceDescription}>{service.descricao}</Text>

            {/* Informações da empresa */}
            <View style={styles.infoContainer}>
                <Icon name="business" size={24} color="#003DA5" style={styles.icon} />
                <Text style={styles.infoText}>{service.empresa_nome}</Text>
            </View>

            {/* Localização */}
            <View style={styles.infoContainer}>
                <Icon name="location-on" size={24} color="#003DA5" style={styles.icon} />
                <Text style={styles.infoText}>{service.endereco}</Text>
            </View>

            {/* Preço */}
            <View style={styles.infoContainer}>
                <Icon name="attach-money" size={24} color="#003DA5" style={styles.icon} />
                <Text style={styles.infoText}>
                    {service.preco_com_desconto ? `R$ ${service.preco_com_desconto}` : `R$ ${service.preco_original}`}
                </Text>
            </View>

            {/* Botão para solicitar serviço */}
            <TouchableOpacity style={styles.actionButton} onPress={() => solicitarServico()}>
                <Text style={styles.buttonText}>Solicitar Serviço</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F4F7FC',
    },
    serviceImage: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 20,
    },
    serviceName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#003DA5',
        marginBottom: 10,
    },
    serviceDescription: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    infoText: {
        fontSize: 18,
        color: '#333',
    },
    actionButton: {
        backgroundColor: '#003DA5',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
});