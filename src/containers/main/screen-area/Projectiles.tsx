import {
  defineComponent,
  computed,
  toRefs,
} from 'vue';
import { ProjectileStatus } from './composables';
import './Projectiles.css';

interface ProjectilesProps {
  projectileStatus: ProjectileStatus;
  level: number;
}

const Projectiles = defineComponent<ProjectilesProps>((props) => {
  const {
    projectileStatus,
    level,
  } = toRefs(props);

  const laserClassName = computed(() => {
    if (
      level.value === 8 &&
      projectileStatus.value === ProjectileStatus.FlyingFromEnemy
    ) return 'Projectiles-area-laser '.concat(
      'Projectiles-area-laser--flying8 '
    );

    return 'Projectiles-area-laser '.concat(
      `Projectiles-area-laser--${level.value} `,
      projectileStatus.value === ProjectileStatus.FlyingFromEnemy ?
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
  'level',
];

export default Projectiles;
