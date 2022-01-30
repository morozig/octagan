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

const scores = [] as number[];
const keyBuild = new Array(64)
  .fill(undefined)
  .map(() => Math.floor(Math.random() * 8));
const getScore = (build: string, level: number) => {
  return new Promise<number>(resolve => {
    setTimeout(() => {
      const diff = build
        .split('')
        .map(curr => +curr)
        .map((curr, i) => (level === 8 || curr === level || curr === 0) ?
          Math.abs(curr - keyBuild[i]) : 0
        )
        .reduce((total, curr) => total + curr, 0);
      resolve(1 - diff / 7 / 64);
    }, 200);
  });
};
const getPlayerDamageSent = (level: number) => {
  let damage = Math.ceil(Math.random() * 20);
  for (let i = 0; i < level; i++) {
    const multiplier = i === level - 1 ? 2 : 1;
    const score = scores[i];
    if (score > Math.random()) {
      damage += 20 * multiplier;
    }
  }
  return damage;
};
const getPlayerDamageRecieved = (damage: number, level: number) => {
  let block = 0;
  for (let i = 0; i < level; i++) {
    const multiplier = i === level - 1 ? 2 : 1;
    const score = scores[i];
    if (score > Math.random()) {
      block += 20 * multiplier;
    }
  }
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

  const score = ref<number>(undefined);
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
      if (scores[level.value - 1] === undefined) {
        scores[level.value - 1] = await getScore(build.value, level.value);
      }
      score.value = scores[level.value - 1];
      fightStatus.value = FightStatus.Running;
      playerStatus.value = UnitStatus.Sending;
    };

    if (value === FightStatus.Started) {
      run();
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
    start,
    stop,
  };
};

export {
  useFight,
}