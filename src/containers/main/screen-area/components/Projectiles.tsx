import {
  defineComponent,
  computed,
  toRefs,
  ref,
  watch,
} from 'vue';
import { ProjectileStatus, UnitStatus } from '../composables';
import './Projectiles.css';
import { getBaseUrl } from '~~/src/lib/helpers';

interface ProjectilesProps {
  projectileStatus: ProjectileStatus;
  isMissing: boolean;
  playerStatus: UnitStatus;
  enemyStatus: UnitStatus;
  level: number;
  isSoundOn: boolean;
}

const Projectiles = defineComponent<ProjectilesProps>((props) => {
  const {
    projectileStatus,
    isMissing,
    playerStatus,
    enemyStatus,
    level,
    isSoundOn,
  } = toRefs(props);

  const isLaserFlying = ref(false);

  const playerSoundRef = ref<HTMLAudioElement>();
  const enemyHitSoundRef = ref<HTMLAudioElement>();
  const enemyMissSoundRef = ref<HTMLAudioElement>();
  const origin = getBaseUrl();

  watch(
    [ projectileStatus, playerStatus, enemyStatus ],
    ([ projectileValue, playerValue, enemyValue ]) => {
      isLaserFlying.value =
        projectileValue === ProjectileStatus.FlyingFromEnemy ||
        playerValue === UnitStatus.Recieving;
      if (playerValue === UnitStatus.Sending) {
        if (playerSoundRef.value) {
          playerSoundRef.value.currentTime = 0;
          playerSoundRef.value.play();
        }
      }
      if (enemyValue === UnitStatus.Sending) {
        if (isMissing.value) {
          if (enemyMissSoundRef.value) {
            enemyMissSoundRef.value.currentTime = 0;
            enemyMissSoundRef.value.play();
          }
        } else {
          if (enemyHitSoundRef.value) {
            enemyHitSoundRef.value.currentTime = 0;
            enemyHitSoundRef.value.play();
          }
        }
      }

      if (
        projectileValue === ProjectileStatus.Absent &&
        playerValue === UnitStatus.Idle &&
        enemyValue === UnitStatus.Idle
      ) {
        if (playerSoundRef.value) {
          playerSoundRef.value.pause();
        }
        if (enemyMissSoundRef.value) {
          enemyMissSoundRef.value.pause();
        }
        if (enemyHitSoundRef.value) {
          enemyHitSoundRef.value.pause();
        }
      }
    }
  );

  const laserClassName = computed(() => {
    if (
      level.value === 8 &&
      isLaserFlying.value
    ) return 'Projectiles-area-laser '.concat(
      'Projectiles-area-laser--flying8 '
    );

    return 'Projectiles-area-laser '.concat(
      `Projectiles-area-laser--${level.value} `,
      isLaserFlying.value ?
        'Projectiles-area-laser--flying ' : ' ',
    );
  });
  
  return () => (
    <div
      class={'Projectiles'}
    >
      <div
        class={'Projectiles-area'}
      >
        <div
          class={'Projectiles-area-plasma '.concat(
            projectileStatus.value === ProjectileStatus.FlyingFromPlayer ?
              'Projectiles-area-plasma--flying ' : ' '
          )}
        />
        {isSoundOn.value &&
          <audio
            src={`${origin}/sound/player.mp3`}
            ref={playerSoundRef}
          />
        }
        <div
          class={laserClassName.value}
        />
        {isSoundOn.value &&
          <audio
            src={`${origin}/sound/enemyHit.mp3`}
            ref={enemyHitSoundRef}
          />
        }
        {isSoundOn.value &&
          <audio
            src={`${origin}/sound/enemyMiss.mp3`}
            ref={enemyMissSoundRef}
          />
        }
      </div>
    </div>
  );
});

Projectiles.props = [
  'projectileStatus',
  'isMissing',
  'playerStatus',
  'enemyStatus',
  'level',
  'isSoundOn',
];

export default Projectiles;
