import {
  defineComponent,
  ref,
  toRefs,
  watch,
} from 'vue';
import { GameStatus } from '..';
import './ScreenArea.css';

const maxLevels = 8;

interface ScreenAreaProps {
  gameStatus: GameStatus;
  onLevelChange: (level: number) => void;
  onFinish: () => void;
}

const ScreenArea = defineComponent<ScreenAreaProps>((props) => {
  const {
    gameStatus,
  } = toRefs(props);

  const level = ref(1);
  let interval = undefined as NodeJS.Timer | undefined;

  watch(gameStatus, (value, oldValue, onCleanup) => {
    onCleanup(() => {
      clearInterval(interval);
      interval = undefined;
    });
    if (value === GameStatus.Stopped) {
      level.value = 1;
    }
    if (
      value === GameStatus.Running && 
      !interval
    ) {
      if (
        oldValue === GameStatus.Finished
      ) {
        level.value = 1;
      }
      interval = setInterval(() => {
        if (level.value < maxLevels) {
          level.value += 1;
        } else {
          props.onFinish();
        }
      }, 5000);
    }
  });

  watch(level, props.onLevelChange);

  return () => (
    <div
      class={'ScreenArea'}
    >
      <p>
        {GameStatus[props.gameStatus]}
      </p>
      <p>
        {`level: ${level.value}`}
      </p>
    </div>
  );
});

ScreenArea.props = [
  'gameStatus',
  'onLevelChange',
  'onFinish',
];

export default ScreenArea;
