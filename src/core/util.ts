/**
 * 生成指定范围的随机数
 * @param {number} min
 * @param {number} max
 */
export function getRandom(min: number, max: number) {
  const dec = max - min;
  return Math.floor(Math.random() * dec + min);
}
