import { _decorator, CCFloat, Collider, Component, director, EventKeyboard, Input, input, instantiate, KeyCode, Node, Prefab, RigidBody2D, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    
    @property({type: CCFloat})
    speed: number = 0;

    @property({type: CCFloat})
    direction: number = 1;

    @property(Prefab)
    barPrefab:Prefab = null;

    @property(Node)
    ball:Node = null;

    @property(Node)
    cameraTarget: Node = null;

    @property(Node)
    groundGame:Node = null;

    start () {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.SPACE) {
            this.direction *= -1;
        }
    }

    update (dt: number) {
        const angle = Math.PI / 4;
        const speedX = this.speed * this.direction * Math.cos(angle);
        const speedY = this.speed * Math.sin(angle);
        const velocity = new Vec3(speedX * dt, speedY * dt, 0);

        this.ball.setPosition(this.ball.position.add(velocity));
    }
    

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);      
    }

}


