import { clsx } from 'clsx';
import { useState } from 'react';
import { useSnapshot } from 'reactish-state';
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons';
import { Sidebar } from './components/Sidebar';
import { UsersPage } from './pages/UsersPage';
import { BooksPage } from './pages/BooksPage';
import { LoansPage } from './pages/LoansPage';
import { toast$ } from './store';
import styles from './App.module.css';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('users');
  const toast = useSnapshot(toast$);

  const renderPage = () => {
    switch (currentPage) {
      case 'books':
        return <BooksPage />;
      case 'loans':
        return <LoansPage />;
      case 'users':
        return <UsersPage />;
      default:
        return <UsersPage />;
    }
  };

  return (
    <div className={styles.appContainer}>
      <header className={styles.productHeader}>
        <i className="fa-solid fa-book-open"></i>
        <div className={styles.productName}>
          Page<span>Swap</span>
        </div>
      </header>

      <div className={styles.mainLayout}>
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main className={styles.content}>
          <div className={styles.pageContainer}>{renderPage()}</div>
          <footer className={styles.footer}>
            <p>© 2025 PageSwap. All rights reserved.</p>
          </footer>
        </main>
      </div>

      {toast.show && (
        <div className={clsx(styles.toast, toast.type && styles[toast.type])}>
          {toast.type === 'success' ? <CheckCircledIcon /> : <CrossCircledIcon />}
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default App;
