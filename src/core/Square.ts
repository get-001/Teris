import { Point, IViewer } from "./types";

// 小方块
// this.viewer  this.point  this.color
export class Square {
  private _viewer?: IViewer;
  // private _point: Point = { x: 0, y: 0 };
  // private _color: string = "red";
  constructor(private _point: Point, private _color: string) {}
  public get viewer() {
    return this._viewer;
  }
  public set viewer(v) {
    this._viewer = v;
    this._viewer?.show();
  }
  public get point() {
    return this._point;
  }
  public set point(val) {
    this._point = val;
    // 完成显示
    this._viewer && this._viewer.show();
  }
  public get color() {
    return this._color;
  }
}
