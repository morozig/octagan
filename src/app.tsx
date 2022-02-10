import { defineComponent } from 'vue';
import Main from './containers/main';


const App = defineComponent(() => {
  return () => (
    <Main/>
  );
});

export default App;
