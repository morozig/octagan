import { defineComponent } from 'vue';
import './App.css';
import Main from './containers/main';


const App = defineComponent(() => {
  useMeta({
    meta: [
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
    ],
  });

  return () => (
    <Main/>
  );
});

export default App;
