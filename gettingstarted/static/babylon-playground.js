var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
	scene.enablePhysics();

    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 2, 30, BABYLON.Vector3.Zero(), scene);

	camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    var subdivisions = 10
	var groundWidth = 10;
	
	var sunsSize = 5;
	var sunsRadius = sunsSize / 2;

    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    var sun = BABYLON.Mesh.CreateSphere("sphere1", 3, sunsSize, scene);
	sun.on = false;
	
	sun.actionManager = new BABYLON.ActionManager(scene);
	sun.actionManager.registerAction(
			new BABYLON.SwitchBooleanAction(BABYLON.ActionManager.OnPickTrigger, sun, "on")
		);
	
	var distanceBetweenPoints = groundWidth / subdivisions;	
	
	var clothMat = new BABYLON.StandardMaterial("texture3", scene);
    clothMat.diffuseTexture = new BABYLON.Texture("http://i.imgur.com/2HklR1L.jpg", scene);
	clothMat.zOffset = -20;
	clothMat.backFaceCulling = false;

    // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
    var ground = BABYLON.Mesh.CreateGround("ground1", groundWidth, groundWidth, subdivisions - 1, scene, true);
		
	ground.material = clothMat;
		
	var positions = ground.getVerticesData(BABYLON.VertexBuffer.PositionKind);
	var spheres = [];
	var joints = [];
	for (var i = 0; i < positions.length; i = i + 3) {
		var v = BABYLON.Vector3.FromArray(positions, i);
		
		var s = BABYLON.MeshBuilder.CreateSphere("s" + i, { diameter: 0.1 }, scene);
		
		s.position.copyFrom(v);
		spheres.push(s);
	}
	
	function createDistanceJoint(imp1, imp2) {
		var joint = new BABYLON.DistanceJoint({
			maxDistance: distanceBetweenPoints
		})
		imp1.addJoint(imp2, joint);
	}
	
	function createSpringJoint(imp1, imp2) {
		var joint = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.SpringJoint, {
		length: 1,
		stiffness: 20,
		damping: 0.1
	});
		imp1.addJoint(imp2, joint);
	}
	
	function createSpring2Joint(imp1, imp2) {
		var joint = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.SpringJoint, {
		length: .1,
		stiffness: 200,
		damping: 0.1
	});
		imp1.addJoint(imp2, joint);
	}
	
	//create the impostors
	spheres.forEach(function (point, idx) {
		
var mass = idx < subdivisions ? 0 : 1;
		point.physicsImpostor = new BABYLON.PhysicsImpostor(point, BABYLON.PhysicsImpostor.ParticleImpostor, { mass: mass }, scene);
		
		if (idx >= subdivisions) {
			if (idx > 49 && idx < 60) {

				createSpringJoint(point.physicsImpostor, spheres[idx - subdivisions].physicsImpostor);
				if (idx % subdivisions) {
					createDistanceJoint(point.physicsImpostor, spheres[idx - 1].physicsImpostor);
				}
			}
			else {
				createDistanceJoint(point.physicsImpostor, spheres[idx - subdivisions].physicsImpostor);
				if (idx % subdivisions) {
					createDistanceJoint(point.physicsImpostor, spheres[idx - 1].physicsImpostor);
				}
			}
		}
		
	});
	
	
		if (scene.activeCameras.length === 0){
		    scene.activeCameras.push(scene.activeCamera);
		}              

		var secondCamera = new BABYLON.FreeCamera("GunSightCamera", new BABYLON.Vector3(0, 0, -50), scene);                
		secondCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
		secondCamera.layerMask = 0x20000000;
		scene.activeCameras.push(secondCamera);
		
		var meshes = [];
		var h = window.innerHeight;
		var w = window.innerWidth;
		
		var x_less = BABYLON.Mesh.CreateBox("y", 10, scene);
		x_less.scaling = new BABYLON.Vector3(1, 1, 1);
		x_less.position = new BABYLON.Vector3(150, 220, 0);
		x_less.rotation = new BABYLON.Vector3(0, 0, 0);
		x_less.on = false;
		
		var x_more = BABYLON.Mesh.CreateBox("y", 10, scene);
		x_more.scaling = new BABYLON.Vector3(1, 1, 1);
		x_more.position = new BABYLON.Vector3(190, 220, 0);
		x_more.rotation = new BABYLON.Vector3(0, 0, 0);
		x_more.on = false;
		
		var x_1 = BABYLON.Mesh.CreateBox("y", 15, scene);
		x_1.scaling = new BABYLON.Vector3(1,0.1, 1);
		x_1.position = new BABYLON.Vector3(170, 220, 0);
		x_1.rotation = new BABYLON.Vector3(0, 0, 45);
		meshes.push(x_1);
		
		var x_2 = BABYLON.Mesh.CreateBox("y", 15, scene);
		x_2.scaling = new BABYLON.Vector3(1,0.1, 1);
		x_2.position = new BABYLON.Vector3(170, 220, 0);
		x_2.rotation = new BABYLON.Vector3(0, 0, 90);
		meshes.push(x_2);
		
		var y_less = BABYLON.Mesh.CreateBox("y", 10, scene);
		y_less.scaling = new BABYLON.Vector3(1, 1, 1);
		y_less.position = new BABYLON.Vector3(150, 200, 0);
		y_less.rotation = new BABYLON.Vector3(0, 0, 0);
		
		var y_more = BABYLON.Mesh.CreateBox("y", 10, scene);
		y_more.scaling = new BABYLON.Vector3(1, 1, 1);
		y_more.position = new BABYLON.Vector3(190, 200, 0);
		y_more.rotation = new BABYLON.Vector3(0, 0, 0);
		
		var y_1 = BABYLON.Mesh.CreateBox("y", 15, scene);
		y_1.scaling = new BABYLON.Vector3(1,0.1, 1);
		y_1.position = new BABYLON.Vector3(170, 200, 0);
		y_1.rotation = new BABYLON.Vector3(0, 0, 45);
		meshes.push(y_1);
		
		var y_2 = BABYLON.Mesh.CreateBox("y", 7, scene);
		y_2.scaling = new BABYLON.Vector3(1,0.1, 1);
		y_2.position = new BABYLON.Vector3(169, 204, 0);
		y_2.rotation = new BABYLON.Vector3(0, 0, 90);
		meshes.push(y_2);
		
		var z_less = BABYLON.Mesh.CreateBox("y", 10, scene);
		z_less.scaling = new BABYLON.Vector3(1, 1, 1);
		z_less.position = new BABYLON.Vector3(150, 180, 0);
		z_less.rotation = new BABYLON.Vector3(0, 0, 0);
		
		var z_more = BABYLON.Mesh.CreateBox("y", 10, scene);
		z_more.scaling = new BABYLON.Vector3(1, 1, 1);
		z_more.position = new BABYLON.Vector3(190, 180, 0);
		z_more.rotation = new BABYLON.Vector3(0, 0, 0);
		
		var z_1 = BABYLON.Mesh.CreateBox("y", 15, scene);
		z_1.scaling = new BABYLON.Vector3(1,0.1, 1);
		z_1.position = new BABYLON.Vector3(170, 180, 0);
		z_1.rotation = new BABYLON.Vector3(0, 0, 45);
		meshes.push(z_1);
		
		var z_2 = BABYLON.Mesh.CreateBox("y", 8, scene);
		z_2.scaling = new BABYLON.Vector3(1,0.1, 1);
		z_2.position = new BABYLON.Vector3(169, 186, 0);
		z_2.rotation = new BABYLON.Vector3(0, 0, .09);
		meshes.push(z_2);
		
		var z_3 = BABYLON.Mesh.CreateBox("y", 8, scene);
		z_3.scaling = new BABYLON.Vector3(1,0.1, 1);
		z_3.position = new BABYLON.Vector3(169, 174, 0);
		z_3.rotation = new BABYLON.Vector3(0, 0, .09);
		meshes.push(z_3);
		
		var add = BABYLON.Mesh.CreateBox("y", 10, scene);
		add.scaling = new BABYLON.Vector3(1, 1, 1);
		add.position = new BABYLON.Vector3(150, 150, 0);
		add.rotation = new BABYLON.Vector3(0, 0, 0);
		add.on = false;
		
		var a_1 = BABYLON.Mesh.CreateBox("y", 15, scene);
		a_1.scaling = new BABYLON.Vector3(1,0.1, 1);
		a_1.position = new BABYLON.Vector3(170, 150, 0);
		a_1.rotation = new BABYLON.Vector3(0, 0, 45);
		meshes.push(a_1);
		
		var a_2 = BABYLON.Mesh.CreateBox("y", 8, scene);
		a_2.scaling = new BABYLON.Vector3(1,0.1, 1);
		a_2.position = new BABYLON.Vector3(169, 156, 0);
		a_2.rotation = new BABYLON.Vector3(0, 0, .09);
		meshes.push(a_2);
		
		var a_3 = BABYLON.Mesh.CreateBox("y", 8, scene);
		a_3.scaling = new BABYLON.Vector3(1,0.1, 1);
		a_3.position = new BABYLON.Vector3(169, 154, 0);
		a_3.rotation = new BABYLON.Vector3(0, 0, .09);
		meshes.push(a_3);
		
		var save = BABYLON.Mesh.CreateBox("y", 10, scene);
		save.scaling = new BABYLON.Vector3(1, 1, 1);
		save.position = new BABYLON.Vector3(150, 130, 0);
		save.rotation = new BABYLON.Vector3(0, 0, 0);
		save.on = false;
		
		var s_1 = BABYLON.Mesh.CreateBox("y", 15, scene);
		s_1.scaling = new BABYLON.Vector3(1,0.1, 1);
		s_1.position = new BABYLON.Vector3(170, 180, 0);
		s_1.rotation = new BABYLON.Vector3(0, 0, 45);
		meshes.push(s_1);
		
		var s_2 = BABYLON.Mesh.CreateBox("y", 8, scene);
		s_2.scaling = new BABYLON.Vector3(1,0.1, 1);
		s_2.position = new BABYLON.Vector3(169, 186, 0);
		s_2.rotation = new BABYLON.Vector3(0, 0, .09);
		meshes.push(s_2);
		
		var s_3 = BABYLON.Mesh.CreateBox("y", 8, scene);
		s_3.scaling = new BABYLON.Vector3(1,0.1, 1);
		s_3.position = new BABYLON.Vector3(169, 174, 0);
		s_3.rotation = new BABYLON.Vector3(0, 0, .09);
		meshes.push(s_3);
		
		var s_4 = BABYLON.Mesh.CreateBox("y", 15, scene);
		s_4.scaling = new BABYLON.Vector3(1,0.1, 1);
		s_4.position = new BABYLON.Vector3(170, 180, 0);
		s_4.rotation = new BABYLON.Vector3(0, 0, 45);
		meshes.push(s_4);
		
		var s_5 = BABYLON.Mesh.CreateBox("y", 8, scene);
		s_5.scaling = new BABYLON.Vector3(1,0.1, 1);
		s_5.position = new BABYLON.Vector3(169, 186, 0);
		s_5.rotation = new BABYLON.Vector3(0, 0, .09);
		meshes.push(s_5);
		
		var gunSight1 = x_less;
		gunSight1.name = "gunSight1";
		gunSight1.layerMask = 0x20000000;
		gunSight1.freezeWorldMatrix();
		
		var gunSight2 = x_more;
		gunSight2.name = "gunSight2";
		gunSight2.layerMask = 0x20000000;
		gunSight2.freezeWorldMatrix();
		
		var gunSight3 = y_less;
		gunSight3.name = "gunSight3";
		gunSight3.layerMask = 0x20000000;
		gunSight3.freezeWorldMatrix();
		
		var gunSight4 = y_more;
		gunSight4.name = "gunSight4";
		gunSight4.layerMask = 0x20000000;
		gunSight4.freezeWorldMatrix();
		
		var gunSight5 = z_less;
		gunSight5.name = "gunSight5";
		gunSight5.layerMask = 0x20000000;
		gunSight5.freezeWorldMatrix();
		
		var gunSight6 = z_more;
		gunSight6.name = "gunSight6";
		gunSight6.layerMask = 0x20000000;
		gunSight6.freezeWorldMatrix();
		
		var gunSight7 = add;
		gunSight7.name = "gunSight7";
		gunSight7.layerMask = 0x20000000;
		gunSight7.freezeWorldMatrix();
		
		var gunSight8 = save;
		gunSight8.name = "gunSight8";
		gunSight8.layerMask = 0x20000000;
		gunSight8.freezeWorldMatrix();
		
		var gunSight = BABYLON.Mesh.MergeMeshes(meshes);
		gunSight.name = "gunSight";
		gunSight.layerMask = 0x20000000;
		gunSight.freezeWorldMatrix();
		
		gunSight1.actionManager = new BABYLON.ActionManager(scene);
		gunSight1.actionManager.registerAction(
			new BABYLON.SwitchBooleanAction(BABYLON.ActionManager.OnPickTrigger, x_less, "on")
		);
		
		gunSight2.actionManager = new BABYLON.ActionManager(scene);
		gunSight2.actionManager.registerAction(
			new BABYLON.SwitchBooleanAction(BABYLON.ActionManager.OnPickTrigger, x_more, "on")
		);
		
		gunSight3.actionManager = new BABYLON.ActionManager(scene);
		gunSight3.actionManager.registerAction(
			new BABYLON.SwitchBooleanAction(BABYLON.ActionManager.OnPickTrigger, y_less, "on")
			);
		
		gunSight4.actionManager = new BABYLON.ActionManager(scene);
		gunSight4.actionManager.registerAction(
			new BABYLON.SwitchBooleanAction(BABYLON.ActionManager.OnPickTrigger, y_more, "on")
			);
		
		gunSight5.actionManager = new BABYLON.ActionManager(scene);
		gunSight5.actionManager.registerAction(
			new BABYLON.SwitchBooleanAction(BABYLON.ActionManager.OnPickTrigger, z_less, "on")
		);
		
		gunSight6.actionManager = new BABYLON.ActionManager(scene);
		gunSight6.actionManager.registerAction(
			new BABYLON.SwitchBooleanAction(BABYLON.ActionManager.OnPickTrigger, z_more, "on")
		);
		
		var mat = new BABYLON.StandardMaterial("emissive mat",scene);
		mat.checkReadyOnlyOnce = true;
		mat.emissiveColor = new BABYLON.Color3(0,1,0);
		
		gunSight1.material = mat;
		gunSight2.material = mat;
		gunSight3.material = mat;
		gunSight4.material = mat;
		gunSight5.material = mat;
		gunSight6.material = mat;
		gunSight7.material = mat;
		gunSight8.material = mat;
		
		gunSight.material = mat;
	
	ground.registerBeforeRender(function () {
		if (sun.on) {
			spheres.forEach(function (point, idx) {
		if (idx >= subdivisions) {
			if (idx > 49 && idx < 60) {

				createSpring2Joint(point.physicsImpostor, spheres[idx - subdivisions].physicsImpostor);
				if (idx % subdivisions) {
					createDistanceJoint(point.physicsImpostor, spheres[idx - 1].physicsImpostor);
				}
			}
			else {
				createDistanceJoint(point.physicsImpostor, spheres[idx - subdivisions].physicsImpostor);
				if (idx % subdivisions) {
					createDistanceJoint(point.physicsImpostor, spheres[idx - 1].physicsImpostor);
				}
			}
			
		}
			});
		//sun.position.x = sun.position.x + 1;
		sun.on = false;
		}
		if (x_more.on)
		{
			sun.position.x = sun.position.x + 1;
			x_more.on = false;
		}
		if (x_less.on)
		{
			sun.position.x = sun.position.x - 1;
			x_less.on = false;
		}
		if (y_more.on)
		{
			sun.position.y = sun.position.y + 1;
			y_more.on = false;
		}
		if (y_less.on)
		{
			sun.position.y = sun.position.y - 1;
			y_less.on = false;
		}
		if (z_more.on)
		{
			sun.position.z = sun.position.z + 1;
			z_more.on = false;
		}
		if (z_less.on)
		{
			sun.position.z = sun.position.z - 1;
			z_less.on = false;
		}
		
		var positions = [];
		spheres.forEach(function (s,x) {
			positions.push(s.position.x, s.position.y, s.position.z);
		});
		ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
		ground.refreshBoundingInfo();
		
	});
	
    return scene;

};