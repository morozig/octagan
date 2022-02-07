import {
  defineComponent,
  computed,
  toRefs,
  ref,
  watch,
} from 'vue';
import { ProjectileStatus, UnitStatus } from '../composables';
import './Projectiles.css';

interface ProjectilesProps {
  projectileStatus: ProjectileStatus;
  playerStatus: UnitStatus;
  level: number;
}

const Projectiles = defineComponent<ProjectilesProps>((props) => {
  const {
    projectileStatus,
    playerStatus,
    level,
  } = toRefs(props);

  const isLaserFlying = ref(false);

  watch(
    [projectileStatus, playerStatus],
    ([ projectileValue, playerValue ]) => {
      isLaserFlying.value =
        projectileValue === ProjectileStatus.FlyingFromEnemy ||
        playerValue === UnitStatus.Recieving;
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
        <div
          class={laserClassName.value}
        />
      </div>
    </div>
  );
});

Projectiles.props = [
  'projectileStatus',
  'playerStatus',
  'level',
];

export default Projectiles;
