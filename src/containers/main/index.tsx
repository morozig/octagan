import {
  defineComponent,
  ref,
} from 'vue';
import ControlsArea from './controls-area';
import ScreenArea from './screen-area';

export enum GameStatus {
  Stopped,
  Running,
  Paused,
  Finished,
}

const Main = defineComponent(() => {
  const gameStatus = ref(GameStatus.Stopped);
  const level = ref(1);

  const onSwitch = () => {
    if (gameStatus.value === GameStatus.Running) {
      gameStatus.value = level.value > 1 ?
        GameStatus.Paused : GameStatus.Stopped;
    } else {
      gameStatus.value = GameStatus.Running;
    }
  };

  const onStop = () => {
    gameStatus.value = GameStatus.Stopped;
    level.value = 1;
  };

  const onLevelChange = (newLevel: number) => {
    level.value = newLevel;
  };
  const onFinish = () => {
    gameStatus.value = GameStatus.Finished;
  };

  return () => (
    <>
      <ScreenArea
        gameStatus={gameStatus.value}
        onLevelChange={onLevelChange}
        onFinish={onFinish}
      />
      <ControlsArea
        gameStatus={gameStatus.value}
        onSwitch={onSwitch}
        onStop={onStop}
      />
    </>
  );
});

export default Main;
