// assets
import { MessageOutlined, SearchOutlined } from '@ant-design/icons';

// icons
const icons = {
    MessageOutlined,
    SearchOutlined
};
// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
    id: 'manage',
    title: 'Manage',
    type: 'group',
    children: [
        {
            id: 'responses',
            title: 'Responses',
            type: 'item',
            url: '/dashboard/responses',
            icon: icons.MessageOutlined,
            target: false,
            breadcrumbs: false
        },
        {
            id: 'search',
            title: 'Search',
            type: 'item',
            url: '/dashboard/search',
            icon: icons.SearchOutlined,
            target: false,
            breadcrumbs: false
        },
    ]
};

export default pages;
