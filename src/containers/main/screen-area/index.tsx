import {
  defineComponent,
  ref,
  toRefs,
  watch,
} from 'vue';
import { GameStatus } from '..';
import {
  FightStatus,
  ProjectileStatus,
  UnitStatus,
  useFight
} from './composables';
import Enemy from './Enemy';
import Player from './Player';
import Princess from './Princess';
import Projectiles from './Projectiles';
import './ScreenArea.css';

interface ScreenAreaProps {
  gameStatus: GameStatus;
  onLevelChange: (level: number) => void;
  onLost: () => void;
  onWon: () => void;
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
    totalScore,
    start,
    stop,
  } = useFight({
    build,
    level,
  });

  watch(gameStatus, (value, oldValue) => {
    switch (value) {
      case (GameStatus.Stopped): {
        level.value = 1;
        playerHealth.value = 100;
        stop();
        break;
      }
      case (GameStatus.Paused): {
        playerHealth.value = 100;
        stop();
        break;
      }
      case (GameStatus.Running): {
        if (
          oldValue === GameStatus.Won
        ) {
          level.value = 1;
        }
        start();
        break;
      }
    }
  });

  watch(fightStatus, (value) => {
    if (value === FightStatus.Finished) {
      if (playerHealth.value > 0) {
        if (level.value === 8) {
          props.onWon();
        } else {
          level.value += 1;
          start();
        }
      } else {
        props.onLost();
      }
    }
  });

  watch(level, props.onLevelChange);

  // watch([
  //   fightStatus,
  //   playerHealth,
  // ], console.log)

  return () => (
    <div
      class={'ScreenArea'}
    >
      <div
        class={'ScreenArea-unit'}
      >
        <Player
          class={'ScreenArea-unit-fighter'}
        />
        <div
          class={'ScreenArea-unit-health'}
        >
          {playerHealth.value}
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
      
      {gameStatus.value !== GameStatus.Won &&
        <Projectiles
          projectileStatus={projectileStatus.value}
          level={level.value}
        />
      }

      {gameStatus.value !== GameStatus.Won &&
        <div
          class={'ScreenArea-unit '}
        >
          <Enemy
            color={level.value}
            class={'ScreenArea-unit-fighter'}
          />
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
          class={'ScreenArea-unit '}
        >
          <Enemy
            color={i + 1 + level.value}
          />
          <div
            class={'ScreenArea-unit-health'}
          >
            {(i + 1 + level.value) * 100}
          </div>
        </div>
      ))}

      {gameStatus.value !== GameStatus.Won &&
        <div
          class={'ScreenArea-space '}
        />
      }
      <div
        class={'ScreenArea-unit '}
      >
        <Princess/>
        <div
          class={'ScreenArea-unit-health'}
        >
          {100}
        </div>
      </div>

      {(gameStatus.value === GameStatus.Lost ||
        gameStatus.value === GameStatus.Won) &&
        <div
          class={'ScreenArea-dialog'}
        >
          <div
            class={'ScreenArea-dialog-result'}
          >
            {gameStatus.value === GameStatus.Won ?
              'YOU WON!' :
              'YOU LOST'
            }
          </div>
          {totalScore.value ?
            <div
              class={'ScreenArea-dialog-score'}
            >
              {`Score: ${(totalScore.value * 100).toFixed(1)}%`}
            </div> :
            null
          }
        </div>
      }
    </div>
  );
});

ScreenArea.props = [
  'gameStatus',
  'onLevelChange',
  'onLost',
  'onWon',
  'build',
];

export default ScreenArea;
