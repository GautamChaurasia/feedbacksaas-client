// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import ScrollTop from 'components/ScrollTop';

// =======================s=======|| APP - THEME, ROUTER, LOCAL  ||============================== //

React.useEffect(()=>{
    localStorage.setItem("userId", "1234567890")
    localStorage.setItem("userEmail", "testuser@email.com")
})

const App = () => (
    <ThemeCustomization>
        <ScrollTop>
            <Routes />
        </ScrollTop>
    </ThemeCustomization>
);

export default App;
