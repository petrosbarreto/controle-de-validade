import Realm from '../Services/Realm';
import { sortLoteByExpDate, removeLotesTratados } from './Lotes';

// ESSA FUNÇÃO RECEBE UMA LISTA DE PRODUTOS E ORDERNAR CADA ARRAY DE LOTES DE CADA PRODUTO
// POR DATA DE VENCIMENTO, OU SEJA CADA PRODUTO DA LISTA VAI TER UM ARRAY DE LOTE JÁ ORDERNADO POR DATA DE VENCIMENTO
export function sortProductsLotesByLotesExpDate(listProducts) {
    const productsLotesSorted = listProducts.map((prod) => {
        const prodLotesSorted = sortLoteByExpDate(prod.lotes);

        return {
            id: prod.id,
            name: prod.name,
            code: prod.code,
            lotes: prodLotesSorted,
        };
    });

    return productsLotesSorted;
}

// classifica os produtos em geral pelo o mais proximo de vencer
// ATENÇÃO QUE A FUNÇÃO SÓ PEGA O PRIMEIRO VALOR DO ARRAY DE LOTES, OU SEJA
// É ESPERADO QUE O ARRAY DE LOTES JÁ TENHA SIDO ORDERNADO ANTES
export function sortProductsByFisrtLoteExpDate(listProducts) {
    const results = listProducts.sort((item1, item2) => {
        if (item1.lotes !== null && item1.lotes.length > 0) {
            if (item2.lotes !== null && item2.lotes.length > 0) {
                if (item1.lotes[0].exp_date > item2.lotes[0].exp_date) return 1;
                if (item1.lotes[0].exp_date < item2.lotes[0].exp_date)
                    return -1;
                return 0;
            }

            return 1;
        }

        return -1;
    });

    return results;
}

export function removeAllLotesTratadosFromAllProduts(listProducts) {
    const results = listProducts.map((prod) => {
        return {
            id: prod.id,
            name: prod.name,
            code: prod.code,
            lotes: removeLotesTratados(prod.lotes),
        };
    });

    return results;
}

export async function GetAllProducts() {
    try {
        const realm = await Realm();

        const results = realm.objects('Product').slice();

        return results;
    } catch (err) {
        console.warn(err);
    }

    return null;
}

export async function GetAllProductsWithLotes() {
    try {
        const realm = await Realm();

        const results = realm
            .objects('Product')
            .filtered('lotes.@count > 0')
            .slice();

        return results;
    } catch (err) {
        console.warn(err);
    }

    return null;
}
