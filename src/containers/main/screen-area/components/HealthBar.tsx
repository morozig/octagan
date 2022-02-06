import {
  defineComponent,
  computed,
} from 'vue';
import './HealthBar.css';

interface HealthBarProps {
  health: number;
  maxHealth: number;
  class?: string;
}

const HealthBar = defineComponent<HealthBarProps>((props) => {
  const className = computed(() => 'HealthBar '.concat(
    props.class ? `${props.class} ` : ' ',
  ));
  const percents = computed(() => props.health / props.maxHealth * 100);
  const green = computed(() => Math.min(
    Math.round( 255 * percents.value / 50 ),
    255
  ));
  const red = computed(() => {
    let color = Math.round( 255 * (percents.value - 50) / 50 );
    color = Math.min(color, 255);
    return Math.abs(color - 255);
  });

  return () => (
    <div
      class={className.value}
    >
      <div
        class={'HealthBar-health'}
        style={{
          width: `${percents.value}%`,
          backgroundColor: `rgb(
            ${red.value},
            ${green.value},
            0
          )`
        }}
      />
      <span
        class={'HealthBar-number'}
        style={{
          color: `rgb(
            ${red.value},
            ${green.value},
            0
          )`,
          mixBlendMode: percents.value > 35 ?
            'difference' :
            'normal',
        }}
      >
        {props.health}
      </span>
    </div>
  );
});

HealthBar.props = [
  'health',
  'maxHealth',
  'class',
];

export default HealthBar;
