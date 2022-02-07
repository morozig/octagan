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
import Enemy from './components/Enemy';
import Player from './components/Player';
import Princess from './components/Princess';
import Projectiles from './components/Projectiles';
import './ScreenArea.css';
import HealthBar from './components/HealthBar';

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
        class={'ScreenArea-inner'}
      >
        <div
          class={'ScreenArea-unit'}
        >
          <div
            class={'ScreenArea-unit-fighter '.concat(
              (
                playerStatus.value === UnitStatus.Recieving &&
                damageRecieved.value > 0
              ) ? 'ScreenArea-unit--negative ' : ' '
            )}
          >
            <Player/>
          </div>
          <HealthBar
            health={playerHealth.value}
            maxHealth={100}
            class={'ScreenArea-unit-humanhealth'}
          />
          {projectileStatus.value === ProjectileStatus.FlyingFromPlayer &&
            <div
              class={'ScreenArea-unit-damage'}
            >
              {damageSent.value}
            </div>
          }
          {playerStatus.value === UnitStatus.Recieving &&
            <div
              class={'ScreenArea-unit-damagerecieved'}
            >
              {damageRecieved.value > 0 ?
                `-${damageRecieved.value}` :
                '0'
              }
            </div>
          }
        </div>
        
        {gameStatus.value !== GameStatus.Won &&
          <Projectiles
            projectileStatus={projectileStatus.value}
            playerStatus={playerStatus.value}
            level={level.value}
          />
        }

        {gameStatus.value !== GameStatus.Won &&
          <div
            class={'ScreenArea-unit '}
          >
            <div
              class={'ScreenArea-unit-fighter '.concat(
                enemyStatus.value === UnitStatus.Recieving ?
                  'ScreenArea-unit--shaking ' : ' '
              )}
            >
              <Enemy
                color={level.value}
              />
            </div>
            <HealthBar
              health={fightStatus.value === FightStatus.Running ?
                enemyHealth.value : 100 * level.value}
              maxHealth={100 * level.value}
            />
            {projectileStatus.value === ProjectileStatus.FlyingFromEnemy &&
              <div
                class={'ScreenArea-unit-damage'}
              >
                {damageSent.value}
              </div>
            }
            {enemyStatus.value === UnitStatus.Recieving &&
              <div
                class={'ScreenArea-unit-damagerecieved'}
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
            <HealthBar
              health={(i + 1 + level.value) * 100}
              maxHealth={(i + 1 + level.value) * 100}
            />
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
          <HealthBar
            health={100}
            maxHealth={100}
            class={'ScreenArea-unit-humanhealth'}
          />
        </div>

        {gameStatus.value === GameStatus.Lost &&
          <div
            class={'ScreenArea-dialog--lost'}
          >
            <div
              class={'ScreenArea-dialog-result'}
            >
              {'DISCRIMINATED'}
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
        {gameStatus.value === GameStatus.Won &&
          <div
            class={'ScreenArea-dialog--won'}
          >
            <div
              class={'ScreenArea-dialog-result'}
            >
              {'Victory!'}
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
