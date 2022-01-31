import {
  watch,
  ref,
  Ref,
} from 'vue';

export const animationTimings = {
  playerSending: 400,
  playerRecieving: 800,
  enemySending: 400,
  enemyRecieving: 800,
  playerProjectileFlying: 1000,
  enemyProjectileFlying: 1000,
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

let scoresBuild = '';
let scores = [] as number[];
let model; // tf.LayersModel;
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
const getScore = async (build: string, level: number) => {
  const start = new Date().getTime();
  const tf = await import('@tensorflow/tfjs');
  const imported = new Date().getTime();
  console.log('tf imported', imported - start);
  if (!model) {
    const requestUrl = `${window.location}model/model.json`;
    model = await tf.loadLayersModel(requestUrl);
  }
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
  const damage = level * Math.ceil(Math.random() * 20);
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
  
  const start = () => {
    playerHealth.value = 100;
    enemyHealth.value = 100 * level.value;
    fightStatus.value = FightStatus.Started;
  };
  const stop = () => {
    fightStatus.value = FightStatus.Stopped;
    playerStatus.value = UnitStatus.Idle;
    enemyStatus.value = UnitStatus.Idle;
    projectileStatus.value = ProjectileStatus.Absent;
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
    let timerHandle: NodeJS.Timeout | undefined
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
          playerHealth.value = Math.max(
            playerHealth.value - damageRecieved.value,
            0
          );
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
    let timerHandle: NodeJS.Timeout | undefined
    onCleanup(() => {
      if (timerHandle) {
        clearTimeout(timerHandle);
        timerHandle = undefined;
      }
    });
    switch (value) {
      case (UnitStatus.Recieving): {
        timerHandle = setTimeout(() => {
          enemyHealth.value = Math.max(
            enemyHealth.value - damageRecieved.value,
            0
          );
          enemyStatus.value = enemyHealth.value > 0 ?
            UnitStatus.Sending :
            UnitStatus.Dead;
          damageRecieved.value = undefined;
        }, animationTimings.enemyRecieving);
        break;
      }
      case (UnitStatus.Sending): {
        timerHandle = setTimeout(() => {
          enemyStatus.value = UnitStatus.Idle;
          projectileStatus.value = ProjectileStatus.FlyingFromEnemy;
          damageSent.value = getEnemyDamageSent(level.value);
        }, animationTimings.enemySending);
        break;
      }
      case (UnitStatus.Dead): {
        playerHealth.value = 100;
        fightStatus.value = FightStatus.Finished;
        break;
      }
    }
  });
  watch(projectileStatus, (value, oldValue, onCleanup) => {
    let timerHandle: NodeJS.Timeout | undefined
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
    playerHealth,
    enemyHealth,
    damageSent,
    damageRecieved,
    totalScore,
    start,
    stop,
  };
};

export {
  useFight,
}