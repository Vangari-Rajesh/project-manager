import { Routes , Route , BrowserRouter } from 'react-router-dom'
import Home from './Components/Home';
import Admin from './Components/Admin';
import User from './Components/User';
import LoginForm from './Components/LoginForm';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={ <LoginForm/> } />
          <Route path='/Home' element={ <Home/> } />
          <Route path='/Admin' element={ <Admin/> } />
          <Route path='/User' element={ <User/> } />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
