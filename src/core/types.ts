import { SquareGroup } from "./SquareGroup";
import { Game } from "./Game";

// 坐标
export interface Point {
  readonly x: number;
  readonly y: number;
}
// 展示类
export interface IViewer {
  show(): void; // 显示
  remove(): void; // 移除
}
// 形状
export type Shape = Point[];
/**
 * 移动的方向
 * @enum {number}
 */
export enum MoveDirection {
  left,
  right,
  down
}
/**
 * @enum {number} 游戏状态枚举
 * @init 未开始
 * @playing 进行中
 * @pause 暂停
 * @over 结束
 */
export enum GameStatus {
  init,
  playing,
  pause,
  over
}

export interface GameViewer {
  showNext(teris: SquareGroup): void; // 显示下一个对象
  swtich(teris: SquareGroup): void; // 切换对象
  init(game: Game): void; // 完成游戏界面的初始化
  showScore(score: number): void; // 显示分数
  onGamePause(): void;
  onGameStart(): void;
  onGameOver(): void;
}
