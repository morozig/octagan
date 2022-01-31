import {
  defineComponent,
  computed,
  ref,
} from 'vue';
import './BuildArea.css';
import Gem from './Gem';

interface BuildAreaProps {
  build: string;
  onBuildChange: (build: string) => void;
  isDisabled?: boolean;
}

const BuildArea = defineComponent<BuildAreaProps>((props) => {
  const colorSelected = ref<number>(undefined);

  const onClearClick = () => {
    colorSelected.value = undefined;
    const build = '0'.repeat(64);
    props.onBuildChange(build);
  };

  const onRandomClick = () => {
    colorSelected.value = undefined;
    const build = new Array(64)
      .fill(undefined)
      .map(() => Math.floor(Math.random() * 8))
      .join('');
    props.onBuildChange(build);
  };

  const controlsClass = computed(() => 'BuildArea-controls '.concat(
    props.isDisabled ? 'BuildArea-controls--disabled ' : '',
  ));

  return () => (
    <div
      class={'BuildArea'}
    >
      <div
        class={controlsClass.value}
      >
        {new Array(7).fill(undefined).map((_, i) => (
          <div
            key={i + 1}
            class={'BuildArea-controls-color '.concat(
              colorSelected.value === i + 1 ?
                'BuildArea-controls-color--selected ' :
                ''
            )}
            onClick={() => {
              if (colorSelected.value === i + 1) {
                colorSelected.value = undefined;
              } else {
                colorSelected.value = i + 1
              }
            }}
          >
            <Gem
              color={i + 1}
            />
          </div>
        ))}
        <div
          class={'BuildArea-controls-color '.concat(
            colorSelected.value === 0 ?
              'BuildArea-controls-color--selected ' :
              ''
          )}
          onClick={() => {
            if (colorSelected.value === 0) {
              colorSelected.value = undefined;
            } else {
              colorSelected.value = 0
            }
          }}
        />
        <button
          onClick={onClearClick}
        >
          {'Clear'}
        </button>
        <button
          onClick={onRandomClick}
        >
          {'Random'}
        </button>
      </div>
      <div
        class={'BuildArea-grid '.concat(
          colorSelected.value !== undefined ? 
            'BuildArea-grid--active ' : ''
        )}
      >
        {props.build.split('').map((char, i) => (
          <div
            key={i}
            class={'BuildArea-grid-item'}
            onClick={() => {
              if (colorSelected.value !== undefined) {
                const buildChars = props.build.split('');
                buildChars[i] = `${colorSelected.value}`;
                const newBuild = buildChars.join('');
                props.onBuildChange(newBuild);
              }
            }}
          >
            {+char ?
              <Gem
                color={+char}
              /> :
              null
            }
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
