import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, createHashRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './app/AuthContext';
import { Layout } from './components/Layout';
import { LoadingPage } from './components/LoadingPage';
import './i18n';
import './styles/main.scss';

const HomePage = lazy(() => import('./pages/HomePage').then((module) => ({ default: module.HomePage })));
const MenuPage = lazy(() => import('./pages/MenuPage').then((module) => ({ default: module.MenuPage })));
const BookingPage = lazy(() => import('./pages/BookingPage').then((module) => ({ default: module.BookingPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((module) => ({ default: module.ProfilePage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then((module) => ({ default: module.AuthPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

declare const __GITHUB_PAGES__: boolean;
const createRouter = __GITHUB_PAGES__ ? createHashRouter : createBrowserRouter;
const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1 } } });
const router = createRouter([{
  element: <Layout />,
  children: [
    { path: '/', element: <Suspense fallback={<LoadingPage />}><HomePage /></Suspense> },
    { path: '/menu', element: <Suspense fallback={<LoadingPage />}><MenuPage /></Suspense> },
    { path: '/booking', element: <Suspense fallback={<LoadingPage />}><BookingPage /></Suspense> },
    { path: '/profile', element: <Suspense fallback={<LoadingPage />}><ProfilePage /></Suspense> },
    { path: '/auth', element: <Suspense fallback={<LoadingPage />}><AuthPage /></Suspense> },
    { path: '*', element: <Suspense fallback={<LoadingPage />}><NotFoundPage /></Suspense> },
  ],
}]);

createRoot(document.getElementById('root')!).render(
  <StrictMode><QueryClientProvider client={queryClient}><AuthProvider><RouterProvider router={router}/></AuthProvider></QueryClientProvider></StrictMode>
);
