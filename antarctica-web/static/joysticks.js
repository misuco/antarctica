    // Create joystick and set z index to be below playgrounds top bar
    var leftJoystick = new BABYLON.VirtualJoystick(true);
    var rightJoystick = new BABYLON.VirtualJoystick(false);
    BABYLON.VirtualJoystick.Canvas.style.zIndex = "-1";
    var cameraZ = 10;
    var cameraAlpha = 0;
    var cameraBeta = 0;

    // Game/Render loop
    var movespeed = 50;
    scene.onBeforeRenderObservable.add(()=>{
        if(leftJoystick.pressed){
            moveX = leftJoystick.deltaPosition.x * (engine.getDeltaTime()/1000) * movespeed;
            moveY = leftJoystick.deltaPosition.y * (engine.getDeltaTime()/1000) * movespeed;
            camera.position.x=0;//+=moveX;
            camera.position.y=0;//+=moveY;
            //camera.target.x+=moveX;
            distance+=moveX;
            camera.target.y+=moveY;
            //console.log("left jouystick pressed moveX " + moveX + " moveY " + moveY );
            
        }
        if(rightJoystick.pressed){
            moveX = rightJoystick.deltaPosition.x;// * (engine.getDeltaTime()/1000) * movespeed;
            moveY = rightJoystick.deltaPosition.y;// * (engine.getDeltaTime()/1000) * movespeed;

			camera.alpha=moveX;
			camera.beta=moveY;
//            cameraZ += moveZ;
//            if(cameraZ > 500) cameraZ = 50;
//            if(cameraZ < -500) cameraZ = -500;
           
//            camera.position.z=0;//cameraZ;
//            camera.target.z=cameraZ;
            
            
//            cameraAlpha = moveX;
//            camera.beta = cameraAlpha;
            
            //console.log("right jouystick pressed moveZ " + moveZ + " position z: " + camera.position.z );
        }
    })
    
    // Create button to toggle joystick overlay canvas
    var btn = document.createElement("button")
    btn.innerText = "Enable/Disable Joystick"
    btn.style.zIndex = 10;
    btn.style.position = "absolute"
    btn.style.bottom = "50px"
    btn.style.right = "0px"
    document.body.appendChild(btn)

    // Button toggle logic
    btn.onclick = ()=>{
        if(BABYLON.VirtualJoystick.Canvas.style.zIndex == "-1"){
            BABYLON.VirtualJoystick.Canvas.style.zIndex = "4";
        }else{
            BABYLON.VirtualJoystick.Canvas.style.zIndex = "-1";
        }
    }
