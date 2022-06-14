import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import LandingPage from './components/LandingPage.jsx'
import Home from './components/Home.jsx';
// import GameCreation from './Components/GameCreation'
// import GameDetail from './Components/GameDetails';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Switch>
        <Route exact path='/' component={ LandingPage }/>
        <Route exact path='/home' component={Home}/>
        {/* <Route path='/newvideogame' component={GameCreation}/>
        <Route exact path='/home/:id' component={GameDetail}/> */}
        {/* <Route exact path="/home/:id" render={({match})=> <GameDetail match={match}/>}/> */}

        </Switch>
    </div>
    </BrowserRouter>
  );
}

export default App;
