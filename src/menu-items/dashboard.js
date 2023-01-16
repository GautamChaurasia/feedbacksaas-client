// assets
import { FormOutlined, ChromeOutlined, DashboardOutlined } from '@ant-design/icons';

// icons
const icons = {
    DashboardOutlined,
    ChromeOutlined,
    FormOutlined
};



// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
    id: 'group-dashboard',
    title: 'Navigation',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard/default',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        },
        {
            id: 'testimonials',
            title: 'Testimonials',
            type: 'item',
            url: '/dashboard/testimonials',
            icon: icons.FormOutlined,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
