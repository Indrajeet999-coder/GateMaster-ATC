

class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    parent(i) {
        return Math.floor((i - 1) / 2);
    }

    leftChild(i) {
        return 2 * i + 1;
    }

    rightChild(i) {
        return 2 * i + 2;
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    insert(gate) {
        this.heap.push(gate);
        this.bubbleUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }

    bubbleUp(index) {
        let current = index;
        while (current > 0) {
            let p = this.parent(current);
            const currentTime = new Date(this.heap[current].nextAvailableTime).getTime();
            const parentTime = new Date(this.heap[p].nextAvailableTime).getTime();
            
            if (currentTime < parentTime) {
                this.swap(current, p);
                current = p;
            } else {
                break;
            }
        }
    }

    bubbleDown(index) {
        let current = index;
        const n = this.heap.length;
        
        while (true) {
            let left = this.leftChild(current);
            let right = this.rightChild(current);
            let smallest = current;

            const currentVal = new Date(this.heap[smallest].nextAvailableTime).getTime();

            if (left < n) {
                const leftVal = new Date(this.heap[left].nextAvailableTime).getTime();
                if (leftVal < currentVal) {
                    smallest = left;
                }
            }
            
            if (right < n) {
                const rightVal = new Date(this.heap[right].nextAvailableTime).getTime();
                const smallestVal = new Date(this.heap[smallest].nextAvailableTime).getTime();
                if (rightVal < smallestVal) {
                    smallest = right;
                }
            }

            if (smallest !== current) {
                this.swap(current, smallest);
                current = smallest;
            } else {
                break;
            }
        }
    }

    getAll() {
        return [...this.heap];
    }
}

module.exports = PriorityQueue;
