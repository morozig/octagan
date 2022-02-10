import { defineComponent } from 'vue';
import Main from './containers/main';
import './App.css';


const App = defineComponent(() => {
  return () => (
    <Main/>
  );
});

export default App;
