// react-dom (what we'll use here)
import { BrowserRouter } from 'react-router-dom'

//require(['react-router-dom'], function (require) {
//    var BrowserRouter = require('react-router-dom').BrowserRouter;
//});

const App = () => (
  <div>
    <nav>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  </div>
);

ReactDOM.render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('reactRouter'));