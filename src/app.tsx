import { defineComponent } from 'vue';
import './App.css';
import Main from './containers/main';


const App = defineComponent(() => {
  return () => {
    return (
      <>
        <Main/>
      </>
    );
  };
});

export default App;
