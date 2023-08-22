/*
 * @copyright    [MBC_Robot](https://mbc-robot.com/), 2023
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](mbc.robot89@gmail.com)
 * @date  20230822
 */

enum lineColor {
    //% block="black"
    black = 0,
    //% block="white"
    white = 1
}
enum calibColor {
    //% block="black"
    black = 0,
    //% block="white"
    white = 1
}

/**
 * MBC_lineSensorV1 blocks
 */
//%weight=100 color=#0fbc11 icon="\uf072"
namespace MBC_lineSensorV1 {
    //% block="init|TX:%txPin=SerialPin|RX:%rxPin" weight=10
    //% txPin.defl=SerialPin.P0
    //% rxPin.defl=SerialPin.P1
    export function init(txPin: SerialPin, rxPin: SerialPin): void {
        serial.redirect(txPin, rxPin, 38400);
    }

    //% block="setLineColor|%color" weight=9
    export function setLineColor(color: lineColor): void {
        serial.writeString("" + (color << 4 | 4));
    }

    //% block="getLineError" weight=8
    export function getLineError(): number {
        serial.writeString("1");
        let receivedByte = 0;
        while (1) {
            let serialData = serial.readBuffer(0)
            if (serialData.length > 0) {
                receivedByte = serialData[0]
                break;
            }
        }
        // 清空暫存
        while (serial.readBuffer(0).length > 0);
        // 進行值的轉換
        let convertedValue = receivedByte > 127 ? receivedByte - 256 : receivedByte;
        return convertedValue;
    }

    //% block="getLineWidth" weight=7
    export function getLineWidth(): number {
        serial.writeString("2");
        let receivedByte = 0;
        while (1) {
            let serialData = serial.readBuffer(0)
            if (serialData.length > 0) {
                receivedByte = serialData[0]
                break;
            }
        }
        // 清空暫存
        while (serial.readBuffer(0).length > 0);
        return receivedByte;
    }

    //% block="getEachSensor|%each" weight=6
    //% each.min=0 each.max=7
    export function getEachSensor(each: number): number {
        if (each % 1 !== 0) {
            // If it's a float, convert it to an integer
            each = Math.round(each);
        }
        if (each < 0) each = 0;
        if (each > 7) each = 7;
        serial.writeString("" + (each << 4 | 3));
        let receivedByte = 0;
        while (1) {
            let serialData = serial.readBuffer(0)
            if (serialData.length > 0) {
                receivedByte = serialData[0]
                break;
            }
        }
        // 清空暫存
        while (serial.readBuffer(0).length > 0);
        return receivedByte;
    }

    //% block="setCalibrate|%color" weight=5
    export function setCalibrate(color: calibColor) {
        serial.writeString("" + (color << 4 | (5 + color)));
    }
}
