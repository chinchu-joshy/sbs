import { useEffect } from "react";
import "./App.css";
import * as THREE from "three";
import { VRButton } from "three/addons/webxr/VRButton.js";

function App() {
  useEffect(() => {
    const container = document.getElementById("container");
   
    // Create a new scene for the video overlay
    const videoScene = new THREE.Scene();

    // Create a new camera for the video overlay
    const videoCamera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Set the initial position and orientation of the video camera
    videoCamera.position.set(0, 0, 0);
    videoCamera.lookAt(0, 0, -1);
    // const sbsVideo = document.getElementById("video");
  
    // container.addEventListener("click", function () {
    //   sbsVideo.play();
    // });


    const video = document.createElement('video')
    video.src='https://www.images.depthify.ai/dirtbike_sbs.mp4 '
    video.crossOrigin='anonymous'
    video.loop=true
    video.autoplay=true
window.addEventListener("click",()=>{
  video.play()
})




    // Create a video texture for the SBS video
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.format = THREE.RGBFormat;

    // Create a plane geometry for the video overlay
    const videoGeometry = new THREE.PlaneGeometry(16, 9);

    // Create a material using the video texture
    const videoMaterial = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.DoubleSide,
    });

    // Create a mesh using the video geometry and material
    const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

    // Position the video mesh in front of the user's view
    videoMesh.position.set(0, 0, -10);

    // Add the video mesh to the video scene
    videoScene.add(videoMesh);




    // Create a plane geometry for left eye
// const leftEyeGeometry = new THREE.PlaneGeometry(16, 9);

// // Create a plane geometry for right eye
// const rightEyeGeometry = new THREE.PlaneGeometry(16, 9);

// Create a material using the left half of the SBS video texture
// const leftEyeMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
// leftEyeMaterial.map.offset.set(0, 0);
// leftEyeMaterial.map.repeat.set(0.5, 1);

// // Create a material using the right half of the SBS video texture
// const rightEyeMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
// rightEyeMaterial.map.offset.set(0.5, 0);
// rightEyeMaterial.map.repeat.set(0.5, 1);

// // Create meshes for left and right eyes
// const leftEyeMesh = new THREE.Mesh(leftEyeGeometry, leftEyeMaterial);
// const rightEyeMesh = new THREE.Mesh(rightEyeGeometry, rightEyeMaterial);

// // Position left eye mesh to the left
// leftEyeMesh.position.set(-8, 0, 0);

// // Position right eye mesh to the right
// rightEyeMesh.position.set(8, 0, 0);

// // Add left and right eye meshes to the scene
// videoScene.add(leftEyeMesh);
// videoScene.add(rightEyeMesh);






    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    renderer.xr.setReferenceSpaceType("local");
    // const canvas = document.querySelector("#canvas");
    container.appendChild(renderer.domElement);

    document.body.appendChild(VRButton.createButton(renderer));

    // Function to update the video overlay position and orientation based on the VR headset
    function updateVideoOverlay() {
      const vrDisplay = renderer.xr.getSession()?.device;

      if (vrDisplay && vrDisplay.isPresenting) {
        const pose = vrDisplay.getFrameData().pose;

        // Update the position and orientation of the video camera based on the VR headset pose
        videoCamera.position.copy(pose.position);
        videoCamera.quaternion.copy(pose.orientation);

        // Update the position of the video mesh in front of the user's view
        videoMesh.position.set(0, 0, -10).applyQuaternion(pose.orientation);
      }
    }

    // Render loop
    function animate() {
      renderer.setAnimationLoop(() => {
        // Update the video overlay position and orientation
        updateVideoOverlay();

        // Render the video scene
        renderer.render(videoScene, videoCamera);

        // // Render the main scene (your 3D environment)
        // renderer.render(scene, camera);
      });
    }

    // Start the animation loop
    animate();
  }, []);

  return (
    <>
    
      <div id="container"></div>
      <video
        id="video"
        loop
        crossOrigin="anonymous"
        playsInline
        style={{display:"none"}}
      >
        <source
          src="textures/sintel.ogv"
          type='video/ogg; codecs="theora, vorbis"'
        />
        <source
          src="textures/sintel.mp4"
          type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
        />
      </video>
    </>
  );
}

export default App;
