import $ from "jquery";
import { Square } from "./core/Square";
import { SquarePageViewer } from "./core/viewer/SquarePageViewer";
import { SquareGroup } from "./core/SquareGroup";
import { TShape } from "./core/Teris";

const sq = new Square({ x: 2, y: 2 }, "red");
sq.point = { x: 2, y: 3 };
sq.viewer = new SquarePageViewer(sq, $("#root"));

// setInterval(() => (sq.point = { x: sq.point.x, y: sq.point.y + 1 }), 500);
$("#btn-down").click(() => (sq.point = { x: sq.point.x, y: sq.point.y + 1 }));
$("#btn-remove").click(() => sq.viewer?.remove());
$("#btn-add").click(() => (sq.viewer = new SquarePageViewer(sq, $("#root"))));

const group = new SquareGroup(TShape, { x: 5, y: 5 }, "#258");
group.squares.forEach(sq => {
  sq.viewer = new SquarePageViewer(sq, $("#root"));
});

// Test
$("#btn-top").click(() => {
  group.centerPoint = { x: group.centerPoint.x, y: group.centerPoint.y - 1 };
});
$("#btn-left").click(() => {
  group.centerPoint = { x: group.centerPoint.x - 1, y: group.centerPoint.y };
});
$("#btn-right").click(() => {
  group.centerPoint = { x: group.centerPoint.x + 1, y: group.centerPoint.y };
});
$("#btn-bottom").click(() => {
  group.centerPoint = { x: group.centerPoint.x, y: group.centerPoint.y + 1 };
});
