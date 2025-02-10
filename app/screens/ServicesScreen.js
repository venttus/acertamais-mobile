import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
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

export default function ServicesScreen({ route, navigation }) {
    const { credenciadoId } = route.params || {}; // Recebe o credenciado_id como parâmetro
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const servicosRef = collection(db, 'servicos');
                const snapshot = await getDocs(servicosRef);
                const servicesData = [];

                for (let docSnapshot of snapshot.docs) {
                    const serviceData = docSnapshot.data();
                    const credenciadoRef = doc(db, 'credenciados', serviceData.credenciado_id);
                    const credenciadoSnapshot = await getDoc(credenciadoRef);

                    if (credenciadoSnapshot.exists()) {
                        const credenciadoData = credenciadoSnapshot.data();
                        serviceData.segmento = credenciadoData.segmento;
                        serviceData.empresa_nome = credenciadoData.nomeFantasia;
                    }

                    servicesData.push(serviceData);
                }

                // Filtra os serviços pelo credenciado_id
                const filteredServices = credenciadoId
                    ? servicesData.filter(service => service.credenciado_id === credenciadoId)
                    : servicesData;

                setServicos(filteredServices);
            } catch (error) {
                console.error("Erro ao carregar os serviços:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [credenciadoId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#003DA5" />
                <Text style={styles.loadingText}>Carregando serviços...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.discountText}>{credenciadoId}</Text>
            <FlatList
                data={servicos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const hasDiscount = item.preco_com_desconto && item.preco_original > item.preco_com_desconto;
                    const discountPercentage = hasDiscount ? ((item.preco_original - item.preco_com_desconto) / item.preco_original * 100).toFixed(0) : null;
                    const segmentName = segmentos[item.segmento];

                    return (
                        <View style={styles.card}>
                            {/* Imagem do serviço (pode ser substituída por uma imagem real) */}
                            <Image
                                source={require("../../assets/items/business_logo.jpg")} // Substitua por uma imagem real
                                style={styles.serviceImage}
                            />

                            {/* Badge de desconto */}
                            {hasDiscount && (
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
                                </View>
                            )}

                            {/* Nome e descrição do serviço */}
                            <Text style={styles.serviceName}>{item.nome_servico}</Text>
                            <Text style={styles.serviceDescription}>{item.descricao}</Text>

                            {/* Preço e segmento */}
                            <View style={styles.priceContainer}>
                                <Text style={styles.servicePrice}>
                                    {hasDiscount ? (
                                        <>
                                            <Text style={styles.originalPrice}>R$ {item.preco_original}</Text>
                                            <Text style={styles.discountedPrice}> R$ {item.preco_com_desconto}</Text>
                                        </>
                                    ) : (
                                        `R$ ${item.preco_original}`
                                    )}
                                </Text>
                                <View style={styles.segmentContainer}>
                                    <Icon name="category" size={16} color="#003DA5" />
                                    <Text style={styles.serviceSegment}>{segmentName}</Text>
                                </View>
                            </View>

                            {/* Botão de ação */}
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => navigation.navigate('ServiceDetails', { service: item })}
                            >
                                <Text style={styles.buttonText}>Ver Detalhes</Text>
                            </TouchableOpacity>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#003DA5',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 15,
        marginBottom: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    serviceImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    discountBadge: {
        backgroundColor: '#FF5722',
        position: 'absolute',
        top: 10,
        right: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
    },
    discountText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    serviceName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        margin: 15,
    },
    serviceDescription: {
        fontSize: 14,
        color: '#777',
        marginHorizontal: 15,
        marginBottom: 10,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 15,
    },
    servicePrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    originalPrice: {
        fontSize: 16,
        color: '#ee6e6e',
        textDecorationLine: 'line-through',
    },
    discountedPrice: {
        fontSize: 18,
        color: '#08ca08',
    },
    segmentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceSegment: {
        fontSize: 14,
        color: '#888',
        marginLeft: 5,
    },
    actionButton: {
        backgroundColor: '#003DA5',
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
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