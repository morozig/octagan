import {
  defineComponent,
  computed,
} from 'vue';
import './SoundButton.css';

interface SoundButtonProps {
  isOn: boolean;
  onToggle: () => void;
  class?: string;
}

const SoundButton = defineComponent<SoundButtonProps>((props) => {
  const className = computed(() => 'SoundButton '.concat(
    props.isOn ? 'SoundButton--on ' : ' ',
    props.class ? `${props.class} ` : ' ',
  ));

  return () => (
    <div
      class={className.value}
      onClick={props.onToggle}
    >
      {props.isOn ?
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
        >
          <path d='M5 17h-5v-10h5v10zm2-10v10l9 5v-20l-9 5zm11.008 2.093c.742.743 1.2 1.77 1.198 2.903-.002 1.133-.462 2.158-1.205 2.9l1.219 1.223c1.057-1.053 1.712-2.511 1.715-4.121.002-1.611-.648-3.068-1.702-4.125l-1.225 1.22zm2.142-2.135c1.288 1.292 2.082 3.073 2.079 5.041s-.804 3.75-2.096 5.039l1.25 1.254c1.612-1.608 2.613-3.834 2.616-6.291.005-2.457-.986-4.681-2.595-6.293l-1.254 1.25z' />
        </svg> :
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
        >
          <path d='M22 1.269l-18.455 22.731-1.545-1.269 3.841-4.731h-1.827v-10h4.986v6.091l2.014-2.463v-3.628l5.365-2.981 4.076-5.019 1.545 1.269zm-10.986 15.926v.805l8.986 5v-16.873l-8.986 11.068z' />
        </svg>
      }
    </div>
  );
});

SoundButton.props = [
  'isOn',
  'onToggle',
  'class',
];

export default SoundButton;
