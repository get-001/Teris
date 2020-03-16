import $ from "jquery";
import { Square } from "../Square";
import { IViewer } from "../types";
import PageConfig from "./PageConfig";

// 显示一个小方块到页面上
// this.show()  this.remove()
// implements -- 约束对象必须实践某个类
export class SquarePageViewer implements IViewer {
  private dom?: JQuery<HTMLElement>;
  private isRemove: boolean = false; // 是否已经销毁
  constructor(
    private square: Square, // 小方块对象
    private container: JQuery<HTMLElement> // dom容器
  ) {}
  show(): void {
    if (this.isRemove) return; // dom已经移除，不再显示
    const { width, height } = PageConfig.SquareSize;
    if (!this.dom) {
      this.dom = $("<div>")
        .css({
          position: "absolute",
          width,
          height,
          border: "1px solid #fff"
        })
        .appendTo(this.container);
    }
    this.dom.css({
      left: width * this.square.point.x,
      top: height * this.square.point.y,
      background: this.square.color
    });
    // console.log(this.square.point, this.square.color);
  }
  remove(): void {
    if (this.dom && !this.isRemove) {
      this.dom.remove();
      this.isRemove = true;
    }
  }
}
