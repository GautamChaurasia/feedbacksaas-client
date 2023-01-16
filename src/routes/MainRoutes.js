import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

const Testimonials = Loadable(lazy(() => import('pages/extra-pages/Testimonials')));
const TestimonialView = Loadable(lazy(() => import('pages/extra-pages/TestimonialView')));
const Response = Loadable(lazy(() => import('pages/extra-pages/Response')));
const Search = Loadable(lazy(() => import('pages/extra-pages/Search')));


// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            children: [
                {
                    path: 'default',
                    element: <DashboardDefault />
                }
            ]
        },
        {
            path: '/dashboard/testimonials',
            element: <Testimonials />
        },
        {
            path: '/dashboard/testimonialview/:formId',
            element: <TestimonialView />
        },
        {
            path: '/dashboard/responses',
            element: <Response />
        },
        {
            path: '/dashboard/search',
            element: <Search />
        },
    ]
};

export default MainRoutes;
