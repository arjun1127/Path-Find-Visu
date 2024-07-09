import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      startNode: { row: null, col: null },
      finishNode: { row: null, col: null },
    };
  }

  componentDidMount() {
    const startNode = this.getRandomNode();
    const finishNode = this.getRandomNode();
    this.setState({ startNode, finishNode }, () => {
      const grid = this.getInitialGrid(startNode, finishNode);
      this.setState({ grid });
    });
  }

  getRandomNode() {
    const row = Math.floor(Math.random() * 20);
    const col = Math.floor(Math.random() * 50);
    return { row, col };
  }

  handleMouseDown(row, col) {
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid, startNode, finishNode } = this.state;
    const start = grid[startNode.row][startNode.col];
    const finish = grid[finishNode.row][finishNode.col];
    const visitedNodesInOrder = dijkstra(grid, start, finish);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finish);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  getInitialGrid(startNode, finishNode) {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        currentRow.push(this.createNode(col, row, startNode, finishNode));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  createNode(col, row, startNode, finishNode) {
    return {
      col,
      row,
      isStart: row === startNode.row && col === startNode.col,
      isFinish: row === finishNode.row && col === finishNode.col,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  }
}
