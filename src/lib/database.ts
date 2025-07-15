// TypeScript interfaces
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    features: string;
    created_at: string;
}

interface Order {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    customer_postal_code: string;
    total_amount: number;
    order_items: string;
    status: string;
    payment_intent_id: string;
    created_at: string;
}

interface AdminUser {
    id: number;
    username: string;
    password_hash: string;
    created_at: string;
}

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    created_at: string;
}

interface SiteStats {
    total_visits: number;
    unique_visitors: number;
    today_visits: number;
    week_visits: number;
    month_visits: number;
}

interface OrderItem {
    id: number;
    quantity: number;
}

interface OrderData {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_address: string;
    customer_city: string;
    customer_postal_code: string;
    total_amount: number;
    order_items: OrderItem[];
    payment_intent_id: string;
}

interface ProductData {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    features: string[];
}

interface MessageData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface SiteVisit {
    id: number;
    visitor_ip: string;
    user_agent: string;
    page_path: string;
    created_at: string;
}

// Static data for Vercel deployment
const staticProducts: Product[] = [
    {
        id: 1,
        name: 'Smart Fietsslot Pro',
        description: 'Revolutionair fietsslot dat je met je smartphone kunt openen. Inclusief alarm en GPS-tracking. Waterdicht en ultra-sterk materiaal.',
        price: 89.99,
        image: '/images/fietsslot.png',
        category: 'fietsslot',
        stock: 25,
        features: '["Smartphone opening", "Alarm functie", "GPS tracking", "Waterdicht", "Ultra-sterk materiaal", "Batterij duurt 6 maanden"]',
        created_at: '2024-01-01T00:00:00.000Z'
    },
    {
        id: 2,
        name: 'Smart Kabelslot Secure',
        description: 'Flexibel kabelslot met smartphone bediening en alarm. Perfect voor motoren, fietsen en andere voertuigen. Verstelbare kabellengte.',
        price: 79.99,
        image: '/images/kettingslot.png',
        category: 'kabelslot',
        stock: 30,
        features: '["Smartphone opening", "Alarm functie", "Verstelbare kabel", "Weersbestendig", "Lange batterijduur", "Bluetooth connectie"]',
        created_at: '2024-01-01T00:00:00.000Z'
    },
    {
        id: 3,
        name: 'Smart Deurslot',
        description: 'Flexibel slim deurslot met smartphonebediening en ingebouwd alarm. Ideaal voor schuifdeuren, poorten en toegangshekken.',
        price: 99.99,
        image: '/images/product-1752358283661.png',
        category: 'deurslot',
        stock: 20,
        features: '["Deurslot", "Smart", "Bluetooth", "Telefoon"]',
        created_at: '2024-01-01T00:00:00.000Z'
    }
];

// In-memory storage for orders and messages (will reset on server restart)
const orders: Order[] = [
    {
        id: 1,
        customer_name: 'Jan Jansen',
        customer_email: 'jan@example.com',
        customer_phone: '06-12345678',
        customer_address: 'Hoofdstraat 123',
        customer_city: 'Amsterdam',
        customer_postal_code: '1000 AA',
        total_amount: 89.99,
        order_items: '[{"id":1,"quantity":1,"price":89.99}]',
        status: 'completed',
        payment_intent_id: 'pi_mock_123',
        created_at: '2024-01-15T10:30:00.000Z'
    },
    {
        id: 2,
        customer_name: 'Piet Pietersen',
        customer_email: 'piet@example.com',
        customer_phone: '06-87654321',
        customer_address: 'Kerkstraat 456',
        customer_city: 'Rotterdam',
        customer_postal_code: '2000 BB',
        total_amount: 159.98,
        order_items: '[{"id":1,"quantity":1,"price":89.99},{"id":2,"quantity":1,"price":79.99}]',
        status: 'pending',
        payment_intent_id: 'pi_mock_456',
        created_at: '2024-01-16T14:20:00.000Z'
    }
];

const contactMessages: ContactMessage[] = [
    {
        id: 1,
        name: 'Anna de Vries',
        email: 'anna@example.com',
        subject: 'Vraag over Smart Fietsslot Pro',
        message: 'Ik heb een vraag over de GPS tracking functie. Hoe lang werkt de batterij precies?',
        status: 'new',
        created_at: '2024-01-17T09:15:00.000Z'
    },
    {
        id: 2,
        name: 'Mark Bakker',
        email: 'mark@example.com',
        subject: 'Retourverzoek',
        message: 'Ik wil graag mijn bestelling retourneren. Wat is de procedure?',
        status: 'read',
        created_at: '2024-01-16T16:45:00.000Z'
    }
];

const siteVisits: SiteVisit[] = [];



// Initialize database (no-op for static data)
export const initDatabase = (): Promise<boolean> => {
    return new Promise((resolve) => {
        console.log('[DATABASE] Static database initialized');
        resolve(true);
    });
};

// Database query functions
export const getAllProducts = (): Promise<Product[]> => {
    return new Promise((resolve) => {
        console.log('[DATABASE] getAllProducts - returning static data');
        resolve(staticProducts);
    });
};

export const getProductById = (id: number): Promise<Product | undefined> => {
    return new Promise((resolve) => {
        const product = staticProducts.find(p => p.id === id);
        resolve(product);
    });
};

// Reduce stock for multiple products (used when creating orders)
export const reduceProductStock = (products: { id: number; quantity: number }[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        console.log('[DATABASE] reduceProductStock - checking stock availability');

        // Check if all products have sufficient stock
        for (const { id, quantity } of products) {
            const product = staticProducts.find(p => p.id === id);
            if (!product || product.stock < quantity) {
                reject(new Error("Insufficient stock for one or more products"));
                return;
            }
        }

        // Mock stock reduction (in real implementation, you'd update the stock)
        console.log('[DATABASE] Stock reduction successful (mock)');
        resolve();
    });
};

export const createOrder = (orderData: OrderData): Promise<number> => {
    return new Promise((resolve) => {
        const newOrderId = Math.max(...orders.map(o => o.id), 0) + 1;
        const newOrder: Order = {
            id: newOrderId,
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email,
            customer_phone: orderData.customer_phone,
            customer_address: orderData.customer_address,
            customer_city: orderData.customer_city,
            customer_postal_code: orderData.customer_postal_code,
            total_amount: orderData.total_amount,
            order_items: JSON.stringify(orderData.order_items),
            payment_intent_id: orderData.payment_intent_id,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        (orders as Order[]).push(newOrder);
        console.log('[DATABASE] createOrder - new order created with ID:', newOrderId);
        resolve(newOrderId);
    });
};

export const getAllOrders = (): Promise<Order[]> => {
    return new Promise((resolve) => {
        console.log('[DATABASE] getAllOrders - returning orders');
        resolve([...(orders as Order[])]);
    });
};

export const updateOrderStatus = (orderId: number, status: string): Promise<void> => {
    return new Promise((resolve) => {
        const order = (orders as Order[]).find(o => o.id === orderId);
        if (order) {
            order.status = status;
            console.log('[DATABASE] updateOrderStatus - order', orderId, 'updated to', status);
        }
        resolve();
    });
};

export const getAdminUser = (username: string): Promise<AdminUser | undefined> => {
    return new Promise((resolve) => {
        // Mock admin user for Vercel
        if (username === 'Youribrouwers') {
            resolve({
                id: 1,
                username: 'Youribrouwers',
                password_hash: '$2a$10$mock.hash.for.vercel',
                created_at: '2024-01-01T00:00:00.000Z'
            });
        } else {
            resolve(undefined);
        }
    });
};

export const logSiteVisit = (visitorIp: string, userAgent: string, pagePath: string): Promise<void> => {
    return new Promise((resolve) => {
        const newVisit: SiteVisit = {
            id: Math.max(...(siteVisits as SiteVisit[]).map(v => v.id), 0) + 1,
            visitor_ip: visitorIp,
            user_agent: userAgent,
            page_path: pagePath,
            created_at: new Date().toISOString()
        };
        (siteVisits as SiteVisit[]).push(newVisit);
        console.log('[DATABASE] logSiteVisit - visit logged');
        resolve();
    });
};

export const getSiteStats = (): Promise<SiteStats> => {
    return new Promise((resolve) => {
        // Calculate real stats from siteVisits
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const visitsArray = siteVisits as SiteVisit[];
        const uniqueIPs = new Set(visitsArray.map(v => v.visitor_ip));
        const todayVisits = visitsArray.filter(v => new Date(v.created_at) >= today).length;
        const weekVisits = visitsArray.filter(v => new Date(v.created_at) >= weekAgo).length;
        const monthVisits = visitsArray.filter(v => new Date(v.created_at) >= monthAgo).length;

        const stats: SiteStats = {
            total_visits: visitsArray.length,
            unique_visitors: uniqueIPs.size,
            today_visits: todayVisits,
            week_visits: weekVisits,
            month_visits: monthVisits
        };

        console.log('[DATABASE] getSiteStats - returning calculated stats');
        resolve(stats);
    });
};

export const createProduct = (productData: ProductData): Promise<number> => {
    return new Promise((resolve) => {
        const newProductId = Math.max(...staticProducts.map(p => p.id), 0) + 1;
        const newProduct: Product = {
            id: newProductId,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image: productData.image,
            category: productData.category,
            stock: productData.stock,
            features: JSON.stringify(productData.features),
            created_at: new Date().toISOString()
        };

        (staticProducts as Product[]).push(newProduct);
        console.log('[DATABASE] createProduct - new product created with ID:', newProductId);
        resolve(newProductId);
    });
};

export const updateProduct = (id: number, productData: ProductData): Promise<void> => {
    return new Promise((resolve) => {
        const product = (staticProducts as Product[]).find(p => p.id === id);
        if (product) {
            product.name = productData.name;
            product.description = productData.description;
            product.price = productData.price;
            product.image = productData.image;
            product.category = productData.category;
            product.stock = productData.stock;
            product.features = JSON.stringify(productData.features);
            console.log('[DATABASE] updateProduct - product', id, 'updated');
        }
        resolve();
    });
};

export const deleteProduct = (id: number): Promise<void> => {
    return new Promise((resolve) => {
        const index = (staticProducts as Product[]).findIndex(p => p.id === id);
        if (index !== -1) {
            (staticProducts as Product[]).splice(index, 1);
            console.log('[DATABASE] deleteProduct - product', id, 'deleted');
        }
        resolve();
    });
};

export const createContactMessage = (messageData: MessageData): Promise<number> => {
    return new Promise((resolve) => {
        const newMessageId = Math.max(...(contactMessages as ContactMessage[]).map(m => m.id), 0) + 1;
        const newMessage: ContactMessage = {
            id: newMessageId,
            name: messageData.name,
            email: messageData.email,
            subject: messageData.subject,
            message: messageData.message,
            status: 'new',
            created_at: new Date().toISOString()
        };

        (contactMessages as ContactMessage[]).push(newMessage);
        console.log('[DATABASE] createContactMessage - new message created with ID:', newMessageId);
        resolve(newMessageId);
    });
};

export const getAllContactMessages = (): Promise<ContactMessage[]> => {
    return new Promise((resolve) => {
        console.log('[DATABASE] getAllContactMessages - returning messages');
        resolve([...(contactMessages as ContactMessage[])]);
    });
};

export const updateContactMessageStatus = (messageId: number, status: string): Promise<void> => {
    return new Promise((resolve) => {
        const message = (contactMessages as ContactMessage[]).find(m => m.id === messageId);
        if (message) {
            message.status = status;
            console.log('[DATABASE] updateContactMessageStatus - message', messageId, 'updated to', status);
        }
        resolve();
    });
}; 