import {
  defineComponent,
  ref,
  toRefs,
  watch,
  computed,
} from 'vue';
import { GameStatus } from '..';
import { FightStatus, ProjectileStatus, UnitStatus, useFight } from './composables';
import './ScreenArea.css';

interface ScreenAreaProps {
  gameStatus: GameStatus;
  onLevelChange: (level: number) => void;
  onFail: () => void;
  onFinish: () => void;
  build: string;
}

const ScreenArea = defineComponent<ScreenAreaProps>((props) => {
  const {
    gameStatus,
    build,
  } = toRefs(props);

  const level = ref(1);

  const {
    fightStatus,
    playerStatus,
    enemyStatus,
    projectileStatus,
    playerHealth,
    enemyHealth,
    damageSent,
    damageRecieved,
    start,
    stop,
  } = useFight({
    build,
    level,
  });

  watch(gameStatus, (value, oldValue, onCleanup) => {
    if (value === GameStatus.Stopped) {
      level.value = 1;
      stop();
    } else if (value === GameStatus.Running) {
      if (
        oldValue === GameStatus.Finished
      ) {
        level.value = 1;
      }
      start();
    } else if (value === GameStatus.Paused) {
      stop();
    }
  });

  watch(fightStatus, (value, oldValue, onCleanup) => {
    if (value === FightStatus.Finished) {
      if (playerHealth.value > 0) {
        if (level.value === 8) {
          props.onFinish();
        } else {
          level.value += 1;
          start();
        }
      } else {
        props.onFail();
      }
    }
  });

  watch(level, props.onLevelChange);

  // watch([
  //   fightStatus,
  //   playerStatus,
  //   enemyStatus,
  //   projectileStatus,
  //   playerHealth,
  //   enemyHealth,
  //   damageSent,
  //   damageRecieved,
  // ], console.log)

  return () => (
    <div
      class={'ScreenArea'}
    >
      <div
        class={'ScreenArea-unit '.concat(
          'ScreenArea-unit--player '
        )}
      >
        <div
          class={'ScreenArea-unit-health'}
        >
          {fightStatus.value === FightStatus.Running ?
            playerHealth.value : 100
          }
        </div>
        {projectileStatus.value === ProjectileStatus.FlyingFromPlayer &&
          <div
            class={'ScreenArea-unit-damage'}
          >
            {damageSent.value}
          </div>
        }
        {playerStatus.value === UnitStatus.Recieving &&
          <div
            class={'ScreenArea-unit-damage'}
          >
            {-damageRecieved.value}
          </div>
        }
      </div>
      
      {gameStatus.value !== GameStatus.Finished &&
        <>
          <div
            class={'ScreenArea-space '}
          />
          <div
            class={'ScreenArea-space '}
          />
          <div
            class={'ScreenArea-space '}
          />
        </>
      }

      {gameStatus.value !== GameStatus.Finished &&
        <div
          class={'ScreenArea-unit '.concat(
            `ScreenArea-unit--enemy${level.value} `
          )}
        >
          <div
            class={'ScreenArea-unit-health'}
          >
            {fightStatus.value === FightStatus.Running ?
              enemyHealth.value : 100 * level.value
            }
          </div>
          {projectileStatus.value === ProjectileStatus.FlyingFromEnemy &&
            <div
              class={'ScreenArea-unit-damage'}
            >
              {damageSent.value}
            </div>
          }
          {enemyStatus.value === UnitStatus.Recieving &&
            <div
              class={'ScreenArea-unit-damage'}
            >
              {-damageRecieved.value}
            </div>
          }
        </div>
      }

      {new Array(8 - level.value).fill(undefined).map((_, i) => (
        <div
          key={i + 1 + level.value}
          class={'ScreenArea-unit '.concat(
            `ScreenArea-unit--enemy${i + 1 + level.value} `
          )}
        >
          <div
            class={'ScreenArea-unit-health'}
          >
            {(i + 1 + level.value) * 100}
          </div>
        </div>
      ))}
      {gameStatus.value !== GameStatus.Finished &&
        <div
          class={'ScreenArea-space '}
        />
      }
      <div
        class={'ScreenArea-unit '.concat(
          'ScreenArea-unit--princess '
        )}
      >
        <div
          class={'ScreenArea-unit-health'}
        >
          {100}
        </div>
      </div>
    </div>
  );
});

ScreenArea.props = [
  'gameStatus',
  'onLevelChange',
  'onFinish',
  'onFail',
  'build',
];

export default ScreenArea;
