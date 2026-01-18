// Calculate the current cap for a skill level
// Caps: 10, 30, 100, 200, 300, ...
export const getSkillCap = (level) => {
  if (level < 10) return 10;
  if (level < 30) return 30;
  if (level < 100) return 100;
  // After 100, caps increase by 100: 200, 300, 400, ...
  const capsAfter100 = Math.floor((level - 100) / 100) + 1;
  return 100 + capsAfter100 * 100;
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
  const prevCap = getPreviousCap(cap);
  const progressInTier = level - prevCap;
  const tierSize = cap - prevCap;
  return (progressInTier / tierSize) * 100;
};
