import {
  watch,
  ref,
  Ref,
  onMounted,
} from 'vue';
import { getBaseUrl } from '~~/src/lib/helpers';

export const animationTimings = {
  playerSending: 50,
  playerRecieving: 1100,
  enemySending: 50,
  enemyRecieving: 1100,
  playerProjectileFlying: 900,
  enemyProjectileFlying: 350,
  modelLeaving: 500,
};

export const enum UnitStatus {
  Idle,
  Sending,
  Recieving,
  Dead,
}

export const enum FightStatus {
  Stopped,
  Started,
  Running,
  Finished,
}

export const enum ProjectileStatus {
  Absent,
  FlyingFromPlayer,
  FlyingFromEnemy,
}

export const enum ModelStatus {
  Idle,
  Loading,
  Leaving,
  Ready,
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let scoresBuild = '';
let scores = [] as number[];
let model; // tf.LayersModel;
let modelPromise;

const buildToInput = (build: string, level: number) => {
  const buildArr = build
    .split('')
    .map(char => +char);
  const input = [] as number[][][];
  for (let i = 0; i < 8; i++) {
    if (!input[i]) input[i] = [];
    for (let j = 0; j < 8; j++) {
      if (!input[i][j]) input[i][j] = [];
      for (let k = 0; k < 16; k++) {
        input[i][j][k] = k + 1 === level + 8 ? 1 : 0;
      }
    }
  }
  for (let index = 0; index < 64; index++) {
    const i = Math.floor(index / 8);
    const j = index % 8;
    const k = buildArr[index] > 0 ?
      buildArr[index] - 1 : 7;
    input[i][j][k] = 1;
  }
  return input;
};
const getModel = async () => {
  const origin = getBaseUrl();
  let tf = (window as any).tf;
  if (!model) {
    if (!modelPromise) {
      const requestUrl = `${origin}/model/model.json`;
      modelPromise = tf.loadLayersModel(requestUrl);
    }
    model = await modelPromise;
  }
};

const getScore = async (build: string, level: number) => {
  let tf = (window as any).tf;
  await getModel();
  const input = buildToInput(build, level);
  const inputsTensor = tf.tensor([input]);
  const outputsTensor = model.predict(inputsTensor);
  const outputs = await outputsTensor.array() as number[][];
  inputsTensor.dispose();
  outputsTensor.dispose();
  const score = outputs[0][0];
  return score;
};

const getPlayerDamageSent = (level: number) => {
  let damage = Math.ceil(Math.random() * 20);
  const score = scores[level - 1];
  damage += Math.round(20 * level * score);
  return damage;
};
const getPlayerDamageRecieved = (damage: number, level: number) => {
  let block = 0;
  const score = scores[level - 1];
  block += Math.round(20 * level * score);
  const damageRecieved = Math.max(damage - block, 0);
  return damageRecieved;
};
const getEnemyDamageSent = (level: number) => {
  const damage = level * (
    level + Math.floor(Math.random() * (20 - level + 1))
  );
  return damage;
};
const getEnemyDamageRecieved = (damage: number, level: number) => {
  return damage;
};

interface FightOptions {
  build: Ref<string>;
  level: Ref<number>;
};

const useFight = (options: FightOptions) => {
  const {
    build,
    level,
  } = options;
  const fightStatus = ref(FightStatus.Stopped);

  const playerHealth = ref(100);
  const playerStatus = ref(UnitStatus.Idle);

  const enemyHealth = ref(100 * level.value);
  const enemyStatus = ref(UnitStatus.Idle);

  const totalScore = ref<number>(undefined);
  const damageSent = ref<number>(undefined);
  const damageRecieved = ref<number>(undefined);
  const projectileStatus = ref(ProjectileStatus.Absent);
  const isMissing = ref(false);
  const modelStatus = ref(ModelStatus.Idle);
  
  onMounted(async () => {
    modelStatus.value = ModelStatus.Loading;
    await getScore(build.value, 1);
    modelStatus.value = ModelStatus.Leaving;
    await sleep(animationTimings.modelLeaving);
    modelStatus.value = ModelStatus.Ready;
  });

  const start = () => {
    enemyHealth.value = 100 * level.value;
    fightStatus.value = FightStatus.Started;
  };
  const stop = () => {
    fightStatus.value = FightStatus.Stopped;
    playerStatus.value = UnitStatus.Idle;
    enemyStatus.value = UnitStatus.Idle;
    projectileStatus.value = ProjectileStatus.Absent;
    isMissing.value = false;
  };

  
  watch(fightStatus, (value, oldValue) => {
    const run = async () => {
      if (scoresBuild !== build.value) {
        scores = [];
        scoresBuild = build.value;
      }
      if (scores[level.value - 1] === undefined) {
        scores[level.value - 1] = await getScore(build.value, level.value);
      }
      const score = scores[level.value - 1];
      fightStatus.value = FightStatus.Running;
      playerStatus.value = UnitStatus.Sending;
    };

    switch (value) {
      case (FightStatus.Started): {
        run();
        break;
      }
      case (FightStatus.Finished): {
        if (scores.length) {
          totalScore.value = scores.reduce(
            (total, curr) => total + curr, 0
          ) / scores.length;
        }
        break;
      }
    }
  });
  watch(playerStatus, (value, oldValue, onCleanup) => {
    let timerHandle: NodeJS.Timeout | undefined;
    onCleanup(() => {
      if (timerHandle) {
        clearTimeout(timerHandle);
        timerHandle = undefined;
      }
    });
    switch (value) {
      case (UnitStatus.Sending): {
        timerHandle = setTimeout(() => {
          playerStatus.value = UnitStatus.Idle;
          projectileStatus.value = ProjectileStatus.FlyingFromPlayer;
          damageSent.value = getPlayerDamageSent(level.value);
        }, animationTimings.playerSending);
        break;
      }
      case (UnitStatus.Recieving): {
        timerHandle = setTimeout(() => {
          playerStatus.value = playerHealth.value > 0 ?
            UnitStatus.Sending :
            UnitStatus.Dead;
          damageRecieved.value = undefined;
        }, animationTimings.playerRecieving);
        break;
      }
      case (UnitStatus.Dead): {
        fightStatus.value = FightStatus.Finished;
        break;
      }
    }
  });
  watch(enemyStatus, (value, oldValue, onCleanup) => {
    let timerHandle: NodeJS.Timeout | undefined;
    onCleanup(() => {
      if (timerHandle) {
        clearTimeout(timerHandle);
        timerHandle = undefined;
      }
    });
    switch (value) {
      case (UnitStatus.Recieving): {
        timerHandle = setTimeout(() => {
          enemyStatus.value = enemyHealth.value > 0 ?
            UnitStatus.Sending :
            UnitStatus.Dead;
          damageRecieved.value = undefined;
        }, animationTimings.enemyRecieving);
        break;
      }
      case (UnitStatus.Sending): {
        const willSend = getEnemyDamageSent(level.value);
        const willRecieve = getPlayerDamageRecieved(
          willSend,
          level.value
        );
        const willMiss = willRecieve <= 0;
        isMissing.value = willMiss;
        timerHandle = setTimeout(() => {
          enemyStatus.value = UnitStatus.Idle;
          projectileStatus.value = ProjectileStatus.FlyingFromEnemy;
          damageSent.value = willSend;
          isMissing.value = false;
        }, animationTimings.enemySending);
        break;
      }
      case (UnitStatus.Dead): {
        fightStatus.value = FightStatus.Finished;
        break;
      }
    }
  });
  watch(projectileStatus, (value, oldValue, onCleanup) => {
    let timerHandle: NodeJS.Timeout | undefined;
    onCleanup(() => {
      if (timerHandle) {
        clearTimeout(timerHandle);
        timerHandle = undefined;
      }
    });
    switch (value) {
      case (ProjectileStatus.FlyingFromPlayer): {
        timerHandle = setTimeout(() => {
          enemyStatus.value = UnitStatus.Recieving;
          projectileStatus.value = ProjectileStatus.Absent;
          damageRecieved.value = getEnemyDamageRecieved(
            damageSent.value,
            level.value
          );
          damageSent.value = undefined;
          enemyHealth.value = Math.max(
            enemyHealth.value - damageRecieved.value,
            0
          );
        }, animationTimings.playerProjectileFlying);
        break;
      }
      case (ProjectileStatus.FlyingFromEnemy): {
        timerHandle = setTimeout(() => {
          playerStatus.value = UnitStatus.Recieving;
          projectileStatus.value = ProjectileStatus.Absent;
          damageRecieved.value = getPlayerDamageRecieved(
            damageSent.value,
            level.value
          );
          damageSent.value = undefined;
          playerHealth.value = Math.max(
            playerHealth.value - damageRecieved.value,
            0
          );
        }, animationTimings.enemyProjectileFlying);
        break;
      }
    }
  });

  return {
    fightStatus,
    playerStatus,
    enemyStatus,
    projectileStatus,
    isMissing,
    playerHealth,
    enemyHealth,
    damageSent,
    damageRecieved,
    totalScore,
    modelStatus,
    start,
    stop,
  };
};

export {
  useFight,
}