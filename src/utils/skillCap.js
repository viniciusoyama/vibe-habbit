// Calculate the current cap for a skill level
export const getSkillCap = (level) => {
  if (level < 10) return 10;
  if (level < 30) return 30;
  if (level < 100) return 100;

  const capSteps = Math.floor((level - 100) / 100) + 1;
  return 100 + capSteps * 100;
};

// Get previous cap (for calculating progress within current tier)
export const getPreviousCap = (currentCap) => {
  if (currentCap === 10) return 0;
  if (currentCap === 30) return 10;
  if (currentCap === 100) return 30;
  return currentCap - 100;
};

// Calculate progress percentage within current tier
export const getProgressPercent = (level) => {
  const cap = getSkillCap(level);

  return (level / cap) * 100;
};
