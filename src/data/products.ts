export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    features: string[];
    created_at: string;
}

export const staticProducts: Product[] = [
    {
        id: 1,
        name: 'Smart Fietsslot Pro',
        description: 'Revolutionair fietsslot dat je met je smartphone kunt openen. Inclusief alarm en GPS-tracking. Waterdicht en ultra-sterk materiaal.',
        price: 89.99,
        image: '/images/fietsslot.png',
        category: 'fietsslot',
        stock: 25,
        features: [
            'Smartphone opening',
            'Alarm functie',
            'GPS tracking',
            'Waterdicht',
            'Ultra-sterk materiaal',
            'Batterij duurt 6 maanden'
        ],
        created_at: '2025-07-12T18:08:13.000Z'
    },
    {
        id: 2,
        name: 'Smart Kabelslot Secure',
        description: 'Flexibel kabelslot met smartphone bediening en alarm. Perfect voor motoren, fietsen en andere voertuigen. Verstelbare kabellengte.',
        price: 79.99,
        image: '/images/kettingslot.png',
        category: 'kabelslot',
        stock: 30,
        features: [
            'Smartphone opening',
            'Alarm functie',
            'Verstelbare kabel',
            'Weersbestendig',
            'Lange batterijduur',
            'Bluetooth connectie'
        ],
        created_at: '2025-07-12T18:08:13.000Z'
    },
    {
        id: 3,
        name: 'Smart Deurslot',
        description: 'Flexibel slim deurslot met smartphonebediening en ingebouwd alarm. Ideaal voor schuifdeuren, poorten en toegangshekken.',
        price: 99.99,
        image: '/images/product-1752358283661.png',
        category: 'deurslot',
        stock: 20,
        features: [
            'Deurslot',
            'Smart',
            'Bluetooth',
            'Telefoon'
        ],
        created_at: '2025-07-12T22:11:43.000Z'
    }
];

export const getAllProducts = (): Product[] => {
    return staticProducts;
};

export const getProductById = (id: number): Product | undefined => {
    return staticProducts.find(product => product.id === id);
}; 