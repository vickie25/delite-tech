import { Link } from 'react-router-dom';
import { Smartphone, Laptop, Tablet, Headphones, Watch, Camera, Gamepad, MoreHorizontal } from 'lucide-react';

const categories = [
  { name: 'Phones', icon: Smartphone, path: '/category/phones' },
  { name: 'Laptops', icon: Laptop, path: '/category/laptops' },
  { name: 'Tablets', icon: Tablet, path: '/category/tablets' },
  { name: 'Audio', icon: Headphones, path: '/category/audio' },
  { name: 'Watches', icon: Watch, path: '/category/watches' },
  { name: 'Cameras', icon: Camera, path: '/category/cameras' },
  { name: 'Gaming', icon: Gamepad, path: '/category/gaming' },
  { name: 'View All', icon: MoreHorizontal, path: '/shop' },
];

const Categories = () => {
  return (
    <section className="bg-white py-6">
      <div className="container">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-lg hover:bg-grey-light transition-all min-w-[90px]"
            >
              <div className="w-12 h-12 bg-grey-light rounded-full flex items-center justify-center transition-colors">
                <cat.icon className="w-6 h-6 text-black" />
              </div>
              <span className="font-inter text-[11px] font-medium text-black text-center whitespace-nowrap">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
