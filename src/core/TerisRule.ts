import { Point, Shape, MoveDirection } from "./types";
import GameConfig from "./GameConfig";
import { SquareGroup } from "./SquareGroup";
import { Square } from "./Square";

/**
 * 类型保护函数
 * @param {*} obj
 * @returns {obj is Point}
 */
function isPoint(obj: any): obj is Point {
  return !(typeof obj.x === "undefined");
}

/**
 * 该类中提供一系列的函数，根据游戏规则判断各种情况
 */
export class TerisRule {
  /**
   * 判断某个形状的方块，是否能够移动到目标位置
   * @param {Shape} shape         -- 形状数组
   * @param {Point} targetPoint   -- 目标位置
   * @returns {boolean} 返回是否可以移动
   */
  static canIMove(shape: Shape, targetPoint: Point, exists: Square[]): boolean {
    // 假设中心点已经移动到目标位置，算出每一个小方块的坐标，
    const targetSquarePoints: Point[] = shape.map(it => {
      return { x: it.x + targetPoint.x, y: it.y + targetPoint.y };
    });
    // 边界判断
    let result = targetSquarePoints.some(p => {
      const { width, height } = GameConfig.panelSize;
      return p.x < 0 || p.x > width - 1 || p.y < 0 || p.y > height - 1;
    });
    if (result) return false;
    // 判断是否与已有的小方块有重叠
    result = targetSquarePoints.some(p =>
      exists.some(({ point }) => point.x === p.x && point.y === p.y)
    );
    return !result;
  }
  /**
   * 移动俄罗斯方块到指定目标点
   * @memberof TerisRule
   * @static 静态方法
   * @param {SquareGroup} teris 俄罗斯方块对象
   * @param {(Point | MoveDirection)} pointOrDirection 目标点坐标 or 需要移动的方向
   * @returns {boolean} 返回是否移动成功
   */
  static move(
    teris: SquareGroup,
    pointOrDirection: Point,
    exists: Square[]
  ): boolean;
  static move(
    teris: SquareGroup,
    pointOrDirection: MoveDirection,
    exists: Square[]
  ): boolean;
  static move(
    teris: SquareGroup,
    pointOrDirection: Point | MoveDirection,
    exists: Square[]
  ): boolean {
    if (isPoint(pointOrDirection)) {
      // pointOrDirection 类型为 Point
      if (this.canIMove(teris.shape, pointOrDirection, exists)) {
        teris.centerPoint = pointOrDirection;
        return true;
      }
      return false;
    } else {
      // pointOrDirection 类型为 MoveDirection
      const { x, y } = teris.centerPoint;
      let targetPoint: Point;
      if (pointOrDirection === MoveDirection.left) {
        targetPoint = { x: x - 1, y: y };
      } else if (pointOrDirection === MoveDirection.right) {
        targetPoint = { x: x + 1, y: y };
      } else {
        targetPoint = { x: x, y: y + 1 };
      }
      return this.move(teris, targetPoint, exists);
    }
  }
  /**
   * 将当前的俄罗斯方块，移动至目标方向的终点
   * @memberof TerisRule
   * @static 静态方法
   * @param {SquareGroup} teris 俄罗斯方块对象
   * @param {MoveDirection} direction 需要移动的方向
   * @returns 递归函数，结束后返回false
   */
  static moveDirectly(
    teris: SquareGroup,
    direction: MoveDirection,
    exists: Square[]
  ) {
    if (this.move(teris, direction, exists)) {
      this.moveDirectly(teris, direction, exists);
    } else {
      return false;
    }
  }
  static rotate(teris: SquareGroup, exists: Square[]): boolean {
    const newShape = teris.afterRotateShape(); // 只是计算出旋转后新的形状
    if (this.canIMove(newShape, teris.centerPoint, exists)) {
      teris.rotate();
      return true;
    }
    return false;
  }
  /**
   * 得到一行所有的小方块
   * @static
   * @param {Square[]} exists 所有小方块的数组
   * @param {number} rowIndex 行索引
   * @returns {Square[]} 返回指定行索引的小方块数组
   * @memberof TerisRule
   */
  private static getLineSquares(exists: Square[], rowIndex: number): Square[] {
    return exists.filter(sq => sq.point.y === rowIndex);
  }
  /**
   * 从已存在的方法中进行消除,并返回消除的行索引
   * @static
   * @param {Square[]} exists 所有小方块的数组
   * @returns {number} 返回消除了多少行
   * @memberof TerisRule
   */
  static deleteSquares(exists: Square[]): number {
    // 获得y坐标数组
    const ys = exists.map(sq => sq.point.y);
    // 获取最大和最小的坐标
    const maxY = Math.max(...ys),
      minY = Math.min(...ys);
    let num = 0;
    // 循环判断每一行是否可消除
    for (let index = minY; index <= maxY; index++) {
      this.deleteLine(exists, index) && num++;
    }
    return num;
  }
  private static deleteLine(exists: Square[], rowIndex: number): boolean {
    const square = this.getLineSquares(exists, rowIndex);
    if (square.length === GameConfig.panelSize.width) {
      // 这一行可以消除
      square.forEach(sq => {
        // 1.从界面中移除
        sq.viewer?.remove();
        // 2.从数据中彻底把它干掉，
        const index = exists.indexOf(sq);
        exists.splice(index, 1);
      });
      // 剩下的小方块，只要是Y坐标比行索引小的都+1
      exists
        .filter(sq => sq.point.y < rowIndex)
        .forEach(sq => {
          sq.point = {
            x: sq.point.x,
            y: sq.point.y + 1
          };
        });
      return true;
    }
    return false;
  }
}
