//ThreeJS App(s)
var link1 = document.createElement("script");
link1.src = "js/three.min.js"; // Can set this to be a nonlocal link like from cloudflare or a special script with a custom app
link1.async = false; // Load synchronously
document.head.appendChild(link1); //Append script
//Postprocessing Dependency
var link2 = document.createElement("script");
link2.src = "js/postprocessing.min.js"; // Can set this to be a nonlocal link like from cloudflare or a special script with a custom app
link2.async = false; // Load synchronously
document.head.appendChild(link2); //Append script


class ThreeGlobe {
    constructor() {
        //ThreeJS 
        var rendererHTML = '<div id="threeContainer" class="canvasContainer"></div>';
            HEGwebAPI.appendFragment(rendererHTML,'main_body');

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, (window.innerWidth - 20) / 435, 0.1, 1000 );
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth - 20, 435);
        this.renderer.shadowMap.enabled = true;
        //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
     
        document.getElementById("threeContainer").appendChild(this.renderer.domElement);

        var nStars = 5000;

        var vertices = [];

        for ( var i = 0; i < nStars; i ++ ) {

            var x = THREE.Math.randFloatSpread( 500 );
            var y = THREE.Math.randFloatSpread( 1000 );
            var z = THREE.Math.randFloatSpread( 1500 );

            vertices.push( x, y, z );
        }
        
        var geometry = new THREE.BufferGeometry();
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        var color = new THREE.Color();
        var colors = [];

        for (var i = 0; i < nStars; i++) {
            var roll = Math.random();
            if(roll <= 0.15){
                color.set('skyblue');
                colors.push(color.r,color.g,color.b);
            }
            else if ((roll > 0.15) && (roll <= 0.3)) {
                color.set('royalblue');
                colors.push(color.r,color.g,color.b);
            }
            else if ((roll > 0.3) && (roll <= 0.45)) { 
                color.set('purple');
                colors.push(color.r,color.g,color.b);
            }
            else if ((roll > 0.45) && (roll <= 0.6)) { 
                color.set('firebrick');
                colors.push(color.r,color.g,color.b);
            }
            else if ((roll > 0.6) && (roll < 0.9)) {
                color.set('white');
                colors.push(color.r,color.g,color.b);
            }
            else {
                color.set('goldenrod');
                colors.push(color.r,color.g,color.b);
            }
        }

        geometry.setAttribute('color', new THREE.Float32BufferAttribute( colors, 3));

        var pointmat = new THREE.PointsMaterial( { 
            vertexColors: THREE.VertexColors,
            opacity:0.99
        } );

        /*
        var spriteUrl = 'https://i.ibb.co/NsRgxZc/star.png';

        var textureLoader = new THREE.TextureLoader()
        textureLoader.crossOrigin = "Anonymous"
        var myTexture = textureLoader.load(spriteUrl);
        pointmat.map = myTexture;
        */
        this.points = new THREE.Points( geometry, pointmat );
        this.scene.add( this.points );

        var sunmat = new THREE.MeshBasicMaterial( {
            wireframe: false,
            color: 0xffe8c6
        } );
        
        var sunsphere = new THREE.SphereBufferGeometry( 0.5, 20, 20 );
        this.sunMesh = new THREE.Mesh( sunsphere, sunmat );

        this.sunMesh.position.set(5, 0, -10);

        this.scene.add( this.sunMesh );

        console.log(window.location.pathname);
        var texUrl = 'assets/textures/8k_earth_daymap.jpg'

        var textureLoader = new THREE.TextureLoader()
        //textureLoader.crossOrigin = "Anonymous"
        var globetex = textureLoader.load(texUrl);
        globetex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

        //var globebump = textureLoader.load('assets/textures/8k_earth_bump_map.tif');

        var globeemissive = textureLoader.load('assets/textures/8k_earth_nightmap.jpg')
        globeemissive.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

        var globemetal = textureLoader.load('assets/textures/8k_earth_specular_map.tif');
        globemetal.anisotropy = this.renderer.capabilities.getMaxAnisotropy();


        //material
        var globemat = new THREE.MeshStandardMaterial( {
            wireframe: false,
            color: 0xa1e3fe,
            roughness: 0.7,
            metalness: 1.0
        } );
        globemat.map = globetex;
        globemat.emissiveMap = globeemissive;
        globemat.emissive = color.set('yellow');
        globemat.emissiveIntensity = 0.5;
        //globemat.metalnessMap = globemetal;

        //globemat.bumpMap = globebump;
        //globemat.normalMap = globenormals;
        globemat.map.minFilter = THREE.LinearFilter;
        
        //sphere
        var earthsphere = new THREE.SphereBufferGeometry(2,500,500);
        this.sphereMesh = new THREE.Mesh( earthsphere, globemat );

        this.sphereMesh.castShadow = true;
        this.sphereMesh.receiveShadow = true;

        this.scene.add( this.sphereMesh );

        var cloudtexUrl = "assets/textures/clouds_8k.jpg";
        var cloudtex = textureLoader.load(cloudtexUrl);
        cloudtex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();

        var cloudmat = new THREE.MeshStandardMaterial( {
            transparent: true,
            map: cloudtex,
            alphaMap: cloudtex
        });
        //cloudmat.map.minFilter = THREE.LinearFilter;

        var cloudsphere = new THREE.SphereBufferGeometry(2.01,500,500);
        this.cloudMesh = new THREE.Mesh( cloudsphere, cloudmat );
        //this.cloudMesh.castShadow = true;
        this.cloudMesh.receiveShadow = true;

        this.scene.add(this.cloudMesh);

        var moontexUrl = "assets/textures/moon_4k.jpg";
        var moondispUrl = "assets/textures/moon_displace_4k.jpg"

        var moontex = textureLoader.load(moontexUrl);

        var moonmat = new THREE.MeshStandardMaterial({
            map: moontex,
            roughness: 1.0,
            metalness: 1.2
        });


        var moonSphere = new THREE.SphereBufferGeometry(1.0, 50, 50);
        this.moonMesh = new THREE.Mesh( moonSphere, moonmat );
        this.moonMesh.position.set(0, 0, -5);
        this.moonMesh.castShadow = true;
        this.moonMesh.receiveShadow = true;

        this.scene.add(this.moonMesh);

        this.pointLight = new THREE.PointLight(0xFFFFFF);
        this.pointLight.position.set( 0, 0, -8 );

        this.pointLight.castShadow = true;
        this.pointLight.intensity = 4;

        this.pointLight.shadow.mapSize.width = 4096;
        this.pointLight.shadow.mapSize.height = 4096;

        //this.pointLight.shadow.camera.fov = 360;

        //var sphere = new THREE.SphereBufferGeometry( 0.5, 20, 20 );
        //this.pointLight.add(new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ));

        this.scene.add( this.pointLight );

        this.redpointLight = new THREE.PointLight(0xff2c35);
        this.redpointLight.position.set( 0, 0, -8 );

        this.redpointLight.intensity = 1;

      
        //this.redpointLight.shadow.camera.fov = 360;

        //var sphere = new THREE.SphereBufferGeometry( 0.5, 20, 20 );
        //this.pointLight.add(new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ));

        this.scene.add( this.redpointLight );

        this.redpointLight2 = new THREE.PointLight(0xff2c35);
        this.redpointLight2.position.set( 0, 0, -8 );

        this.redpointLight2.intensity = 2;


        //this.redpointLight2.shadow.camera.fov = 360;

        this.scene.add( this.redpointLight2 );

        this.composer = new POSTPROCESSING.EffectComposer(this.renderer);
        this.renderPass = new POSTPROCESSING.RenderPass( this.scene, this.camera )
        
        this.composer.addPass( this.renderPass );

        this.godrayeffect = new POSTPROCESSING.GodRaysEffect(this.camera, this.sunMesh, {
            height: 720,
            kernelSize: POSTPROCESSING.KernelSize.SMALL,
            density: 3,
			decay: 0.92,
			weight: 0.5,
			exposure: 0.6,
			samples: 60,
            clampMax: 1.0
		});

        this.godrayeffect.dithering = true;

        this.godraypass = new POSTPROCESSING.EffectPass(this.camera, this.godrayeffect);
        this.composer.addPass(this.godraypass)

        this.bloomEffect = new POSTPROCESSING.BloomEffect({
            blendFunction: POSTPROCESSING.BlendFunction.SCREEN,
            kernelSize: POSTPROCESSING.KernelSize.SMALL,
            luminanceThreshold: 0.1,
            luminanceSmoothing: 0.5,
            opacity: 2,
            height: 480
        })

        this.bloompass = new POSTPROCESSING.EffectPass(this.camera, this.bloomEffect);
        this.composer.addPass(this.bloompass);

        this.renderPass.renderToScreen = false;
        this.godraypass.renderToScreen = false;
        this.bloompass.renderToScreen = true;

        this.sphereMesh.rotation.z -= 0.3;
        this.sphereMesh.rotation.y += 0.5;
        this.sphereMesh.rotation.x = Math.random();

        this.cloudMesh.rotation.y = Math.random() * 2;

        this.points.rotation.z += 1;
        this.camera.position.x = 1.5;
        this.camera.position.y = 0.5;
        this.camera.position.z = 2;

        this.camera.rotation.x = -0.3;
        this.camera.rotation.y = -0.2;
        this.camera.rotation.z = -0.2;

        this.begin = 0;
        this.ticks = 0;
        this.change = 0.00015; //Default
        this.threeAnim;
        this.threeWidth = window.innerWidth - 20;

        this.render();
    }

    destroyThreeApp = () => {
        cancelAnimationFrame(this.threeAnim);
        this.renderer.domElement.addEventListener('dblclick', null, false); //remove listener to render
        this.composer = null;
        this.scene = null;
        this.projector = null;
        this.camera = null;
        this.controls = null;

        this.sphereMesh = null;
        this.points = null;

        document.getElementById("threeContainer").remove();
    }

    onData(score) {
        this.change = score * 0.04;
    }

    render = () => {
        if(this.threeWidth != window.innerWidth - 20) {
            this.threeWidth = window.innerWidth - 20;
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.threeWidth, 435);
            this.composer.setSize(this.threeWidth, 435);
            this.camera.aspect = this.threeWidth / 435;
            this.camera.updateProjectionMatrix();
        }

        this.ticks -= this.change*1000;

        this.sphereMesh.rotation.y += this.change*0.25;
        this.cloudMesh.rotation.y = this.sphereMesh.rotation.y;
        this.points.rotation.y -= this.change;

        var theta = (this.ticks + 2900) * 0.001;
        this.pointLight.position.x = Math.sin(theta) * 40;
        //this.pointLight.position.y = Math.cos( time * 7 ) * 3;
        this.pointLight.position.z = Math.cos(theta) * 40;
        this.redpointLight.position.x = Math.sin(theta - 0.15) * 40;
        this.redpointLight.position.z = Math.cos(theta - 0.15) * 40;
        this.redpointLight2.position.x = Math.sin(theta + 0.15) * 40;
        this.redpointLight2.position.z = Math.cos(theta + 0.15) * 40;
        
        this.sunMesh.position.x = Math.sin(theta) * 40;
        this.sunMesh.position.z = Math.cos(theta) * 40;

        this.moonMesh.position.x = Math.sin(theta*1.05 + 0.83) * 30;
        this.moonMesh.position.z = Math.cos(theta*1.05 + 0.83) * 30;
        
        this.composer.render();
        this.threeAnim = requestAnimationFrame(this.render);

    }  
} 