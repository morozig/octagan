import {
  defineComponent,
  computed,
} from 'vue';
import './Player.css';

interface PlayerProps {
  class?: string;
  isDead?: boolean;
}

const Player = defineComponent<PlayerProps>((props) => {
  const className = computed(() => 'Player '.concat(
    props.isDead ? 'Player--dead ' : ' ',
    props.class ? `${props.class } ` : ' ',
  ));

  return () => (
    <svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      width='100'
      height='100'
      viewBox='0 0 100 100'
      class={className.value}
    >
      <defs
        id='defs2'>
        <linearGradient
          id='linearGradient2903'>
          <stop
            class={'Player-center'}
            offset='0'
            id='stop3842'
          />
          <stop
            class={'Player-outer'}
            offset='1'
            id='stop3844'
          />
        </linearGradient>
        <radialGradient
          xlinkHref='#linearGradient2903'
          id='radialGradient5997'
          cx='17.960989'
          cy='17.264349'
          fx='17.960989'
          fy='17.264349'
          r='15.5'
          gradientUnits='userSpaceOnUse'
        />
        <radialGradient
          xlinkHref='#linearGradient2903'
          id='radialGradient6005'
          cx='17.960989'
          cy='49.138783'
          fx='17.960989'
          fy='49.138783'
          r='15.5'
          gradientUnits='userSpaceOnUse'
        />
        <radialGradient
          xlinkHref='#linearGradient2903'
          id='radialGradient6493'
          cx='34.847946'
          cy='66.937302'
          fx='34.847946'
          fy='66.937302'
          r='20.221333'
          gradientTransform='matrix(0.92916233,0.60509959,-0.81674082,1.2541487,57.200263,-38.614606)'
          gradientUnits='userSpaceOnUse'
        />
      </defs>
      <g
        id='layer1'
        style='display:inline'>
        <rect
          style='fill:#b0b0b0;fill-opacity:1;stroke:#000000;stroke-width:1.05553;stroke-opacity:1'
          id='rect1834'
          width='30.435759'
          height='28.0644'
          x='35.842823'
          y='64.523239'
        />
        <rect
          style='fill:#b0b0b0;fill-opacity:1;stroke:#000000;stroke-width:0.875087;stroke-opacity:1'
          id='rect846'
          width='33.348526'
          height='46.16576'
          x='34.847633'
          y='22.030401'
          ry='1.8551255'
        />
        <rect
          style='fill:#b0b0b0;fill-opacity:1;stroke:#000000;stroke-opacity:1'
          id='rect1320'
          width='32.211727'
          height='21.41827'
          x='35.203289'
          y='0.63049203'
          ry='4.5534902'
        />
        <rect
          style='fill:#544f4f;fill-opacity:1;stroke:#000000;stroke-width:0.888888;stroke-opacity:1'
          id='rect1650'
          width='54.233627'
          height='17.708017'
          x='45.605862'
          y='35.584686'
        />
        <rect
          style='fill:#b0b0b0;fill-opacity:1;stroke:#000000;stroke-opacity:1'
          id='rect1527'
          width='34.2355'
          height='9.9502192'
          x='34.404148'
          y='89.383331'
          ry='2.8670125'
        />
        <rect
          style='fill:#544f4f;fill-opacity:1;stroke:#000000;stroke-width:1.01961;stroke-opacity:1'
          id='rect2117'
          width='34.171795'
          height='64.953888'
          x='1.021691'
          y='0.64029622'
        />
        <rect
          style='fill:#000000;fill-opacity:1;stroke:#000000;stroke-opacity:1'
          id='rect2221'
          width='15.178299'
          height='13.997766'
          x='52.955406'
          y='4.0475469'
          ry='1.8551257'
        />
        <circle
          style='opacity:1;fill:url(#radialGradient5997);fill-opacity:1;stroke:#000000;stroke-opacity:1'
          id='path2886'
          cx='17.960989'
          cy='17.264349'
          r='15'
        />
        <circle
          style='fill:url(#radialGradient6005);fill-opacity:1.0;stroke:#000000;stroke-opacity:1'
          id='circle2968'
          cx='17.960989'
          cy='49.138783'
          r='15'
        />
        <path
          style='fill:none;stroke:url(#radialGradient6493);stroke-width:3;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;fill-opacity:1'
          d='M 17.033427,65.435342 C 16.696131,107.93459 54.641884,84.66119 54.473236,52.955406'
          id='path3093'
        />
      </g>
    </svg>
  );
});

Player.props = [
  'class',
  'isDead',
];

export default Player;
