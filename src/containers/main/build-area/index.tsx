import {
  defineComponent,
  computed,
  ref,
  watch,
  toRefs,
} from 'vue';
import './BuildArea.css';
import Gem from './Gem';

const buildLocalStorageKey = 'build';

export const validateBuild = (buildStr: string) => {
  if (buildStr.length !== 64) {
    return false;
  }
  for (let i = 0; i < 64; i++) {
    const char = buildStr[i];
    const parsed = parseInt(char, 10);
    if (isNaN(parsed)) {
      return false;
    }
    if (parsed < 0 || parsed > 7) {
      return false;
    }
  }
  return true;
};

interface BuildAreaProps {
  build: string;
  onBuildChange: (build: string) => void;
  isDisabled?: boolean;
}

const BuildArea = defineComponent<BuildAreaProps>((props) => {
  const {
    isDisabled
  } = toRefs(props);
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

  const onSaveClick = () => {
    localStorage.setItem(buildLocalStorageKey, props.build);
  };

  const onLoadClick = () => {
    const build = localStorage.getItem(buildLocalStorageKey);
    if (build && validateBuild(build)) {
      props.onBuildChange(build);
    }
  };
  const onCloneClick = () => {
    window.open(window.location.href, '_blank');
  };

  watch(isDisabled, () => {
    colorSelected.value = undefined;
  });

  const controlsClass = computed(() => 'BuildArea-controls '.concat(
    isDisabled.value ? 'BuildArea-controls--disabled ' : '',
  ));

  return () => (
    <div
      class={'BuildArea'}
    >
      <div
        class={controlsClass.value}
      >
        <div
          class={'BuildArea-controls-buttons'}
        >
          <button
            onClick={onRandomClick}
          >
            {'Random'}
          </button>
          <button
            onClick={onClearClick}
          >
            {'Clear'}
          </button>
          <button
            onClick={onSaveClick}
          >
            {'Save'}
          </button>
          <button
            onClick={onLoadClick}
          >
            {'Load'}
          </button>
          <button
            onClick={onCloneClick}
            class={'BuildArea-controls--enabled'}
          >
            {'Clone'}
          </button>
        </div>
        <div
          class={'BuildArea-controls-colors'}
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
        </div>
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
