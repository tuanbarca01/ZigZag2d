import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraController')
export class CameraController extends Component {

    @property(Node)
    ball:Node = null;

    update(dt: number) {
        let target_position = this.ball.getPosition();
        let current_position = this.node.getPosition();
        current_position.lerp(target_position, 0.1);
        this.node.setPosition(current_position);
    }
}


