import {
  defineComponent,
  computed,
} from 'vue';
import './Gem.css';

interface GemProps {
  color: number;
}

const Gem = defineComponent<GemProps>((props) => {
  const className = computed(() => 'Gem '.concat(
    `Gem--${props.color} `,
  ));

  return () => (
    <svg
      version='1.1' xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 80 80'
      class={className.value}
    >
      <polygon
        points='20 0 60 0 80 20 80 60 60 80 20 80 0 60 0 20'
      />
    </svg>
  );
});

Gem.props = [
  'color',
];

export default Gem;
