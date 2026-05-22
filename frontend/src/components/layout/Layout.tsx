import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-amazon-light-gray">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 bg-amazon-dark-gray text-white p-3 rounded-full shadow-lg hover:bg-amazon-gray transition-all z-50">
        ↑
      </button>
    </div>
  );
};

export default Layout;