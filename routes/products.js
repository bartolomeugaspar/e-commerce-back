const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');

// Mock products data (fallback)
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 9499,
    originalPrice: 10999,
    category: 'smartphones',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80',
    rating: 4.8,
    reviewCount: 245,
    stock: 45,
    description: 'O smartphone mais avançado do mercado com câmera profissional',
    specifications: {
      'Tela': '6.7 polegadas',
      'Processador': 'A17 Pro',
      'Câmera': '48MP',
      'Bateria': '4685 mAh'
    },
    tags: ['5G', 'ProMotion', 'Câmera Pro'],
    variations: [
      { color: 'Preto', storage: '256GB', price: 9499 },
      { color: 'Preto', storage: '512GB', price: 10499 },
      { color: 'Ouro', storage: '256GB', price: 9499 }
    ]
  },
  {
    id: '2',
    name: 'MacBook Pro 14',
    price: 12999,
    originalPrice: 14999,
    category: 'laptops',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80',
    rating: 4.9,
    reviewCount: 189,
    stock: 23,
    description: 'Laptop profissional com chip M3 Max',
    specifications: {
      'Processador': 'M3 Max',
      'RAM': '36GB',
      'Armazenamento': '512GB SSD',
      'Tela': '14 polegadas'
    },
    tags: ['M3', 'Profissional', 'Alto Desempenho'],
    variations: []
  },
  {
    id: '3',
    name: 'AirPods Pro',
    price: 1899,
    originalPrice: 2199,
    category: 'headphones',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    rating: 4.7,
    reviewCount: 512,
    stock: 156,
    description: 'Fones de ouvido com cancelamento de ruído ativo',
    specifications: {
      'Tipo': 'In-ear',
      'Bateria': '6 horas',
      'Cancelamento de Ruído': 'Ativo',
      'Conexão': 'Bluetooth 5.3'
    },
    tags: ['Wireless', 'Cancelamento de Ruído', 'Premium'],
    variations: []
  },
  {
    id: '4',
    name: 'iPad Air',
    price: 6499,
    originalPrice: 7499,
    category: 'tablets',
    brand: 'Apple',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80',
    rating: 4.6,
    reviewCount: 234,
    stock: 34,
    description: 'Tablet versátil com chip M1',
    specifications: {
      'Tela': '11 polegadas',
      'Processador': 'M1',
      'RAM': '8GB',
      'Armazenamento': '256GB'
    },
    tags: ['M1', 'Portátil', 'Produtividade'],
    variations: []
  }
];

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, search, sort } = req.query;

    // Get products from Supabase
    let query = supabase.from('products').select('*');

    // Apply filters
    if (category) {
      query = query.eq('category', category.toLowerCase());
    }
    if (brand) {
      query = query.eq('brand', brand.toLowerCase());
    }
    if (minPrice) {
      query = query.gte('price', parseInt(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice));
    }

    const { data: products, error } = await query;

    let filtered = products && !error ? products : mockProducts;

    // Search by name or description
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      );
    }

    // Sort
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'newest') {
      filtered.sort((a, b) => b.id - a.id);
    }

    res.json({
      total: filtered.length,
      products: filtered
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !product) {
      // Fallback to mock data
      const mockProduct = mockProducts.find(p => p.id === req.params.id);
      if (!mockProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.json(mockProduct);
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories
router.get('/categories/list', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('category');

    if (error || !products) {
      const categories = [...new Set(mockProducts.map(p => p.category))];
      return res.json({ categories });
    }

    const categories = [...new Set(products.map(p => p.category))];
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create product (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, price, category, brand, stock, description } = req.body;

    if (!name || !price || !category || !brand) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: newProduct, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          price,
          originalPrice: price,
          category,
          brand,
          stock: stock || 0,
          description: description || '',
          image: 'https://via.placeholder.com/500',
          rating: 0,
          reviewCount: 0,
          specifications: {},
          tags: [],
          variations: []
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'Product created successfully',
      product: newProduct[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
