// src/logic/utils.js

// 1. Tetromino definitions
export const TETROMINOES = {
    I: [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0],
    ],
    J: [
      [1,0,0],
      [1,1,1],
      [0,0,0],
    ],
    L: [
      [0,0,1],
      [1,1,1],
      [0,0,0],
    ],
    O: [
      [1,1],
      [1,1],
    ],
    S: [
      [0,1,1],
      [1,1,0],
      [0,0,0],
    ],
    T: [
      [0,1,0],
      [1,1,1],
      [0,0,0],
    ],
    Z: [
      [1,1,0],
      [0,1,1],
      [0,0,0],
    ],
  };
  
  // 2. Deep clone a matrix (to avoid mutating originals)
  export function cloneMatrix(matrix) {
    return matrix.map(row => row.slice());
  }
  
  // 3. Rotate a matrix clockwise
  export function rotateMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
  
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        rotated[x][rows - 1 - y] = matrix[y][x];
      }
    }
    return rotated;
  }
  
  // 4. Create an empty grid
  export function createGrid(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(null));
  }
  
  // 5. Check collision or out‑of‑bounds
  export function isValidPosition(grid, piece, offsetX = 0, offsetY = 0) {
    const { shape, x: px, y: py } = piece;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (!shape[y][x]) continue;
  
        const newX = px + x + offsetX;
        const newY = py + y + offsetY;
  
        // Out of bounds
        if (newX < 0 || newX >= grid[0].length || newY >= grid.length) {
          return false;
        }
        // Hitting locked block
        if (newY >= 0 && grid[newY][newX]) {
          return false;
        }
      }
    }
    return true;
  }
  
  // 6. Clear full lines, return number of cleared rows
  export function clearFullLines(grid) {
    let cleared = 0;
    const newGrid = grid.filter(row => {
      if (row.every(cell => cell !== null)) {
        cleared++;
        return false; // drop this row
      }
      return true;
    });
    // add empty rows at top
    while (newGrid.length < grid.length) {
      newGrid.unshift(Array(grid[0].length).fill(null));
    }
    return { newGrid, cleared };
  }
  
  // 7. Spawn a random tetromino
  export function createRandomPiece(cols) {
    const types = Object.keys(TETROMINOES);
    const type = types[Math.floor(Math.random() * types.length)];
    const shape = cloneMatrix(TETROMINOES[type]);
    // start near top-center
    const x = Math.floor((cols - shape[0].length) / 2);
    const y = -shape.length;
    return { type, shape, x, y };
  }
  