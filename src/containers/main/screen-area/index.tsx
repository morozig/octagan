import {
  defineComponent,
  ref,
  toRefs,
  watch,
} from 'vue';
import { GameStatus } from '..';
import {
  FightStatus,
  ModelStatus,
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
import SoundButton from './components/SoundButton';

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
  const isSoundOn = ref(false);
  const onSoundToggle = () => isSoundOn.value = !isSoundOn.value;
  const backgroundSoundRef = ref<HTMLAudioElement>();
  const lostSoundRef = ref<HTMLAudioElement>();

  const {
    fightStatus,
    playerStatus,
    enemyStatus,
    projectileStatus,
    isMissing,
    playerHealth,
    enemyHealth,
    damageSent,
    damageRecieved,
    totalScore,
    modelStatus,
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
        playerHealth.value = 100;
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

  watch(gameStatus, (value, oldValue) => {
    if (!backgroundSoundRef.value ||
      !lostSoundRef.value
    ) {
      return;
    }
    switch (value) {
      case (GameStatus.Stopped): {
        backgroundSoundRef.value.pause();
        backgroundSoundRef.value.currentTime = 0;
        lostSoundRef.value.pause();
        break;
      }
      case (GameStatus.Paused): {
        backgroundSoundRef.value.pause();
        lostSoundRef.value.pause();
        break;
      }
      case (GameStatus.Running): {
        if (
          oldValue !== GameStatus.Running
        ) {
          backgroundSoundRef.value.currentTime = 0;
          backgroundSoundRef.value.play();
        }
        break;
      }
      case (GameStatus.Lost): {
        backgroundSoundRef.value.pause();
        backgroundSoundRef.value.currentTime = 0;
        lostSoundRef.value.currentTime = 0;
        lostSoundRef.value.play();
        break;
      }
    }
  });

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
          class={'ScreenArea-unit '.concat(
            'ScreenArea-inner-firstUnit'
          )
        }
        >
          <div
            class={'ScreenArea-unit-fighter '.concat(
              (
                playerStatus.value === UnitStatus.Recieving &&
                damageRecieved.value > 0
              ) ? 'ScreenArea-unit--negative ' : ' '
            )}
          >
            <Player
              isDead={!playerHealth.value}
            />
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
            isMissing={isMissing.value}
            playerStatus={playerStatus.value}
            enemyStatus={enemyStatus.value}
            level={level.value}
            isSoundOn={isSoundOn.value}
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
          class={'ScreenArea-unit '.concat(
            'ScreenArea-inner-lastUnit'
          )}
        >
          <Princess/>
          <HealthBar
            health={100}
            maxHealth={100}
            class={'ScreenArea-unit-humanhealth'}
          />
        </div>

        <SoundButton
          isOn={isSoundOn.value}
          onToggle={onSoundToggle}
          class={'ScreenArea-soundButton'}
        />
        {isSoundOn.value &&
          <audio
            src={'/sound/background.mp3'}
            autoplay={
              gameStatus.value === GameStatus.Running ||
              gameStatus.value === GameStatus.Won
            }
            loop={
              gameStatus.value === GameStatus.Running ||
              gameStatus.value === GameStatus.Won
            }
            ref={backgroundSoundRef}
          />
        }
        {isSoundOn.value &&
          <audio
            src={'/sound/lost.mp3'}
            ref={lostSoundRef}
          />
        }

        {modelStatus.value === ModelStatus.Loading &&
          <div
            class={'ScreenArea-loadingModel'}
          >
            {'Loading model...'}
          </div>
        }
        {modelStatus.value === ModelStatus.Leaving &&
          <div
            class={'ScreenArea-loadingModel '.concat(
              'ScreenArea-loadingModel--leaving'
            )}
          >
            {'Loading model...'}
          </div>
        }
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
        {gameStatus.value === GameStatus.Stopped &&
          <div
            class={'ScreenArea-preload'}
          >
            <span
              class={'ScreenArea-preload-lost'}
            >
              {'Load'}
            </span>
            <span
              class={'ScreenArea-preload-won'}
            >
              {'ing'}
            </span>
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
