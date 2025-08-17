import { describe, it, expect, beforeEach } from 'vitest';
import {
    collision,
    createFood,
    direction,
    resetGame,
    getSnake,
    getDirection,
    setDirection,
    getScore,
    getFood,
    box,
    setSnake,
} from './snake';

describe('Snake Game Core Logic', () => {
    beforeEach(() => {
        // Reset the game state before each test
        resetGame();
    });

    describe('collision', () => {
        it('should return true when the head collides with the body', () => {
            const head = { x: 1, y: 1 };
            const snake = [head, { x: 2, y: 1 }, { x: 1, y: 1 }];
            expect(collision(head, snake)).toBe(true);
        });

        it('should return false when the head does not collide', () => {
            const head = { x: 0, y: 1 };
            const snake = [{ x: 1, y: 1 }, { x: 2, y: 1 }];
            expect(collision(head, snake)).toBe(false);
        });
    });

    describe('createFood', () => {
        it('should create food within the game boundaries', () => {
            const canvas = { width: 608, height: 608 };
            const food = createFood(canvas, box);

            expect(food.x).toBeGreaterThanOrEqual(box);
            expect(food.x).toBeLessThan(canvas.width - box);
            expect(food.y).toBeGreaterThanOrEqual(box);
            expect(food.y).toBeLessThan(canvas.height - box);
        });
    });

    describe('direction', () => {
        it('should change direction to LEFT', () => {
            direction({ key: 'ArrowLeft' });
            expect(getDirection()).toBe('LEFT');
        });

        it('should change direction to UP', () => {
            direction({ key: 'ArrowUp' });
            expect(getDirection()).toBe('UP');
        });

        it('should change direction to RIGHT', () => {
            direction({ key: 'ArrowRight' });
            expect(getDirection()).toBe('RIGHT');
        });

        it('should change direction to DOWN', () => {
            direction({ key: 'ArrowDown' });
            expect(getDirection()).toBe('DOWN');
        });

        it('should not change direction if opposite key is pressed', () => {
            setDirection('RIGHT');
            direction({ key: 'ArrowLeft' });
            expect(getDirection()).toBe('RIGHT');
        });
    });

    describe('resetGame', () => {
        it('should reset the snake, direction, score, and food', () => {
            setSnake([{ x: 5 * box, y: 5 * box }]);
            setDirection('UP');
            
            resetGame();

            expect(getSnake()).toEqual([{ x: 9 * box, y: 10 * box }]);
            expect(getDirection()).toBeUndefined();
            expect(getScore()).toBe(0);
            
            const food = getFood();
            const canvas = { width: 608, height: 608 };
            expect(food.x).toBeGreaterThanOrEqual(box);
            expect(food.x).toBeLessThan(canvas.width - box);
            expect(food.y).toBeGreaterThanOrEqual(box);
            expect(food.y).toBeLessThan(canvas.height - box);
        });
    });
});
