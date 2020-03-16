import { GameStatus, Point, MoveDirection, GameViewer } from "./types";
import { SquareGroup } from "./SquareGroup";
import { createTeris } from "./Teris";
import { TerisRule } from "./TerisRule";
import { Square } from "./Square";
import GameConfig from "./GameConfig";

export class Game {
  // 当前游戏中，已存在的小方块
  private _exists: Square[] = [];
  // 游戏状态
  public gameStatus: GameStatus = GameStatus.init;
  // 当前玩家操作的方块
  private _curTeris?: SquareGroup;
  // 下一个方块
  private _nextTeris: SquareGroup = createTeris({ x: 2, y: 2 });
  // 分数
  private _score: number = 0;
  private get score() {
    return this._score;
  }
  private set score(v: number) {
    this._score = v;
    const level = GameConfig.levels.filter(it => it.score <= v).pop()!;
    if (this._duration !== level.duration) {
      console.log(1, level);
      this._duration = level.duration;
      this.autoDrop();
    }
    this._viewer.showScore(v);
  }
  private addScore(lineNum: number) {
    if (lineNum === 0) {
      return;
    } else if (lineNum === 1) {
      this.score += 10;
    } else if (lineNum === 2) {
      this.score += 25;
    } else if (lineNum === 3) {
      this.score += 50;
    } else {
      this.score += 100;
    }
  }

  /**
   * 游戏初始化
   * @private
   * @memberof Game
   */
  public init() {
    this._exists.forEach(sq => sq.viewer?.remove());
    this._exists = [];
    this._nextTeris = createTeris({ x: 2, y: 2 });
    this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris, 1);
    this._viewer.showNext(this._nextTeris);
    this.score = 0;
    this._curTeris = undefined;
  }

  /**
   * 游戏暂停
   */
  public pause() {
    if (this.gameStatus !== GameStatus.playing) return;
    this.gameStatus = GameStatus.pause;
    clearInterval(this._timer);
    this._viewer.onGamePause();
  }
  /**
   * 游戏开始
   */
  public start() {
    // 游戏状态改变
    if (this.gameStatus === GameStatus.playing) return;
    // 从游戏结束到开始
    if (this.gameStatus === GameStatus.over) {
      // 初始化
      this.init();
    }
    if (!this._curTeris) {
      // 如果当前方块没有值，就给当前方块赋值
      this.switchTeris();
    }
    this.gameStatus = GameStatus.playing;
    this.autoDrop();
    this._viewer.onGameStart();
  }

  /**
   * 控制移动
   * @param {MoveDirection} [direction] 可选值，移动的方向。为空时表示旋转
   * @memberof Game
   */
  control(direction?: MoveDirection) {
    if (this._curTeris && this.gameStatus === GameStatus.playing) {
      if (direction === MoveDirection.down) {
        if (!TerisRule.moveDirectly(this._curTeris, direction, this._exists)) {
          // 触底处理
          this.hitBottom();
        }
      } else if (
        direction === MoveDirection.left ||
        direction === MoveDirection.right
      ) {
        TerisRule.move(this._curTeris, direction, this._exists);
      } else {
        TerisRule.rotate(this._curTeris, this._exists);
      }
    }
  }

  constructor(private _viewer: GameViewer) {
    this.init();
    this._viewer.init(this);
  }

  // 自动下落定时器
  private _timer?: number;
  // 自动下落的间隔时间
  private _duration: number = 1000;
  /**
   * 让当前方块自动下落
   */
  private autoDrop() {
    // 该函数已经执行 或者 当前游戏状态不为`进行中`时不做任何操作。
    if (this.gameStatus !== GameStatus.playing) return;
    clearInterval(this._timer);
    this._timer = setInterval(() => {
      if (!this._curTeris) {
        clearInterval(this._timer);
        return;
      }
      if (!TerisRule.move(this._curTeris, MoveDirection.down, this._exists)) {
        // 触底处理
        this.hitBottom();
      }
    }, this._duration);
  }
  /**
   * 触底之后的处理
   * @private
   * @memberof Game
   */
  private hitBottom() {
    // 将当前俄罗斯方块所包含的小方块加入到已存在的数组中。
    this._exists.push(...this._curTeris!.squares);
    // 处理行方块的消除
    const num = TerisRule.deleteSquares(this._exists);
    this.addScore(num);
    this.switchTeris(); // 切换方块
  }

  /**
   * 切换方块
   * @private
   * @memberof Game
   */
  private switchTeris() {
    this._curTeris = this._nextTeris;
    this._curTeris.squares.forEach(sq => sq.viewer?.remove());
    this.resetCenterPoint(GameConfig.panelSize.width, this._curTeris);
    this._nextTeris = createTeris({ x: 0, y: 0 });
    this.resetCenterPoint(GameConfig.nextSize.width, this._nextTeris, 1);
    // 判断游戏是否结束
    if (
      !TerisRule.canIMove(
        this._curTeris.shape,
        this._curTeris.centerPoint,
        this._exists
      )
    ) {
      this.gameStatus = GameStatus.over;
      clearInterval(this._timer);
      this._viewer.onGameOver();
      return;
    }
    this._viewer.showNext(this._nextTeris);
    this._viewer.swtich(this._curTeris);
  }
  /**
   * 设置中心点坐标，让显示的方块尽可能在区域内居中。
   * @private
   * @param {number} width 容器宽度(相对的)
   * @param {SquareGroup} teris 俄罗斯方块对象
   * @memberof Game
   */
  private resetCenterPoint(width: number, teris: SquareGroup, y: number = 0) {
    const x = Math.ceil(width / 2);
    teris.centerPoint = { x, y };
    while (teris.squares.some(({ point }) => point.y < y)) {
      teris.centerPoint = {
        x: teris.centerPoint.x,
        y: teris.centerPoint.y + 1
      };
    }
  }
}
