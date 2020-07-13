import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorange from '@react-native-community/async-storage';

import ProductItem from '../Product';

import {
    Container,
    HeaderContainer,
    TextLogo,
    CategoryDetails,
    CategoryDetailsText,
    ButtonLoadMore,
    ButtonLoadMoreText,
    HackComponent,
} from './styles';

async function getDaysToBeNext() {
    try {
        const days = await AsyncStorange.getItem('settings/daysToBeNext');

        if (days != null) return days;
    } catch (err) {
        console.log(err);
    }

    return 30;
}

export default function ListProducts({ products, isHome }) {
    const navigation = useNavigation();

    const [daysToBeNext, setDaysToBeNext] = useState();

    useEffect(() => {
        async function getAppData() {
            const days = await getDaysToBeNext();
            setDaysToBeNext(days);
        }

        getAppData();
    }, []);

    const ListHeader = () => {
        return (
            <View>
                {isHome ? (
                    <HeaderContainer>
                        <TextLogo>Controle de validade</TextLogo>
                    </HeaderContainer>
                ) : null}

                {/* Verificar se há items antes de criar o titulo */}
                {products.length > 0 ? (
                    <CategoryDetails>
                        <CategoryDetailsText>
                            Produtos mais próximos ao vencimento
                        </CategoryDetailsText>
                    </CategoryDetails>
                ) : null}
            </View>
        );
    };

    const EmptyList = () => {
        return (
            <Text style={{ marginLeft: 15, marginRight: 15 }}>
                Não há nenhum produto cadastrado ainda...
            </Text>
        );
    };

    // Esse hackzinho evita que o FAB Menu fique em cima do ultimo item na pagina de todos os produtos
    const ButtonHack = () => {
        return <HackComponent isHome={isHome} />;
    };

    function FooterButton() {
        if (products.length > 5 && isHome) {
            return (
                <ButtonLoadMore
                    onPress={() => {
                        navigation.navigate('AllProducts');
                    }}
                >
                    <ButtonLoadMoreText>
                        Mostrar todos os produtos
                    </ButtonLoadMoreText>
                </ButtonLoadMore>
            );
        }

        return (
            <>
                <ButtonLoadMore
                    onPress={() => {
                        navigation.navigate('AddProduct');
                    }}
                >
                    <ButtonLoadMoreText>
                        Cadastrar um produto
                    </ButtonLoadMoreText>
                </ButtonLoadMore>
            </>
        );
    }

    return (
        <Container>
            <FlatList
                data={products}
                keyExtractor={(item) => String(item.id)}
                ListHeaderComponent={ListHeader}
                renderItem={({ item }) => (
                    <ProductItem product={item} daysToBeNext={daysToBeNext} />
                )}
                ListEmptyComponent={EmptyList}
                ListFooterComponent={FooterButton}
            />
        </Container>
    );
}
