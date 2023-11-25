import './App.css';
import { io } from 'socket.io-client';
function App() {
  console.log(process.env.REACT_APP_API_LOCALHOST_ENDPOINT)
  console.log(process.env.REACT_APP_API_LOCALHOST_ENDPOINT)
  console.log(process.env)

  const socket = io('http://localhost:5000')


  return (
    <div className="App">
    </div>
  );
}

export default App;
