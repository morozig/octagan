import {
  defineComponent,
} from 'vue';
import { GameStatus } from '..';
import './ControlsArea.css';

interface ControlsAreaProps {
  gameStatus: GameStatus;
  onSwitch: () => void;
  onStop: () => void;
}

const ControlsArea = defineComponent<ControlsAreaProps>((props) => {
  return () => (
    <div
      class={'ControlsArea'}
    >
      <button
        onClick={props.onSwitch}
      >
        {props.gameStatus === GameStatus.Running ?
          'Pause' : 'Play'
        }
      </button>

      <button
        onClick={props.onStop}
      >
        {'Stop'}
      </button>
    </div>
  );
});

ControlsArea.props = [
  'gameStatus',
  'onSwitch',
  'onStop',
];

export default ControlsArea;
