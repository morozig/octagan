import {
  defineComponent,
  computed,
} from 'vue';
import './Enemy.css';

interface EnemyProps {
  color: number;
}

const Enemy = defineComponent<EnemyProps>((props) => {
  const className = computed(() => 'Enemy '.concat(
    `Enemy--${props.color} `,
  ));

  return () => (
    <svg
      version='1.1' xmlns='http://www.w3.org/2000/svg'
      width='100'
      height='100'
      viewBox='0 0 100 100'
      class={className.value}
    >
      <g>
        <path
          class={'Enemy--primary'}
          d="M -46.511604,-20.511259 A 13.713593,13.713593 0 0 1 -60.087335,-6.7983595 13.713593,13.713593 0 0 1 -73.936018,-20.23555 l 13.710821,-0.275709 z"
          transform="rotate(-180)"
        />
        <rect
          class={'Enemy--secondary'}
          width='28.381975'
          height='5.4855919'
          x='46.031269'
          y='20.034336'
        />
        <rect
          class={'Enemy--primary'}
          width='27.904966'
          height='7.1551199'
          x='22.419376'
          y='31.005518'
        />
        <path
          class={'Enemy--secondary'}
          d='m -26.951713,16.934542 a 7.5128756,8.8246479 0 0 1 -7.437349,8.824202 7.5128756,8.8246479 0 0 1 -7.586883,-8.646784 l 7.511357,-0.177418 z'
          transform='rotate(-90)'
        />
        <path
          class={'Enemy--primary'}
          d='m 21.465359,87.530965 24.088903,-62.72655 29.812999,0 8.347644,62.726551 z'
        />
        <rect
          class={'Enemy--secondary'}
          width='68.212143'
          height='13.11772'
          x='16.69528'
          y='86.57695'
        />
      </g>
    </svg>
  );
});

Enemy.props = [
  'color',
];

export default Enemy;
