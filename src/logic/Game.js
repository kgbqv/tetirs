// src/logic/Game.js
import { createGrid, isValidPosition, clearFullLines, createRandomPiece } from './utils.js';

export class Game {
  constructor(cols = 10, rows = 20) {
    this.cols = cols;
    this.rows = rows;
    this.reset();
  }

  reset() {
    this.grid = createGrid(this.rows, this.cols);
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.gameOver = false;
    this.spawnPiece();
  }

  spawnPiece() {
    this.active = createRandomPiece(this.cols);
    // if the new piece collides immediately, it's game over
    if (!isValidPosition(this.grid, this.active)) {
      this.gameOver = true;
    }
  }

  tick() {
    if (this.gameOver) return;
    // try moving down
    if (isValidPosition(this.grid, this.active, 0, 1)) {
      this.active.y += 1;
    } else {
      // lock piece into grid
      this.lockPiece();
      // clear lines
      const { newGrid, cleared } = clearFullLines(this.grid);
      this.grid = newGrid;
      if (cleared > 0) {
        this.linesCleared += cleared;
        this.score += cleared * 100 * this.level;
        // increase level every 10 lines
        this.level = Math.floor(this.linesCleared / 10) + 1;
      }
      // spawn next
      this.spawnPiece();
    }
  }

  lockPiece() {
    const { shape, x: px, y: py, type } = this.active;
    shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const gx = px + dx;
          const gy = py + dy;
          if (gy >= 0 && gy < this.rows && gx >= 0 && gx < this.cols) {
            this.grid[gy][gx] = type;
          }
        }
      });
    });
  }

  moveLeft() {
    if (isValidPosition(this.grid, this.active, -1, 0)) {
      this.active.x -= 1;
    }
  }

  moveRight() {
    if (isValidPosition(this.grid, this.active, 1, 0)) {
      this.active.x += 1;
    }
  }

  rotateCW() {
    const oldShape = this.active.shape;
    this.active.shape = rotateMatrix(oldShape);
    if (!isValidPosition(this.grid, this.active)) {
      this.active.shape = oldShape;
    }
  }

  hardDrop() {
    while (isValidPosition(this.grid, this.active, 0, 1)) {
      this.active.y += 1;
    }
    // lock and advance
    this.tick();
  }

  getState() {
    return {
      grid: this.grid,
      active: this.active,
      score: this.score,
      level: this.level,
      gameOver: this.gameOver
    };
  }
}
