import { Shape, Point } from "./types";
import { Square } from "./Square";

// 小方块数组
export abstract class SquareGroup {
  private _squares: ReadonlyArray<Square>; // 该数组的组成不能发生变化
  // 根据中心点坐标，设置每一个小方块的坐标
  private setSquarePoints(centerPoint: Point) {
    const { x: centerX, y: centerY } = centerPoint;
    // this._shape 原始数组
    this._shape.forEach((p, i) => {
      // this._squares 处理后的数组
      this._squares[i].point = { x: centerX + p.x, y: centerY + p.y };
    });
  }
  constructor(
    private _shape: Shape, // 形状数组(原始)
    private _centerPoint: Point, // 中心点坐标
    private _color: string
  ) {
    const { x: centerX, y: centerY } = this._centerPoint;
    // 设置小方块数组
    this._squares = this._shape.map(p => {
      const sq = new Square(
        { x: centerX + p.x, y: centerY + p.y },
        this._color
      );
      return sq;
    });
  }
  public get squares() {
    return this._squares;
  }

  public get shape() {
    return this._shape;
  }

  public get centerPoint(): Point {
    return this._centerPoint;
  }
  public set centerPoint(v: Point) {
    // 设置中心点时，同时设置小方块的坐标
    this._centerPoint = v;
    this.setSquarePoints(v);
  }

  // isClock -- 表示旋转的方向是否为顺时针
  protected isClock = true;
  /**
   * 计算旋转之后的形状
   * @param {boolean} isClock 是否顺时针旋转
   * @returns {Shape} 返回计算后的形状数组
   * @memberof SquareGroup
   */
  afterRotateShape(): Shape {
    return this.isClock
      ? this._shape.map(p => ({ x: -p.y, y: p.x }))
      : this._shape.map(p => ({ x: p.y, y: -p.x }));
  }
  /**
   * 执行形状的旋转
   * @memberof SquareGroup
   */
  rotate() {
    const newShape = this.afterRotateShape();
    this._shape = newShape;
    this.setSquarePoints(this._centerPoint);
  }
}
