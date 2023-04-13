import { _decorator, Component, director, EventKeyboard, Input, input, instantiate, KeyCode, Node, Prefab, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BarController')
export class BarController extends Component {
    @property({type: Prefab})
    barPrefab: Prefab = null;

    @property({type: Node})
    ball: Node = null;

    barList: Node[] = [];
    barPool: Node[] = [];
    lastBar: Node = null;
    intervalID: any = null;
    score: number = 0;

    start() {
        this.barPools();
        this.spawnBars(); 
        this.intervalID = setInterval(() => { 
            this.spawnBars(); 
        }, 2800);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        
    }
    
    barPools() {        
        const poolSize = 100;
        for (let i = 0; i < poolSize; i++) {
            const bar = instantiate(this.barPrefab);
            bar.parent = this.node;
            bar.active = false;
            this.barPool.push(bar);
        }
    }

    spawnBars() {
        if (director.isPaused()) {
            return;
        }

        const barCount = 10;
        const spacing = 70;
        const startPos = new Vec3(-(barCount - 1) * spacing / 2, 0, 0);

        for (let i = 0; i < barCount; i++) {
            let bar: Node;
            if (this.barPool.length > 0) {
                bar = this.barPool.pop();
                bar.active = true;
            } else {
                bar = instantiate(this.barPrefab);
                bar.parent = this.node;
            }

            let isMovingRight = true;
            if (this.barList.length === 0) {
                bar.setPosition(startPos.add(new Vec3(70, 70, 0)));
            } else {
                const lastBar = this.barList[this.barList.length - 1];
                const lastBarPos = lastBar.getPosition();
                const direction = isMovingRight ? 1 : -1;
                bar.setPosition(lastBarPos.add(new Vec3(direction * spacing - 16, 107, 0)));
                isMovingRight = !isMovingRight;
            }

            const randomAngle = Math.floor(Math.random() * 2) * 90;
            const rotation = new Vec3(0, 0, randomAngle);
            bar.setRotationFromEuler(rotation);

            this.barList.push(bar);
        }
        this.destroyFirstBarAfterDelay();
    }
    

    // destroyFirstBarAfterDelay() {
    //     if (this.barList.length > 30) {
    //         const removedBars = this.barList.splice(0, 10);
    //         setTimeout(() => {
    //             removedBars.forEach((bar) => {
    //                 bar.active = false;
    //                 this.barPool.push(bar);
    //             });
    //         }, 10000);
    //     }
    // }
    destroyFirstBarAfterDelay() {
        if (this.barList.length > 30) {
            const removedBars = this.barList.splice(0, 10);
            removedBars.forEach((bar) => {
                this.scheduleOnce(() => {
                    bar.active = false;
                    this.barPool.push(bar);
                }, 3000);
            });
        }
    }
    

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.ESCAPE) {
            if (director.isPaused()) {  
                director.resume();
            } else {
                director.pause();
            }
        }
    }

    onDestroy() {
        clearInterval(this.intervalID);
    }
    update() {
        for (let i = 0; i < this.barList.length; i++) {
            const bar = this.barList[i];
            const barPos = bar.getPosition();
            const barScale = bar.getScale();
    
            const barLeft = barPos.x - barScale.x * 107.569;
            const barRight = barPos.x + barScale.x * 107.569;
            const barTop = barPos.y + barScale.y * 53.7845;
            const barBottom = barPos.y - barScale.y * 53.7845;
    
            const ballPos = this.ball.getPosition();
            if (ballPos.x >= barLeft && ballPos.x <= barRight &&
                ballPos.y >= barBottom && ballPos.y <= barTop) {
                console.log("trong!");
            }
        }
    }
}

