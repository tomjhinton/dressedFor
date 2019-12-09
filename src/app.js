import 'bulma'
import './style.scss'
import '@babel/polyfill'
import '@tensorflow/tfjs-core'
import '@tensorflow/tfjs-converter'

import * as bodyPix from '@tensorflow-models/body-pix';
console.log(bodyPix)
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

    let opacity = Math.random()
    const flipHorizontal = false;
    let maskBlurAmount = 10;
    const pixelCellWidth = Math.random()*150

    bodyPix.drawPixelatedMask(
        canvas, webcamElement, coloredPartImage, opacity, maskBlurAmount,
        flipHorizontal, pixelCellWidth)


        const maskBackground = true;
  // Convert the segmentation into a mask to darken the background.
  const foregroundColor = {r: 200, g: 0, b: 0, a: 0};
  const backgroundColor = {r: 0, g: 0, b: 0, a: 255};
  const backgroundDarkeningMask = bodyPix.toMask(
      segmentation, foregroundColor, backgroundColor);

   opacity = 0.7;
   maskBlurAmount = 3

  // Draw the mask onto the image on a canvas.  With opacity set to 0.7 and
  // maskBlurAmount set to 3, this will darken the background and blur the
  // darkened background's edge.
  // bodyPix.drawMask(
  //     canvas, canvas, backgroundDarkeningMask, opacity, maskBlurAmount, flipHorizontal)
  //     }
  //
}
setInterval(function () {
  draw()

}, 100);

}
loadAndPredict();
setupWebcam()
