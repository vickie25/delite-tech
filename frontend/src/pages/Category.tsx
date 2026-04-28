import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const ALL_PRODUCTS = [
  { id: 'p1', name: 'iPhone 17 Pro Max', price: 185000, originalPrice: 205000, img: '/src/assets/iphone 17 pro max.jpg', category: 'phones', brand: 'Apple', spec: '256GB / 12GB RAM', rating: 5, reviewsCount: 124, isNew: true },
  { id: 'p2', name: 'MacBook Air M5', price: 195000, originalPrice: 220000, img: '/src/assets/macbook air m5.jpg', category: 'laptops', brand: 'Apple', spec: 'M5 / 16GB / 512GB', rating: 5, reviewsCount: 86, isSale: true },
  { id: 'p3', name: 'ThinkPad X1 Carbon', price: 210000, img: '/src/assets/lenvovo think pad laptop.jpg', category: 'laptops', brand: 'Lenovo', spec: 'i7 / 32GB / 1TB', rating: 4, reviewsCount: 42 },
  { id: 'p4', name: 'iPhone 16 Pro Max', price: 155000, originalPrice: 175000, img: '/src/assets/iphone 16 pro max.jpg', category: 'phones', brand: 'Apple', spec: '128GB / 8GB RAM', rating: 5, reviewsCount: 512, isSale: true },
];

const Category = () => {
  const { id } = useParams<{ id: string }>();
  
  const filteredProducts = ALL_PRODUCTS.filter(p => p.category === id?.toLowerCase());

  return (
    <div className="bg-white pb-24">
      {/* Header Section */}
      <div className="bg-grey-light py-12 mb-8">
        <div className="container">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[12px] font-inter text-grey-text">
              <Link to="/" className="hover:text-black">Home</Link>
              <span>/</span>
              <span className="text-black font-medium capitalize">{id}</span>
            </div>
            <h1 className="text-[32px] font-poppins font-bold text-black tracking-tight capitalize">{id} Collection</h1>
            <p className="text-[14px] font-inter text-grey-text">Explore our top-tier selection of {id}.</p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-grey-mid gap-4">
          <p className="text-[14px] font-inter text-grey-text">
            Found <span className="text-black font-bold">{filteredProducts.length}</span> items in this category
          </p>
        </div>

        {/* Product Grid */}
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <h3 className="text-[18px] font-poppins font-bold text-black mb-2">Category Repository Empty</h3>
            <p className="text-grey-text font-inter text-[14px] mb-8">We're currently updating our stock for this category.</p>
            <Link to="/shop" className="btn-primary inline-flex px-12 h-11">
              Browse Full Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;

