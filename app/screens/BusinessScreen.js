import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Para ícones modernos
import { db } from '../../service/firebase';

// Mapa de segmentos
const segmentos = {
    agronegocio: 'Agronegócio',
    alimentacao: 'Alimentação',
    artes_publicidade: 'Artes e Publicidade',
    automotivo: 'Automotivo',
    beleza_estetica: 'Beleza e Estética',
    comercio: 'Comércio',
    confeccoes: 'Confecções',
    construcao: 'Construção',
    consultoria: 'Consultoria',
    educacao: 'Educação',
    eletronicos: 'Eletrônicos',
    empresas_variadas: 'Empresas Variadas',
    financas: 'Finanças',
    hospedagem_turismo: 'Hospedagem e Turismo',
    industria: 'Indústria',
    logistica_transporte: 'Logística e Transporte',
    saude: 'Saúde',
    servicos_gerais: 'Serviços Gerais',
    tecnologia: 'Tecnologia',
};

export default function BusinessScreen({ navigation }) {
    const [credenciados, setCredenciados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCredenciados = async () => {
            try {
                const credenciadosRef = collection(db, 'credenciados');
                const snapshot = await getDocs(credenciadosRef);
                const credenciadosData = [];

                snapshot.forEach((doc) => {
                    const credenciado = doc.data();
                    credenciadosData.push({ id: doc.id, ...credenciado });
                });

                setCredenciados(credenciadosData);
            } catch (error) {
                console.error("Erro ao carregar credenciados:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCredenciados();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#003DA5" />
                <Text style={styles.loadingText}>Carregando credenciados...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={credenciados}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const segmentName = segmentos[item.segmento];

                    return (
                        <View style={styles.card}>
                            {/* Imagem da logo à esquerda */}
                            <Image
                                source={require("../../assets/items/business_logo.jpg")} // Substitua por uma imagem real
                                style={styles.logoImage}
                            />

                            {/* Informações do credenciado */}
                            <View style={styles.infoContainer}>
                                <Text style={styles.nomeFantasia}>{item.nomeFantasia}</Text>
                                <View style={styles.infoRow}>
                                    <Icon name="location-on" size={16} color="#003DA5" />
                                    <Text style={styles.endereco}>{item.endereco}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Icon name="category" size={16} color="#003DA5" />
                                    <Text style={styles.segmento}>{segmentName}</Text>
                                </View>

                                {/* Botão "Ver Serviços" */}
                                <TouchableOpacity
                                    style={styles.actionButton}
                                    onPress={() => navigation.navigate('Services', { credenciadoId: item.id })}
                                >
                                    <Text style={styles.buttonText}>Ver Serviços</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F4F7FC',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        marginBottom: 20,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    logoImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 15,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nomeFantasia: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003DA5',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    endereco: {
        fontSize: 14,
        color: '#555',
        marginLeft: 5,
    },
    segmento: {
        fontSize: 14,
        color: '#555',
        marginLeft: 5,
    },
    actionButton: {
        backgroundColor: '#003DA5',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10, // Espaço acima do botão
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F4F7FC',
    },
    loadingText: {
        fontSize: 18,
        color: '#003DA5',
        marginTop: 10,
        fontWeight: '500',
    },
});