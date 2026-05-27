import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../widgets/header';
import { Footer } from '../widgets/footer';
import { Modals } from '@/features/modals/ui/Modals';
import { AuthModal } from '@/features/user';

export const App = () => (
  <div className="app">
  <Header />
  <main>
    <Outlet />
  </main>
  <Footer />
  <Modals />
  <AuthModal />
</div>)