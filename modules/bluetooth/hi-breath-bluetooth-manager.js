import HiBlueToothManager from "../../libs/bluetooth/hi-bluetooth-manager";
import HiBreathBlueToothProtocol from "./hi-breath-bluetooth-protocol";

export default class HiBreathBlueToothManager extends HiBlueToothManager {
    constructor() {
        super();
        this.bluetoothProtocol = new HiBreathBlueToothProtocol(this);
        this.setUUIDs({services: ['6E400001-B5A3-F393-E0A9-E50E24DCCA9E']});//设置主Services方式如 this.setUUIDs({services: ['xxxx']})  xxxx为UUID全称，可设置多个
    }
}
