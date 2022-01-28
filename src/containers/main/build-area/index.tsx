import {
  defineComponent,
  computed,
} from 'vue';
import { GameStatus } from '..';
import './BuildArea.css';

interface BuildAreaProps {
  build: string;
  onBuildChange: (build: string) => void;
  isDisabled?: boolean;
}

const BuildArea = defineComponent<BuildAreaProps>((props) => {
  const onRandomClick = () => {
    const build = new Array(64)
      .fill(undefined)
      .map(() => Math.floor(Math.random() * 8))
      .join('');
    props.onBuildChange(build);
  };

  const randomClass = computed(() => 'BuildArea-controls-random '.concat(
    props.isDisabled ? 'BuildArea-controls-random--disabled ' : '',
  ));

  return () => (
    <div
      class={'BuildArea'}
    >
      <div
        class={'BuildArea-controls'}
      >
        <button
          onClick={onRandomClick}
          class={randomClass.value}
        >
          {'Random'}
        </button>
      </div>
      <div
        class={'BuildArea-grid'}
      >
        {props.build.split('').map((char, i) => (
          <div
            key={i}
            class={'BuildArea-grid-item'}
          >
            {char}
          </div>
        ))}
      </div>
    </div>
  );
});

BuildArea.props = [
  'build',
  'onBuildChange',
  'isDisabled',
];

export default BuildArea;
