import $ from "jquery";
import { createTeris } from "./core/Teris";
import { SquarePageViewer } from "./core/viewer/SquarePageViewer";
import { TerisRule } from "./core/TerisRule";
import { MoveDirection } from "./core/types";

const teris = createTeris({ x: 5, y: 5 });
teris.squares.forEach(sq => {
  sq.viewer = new SquarePageViewer(sq, $("#root"));
});

// Test
$("#btn-left").click(() => {
  TerisRule.moveDirectly(teris, MoveDirection.left);
});
$("#btn-right").click(() => {
  TerisRule.moveDirectly(teris, MoveDirection.right);
});
$("#btn-bottom").click(() => {
  TerisRule.moveDirectly(teris, MoveDirection.down);
});
// 旋转
$("#btn-rotate").click(() => {
  TerisRule.rotate(teris);
});
