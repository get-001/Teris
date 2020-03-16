import { GameViewer, MoveDirection, GameStatus } from "../types";
import { SquarePageViewer } from "./SquarePageViewer";
import $ from "jquery";
import GameConfig from "../GameConfig";
import PageConfig from "./PageConfig";

export class GamePageViewer implements GameViewer {
  onGamePause(): void {
    this.msgDom.fadeIn(500).text("游戏暂停");
  }
  onGameStart(): void {
    this.msgDom.fadeOut(500).text("游戏开始");
  }
  onGameOver(): void {
    this.msgDom.fadeIn(500).text("游戏结束");
  }
  private nextDom = $("#root>#tip>.next");
  private panelDom = $("#root>#panel");
  private scoreDom = $("#root>#tip>.score");
  private msgDom = $("#root>#panel>.msg");
  showScore(score: number): void {
    this.scoreDom.text(score.toString());
  }
  init(game: import("../Game").Game): void {
    // 设置界面的宽高
    this.panelDom.css({
      width: GameConfig.panelSize.width * PageConfig.SquareSize.width,
      height: GameConfig.panelSize.height * PageConfig.SquareSize.height
    });
    this.nextDom.css({
      width: GameConfig.nextSize.width * PageConfig.SquareSize.width,
      height: GameConfig.nextSize.height * PageConfig.SquareSize.height
    });
    // 注册键盘事件
    $(document).keydown(({ keyCode }) => {
      if (keyCode === 37) {
        game.control(MoveDirection.left);
      } else if (keyCode === 39) {
        game.control(MoveDirection.right);
      } else if (keyCode === 40) {
        game.control(MoveDirection.down);
      } else if (keyCode === 32) {
        game.control();
      } else if (keyCode === 13) {
        if (game.gameStatus === GameStatus.playing) {
          game.pause();
        } else {
          game.start();
        }
      }
    });
  }
  showNext(teris: import("../SquareGroup").SquareGroup): void {
    teris.squares.forEach(sq => {
      sq.viewer = new SquarePageViewer(sq, this.nextDom);
    });
  }
  swtich(teris: import("../SquareGroup").SquareGroup): void {
    teris.squares.forEach(sq => {
      sq.viewer!.remove();
      sq.viewer = new SquarePageViewer(sq, this.panelDom);
    });
  }
}
