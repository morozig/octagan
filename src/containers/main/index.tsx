import {
  defineComponent,
  ref,
  onMounted,
  watch,
} from 'vue';
import './Main.css';
import BuildArea, { validateBuild } from './build-area';
import ControlsArea from './controls-area';
import ScreenArea from './screen-area';

const emptyBuild = '0'.repeat(64);

export enum GameStatus {
  Stopped,
  Paused,
  Running,
  Lost,
  Won,
}

const Main = defineComponent(() => {
  const gameStatus = ref(GameStatus.Stopped);
  const level = ref(1);
  const build = ref(emptyBuild);

  onMounted(() => {
    const params = (new URL(document.location.href)).searchParams;
    const buildStr = params.get('build');
    if (buildStr && validateBuild(buildStr)) {
      build.value = buildStr;
    } else {
      window.history.replaceState(
        undefined,
        undefined,
        window.location.origin
      );
    }
  });

  watch(build, (value) => {
    const origin = window.location.origin;
    const href = value !== emptyBuild ?
      `${origin}/?${new URLSearchParams({build: value}).toString()}` :
      origin;
    window.history.replaceState(
      undefined,
      undefined,
      href
    );
  });

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
  const onLost = () => {
    gameStatus.value = GameStatus.Lost;
  };
  const onWon = () => {
    gameStatus.value = GameStatus.Won;
  };
  const onBuildChange = (newBuild: string) => {
    build.value = newBuild;
  };

  return () => (
    <main>
      <ScreenArea
        gameStatus={gameStatus.value}
        onLevelChange={onLevelChange}
        onLost={onLost}
        onWon={onWon}
        build={build.value}
      />
      <div
        class={'Main-controls'}
      >
        <ControlsArea
          gameStatus={gameStatus.value}
          onSwitch={onSwitch}
          onStop={onStop}
        />
        <BuildArea
          build={build.value}
          onBuildChange={onBuildChange}
          isDisabled={gameStatus.value !== GameStatus.Stopped}
        />
      </div>
    </main>
  );
});

export default Main;
