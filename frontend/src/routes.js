import { HomePage } from './pages/home-page.jsx'
import { AboutUs } from './pages/about-us.jsx'
import { CarIndex } from './pages/car-index.jsx'

// Routes accesible from the main navigation (in AppHeader)
const routes = [
    {
        path: '/',
        component: <HomePage />,
        label: 'Home 🏠',
    },
    {
        path: 'car',
        component: <CarIndex />,
        label: 'Cars'
    },
    {
        path: 'about',
        component: <AboutUs />,
        label: 'About us'
    },
]

export default routes