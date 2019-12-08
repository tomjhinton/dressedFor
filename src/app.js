import 'bulma'
import './style.scss'
import '@babel/polyfill'
import '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-converter'

import * as bodyPix from '@tensorflow-models/body-pix';

const img = document.getElementById('image');

const webcamElement = document.getElementById('webcam')
const canvas = document.getElementById('canvas')
function setupWebcam() {
  return new Promise((resolve, reject) => {
    const navigatorAny = navigator
    navigator.getUserMedia = navigator.getUserMedia ||
            navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
            navigatorAny.msGetUserMedia
    if (navigator.getUserMedia) {
      navigator.getUserMedia({ video: true },
        stream => {
          webcamElement.srcObject = stream
          webcamElement.addEventListener('loadeddata', () => resolve(), false)
        },
        error => reject())
    } else {
      reject()
    }
  })
}



async function loadAndPredict() {
  const net = await bodyPix.load(/** optional arguments, see below **/);

  /**
   * One of (see documentation below):
   *   - net.segmentPerson
   *   - net.segmentPersonParts
   *   - net.segmentMultiPerson
   *   - net.segmentMultiPersonParts
   * See documentation below for details on each method.

    */
    async function draw(){
    const segmentation = await net.segmentPersonParts(webcamElement);
    const coloredPartImage = bodyPix.toColoredPartMask(segmentation);
    const opacity = 0.7;
    const flipHorizontal = false;
    const maskBlurAmount = 0;
    const pixelCellWidth = 10.0;

    bodyPix.drawPixelatedMask(
        canvas, webcamElement, coloredPartImage, opacity, maskBlurAmount,
        flipHorizontal, pixelCellWidth)
      }
setInterval(function () {
  draw()

}, 10);

}
loadAndPredict();
setupWebcam()
