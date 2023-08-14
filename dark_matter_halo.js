import * as three from '../js/three.js'
import * as OrbitControls from '../js/OrbitControls.js'
//SATURN'S RINGS
function createRings() {
    const ringTexture = new THREE.TextureLoader().load("../images/cosmos/2k_saturn_ring_alpha.png");
    const geometry = new THREE.RingBufferGeometry(3.5,6,224);
    const saturnTexture = new THREE.TextureLoader().load("../images/cosmos/2k_saturn.png");            
    const planetGeometry = new THREE.SphereGeometry(2.6,50,50);          

    const pos = geometry.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      geometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
    }        
    //ADDING Saturn and the Ring to the "INSTANCE"
    const ringMaterial = new THREE.MeshPhongMaterial({map: ringTexture,color: 0xffffff,side: THREE.DoubleSide,transparent: true});
    const ringMesh = new THREE.Mesh(geometry, ringMaterial);
    ringMesh.castShadow = true;
    ringMesh.receiveShadow = true;
    ringMesh.scale.set(16,16,16);
    //ringMesh.rotation.set(5.05,0,0);
    ringMesh.rotation.x = Math.PI * -.5;//ringMesh.rotation.y = .01;
    ringMesh.position.x = 1000;//SATURN'S RINGS POSITION
    const rings = new Rings();
    rings.add(ringMesh);
    
    const saturnMaterial = new THREE.MeshPhongMaterial({map: saturnTexture,color: 0xffffff}); 
    const saturnMesh = new THREE.Mesh(planetGeometry,saturnMaterial);
    saturnMesh.castShadow = true;
    saturnMesh.receiveShadow = true;
    saturnMesh.scale.set(17.28,16,16);//setX(1.08);
    saturnMesh.rotation.set(0,0,0);
    saturnMesh.rotation.y += .01;
    saturnMesh.position.x = 1000;//SATURN'S POSITION
    rings.add(saturnMesh);
    rings.start();
}
  
  //AdjustRingGeometry(geometry);
  function adjustRingGeometry(geo) {
    const two = 2 * Math.PI;
    const iVer = Math.max(2, geo.gridY);
    for (let i = 0; i < iVer + 1; i++) {
        const fRad1 = i / iVer,
            fRad2 = (i + 1) / iVer,
            fX1 = geo.innerRadius * Math.cos(fRad1 * two),
            fY1 = geo.innerRadius * Math.sin(fRad1 * two),
            fX2 = geo.outerRadius * Math.cos(fRad1 * two),
            fY2 = geo.outerRadius * Math.sin(fRad1 * two),
            fX3 = geo.outerRadius * Math.cos(fRad2 * two),
            fY3 = geo.outerRadius * Math.sin(fRad2 * two),
            fX4 = geo.innerRadius * Math.cos(fRad2 * two),
            fY4 = geo.innerRadius * Math.sin(fRad2 * two),
            v1 = new THREE.Vector3(fX1, fY1, 0),
            v2 = new THREE.Vector3(fX2, fY2, 0),
            v3 = new THREE.Vector3(fX3, fY3, 0),
            v4 = new THREE.Vector3(fX4, fY4, 0);
        geo.vertices.push(new THREE.Vertex(v1));
        geo.vertices.push(new THREE.Vertex(v2));
        geo.vertices.push(new THREE.Vertex(v3));
        geo.vertices.push(new THREE.Vertex(v4));
    }
    for (let i = 0; i < iVer + 1; i++) {
        geo.faces.push(new THREE.Face3(i * 4, i * 4 + 1, i * 4 + 2));
        geo.faces.push(new THREE.Face3(i * 4, i * 4 + 2, i * 4 + 3));
        geo.faceVertexUvs[0].push([
            new THREE.UV(0, 1),
            new THREE.UV(1, 1),
            new THREE.UV(1, 0)
        ]);
        geo.faceVertexUvs[0].push([
            new THREE.UV(0, 1),
            new THREE.UV(1, 0),
            new THREE.UV(0, 0)
        ]);
    }
    geo.computeFaceNormals();
    geo.boundingSphere = {radius: geo.outerRadius};
  }
  //CONSTRUCTOR Function for all objects in SOLAR SYSTEM
  class Rings {
    constructor() {
        this._scene = new THREE.Scene();
        //RENDERER
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCSoftShadowMap;
        this._renderer = renderer;
        //LIGHTING
        const ambientLight = new THREE.AmbientLight(0xffffff,1.15,1000);
        this._scene.add(ambientLight);
        
        //CAMERA
        const camera = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,750000);
        camera.lookAt(0,0,0);
        camera.position.set(30,75,150);
        this._camera = camera;
        
        //CONTROLS
        const controls = new THREE.OrbitControls(camera,renderer.domElement);
        //controls.update();
        controls.minDistance = 150;
        controls.maxDistance = 275000;//350000
        controls.zoomSpeed = .075;
        controls.maxAzimuthAngle = Math.PI / 5;
        controls.minAzimuthAngle = Math.PI / -5;
        controls.maxPolarAngle = Math.PI / 1.5;
        controls.minPolarAngle = Math.PI / 2.4;        
        //controls.enableRotate = true;
        

        this._group = new THREE.Group();
        this._scene.add(this._group);
        document.getElementById("webgl_canvas_dark_matter_halo").appendChild(renderer.domElement);
        this._animate = this._animate.bind(this);

        this._cmbGroup = new THREE.Group();
        this._group.add(this._cmbGroup);

        this._domeGroup = new THREE.Group();
        this._group.add(this._domeGroup);

        this._spiralGroup = new THREE.Group();
        this._group.add(this._spiralGroup);

        this._milkyWayGroup = new THREE.Group();
        this._group.add(this._milkyWayGroup);

        this._sunGroup = new THREE.Group();
        this._group.add(this._sunGroup);

        this._mercuryGroup = new THREE.Group();
        this._group.add(this._mercuryGroup);

        this._venusGroup = new THREE.Group();
        this._scene.add(this._venusGroup);
        
        this._earthGroup = new THREE.Group();

        this._cloudGroup = new THREE.Group();
        this._earthGroup.add(this._cloudGroup);
                
        this._moonGroup = new THREE.Group();
        this._earthGroup.add(this._moonGroup);

        this._marsGroup = new THREE.Group();
        this._group.add(this._marsGroup);

        this._jupiterGroup = new THREE.Group();
        this._group.add(this._jupiterGroup);

        this._ioGroup = new THREE.Group();
        this._group.add(this._ioGroup);

        this._europaGroup = new THREE.Group();
        this._group.add(this._europaGroup);

        this._ganymedeGroup = new THREE.Group();
        this._group.add(this._ganymedeGroup);

        this._callistoGroup = new THREE.Group();
        this._group.add(this._callistoGroup);

        this._saturnGroup = new THREE.Group();
        this._group.add(this._saturnGroup);

        this._uranusGroup = new THREE.Group();
        this._group.add(this._uranusGroup);

        this._neptuneGroup = new THREE.Group();
        this._group.add(this._neptuneGroup);
        
        const loader = new THREE.TextureLoader();
        const geometry = new THREE.SphereBufferGeometry(1,40,40);
        
        //UNIVERSE
        //CMB
        const cmbTexture = new THREE.MeshLambertMaterial({map: loader.load('../images/cosmos/esa_planck_cmb2018_3000_1500.png')
            ,side: THREE.BackSide
            ,transparent: true
            ,opacity: .075});
        const cmb = new THREE.Mesh(geometry,cmbTexture);
        cmb.scale.set(350000,350000,350000);
        this._cmbGroup.add(cmb);

        //MILKY WAY GALAXY
        //DOME
        const outerGeo = new THREE.SphereBufferGeometry(120000,25,15,0/*,Math.PI,0,Math.PI*/);
        const innerGeo = new THREE.SphereBufferGeometry(100000,25,15,0/*,Math.PI,0,Math.PI*/);
        const domeMaterial = new THREE.MeshBasicMaterial({color: "green", side: THREE.DoubleSide, wireframe: true});
        const dome = new THREE.Mesh(outerGeo,domeMaterial);
        dome.position.set(1750,35000,35000);
        this._domeGroup.add(dome);
        /*const dome2 = new THREE.Mesh(innerGeo,domeMaterial);
        dome.add(dome2);*/
        this._dome = dome; 
        dome.rotation.x = Math.PI * .5;//DOME CODE ENDS
                
        //OUTSIDE
        const spiralGalaxyGeo = new THREE.CircleBufferGeometry(100000,50,50);
        const spiralGalaxyTexture = new THREE.MeshPhongMaterial({map: loader.load("../images/cosmos/the_milky_way1920.svg"),side: THREE.DoubleSide});
        const spiralGalaxy = new THREE.Mesh(spiralGalaxyGeo,spiralGalaxyTexture);
        spiralGalaxy.position.set(1750,35000,35000);
        this._spiralGroup.add(spiralGalaxy);
        this._spiral = spiralGalaxy;

        const hZoneGeo2 = new THREE.RingBufferGeometry(23000,33000,50);
        const hZoneMaterial2 = new THREE.MeshPhongMaterial({color: "green"
                            ,transparent: true
                            ,opacity: .3});
        const hZoneGalactic = new THREE.Mesh(hZoneGeo2,hZoneMaterial2);
        hZoneGalactic.position.set(1750,35000,35000);
        //hZoneSS.rotation.x = Math.PI * -.5;
        this._scene.add(hZoneGalactic);

        /*const hZoneGalactic = new THREE.Mesh(hZoneGeo,hZoneMaterial);
        hZoneGalactic.scale.set(50000);
        scene.add(hZoneGalactic);*/


        //INSIDE
        const milkyWayTexture = new THREE.MeshLambertMaterial({map: loader.load('../images/cosmos/2k_stars_milky_way.jpg')});
        milkyWayTexture.side = THREE.BackSide;
        const milkyWay = new THREE.Mesh(geometry,milkyWayTexture);
        milkyWay.scale.set(10000,10000,10000);
        milkyWay.rotation.x = -1.8;
        milkyWay.rotation.y = 2.6;
        this._milkyWayGroup.add(milkyWay);
        
        //GALACTIC STARS
        const sphereGroup = new THREE.Group();
        for (let j=0; j<4000;j++ ){
            let sphGeom = new THREE.SphereBufferGeometry(12.5,16,16); 
            let sphMat = new THREE.MeshBasicMaterial({color: "rgb(214,245,249)"});
            let sph = new THREE.Mesh(sphGeom, sphMat);
            let sphPos = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(6500 + Math.random() * 15000);//4250...//450 This figure made the star placement vary on the circumference
            sph.position.copy(sphPos);
            sphereGroup.add(sph);
            this._scene.add(sphereGroup);  
        }

        //SOLAR SYSTEM
        
        //SUN
        const sunTexture = new THREE.MeshPhongMaterial({map: loader.load("../images/cosmos/sun.png")/*, transparent: true, opacity: .95*/}); 
        const sun = new THREE.Mesh(geometry,sunTexture);
        sun.scale.set(19,19,19);//(8,8,8)
        this._sunGroup.add(sun);
        this._sun = sun;
        // Create the glow of the sun.
        const spriteMaterial = new THREE.SpriteMaterial(
            {
                map: loader.load("../images/cosmos/lensflare_alpha.png")
                , color: 0xffffff
                //, transparent: false
                //, opacity: .3
                , blending: THREE.AdditiveBlending
            });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(8,8,1);
        sun.add(sprite); // This centers the glow at the sun.
        sprite.position.set(0,0,0,);

        const mercuryTexture = new THREE.MeshPhongMaterial({map: loader.load("../images/cosmos/2k_mercury.jpg")}); 
        const mercury = new THREE.Mesh(geometry,mercuryTexture);
        mercury.position.set(34,0,0);
        mercury.scale.set(3.9,3.9,3.9);
        this._mercuryGroup.add(mercury);
        this._mercury = mercury;
        
        const venusTexture = new THREE.MeshPhongMaterial({map: loader.load("../images/cosmos/2k_venus.jpg")}); 
        const venus = new THREE.Mesh(geometry,venusTexture);
        venus.position.set(62,0,0);
        venus.scale.set(7.5,7.5,7.5);
        this._venusGroup.add(venus);
        this._venus = venus;

        const atmosphereVertexShader = `
        varying vec3 vertexNormal;

        void main(){
            vertexNormal = normalize(normalMatrix * normal);//We must NORMALIZE our 'normal'. This translates the values into a range of 0 to 1.
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`
        const atmosphereFragmentShader = `
        varying vec3 vertexNormal;
        void main() {
            float intensity = pow(0.7 - dot(vertexNormal, vec3(0,0,1.0)),2.0);
            gl_FragColor = vec4(0.3,0.6,1.0,1.0) * intensity;
        }
        `

        const vertexShader = `
        varying vec2 vertexUv;
        varying vec3 vertexNormal;

        void main(){
            vertexUv = uv;
            vertexNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`

        const fragmentShader = `
        uniform sampler2D earthTexture; 

        varying vec2 vertexUv; //[0, 0.24]
        varying vec3 vertexNormal;//Anytime you want to DECLARE vertex data to the fShader I need to declare a 'varying' variable FIRST!
                                    //The 'varying' ALSO means the pixels being manipulated are on the edges and not in the MIDDLE

        void main(){
            float intensity = 1.05 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));//This is the CODE for the ATMOSPHERIC EFFECT
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 1.5);//This is the CODE for the ATMOSPHERIC EFFECT
                                    //The Colour    * the Intensity
            gl_FragColor = /*texture2D(earthTexture,vertexUv);*/
                vec4(atmosphere + texture2D(earthTexture, vertexUv).xyz, 1.0);//THEN we replace vec3 with the 'atmosphere' variable       
        }
        `

        //EARTH
        const earth = new THREE.Mesh(geometry,
            new THREE.ShaderMaterial({
                vertexShader: vertexShader,//In new ES6 we can remove the value if = key --> 'vShader,'
                fragmentShader: fragmentShader,
                uniforms: {//THIS object is HOW we pass our texture into our shader!
                    earthTexture: {
                        value: new THREE.TextureLoader().load("../images/cosmos/2k_earth_daymap.png")
                    }      
                }
            })
        );
        earth.position.set(92,0,0);
        earth.rotation.x = -.4;
        earth.scale.set(8,8,8);
        this._earthGroup.add(earth)
        this._scene.add(this._earthGroup);
        this._earth = earth;

        const hZoneGeo = new THREE.RingBufferGeometry(80,104,50);
        const hZoneMaterial = new THREE.MeshPhongMaterial({color: "green"
                            , wireframe: true});
        const hZoneSS = new THREE.Mesh(hZoneGeo,hZoneMaterial);
        hZoneSS.rotation.x = Math.PI * -.5;
        this._scene.add(hZoneSS);
        
        const atmosphere = new THREE.Mesh(geometry,
            new THREE.ShaderMaterial({
                vertexShader: atmosphereVertexShader,//In new ES6 we can remove the value if = key --> 'vShader,'
                fragmentShader: atmosphereFragmentShader,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide        
            })
        );
        atmosphere.scale.set(1.12,1.12,1.12);
        earth.add(atmosphere);
        this._earth.add(atmosphere);

        const cloudTexture = new THREE.MeshPhongMaterial({
            map        : loader.load('../images/cosmos/2k_earth_clouds.png'),
            side       : THREE.DoubleSide,
            transparent: true,
            opacity    : .5,
            depthWrite : false});
        const cloudGroup = new THREE.Group();
        const clouds = new THREE.Mesh(geometry,cloudTexture);
        clouds.position.set(0,0,0);
        clouds.scale.set(1.035,1.035,1.035);
        this._cloudGroup.add(clouds);
        this._earth.add(this._cloudGroup);
        
        const moonTexture = new THREE.MeshPhongMaterial({map: loader.load("../images/cosmos/2k_moon.jpg")}); 
        const moon = new THREE.Mesh(geometry,moonTexture);
        moon.position.set(1.85,0,0);
        moon.scale.set(.25,.25,.25);
        this._moonGroup.add(moon);
        this._earth.add(this._moonGroup);

        //EARTH taken care of ABOVE

        const marsTexture = new THREE.MeshPhongMaterial({map: loader.load("../images/cosmos/2k_mars.jpg")}); 
        const mars = new THREE.Mesh(geometry,marsTexture);
        mars.rotation.x = .4;
        mars.position.set(-127,0,0);
        mars.scale.set(5.5,5.5,5.5);
        this._marsGroup.add(mars);
        this._mars = mars;

        const jupiterTexture = new THREE.MeshPhongMaterial({map: loader.load("../images/cosmos/2k_jupiter.jpg")}); 
        const jupiter = new THREE.Mesh(geometry,jupiterTexture);
        jupiter.position.set(550,0,0);
        jupiter.scale.set(18,18,18);
        this._jupiterGroup.add(jupiter);
        this._jupiter = jupiter;
        //Io
        const ioTexture = new THREE.MeshBasicMaterial({map: loader.load('../images/cosmos/2k_ceres_fictional.jpg')});
        const ioGroup = new THREE.Group();
        const io = new THREE.Mesh(geometry,ioTexture);
        io.position.set(1.75,0,0);
        io.scale.set(.125,.125,.125);
        this._ioGroup.add(io);
        this._jupiter.add(this._ioGroup);
        //Europa
        const europaTexture = new THREE.MeshBasicMaterial({map: loader.load('../images/cosmos/2k_eris_fictional.jpg')});
        const europaGroup = new THREE.Group();
        const europa = new THREE.Mesh(geometry,europaTexture);
        europa.position.set(-2.5,0,0);
        europa.scale.set(.15,.15,.15);
        this._europaGroup.add(europa);
        this._jupiter.add(this._europaGroup);
        //Ganymede
        const ganymedeTexture = new THREE.MeshBasicMaterial({map: loader.load('../images/cosmos/2k_makemake_fictional.jpg')});       
        const ganymedeGroup = new THREE.Group();
        const ganymede = new THREE.Mesh(geometry,ganymedeTexture);
        ganymede.position.set(-3.75,0,0);
        ganymede.scale.set(.1,.1,.1);
        this._ganymedeGroup.add(ganymede);
        this._jupiter.add(this._ganymedeGroup);
        //Callisto
        const callistoTexture = new THREE.MeshBasicMaterial({map: loader.load('../images/cosmos/2k_ceres_fictional.jpg')});
        const callistoGroup = new THREE.Group();
        const callisto = new THREE.Mesh(geometry,callistoTexture);
        callisto.position.set(4.5,0,0);
        callisto.scale.set(.125,.125,.125);
        this._callistoGroup.add(callisto);
        this._jupiter.add(this._callistoGroup);

        const uranusTexture = new THREE.MeshPhongMaterial({map: loader.load("../images/cosmos/2k_uranus.jpg")}); 
        const uranus = new THREE.Mesh(geometry,uranusTexture);
        uranus.position.set(2000,0,0);
        uranus.scale.set(10,10,10);
        this._uranusGroup.add(uranus);
        this._uranus = uranus;

        const neptuneTexture = new THREE.MeshPhongMaterial({map: loader.load("../images/cosmos/2k_neptune.jpg")}); 
        const neptune = new THREE.Mesh(geometry,neptuneTexture);
        neptune.position.set(-3000,-1.5,0);
        neptune.scale.set(9,9,9);
        this._neptuneGroup.add(neptune);
        this._neptune = neptune;


        //MATERIALS
    const asteroidTexture = new THREE.MeshPhongMaterial({map: loader.load('../images/cosmos/2k_ceres_fictional.jpg')});
    //GEOMETRY
    const asteroidGeometry = new THREE.SphereGeometry(1.2,4.2,7.2);

    //MESHES - TEMPLATE  
    // POSITIVE - POSITIVE [+X,+Z]

                                                        // FASTER INNER ORBITING ++
    const asteroidInnerGroup1 = new THREE.Group();
    const asteroidInnerMesh1 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh1,asteroidInnerGroup1,145,0,130,.25);

    const asteroidInnerGroup2 = new THREE.Group();
    const asteroidInnerMesh2 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh2,asteroidInnerGroup2,142,0,140,.37);

    const asteroidInnerGroup3 = new THREE.Group();
    const asteroidInnerMesh3 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh3,asteroidInnerGroup3,171,.51,73,.4);

    const asteroidInnerGroup4 = new THREE.Group();
    const asteroidInnerMesh4 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh4,asteroidInnerGroup4,44,0,160,.28);

    const asteroidInnerGroup5 = new THREE.Group();
    const asteroidInnerMesh5 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh5,asteroidInnerGroup5,168,-.71,75,.27);

    const asteroidInnerGroup6 = new THREE.Group();
    const asteroidInnerMesh6 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh6,asteroidInnerGroup6,118,.2,155,.32);

    const asteroidInnerGroup7 = new THREE.Group();
    const asteroidInnerMesh7 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh7,asteroidInnerGroup7,165,0,77,.61);
        
    const asteroidInnerGroup8 = new THREE.Group();
    const asteroidInnerMesh8 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh8,asteroidInnerGroup8,103,.2,165,.27);

    const asteroidInnerGroup9 = new THREE.Group();
    const asteroidInnerMesh9 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh9,asteroidInnerGroup9,98,.2,170,.27);

    const asteroidInnerGroup10 = new THREE.Group();
    const asteroidInnerMesh10 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh10,asteroidInnerGroup10,90,0,175,.3);

    const asteroidInnerGroup11 = new THREE.Group();
    const asteroidInnerMesh11 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh11,asteroidInnerGroup11,78,0,164,.72);

    const asteroidInnerGroup12 = new THREE.Group();
    const asteroidInnerMesh12 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh12,asteroidInnerGroup12,78,0,180,1);

    const asteroidInnerGroup13 = new THREE.Group();
    const asteroidInnerMesh13 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh13,asteroidInnerGroup13,108,.31,125,.64);

    const asteroidInnerGroup14 = new THREE.Group();
    const asteroidInnerMesh14 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh14,asteroidInnerGroup14,132,0,100,.75);

    const asteroidInnerGroup15 = new THREE.Group();
    const asteroidInnerMesh15 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh15,asteroidInnerGroup15,155,0,104,.7);

    const asteroidInnerGroup16 = new THREE.Group();
    const asteroidInnerMesh16 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh16,asteroidInnerGroup16,105,0,167,.43);

    const asteroidInnerGroup17 = new THREE.Group();
    const asteroidInnerMesh17 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh17,asteroidInnerGroup17,154,0,79,.7);

    const asteroidInnerGroup18 = new THREE.Group();
    const asteroidInnerMesh18 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh18,asteroidInnerGroup18,175,.31,95,.37);

    const asteroidInnerGroup19 = new THREE.Group();
    const asteroidInnerMesh19 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh19,asteroidInnerGroup19,95,0,154,.9);

    const asteroidInnerGroup20 = new THREE.Group();
    const asteroidInnerMesh20 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh20,asteroidInnerGroup20,124,0,118,.8);

    const asteroidInnerGroup21 = new THREE.Group();
    const asteroidInnerMesh21 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh21,asteroidInnerGroup21,150,0,132,.73);

    const asteroidInnerGroup22 = new THREE.Group();
    const asteroidInnerMesh22 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh22,asteroidInnerGroup22,70,0,175,.33);

    const asteroidInnerGroup23 = new THREE.Group();
    const asteroidInnerMesh23 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh23,asteroidInnerGroup23,164,.31,17,.7);

    const asteroidInnerGroup24 = new THREE.Group();
    const asteroidInnerMesh24 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh24,asteroidInnerGroup24,172,-.31,95,.37);

    const asteroidInnerGroup25 = new THREE.Group();
    const asteroidInnerMesh25 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh25,asteroidInnerGroup25,110.6,0,140,.3);

    const asteroidInnerGroup26 = new THREE.Group();
    const asteroidInnerMesh26 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh26,asteroidInnerGroup26,157,0,112,.71);

    const asteroidInnerGroup27 = new THREE.Group();
    const asteroidInnerMesh27 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh27,asteroidInnerGroup27,165,0,105,.5);

    const asteroidInnerGroup28 = new THREE.Group();
    const asteroidInnerMesh28 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh28,asteroidInnerGroup28,125,0,148,.43);

    const asteroidInnerGroup29 = new THREE.Group();
    const asteroidInnerMesh29 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh29,asteroidInnerGroup29,162,.2,103,.32);        

    const asteroidInnerGroup30 = new THREE.Group();
    const asteroidInnerMesh30 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh30,asteroidInnerGroup30,177,-.41,92,.37);

    const asteroidInnerGroup31 = new THREE.Group();
    const asteroidInnerMesh31 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh31,asteroidInnerGroup31,142,0,122,.52);

    const asteroidInnerGroup32 = new THREE.Group();
    const asteroidInnerMesh32 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh32,asteroidInnerGroup32,165,.2,108,.5);

    const asteroidInnerGroup33 = new THREE.Group();
    const asteroidInnerMesh33 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh33,asteroidInnerGroup33,146,-.21,125,.7);

    const asteroidInnerGroup34 = new THREE.Group();
    const asteroidInnerMesh34 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh34,asteroidInnerGroup34,152,.37,98,.45);

    const asteroidInnerGroup35 = new THREE.Group();
    const asteroidInnerMesh35 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh35,asteroidInnerGroup35,141,-.31,115,.37);

    const asteroidInnerGroup36 = new THREE.Group();
    const asteroidInnerMesh36 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh36,asteroidInnerGroup36,70.6,0,158.6,.73);////reference71

    const asteroidInnerGroup37 = new THREE.Group();
    const asteroidInnerMesh37 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh37,asteroidInnerGroup37,130.7,0,142,.63);

    const asteroidInnerGroup38 = new THREE.Group();
    const asteroidInnerMesh38 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh38,asteroidInnerGroup38,84,0,165.7,.73);

    const asteroidInnerGroup39 = new THREE.Group();
    const asteroidInnerMesh39 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh39,asteroidInnerGroup39,64,0,170,.5);

    const asteroidInnerGroup40 = new THREE.Group();
    const asteroidInnerMesh40 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh40,asteroidInnerGroup40,145,-.7,48,.5);
        
    const asteroidInnerGroup41 = new THREE.Group();
    const asteroidInnerMesh41 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh41,asteroidInnerGroup41,163,0,90,.47);

    const asteroidInnerGroup42 = new THREE.Group();
    const asteroidInnerMesh42 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh42,asteroidInnerGroup42,110,.4,150,.6);

    const asteroidInnerGroup43 = new THREE.Group();
    const asteroidInnerMesh43 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh43,asteroidInnerGroup43,172,.61,93,.2);

    const asteroidInnerGroup44 = new THREE.Group();
    const asteroidInnerMesh44 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh44,asteroidInnerGroup44,113,.32,162,.7);

    const asteroidInnerGroup45 = new THREE.Group();
    const asteroidInnerMesh45 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh45,asteroidInnerGroup45,88,0,168,.9);

    const asteroidInnerGroup46 = new THREE.Group();
    const asteroidInnerMesh46 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh46,asteroidInnerGroup46,165,.51,99,.19);

    const asteroidInnerGroup47 = new THREE.Group();
    const asteroidInnerMesh47 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh47,asteroidInnerGroup47,166,-.6,85,.37);

    const asteroidInnerGroup48 = new THREE.Group();
    const asteroidInnerMesh48 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh48,asteroidInnerGroup48,168,-.51,96,.27);
        
    const asteroidInnerGroup49 = new THREE.Group();
    const asteroidInnerMesh49 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh49,asteroidInnerGroup49,88,0,150,.57);

    const asteroidInnerGroup50 = new THREE.Group();
    const asteroidInnerMesh50 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh50,asteroidInnerGroup50,68,0,155,.63);

    const asteroidInnerGroup51 = new THREE.Group();
    const asteroidInnerMesh51 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh51,asteroidInnerGroup51,100,0,140,.63);

    const asteroidInnerGroup52 = new THREE.Group();
    const asteroidInnerMesh52 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh52,asteroidInnerGroup52,163,0,82,.5);

    const asteroidInnerGroup53 = new THREE.Group();
    const asteroidInnerMesh53 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh53,asteroidInnerGroup53,168,.6,102,.17);

    const asteroidInnerGroup54 = new THREE.Group();
    const asteroidInnerMesh54 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh54,asteroidInnerGroup54,166,.6,74,.27);

    const asteroidInnerGroup55 = new THREE.Group();
    const asteroidInnerMesh55 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh55,asteroidInnerGroup55,151,0,114,.63);

    const asteroidInnerGroup56 = new THREE.Group();
    const asteroidInnerMesh56 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh56,asteroidInnerGroup56,177,0,29,1);

    const asteroidInnerGroup57 = new THREE.Group();
    const asteroidInnerMesh57 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh57,asteroidInnerGroup57,31,-.7,177,.5);
        
    const asteroidInnerGroup58 = new THREE.Group();
    const asteroidInnerMesh58 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh58,asteroidInnerGroup58,163,-.6,98,.47);

    const asteroidInnerGroup59 = new THREE.Group();
    const asteroidInnerMesh59 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh59,asteroidInnerGroup59,178,.6,79,.7);

    const asteroidInnerGroup60 = new THREE.Group();
    const asteroidInnerMesh60 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh60,asteroidInnerGroup60,149,.3,120,.7);

    const asteroidInnerGroup61 = new THREE.Group();
    const asteroidInnerMesh61 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh61,asteroidInnerGroup61,166,.31,100,.38);

    const asteroidInnerGroup62 = new THREE.Group();
    const asteroidInnerMesh62 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh62,asteroidInnerGroup62,145,0,111.7,.3);

    const asteroidInnerGroup63 = new THREE.Group();
    const asteroidInnerMesh63 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh63,asteroidInnerGroup63,168,.37,88,.27);

    const asteroidInnerGroup64 = new THREE.Group();
    const asteroidInnerMesh64 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh64,asteroidInnerGroup64,150,0,104.5,.53);

    const asteroidInnerGroup65 = new THREE.Group();
    const asteroidInnerMesh65 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh65,asteroidInnerGroup65,169,.5,106,.37);

    const asteroidInnerGroup66 = new THREE.Group();
    const asteroidInnerMesh66 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh66,asteroidInnerGroup66,157,-.6,56,.8);

    const asteroidInnerGroup67 = new THREE.Group();
    const asteroidInnerMesh67 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh67,asteroidInnerGroup67,144,0,95,.28);
        
    const asteroidInnerGroup68 = new THREE.Group();
    const asteroidInnerMesh68 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh68,asteroidInnerGroup68,152,0,124,.37);

    const asteroidInnerGroup69 = new THREE.Group();
    const asteroidInnerMesh69 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh69,asteroidInnerGroup69,172,.49,88,.37);

    const asteroidInnerGroup70 = new THREE.Group();
    const asteroidInnerMesh70 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh70,asteroidInnerGroup70,56,.4,178,.7);

    const asteroidInnerGroup71 = new THREE.Group();
    const asteroidInnerMesh71 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh71,asteroidInnerGroup71,177,.4,86,.37);

    const asteroidInnerGroup72 = new THREE.Group();
    const asteroidInnerMesh72 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh72,asteroidInnerGroup72,154,.32,118,.38);

    const asteroidInnerGroup73 = new THREE.Group();
    const asteroidInnerMesh73 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh73,asteroidInnerGroup73,169,.38,98,.27);

    const asteroidInnerGroup74 = new THREE.Group();
    const asteroidInnerMesh74 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh74,asteroidInnerGroup74,168,0,104,.3);

    const asteroidInnerGroup75 = new THREE.Group();
    const asteroidInnerMesh75 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh75,asteroidInnerGroup75,91,0,165,.45);

    const asteroidInnerGroup76 = new THREE.Group();
    const asteroidInnerMesh76 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh76,asteroidInnerGroup76,160,0,94,.32);

    const asteroidInnerGroup77 = new THREE.Group();
    const asteroidInnerMesh77 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh77,asteroidInnerGroup77,185,.6,31,.616);

    const asteroidInnerGroup78 = new THREE.Group();
    const asteroidInnerMesh78 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh78,asteroidInnerGroup78,176,.51,44,.819);
        
    const asteroidInnerGroup79 = new THREE.Group();
    const asteroidInnerMesh79 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh79,asteroidInnerGroup79,170,-.6,62,.647);

    const asteroidInnerGroup80 = new THREE.Group();
    const asteroidInnerMesh80 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh80,asteroidInnerGroup80,180,.37,68,.6);

    const asteroidInnerGroup81 = new THREE.Group();
    const asteroidInnerMesh81 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh81,asteroidInnerGroup81,156,0,88,1);

    const asteroidInnerGroup82 = new THREE.Group();
    const asteroidInnerMesh82 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh82,asteroidInnerGroup82,165,0,94,.35);

    const asteroidInnerGroup83 = new THREE.Group();
    const asteroidInnerMesh83 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh83,asteroidInnerGroup83,178,0,88,1);

    const asteroidInnerGroup84 = new THREE.Group();
    const asteroidInnerMesh84 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh84,asteroidInnerGroup84,166,0,112,.37);

    const asteroidInnerGroup85 = new THREE.Group();
    const asteroidInnerMesh85 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh85,asteroidInnerGroup85,40,.21,172,.5);

    const asteroidInnerGroup86 = new THREE.Group();
    const asteroidInnerMesh86 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh86,asteroidInnerGroup86,116,0,142.7,.73);

    const asteroidInnerGroup87 = new THREE.Group();
    const asteroidInnerMesh87 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh87,asteroidInnerGroup87,80,0,174.5,.3);

    const asteroidInnerGroup88 = new THREE.Group();
    const asteroidInnerMesh88 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh88,asteroidInnerGroup88,71,0,170.5,.3);

    const asteroidInnerGroup89 = new THREE.Group();
    const asteroidInnerMesh89 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh89,asteroidInnerGroup89,62,0,185.56,.3);

    const asteroidInnerGroup90 = new THREE.Group();
    const asteroidInnerMesh90 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh90,asteroidInnerGroup90,62,0,190,.73);

    const asteroidInnerGroup91 = new THREE.Group();
    const asteroidInnerMesh91 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh91,asteroidInnerGroup91,54,0,192,.37);

    const asteroidInnerGroup92 = new THREE.Group();
    const asteroidInnerMesh92 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh92,asteroidInnerGroup92,54,-.21,188,.47);

    const asteroidInnerGroup93 = new THREE.Group();
    const asteroidInnerMesh93 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh93,asteroidInnerGroup93,52,0,182,.52);

    const asteroidInnerGroup94 = new THREE.Group();
    const asteroidInnerMesh94 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh94,asteroidInnerGroup94,52,0,190,.75);

    const asteroidInnerGroup95 = new THREE.Group();
    const asteroidInnerMesh95 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh95,asteroidInnerGroup95,50,.3,191,.27);

    const asteroidInnerGroup96 = new THREE.Group();
    const asteroidInnerMesh96 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh96,asteroidInnerGroup96,50,.5,181.8,.27);

    const asteroidInnerGroup97 = new THREE.Group();
    const asteroidInnerMesh97 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh97,asteroidInnerGroup97,48,.32,194,.38);  

    const asteroidInnerGroup98 = new THREE.Group();
    const asteroidInnerMesh98 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh98,asteroidInnerGroup98,45,.42,188,.41);

    const asteroidInnerGroup99 = new THREE.Group();
    const asteroidInnerMesh99 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh99,asteroidInnerGroup99,45,-.31,181,.37);

    const asteroidInnerGroup100 = new THREE.Group();
    const asteroidInnerMesh100 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh100,asteroidInnerGroup100,44,0,191,.63);

    const asteroidInnerGroup101 = new THREE.Group();
    const asteroidInnerMesh101 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh101,asteroidInnerGroup101,40,-.4,188,.47);

    const asteroidInnerGroup102 = new THREE.Group();
    const asteroidInnerMesh102 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh102,asteroidInnerGroup102,38,.4,196,.47);

    const asteroidInnerGroup103 = new THREE.Group();
    const asteroidInnerMesh103 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh103,asteroidInnerGroup103,38,0,180.27,.3);

    const asteroidInnerGroup104 = new THREE.Group();
    const asteroidInnerMesh104 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh104,asteroidInnerGroup104,34,0,195,.7);

    const asteroidInnerGroup105 = new THREE.Group();
    const asteroidInnerMesh105 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh105,asteroidInnerGroup105,33,.31,195,.17);

    const asteroidInnerGroup106 = new THREE.Group();
    const asteroidInnerMesh106 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh106,asteroidInnerGroup106,29,.41,198,.37);

    const asteroidInnerGroup107 = new THREE.Group();
    const asteroidInnerMesh107 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh107,asteroidInnerGroup107,27,0,189,.7);

    const asteroidInnerGroup108 = new THREE.Group();
    const asteroidInnerMesh108 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh108,asteroidInnerGroup108,25,0,184,.28);

    const asteroidInnerGroup109 = new THREE.Group();
    const asteroidInnerMesh109 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh109,asteroidInnerGroup109,18,.51,188,.51);

    const asteroidInnerGroup110 = new THREE.Group();
    const asteroidInnerMesh110 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh110,asteroidInnerGroup110,17,-.31,196,.45);

    const asteroidInnerGroup111 = new THREE.Group();
    const asteroidInnerMesh111 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh111,asteroidInnerGroup111,9,0,194,.7);

    const asteroidInnerGroup112 = new THREE.Group();
    const asteroidInnerMesh112 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh112,asteroidInnerGroup112,6,0,185,.83);

    const asteroidInnerGroup113 = new THREE.Group();
    const asteroidInnerMesh113 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh113,asteroidInnerGroup113,100,0,165.8,.13);

    const asteroidInnerGroup114 = new THREE.Group();
    const asteroidInnerMesh114 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh114,asteroidInnerGroup114,102,0,156.5,.53);

    const asteroidInnerGroup115 = new THREE.Group();
    const asteroidInnerMesh115 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh115,asteroidInnerGroup115,105,.32,146,.7);

    const asteroidInnerGroup116 = new THREE.Group();
    const asteroidInnerMesh116 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh116,asteroidInnerGroup116,105,0,170.3,.43);

    const asteroidInnerGroup117 = new THREE.Group();
    const asteroidInnerMesh117 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh117,asteroidInnerGroup117,110,.4,138,.47);

    const asteroidInnerGroup118 = new THREE.Group();
    const asteroidInnerMesh118 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh118,asteroidInnerGroup118,146,0,106.,.27);

    const asteroidInnerGroup119 = new THREE.Group();
    const asteroidInnerMesh119 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh119,asteroidInnerGroup119,182,0,52,.52);

    const asteroidInnerGroup120 = new THREE.Group();
    const asteroidInnerMesh120 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh120,asteroidInnerGroup120,182,.2,78,.27);

    const asteroidInnerGroup121 = new THREE.Group();
    const asteroidInnerMesh121 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh121,asteroidInnerGroup121,181,-.31,45,.37);

    const asteroidInnerGroup122 = new THREE.Group();
    const asteroidInnerMesh122 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh122,asteroidInnerGroup122,184,0,25,.28);

    const asteroidInnerGroup123 = new THREE.Group();
    const asteroidInnerMesh123 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh123,asteroidInnerGroup123,185,-.7,43,.27);

    const asteroidInnerGroup124 = new THREE.Group();
    const asteroidInnerMesh124 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh124,asteroidInnerGroup124,185,0,41.7,.3);

    const asteroidInnerGroup125 = new THREE.Group();
    const asteroidInnerMesh125 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh125,asteroidInnerGroup125,186,0,36.5,.27);

    const asteroidInnerGroup126 = new THREE.Group();
    const asteroidInnerMesh126 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh126,asteroidInnerGroup126,188,-.21,54,.47);

    const asteroidInnerGroup127 = new THREE.Group();
    const asteroidInnerMesh127 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh127,asteroidInnerGroup127,188,.42,45,.41);

    const asteroidInnerGroup128 = new THREE.Group();
    const asteroidInnerMesh128 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh128,asteroidInnerGroup128,188,-.4,40,.47);

    const asteroidInnerGroup129 = new THREE.Group();
    const asteroidInnerMesh129 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh129,asteroidInnerGroup129,190,0,52,.75);

    const asteroidInnerGroup130 = new THREE.Group();
    const asteroidInnerMesh130 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh130,asteroidInnerGroup130,190,0,62,.73);

    const asteroidInnerGroup131 = new THREE.Group();
    const asteroidInnerMesh131 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh131,asteroidInnerGroup131,191,.3,50,.27);

    const asteroidInnerGroup132 = new THREE.Group();
    const asteroidInnerMesh132 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh132,asteroidInnerGroup132,191,0,44,.63);

    const asteroidInnerGroup133 = new THREE.Group();
    const asteroidInnerMesh133 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh133,asteroidInnerGroup133,192,0,54,.37);

    const asteroidInnerGroup134 = new THREE.Group();
    const asteroidInnerMesh134 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh134,asteroidInnerGroup134,194,.32,48,.38);

    const asteroidInnerGroup135 = new THREE.Group();
    const asteroidInnerMesh135 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh135,asteroidInnerGroup135,194,0,9,.7);

    const asteroidInnerGroup136 = new THREE.Group();
    const asteroidInnerMesh136 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh136,asteroidInnerGroup136,194,-.6,40,.4);

    const asteroidInnerGroup137 = new THREE.Group();
    const asteroidInnerMesh137 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh137,asteroidInnerGroup137,195,0,34,.7);

    const asteroidInnerGroup138 = new THREE.Group();
    const asteroidInnerMesh138 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh138,asteroidInnerGroup138,195,.31,33,.17);

    const asteroidInnerGroup139 = new THREE.Group();
    const asteroidInnerMesh139 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh139,asteroidInnerGroup139,196,.37,16,.8);

    const asteroidInnerGroup140 = new THREE.Group();
    const asteroidInnerMesh140 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh140,asteroidInnerGroup140,196,.4,38,.47);

    const asteroidInnerGroup141 = new THREE.Group();
    const asteroidInnerMesh141 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh141,asteroidInnerGroup141,120,0,147.2,.3);////

    const asteroidInnerGroup142 = new THREE.Group();
    const asteroidInnerMesh142 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh142,asteroidInnerGroup142,190,0,34.5,.53);////

    const asteroidInnerGroup143 = new THREE.Group();
    const asteroidInnerMesh143 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh143,asteroidInnerGroup143,34.5,0,190,.53);

    const asteroidInnerGroup144 = new THREE.Group();
    const asteroidInnerMesh144 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh144,asteroidInnerGroup144,36.5,0,186,.27);

    const asteroidInnerGroup145 = new THREE.Group();
    const asteroidInnerMesh145 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh145,asteroidInnerGroup145,56.5,0,186,.27);

    const asteroidInnerGroup146 = new THREE.Group();
    const asteroidInnerMesh146 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh146,asteroidInnerGroup146,41.7,0,185,.3);

    const asteroidInnerGroup147 = new THREE.Group();
    const asteroidInnerMesh147 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh147,asteroidInnerGroup147,115.5,0,128,.3);

    const asteroidInnerGroup148 = new THREE.Group();
    const asteroidInnerMesh148 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh148,asteroidInnerGroup148,198,.41,29,.37);

    const asteroidInnerGroup149 = new THREE.Group();
    const asteroidInnerMesh149 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh149,asteroidInnerGroup149,172,-.4,52,.47);

    const asteroidInnerGroup150 = new THREE.Group();
    const asteroidInnerMesh150 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh150,asteroidInnerGroup150,168,.3,91,.36);///// 

    const asteroidInnerGroup151 = new THREE.Group();
    const asteroidInnerMesh151 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh151,asteroidInnerGroup151,141.8,.5,120,.27);

    const asteroidInnerGroup152 = new THREE.Group();
    const asteroidInnerMesh152 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh152,asteroidInnerGroup152,181.8,.5,50,.27);

    const asteroidInnerGroup153 = new THREE.Group();
    const asteroidInnerMesh153 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh153,asteroidInnerGroup153,125.6,0,130.6,.3);

    const asteroidInnerGroup154 = new THREE.Group();
    const asteroidInnerMesh154 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh154,asteroidInnerGroup154,138,0,135,.35);

    const asteroidInnerGroup155 = new THREE.Group();
    const asteroidInnerMesh155 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh155,asteroidInnerGroup155,162.6,0,109.6,.3);///// 

    const asteroidInnerGroup156 = new THREE.Group();
    const asteroidInnerMesh156 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh156,asteroidInnerGroup156,169.7,0,102.7,.13);///// 

    const asteroidInnerGroup157 = new THREE.Group();
    const asteroidInnerMesh157 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMesh157,asteroidInnerGroup157,100.7,0,168.7,.13);///// 


                                //MAIN ORBIT 
                                                                            //RIGHT/BOTTOM
    const asteroidGroup1 = new THREE.Group();
    const asteroidMesh1 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh1,asteroidGroup1,209.7,0,32.7,.13);

    const asteroidGroup2 = new THREE.Group();
    const asteroidMesh2 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh2,asteroidGroup2,226,0,12.7,.3);

    const asteroidGroup3 = new THREE.Group();
    const asteroidMesh3 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh3,asteroidGroup3,208,0,34,.3);

    const asteroidGroup4 = new THREE.Group();
    const asteroidMesh4 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh4,asteroidGroup4,228,0,18.7,.3);

    const asteroidGroup5 = new THREE.Group();
    const asteroidMesh5 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh5,asteroidGroup5,202.6,0,39.6,.3);

    const asteroidGroup6 = new THREE.Group();
    const asteroidMesh6 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh6,asteroidGroup6,223,0,21.6,.3);

    const asteroidGroup7 = new THREE.Group();
    const asteroidMesh7 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh7,asteroidGroup7,205.36,0,52.6,.53);

    const asteroidGroup8 = new THREE.Group();
    const asteroidMesh8 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh8,asteroidGroup8,203.7,0,48,.63);

    const asteroidGroup9 = new THREE.Group();
    const asteroidMesh9 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh9,asteroidGroup9,200.6,0,37.6,.3);  

    const asteroidGroup10 = new THREE.Group();
    const asteroidMesh10 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh10,asteroidGroup10,248,.38,40,.67);

    const asteroidGroup11 = new THREE.Group();
    const asteroidMesh11 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh11,asteroidGroup11,260,.38,12,.7);

    const asteroidGroup12 = new THREE.Group();
    const asteroidMesh12 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh12,asteroidGroup12,210,0,49,.3);

    const asteroidGroup13 = new THREE.Group();
    const asteroidMesh13 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh13,asteroidGroup13,211,0,35,.45);

    const asteroidGroup14 = new THREE.Group();
    const asteroidMesh14 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh14,asteroidGroup14,200,0,59.2,.3);

    const asteroidGroup15 = new THREE.Group();
    const asteroidMesh15 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh15,asteroidGroup15,214.5,0,40,.3);

    const asteroidGroup16 = new THREE.Group();
    const asteroidMesh16 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh16,asteroidGroup16,210,0,64,.43);

    const asteroidGroup17 = new THREE.Group();
    const asteroidMesh17 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh17,asteroidGroup17,230.6,0,14,.3);

    const asteroidGroup18 = new THREE.Group();
    const asteroidMesh18 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh18,asteroidGroup18,207,0,60.8,.13);

    const asteroidGroup19 = new THREE.Group();
    const asteroidMesh19 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh19,asteroidGroup19,243,0,46,.3);

    const asteroidGroup20 = new THREE.Group();
    const asteroidMesh20 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh20,asteroidGroup20,242,0,36,.23);

    const asteroidGroup21 = new THREE.Group();
    const asteroidMesh21 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh21,asteroidGroup21,241,0,15.5,.3);

    const asteroidGroup22 = new THREE.Group();
    const asteroidMesh22 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh22,asteroidGroup22,218,.51,73,.51);

    const asteroidGroup23 = new THREE.Group();
    const asteroidMesh23 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh23,asteroidGroup23,243,0,5.27,.3);

    const asteroidGroup24 = new THREE.Group();
    const asteroidMesh24 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh24,asteroidGroup24,231,0,47,.13);

    const asteroidGroup25 = new THREE.Group();
    const asteroidMesh25 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh25,asteroidGroup25,212.6,0,46,.3);

    const asteroidGroup26 = new THREE.Group();
    const asteroidMesh26 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh26,asteroidGroup26,232,0,17,.3);

    const asteroidGroup27 = new THREE.Group();
    const asteroidMesh27 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh27,asteroidGroup27,229,0,12.3,.43);

    const asteroidGroup28 = new THREE.Group();
    const asteroidMesh28 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh28,asteroidGroup28,222,0,38,.3);

    const asteroidGroup29 = new THREE.Group();
    const asteroidMesh29 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh29,asteroidGroup29,205,0,7,.61);      

    const asteroidGroup30 = new THREE.Group();
    const asteroidMesh30 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh30,asteroidGroup30,239,.31,1,.27);

    const asteroidGroup31 = new THREE.Group();
    const asteroidMesh31 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh31,asteroidGroup31,200,0,44,.72);

    const asteroidGroup32 = new THREE.Group();
    const asteroidMesh32 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh32,asteroidGroup32,225,-.31,2,.5);  

    const asteroidGroup34 = new THREE.Group();
    const asteroidMesh34 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh34,asteroidGroup34,233,.21,21,.27);

    const asteroidGroup36 = new THREE.Group();
    const asteroidMesh36 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh36,asteroidGroup36,208,0,71,.82);

    const asteroidGroup37 = new THREE.Group();
    const asteroidMesh37 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh37,asteroidGroup37,205,.21,57,.5);

    const asteroidGroup38 = new THREE.Group();
    const asteroidMesh38 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh38,asteroidGroup38,228,-.41,28.8,.27);

    const asteroidGroup39 = new THREE.Group();
    const asteroidMesh39 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh39,asteroidGroup39,208,0,45,.7);

    const asteroidGroup40 = new THREE.Group();
    const asteroidMesh40 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh40,asteroidGroup40,215,.31,36,.47);

    const asteroidGroup42 = new THREE.Group();
    const asteroidMesh42 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh42,asteroidGroup42,212,-.31,25,.37);

    const asteroidGroup44 = new THREE.Group();
    const asteroidMesh44 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh44,asteroidGroup44,231,-.31,12,.27);

    const asteroidGroup45 = new THREE.Group();
    const asteroidMesh45 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh45,asteroidGroup45,215,.31,25,.37);

    const asteroidGroup46 = new THREE.Group();
    const asteroidMesh46 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh46,asteroidGroup46,197,0,54,.71);

    const asteroidGroup47 = new THREE.Group();
    const asteroidMesh47 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh47,asteroidGroup47,205,0,35,.5);

    const asteroidGroup48 = new THREE.Group();
    const asteroidMesh48 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh48,asteroidGroup48,235,-.31,8,.27);

    const asteroidGroup50 = new THREE.Group();
    const asteroidMesh50 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh50,asteroidGroup50,217,-.41,22,.27);

    const asteroidGroup52 = new THREE.Group();
    const asteroidMesh52 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh52,asteroidGroup52,205,.2,38,.5);  

    const asteroidGroup58 = new THREE.Group();
    const asteroidMesh58 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh58,asteroidGroup58,203,0,20,.47);

    const asteroidGroup60 = new THREE.Group();
    const asteroidMesh60 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh60,asteroidGroup60,215,-1,20,.4);

    const asteroidGroup61 = new THREE.Group();
    const asteroidMesh61 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh61,asteroidGroup61,221,.3,43,.11);

    const asteroidGroup62 = new THREE.Group();
    const asteroidMesh62 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh62,asteroidGroup62,205,.51,29,.19);  

    const asteroidGroup63 = new THREE.Group();
    const asteroidMesh63 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh63,asteroidGroup63,218,-.6,47,.27);

    const asteroidGroup64 = new THREE.Group();
    const asteroidMesh64 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh64,asteroidGroup64,212,.61,23,.2);

    const asteroidGroup65 = new THREE.Group();
    const asteroidMesh65 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh65,asteroidGroup65,230.5,1,45,.17);

    const asteroidGroup66 = new THREE.Group();
    const asteroidMesh66 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh66,asteroidGroup66,208,.3,21,.36);

    const asteroidGroup67 = new THREE.Group();
    const asteroidMesh67 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh67,asteroidGroup67,225,-.6,37,.5);

    const asteroidGroup68 = new THREE.Group();
    const asteroidMesh68 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh68,asteroidGroup68,208,-.51,26,.27);

    const asteroidGroup69 = new THREE.Group();
    const asteroidMesh69 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh69,asteroidGroup69,218,.31,29,.37);

    const asteroidGroup70 = new THREE.Group();
    const asteroidMesh70 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh70,asteroidGroup70,206,-.6,15,.37);

    const asteroidGroup71 = new THREE.Group();
    const asteroidMesh71 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh71,asteroidGroup71,220,.6,39,.42);

    const asteroidGroup72 = new THREE.Group();
    const asteroidMesh72 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh72,asteroidGroup72,203,0,12,.5);  

    const asteroidGroup73 = new THREE.Group();
    const asteroidMesh73 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh73,asteroidGroup73,218,.6,32,.17);

    const asteroidGroup74 = new THREE.Group();
    const asteroidMesh74 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh74,asteroidGroup74,206,.6,4,.27);

    const asteroidGroup75 = new THREE.Group();
    const asteroidMesh75 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh75,asteroidGroup75,223,.6,25,.17);

    const asteroidGroup76 = new THREE.Group();
    const asteroidMesh76 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh76,asteroidGroup76,190,0,77,.67);

    const asteroidGroup77 = new THREE.Group();
    const asteroidMesh77 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh77,asteroidGroup77,212,.6,146,.75);

    const asteroidGroup79 = new THREE.Group();
    const asteroidMesh79 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh79,asteroidGroup79,218,.6,9,.27);

    const asteroidGroup81 = new THREE.Group();
    const asteroidMesh81 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh81,asteroidGroup81,206,.31,30,.38);

    const asteroidGroup85 = new THREE.Group();
    const asteroidMesh85 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh85,asteroidGroup85,209,.5,36,.37);

    const asteroidGroup89 = new THREE.Group();
    const asteroidMesh89 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh89,asteroidGroup89,212,.49,18,.37);

    const asteroidGroup91 = new THREE.Group();
    const asteroidMesh91 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh91,asteroidGroup91,217,.4,16,.37);

    const asteroidGroup93 = new THREE.Group();
    const asteroidMesh93 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh93,asteroidGroup93,254,.38,28,.7);

    const asteroidGroup95 = new THREE.Group();
    const asteroidMesh95 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh95,asteroidGroup95,235,0,8,.37);

    const asteroidGroup96 = new THREE.Group();
    const asteroidMesh96 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh96,asteroidGroup96,200,0,168,.32);

    const asteroidGroup97 = new THREE.Group();
    const asteroidMesh97 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh97,asteroidGroup97,225,0,28,.35);

    const asteroidGroup98 = new THREE.Group();
    const asteroidMesh98 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh98,asteroidGroup98,215,0,32,.3);

    const asteroidGroup99 = new THREE.Group();
    const asteroidMesh99 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh99,asteroidGroup99,221,0,26,.3);

    const asteroidGroup100 = new THREE.Group();
    const asteroidMesh100 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh100,asteroidGroup100,216,0,47,.3);

    const asteroidGroup101 = new THREE.Group();
    const asteroidMesh101 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh101,asteroidGroup101,220,0,18,.25);////////////////////\\\\\\

    const asteroidGroup102 = new THREE.Group();
    const asteroidMesh102 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh102,asteroidGroup102,205,0,24,.35);  

    const asteroidGroup103 = new THREE.Group();
    const asteroidMesh103 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh103,asteroidGroup103,218,0,18,.37);

    const asteroidGroup104 = new THREE.Group();
    const asteroidMesh104 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh104,asteroidGroup104,206,0,42,.37);

    const asteroidGroup105 = new THREE.Group();
    const asteroidMesh105 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh105,asteroidGroup105,235,0,8,.5);

    const asteroidGroup106 = new THREE.Group();
    const asteroidMesh106 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh106,asteroidGroup106,202,.2,33,.32);

    const asteroidGroup108 = new THREE.Group();
    const asteroidMesh108 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh108,asteroidGroup108,245,.2,28,.57);

    const asteroidGroup109 = new THREE.Group();
    const asteroidMesh109 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh109,asteroidGroup109,222,.2,8,.27);

    const asteroidGroup110 = new THREE.Group();
    const asteroidMesh110 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh110,asteroidGroup110,208,0,56,.3);

    const asteroidGroup111 = new THREE.Group();
    const asteroidMesh111 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh111,asteroidGroup111,238,0,21,.3);

    const asteroidGroup112 = new THREE.Group();
    const asteroidMesh112 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh112,asteroidGroup112,250,.51,21,.51);

    const asteroidGroup113 = new THREE.Group();
    const asteroidMesh113 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh113,asteroidGroup113,235,-.51,32,.41);  

    const asteroidGroup114 = new THREE.Group();
    const asteroidMesh114 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh114,asteroidGroup114,211,.51,3,.4);

    const asteroidGroup115 = new THREE.Group();
    const asteroidMesh115 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh115,asteroidGroup115,216,.71,34,.27);

    const asteroidGroup116 = new THREE.Group();
    const asteroidMesh116 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh116,asteroidGroup116,208,-.71,5,.27);



                                                        //RIGHT/BOTTOM/LEFT - 1ST FILL LEFT                         
    const asteroidGroup117 = new THREE.Group();
    const asteroidMesh117 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh117,asteroidGroup117,174.5,0,110,.3);

    const asteroidGroup118 = new THREE.Group();
    const asteroidMesh118 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh118,asteroidGroup118,188,-.41,98.8,.27);

    const asteroidGroup119 = new THREE.Group();
    const asteroidMesh119 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh119,asteroidGroup119,168,0,183,.7);

    const asteroidGroup120 = new THREE.Group();
    const asteroidMesh120 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh120,asteroidGroup120,175,.31,106,.47);

    const asteroidGroup121 = new THREE.Group();
    const asteroidMesh121 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh121,asteroidGroup121,199,.31,71,.27);

    const asteroidGroup122 = new THREE.Group();
    const asteroidMesh122 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh122,asteroidGroup122,188,0,88.7,.3);

    const asteroidGroup123 = new THREE.Group();
    const asteroidMesh123 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh123,asteroidGroup123,183,0,91.6,.3);

    const asteroidGroup124 = new THREE.Group();
    const asteroidMesh124 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh124,asteroidGroup124,165.36,0,122.6,.53);

    const asteroidGroup125 = new THREE.Group();
    const asteroidMesh125 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh125,asteroidGroup125,186,0,82.7,.3);

    const asteroidGroup126 = new THREE.Group();
    const asteroidMesh126 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh126,asteroidGroup126,191,-.31,82,.27);

    const asteroidGroup127 = new THREE.Group();
    const asteroidMesh127 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh127,asteroidGroup127,181,.6,121,.6);

    const asteroidGroup128 = new THREE.Group();
    const asteroidMesh128 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh128,asteroidGroup128,195,-.31,78,.27);

    const asteroidGroup129 = new THREE.Group();
    const asteroidMesh129 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh129,asteroidGroup129,170.7,0,113,.63);

    const asteroidGroup130 = new THREE.Group();
    const asteroidMesh130 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh130,asteroidGroup130,160.6,0,135.6,.53);

    const asteroidGroup131 = new THREE.Group();
    const asteroidMesh131 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh131,asteroidGroup131,170,.51,220,1.1);

    const asteroidGroup132 = new THREE.Group();
    const asteroidMesh132 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh132,asteroidGroup132,195,-.51,102,.41);  

    const asteroidGroup133 = new THREE.Group();
    const asteroidMesh133 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh133,asteroidGroup133,176,0,130,.52);

    const asteroidGroup134 = new THREE.Group();
    const asteroidMesh134 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh134,asteroidGroup134,182,0,108,.3);

    const asteroidGroup135 = new THREE.Group();
    const asteroidMesh135 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh135,asteroidGroup135,185,-.31,102,.38); 

    const asteroidGroup136 = new THREE.Group();
    const asteroidMesh136 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh136,asteroidGroup136,179,.71,104,.7);

    const asteroidGroup137 = new THREE.Group();
    const asteroidMesh137 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh137,asteroidGroup137,193,.21,91,.27);

    const asteroidGroup138 = new THREE.Group();
    const asteroidMesh138 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh138,asteroidGroup138,155,0,140,.82);

    const asteroidGroup139 = new THREE.Group();
    const asteroidMesh139 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh139,asteroidGroup139,165,.21,127,.5);

    const asteroidGroup140 = new THREE.Group();
    const asteroidMesh140 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh140,asteroidGroup140,175,-1,203,.74);

    const asteroidGroup141 = new THREE.Group();
    const asteroidMesh141 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh141,asteroidGroup141,184,.3,113,.8);

    const asteroidGroup142 = new THREE.Group();
    const asteroidMesh142 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh142,asteroidGroup142,191,0,117,.13);

    const asteroidGroup143 = new THREE.Group();
    const asteroidMesh143 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh143,asteroidGroup143,178,-.6,117,.27);

    const asteroidGroup144 = new THREE.Group();
    const asteroidMesh144 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh144,asteroidGroup144,172.6,0,116,.3);

    const asteroidGroup145 = new THREE.Group();
    const asteroidMesh145 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh145,asteroidGroup145,190.5,1,115,.17);

    const asteroidGroup146 = new THREE.Group();
    const asteroidMesh146 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh146,asteroidGroup146,190.6,0,84,.3);

    const asteroidGroup147 = new THREE.Group();
    const asteroidMesh147 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh147,asteroidGroup147,185,-.6,107,.5);

    const asteroidGroup148 = new THREE.Group();
    const asteroidMesh148 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh148,asteroidGroup148,192,0,97,.3);

    const asteroidGroup149 = new THREE.Group();
    const asteroidMesh149 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh149,asteroidGroup149,164,.31,197,.57);

    const asteroidGroup150 = new THREE.Group();
    const asteroidMesh150 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh150,asteroidGroup150,189,0,82.3,.43);

    const asteroidGroup151 = new THREE.Group();
    const asteroidMesh151 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh151,asteroidGroup151,180,.6,109,.42);

    const asteroidGroup152 = new THREE.Group();
    const asteroidMesh152 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh152,asteroidGroup152,201,0,85.5,.3);

    const asteroidGroup153 = new THREE.Group();
    const asteroidMesh153 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh153,asteroidGroup153,201,0,91,.13);

    const asteroidGroup154 = new THREE.Group();
    const asteroidMesh154 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh154,asteroidGroup154,203,0,75.27,.3);

    const asteroidGroup155 = new THREE.Group();
    const asteroidMesh155 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh155,asteroidGroup155,183,.6,95,.17);

    const asteroidGroup156 = new THREE.Group();
    const asteroidMesh156 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh156,asteroidGroup156,145,0,153,.67);

    const asteroidGroup157 = new THREE.Group();
    const asteroidMesh157 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh157,asteroidGroup157,185,.6,90,.5);

    const asteroidGroup158 = new THREE.Group();
    const asteroidMesh158 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh158,asteroidGroup158,170,0,134,.43);

    const asteroidGroup159 = new THREE.Group();
    const asteroidMesh159 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh159,asteroidGroup159,167,0,130.8,.13);

    const asteroidGroup160 = new THREE.Group();
    const asteroidMesh160 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh160,asteroidGroup160,205,0,112,.3);

    const asteroidGroup161 = new THREE.Group();
    const asteroidMesh161 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh161,asteroidGroup161,202,0,106,.23);

    const asteroidGroup162 = new THREE.Group();
    const asteroidMesh162 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh162,asteroidGroup162,207,.42,167,1.1);

    const asteroidGroup163 = new THREE.Group();
    const asteroidMesh163 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh163,asteroidGroup163,195,0,78,.37);      

    const asteroidGroup164 = new THREE.Group();
    const asteroidMesh164 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh164,asteroidGroup164,185,0,98,.35);

    const asteroidGroup166 = new THREE.Group();
    const asteroidMesh166 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh166,asteroidGroup166,175,0,102,.3);

    const asteroidGroup165 = new THREE.Group();
    const asteroidMesh165 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh165,asteroidGroup165,181,0,96,.3);

    const asteroidGroup167 = new THREE.Group();
    const asteroidMesh167 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh167,asteroidGroup167,176,0,117,.3);

    const asteroidGroup168 = new THREE.Group();
    const asteroidMesh168 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh168,asteroidGroup168,195,0,78,.5);

    const asteroidGroup169 = new THREE.Group();
    const asteroidMesh169 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh169,asteroidGroup169,185,.2,88,.35);

    const asteroidGroup170 = new THREE.Group();
    const asteroidMesh170 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh170,asteroidGroup170,185,.2,198,.8);//\\\\\OUTER ORBIT LONER

    const asteroidGroup171 = new THREE.Group();
    const asteroidMesh171 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh171,asteroidGroup171,168,0,126,.3);

    const asteroidGroup172 = new THREE.Group();
    const asteroidMesh172 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh172,asteroidGroup172,198,0,91,.3);

    const asteroidGroup173 = new THREE.Group();
    const asteroidMesh173 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh173,asteroidGroup173,170,0,119,.3);

    const asteroidGroup174 = new THREE.Group();
    const asteroidMesh174 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh174,asteroidGroup174,160,0,129.2,.3);



                                                //RIGHT/BOTTOM/DOWN/LEFT - 2ND FILL LEFT DOWN
    const asteroidGroup175 = new THREE.Group();
    const asteroidMesh175 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh175,asteroidGroup175,5,0,226,.43);

    const asteroidGroup176 = new THREE.Group();
    const asteroidMesh176 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh176,asteroidGroup176,210,0,132,.67);

    const asteroidGroup177 = new THREE.Group();
    const asteroidMesh177 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh177,asteroidGroup177,185,.6,130,.5);

    const asteroidGroup179 = new THREE.Group();
    const asteroidMesh179 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh179,asteroidGroup179,238,.6,59,.27);

    const asteroidGroup180 = new THREE.Group();
    const asteroidMesh180 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh180,asteroidGroup180,211,.3,100,.27);

    const asteroidGroup181 = new THREE.Group();
    const asteroidMesh181 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh181,asteroidGroup181,226,.31,80,.38);

    const asteroidGroup182 = new THREE.Group();
    const asteroidMesh182 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh182,asteroidGroup182,208,.42,95,.41);  

    const asteroidGroup184 = new THREE.Group();
    const asteroidMesh184 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh184,asteroidGroup184,208,-.4,90,.47);

    const asteroidGroup185 = new THREE.Group();
    const asteroidMesh185 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh185,asteroidGroup185,229,.5,86,.37);

    const asteroidGroup186 = new THREE.Group();
    const asteroidMesh186 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh186,asteroidGroup186,214,-.6,90,.4);

    const asteroidGroup187 = new THREE.Group();
    const asteroidMesh187 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh187,asteroidGroup187,204,0,75,.28);

    const asteroidGroup188 = new THREE.Group();
    const asteroidMesh188 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh188,asteroidGroup188,212,0,104,.37);

    const asteroidGroup189 = new THREE.Group();
    const asteroidMesh189 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh189,asteroidGroup189,232,.49,68,.37);

    const asteroidGroup190 = new THREE.Group();
    const asteroidMesh190 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh190,asteroidGroup190,216,.4,88,.47);

    const asteroidGroup191 = new THREE.Group();
    const asteroidMesh191 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh191,asteroidGroup191,237,.4,66,.37);

    const asteroidGroup192 = new THREE.Group();
    const asteroidMesh192 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh192,asteroidGroup192,214,.32,98,.38);  

    const asteroidGroup193 = new THREE.Group();
    const asteroidMesh193 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh193,asteroidGroup193,221,.38,122,.57);

    const asteroidGroup194 = new THREE.Group();
    const asteroidMesh194 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh194,asteroidGroup194,206,0,86.5,.27);

    const asteroidGroup195 = new THREE.Group();
    const asteroidMesh195 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh195,asteroidGroup195,195,0,118,.37);

    const asteroidGroup196 = new THREE.Group();
    const asteroidMesh196 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh196,asteroidGroup196,220,0,74,.32);

    const asteroidGroup197 = new THREE.Group();
    const asteroidMesh197 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh197,asteroidGroup197,185,0,138,.35);

    const asteroidGroup198 = new THREE.Group();
    const asteroidMesh198 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh198,asteroidGroup198,235,0,82,.3);

    const asteroidGroup199 = new THREE.Group();
    const asteroidMesh199 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh199,asteroidGroup199,241,0,76,.3);

    const asteroidGroup200 = new THREE.Group();
    const asteroidMesh200 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh200,asteroidGroup200,206,.51,131,.4);

    const asteroidGroup201 = new THREE.Group();
    const asteroidMesh201 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh201,asteroidGroup201,230,.51,71,.51);

    const asteroidGroup202 = new THREE.Group();
    const asteroidMesh202 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh202,asteroidGroup202,205,-.51,142,.41);

    const asteroidGroup203 = new THREE.Group();
    const asteroidMesh203 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh203,asteroidGroup203,231,.51,53,.4);

    const asteroidGroup204 = new THREE.Group();
    const asteroidMesh204 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh204,asteroidGroup204,236,.71,84,.27);

    const asteroidGroup205 = new THREE.Group();
    const asteroidMesh205 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh205,asteroidGroup205,228,-.71,55,.27);

    const asteroidGroup206 = new THREE.Group();
    const asteroidMesh206 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh206,asteroidGroup206,220,0,94,.72);

    const asteroidGroup207 = new THREE.Group();
    const asteroidMesh207 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh207,asteroidGroup207,220,0,54,.61);

    const asteroidGroup208 = new THREE.Group();
    const asteroidMesh208 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh208,asteroidGroup208,242,0,88,.3);

    const asteroidGroup209 = new THREE.Group();
    const asteroidMesh209 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh209,asteroidGroup209,214,0,59,.7);

    const asteroidGroup210 = new THREE.Group();
    const asteroidMesh210 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh210,asteroidGroup210,199,.31,111,.27);

    const asteroidGroup211 = new THREE.Group();
    const asteroidMesh211 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh211,asteroidGroup211,210,0,102,.75);

    const asteroidGroup212 = new THREE.Group();
    const asteroidMesh212 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh212,asteroidGroup212,185,-.31,142,.38);

    const asteroidGroup213 = new THREE.Group();
    const asteroidMesh213 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh213,asteroidGroup213,218,.31,105,.17);

    const asteroidGroup214 = new THREE.Group();
    const asteroidMesh214 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh214,asteroidGroup214,193,.21,131,.27);

    const asteroidGroup215 = new THREE.Group();
    const asteroidMesh215 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh215,asteroidGroup215,215,0,84,.7);

    const asteroidGroup216 = new THREE.Group();
    const asteroidMesh216 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh216,asteroidGroup216,215,0,120,.82);

    const asteroidGroup217 = new THREE.Group();
    const asteroidMesh217 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh217,asteroidGroup217,225,.21,107,.5);

    const asteroidGroup218 = new THREE.Group();
    const asteroidMesh218 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh218,asteroidGroup218,188,-.41,138.8,.27);

    const asteroidGroup219 = new THREE.Group();
    const asteroidMesh219 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh219,asteroidGroup219,108,0,175,.7);

    const asteroidGroup220 = new THREE.Group();
    const asteroidMesh220 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh220,asteroidGroup220,235,.31,86,.47);

    const asteroidGroup221 = new THREE.Group();
    const asteroidMesh221 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh221,asteroidGroup221,210,0,112,.73);

    const asteroidGroup222 = new THREE.Group();
    const asteroidMesh222 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh222,asteroidGroup222,232,-.31,75,.37);  

    const asteroidGroup223 = new THREE.Group();
    const asteroidMesh223 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh223,asteroidGroup223,215,.31,83,.17);

    const asteroidGroup224 = new THREE.Group();
    const asteroidMesh224 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh224,asteroidGroup224,191,-.31,122,.27);

    const asteroidGroup225 = new THREE.Group();
    const asteroidMesh225 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh225,asteroidGroup225,235,.31,75,.37);

    const asteroidGroup226 = new THREE.Group();
    const asteroidMesh226 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh226,asteroidGroup226,217,0,92,.71);

    const asteroidGroup227 = new THREE.Group();
    const asteroidMesh227 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh227,asteroidGroup227,225,0,85,.5);

    const asteroidGroup228 = new THREE.Group();
    const asteroidMesh228 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh228,asteroidGroup228,195,0.81,68,.27);

    const asteroidGroup229 = new THREE.Group();
    const asteroidMesh229 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh229,asteroidGroup229,218,.41,79,.37);

    const asteroidGroup230 = new THREE.Group();
    const asteroidMesh230 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh230,asteroidGroup230,237,-.41,72,.27);

    const asteroidGroup231 = new THREE.Group();
    const asteroidMesh231 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh231,asteroidGroup231,202,0,102,.52);

    const asteroidGroup232 = new THREE.Group();
    const asteroidMesh232 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh232,asteroidGroup232,225,.2,88,.5);  

    const asteroidGroup233 = new THREE.Group();
    const asteroidMesh233 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh233,asteroidGroup233,208,-.21,104,.47);

    const asteroidGroup234 = new THREE.Group();
    const asteroidMesh234 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh234,asteroidGroup234,212,.37,78,.27);

    const asteroidGroup235 = new THREE.Group();
    const asteroidMesh235 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh235,asteroidGroup235,201,-.31,95,.37);

    const asteroidGroup236 = new THREE.Group();
    const asteroidMesh236 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh236,asteroidGroup236,241,.3,93,.11);

    const asteroidGroup237 = new THREE.Group();
    const asteroidMesh237 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh237,asteroidGroup237,205,-.7,93,.27);

    const asteroidGroup238 = new THREE.Group();
    const asteroidMesh238 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh238,asteroidGroup238,223,0,70,.647);

    const asteroidGroup239 = new THREE.Group();
    const asteroidMesh239 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh239,asteroidGroup239,201.8,.5,100,.27);

    const asteroidGroup240 = new THREE.Group();
    const asteroidMesh240 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh240,asteroidGroup240,235,-1,70,.4);

    const asteroidGroup241 = new THREE.Group();
    const asteroidMesh241 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh241,asteroidGroup241,238,-.6,97,.27);

    const asteroidGroup242 = new THREE.Group();
    const asteroidMesh242 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh242,asteroidGroup242,232,.61,73,.2);

    const asteroidGroup243 = new THREE.Group();
    const asteroidMesh243 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh243,asteroidGroup243,190.5,1,155,.17);

    const asteroidGroup244 = new THREE.Group();
    const asteroidMesh244 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh244,asteroidGroup244,248,.3,71,.49);

    const asteroidGroup245 = new THREE.Group();
    const asteroidMesh245 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh245,asteroidGroup245,245,-.6,87,.5);

    const asteroidGroup246 = new THREE.Group();
    const asteroidMesh246 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh246,asteroidGroup246,228,-.51,76,.27);

    const asteroidGroup247 = new THREE.Group();
    const asteroidMesh247 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh247,asteroidGroup247,238,.31,79,.37);

    const asteroidGroup248 = new THREE.Group();
    const asteroidMesh248 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh248,asteroidGroup248,226,-.6,65,.37);

    const asteroidGroup249 = new THREE.Group();
    const asteroidMesh249 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh249,asteroidGroup249,240,.6,89,.42);

    const asteroidGroup250 = new THREE.Group();
    const asteroidMesh250 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh250,asteroidGroup250,193,0,109,.5);

    const asteroidGroup251 = new THREE.Group();
    const asteroidMesh251 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh251,asteroidGroup251,238,.6,82,.17);

    const asteroidGroup252 = new THREE.Group();
    const asteroidMesh252 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh252,asteroidGroup252,226,.6,54,.27);

    const asteroidGroup253 = new THREE.Group();
    const asteroidMesh253 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh253,asteroidGroup253,243,.6,75,.17);

    const asteroidGroup254 = new THREE.Group();
    const asteroidMesh254 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh254,asteroidGroup254,236,0,97,.3);

    const asteroidGroup255 = new THREE.Group();
    const asteroidMesh255 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh255,asteroidGroup255,240,0,68,.25);

    const asteroidGroup256 = new THREE.Group();
    const asteroidMesh256 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh256,asteroidGroup256,225,0,74,.35);  

    const asteroidGroup257 = new THREE.Group();
    const asteroidMesh257 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh257,asteroidGroup257,238,0,68,.37);

    const asteroidGroup258 = new THREE.Group();
    const asteroidMesh258 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh258,asteroidGroup258,226,0,92,.37);

    const asteroidGroup259 = new THREE.Group();
    const asteroidMesh259 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh259,asteroidGroup259,255,0,58,.5);

    const asteroidGroup260 = new THREE.Group();
    const asteroidMesh260 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh260,asteroidGroup260,222,.2,83,.32);

    const asteroidGroup261 = new THREE.Group();
    const asteroidMesh261 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh261,asteroidGroup261,185,.2,128,.35);

    const asteroidGroup262 = new THREE.Group();
    const asteroidMesh262 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh262,asteroidGroup262,235,.2,78,.27);

    const asteroidGroup264 = new THREE.Group();
    const asteroidMesh264 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh264,asteroidGroup264,242,.2,58,.27);

    const asteroidGroup265 = new THREE.Group();
    const asteroidMesh265 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh265,asteroidGroup265,228,0,106,.3);

    const asteroidGroup266 = new THREE.Group();
    const asteroidMesh266 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh266,asteroidGroup266,198,0,131,.3);

    const asteroidGroup267 = new THREE.Group();
    const asteroidMesh267 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh267,asteroidGroup267,230,0,99,.3);

    const asteroidGroup268 = new THREE.Group();
    const asteroidMesh268 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh268,asteroidGroup268,210,0,84.5,.53);

    const asteroidGroup269 = new THREE.Group();
    const asteroidMesh269 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh269,asteroidGroup269,220,0,109.2,.3);

    const asteroidGroup270 = new THREE.Group();
    const asteroidMesh270 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh270,asteroidGroup270,234.5,0,90,.3);

    const asteroidGroup271 = new THREE.Group();
    const asteroidMesh271 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh271,asteroidGroup271,230,0,114,.43);

    const asteroidGroup272 = new THREE.Group();
    const asteroidMesh272 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh272,asteroidGroup272,205,0,91.7,.3);

    const asteroidGroup273 = new THREE.Group();
    const asteroidMesh273 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh273,asteroidGroup273,227,0,110.8,.13);

    const asteroidGroup274 = new THREE.Group();
    const asteroidMesh274 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh274,asteroidGroup274,205,0,152,.3);

    const asteroidGroup275 = new THREE.Group();
    const asteroidMesh275 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh275,asteroidGroup275,202,0,146,.23);

    const asteroidGroup276 = new THREE.Group();
    const asteroidMesh276 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh276,asteroidGroup276,201,0,125.5,.3);

    const asteroidGroup277 = new THREE.Group();
    const asteroidMesh277 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh277,asteroidGroup277,201,0,131,.13);

    const asteroidGroup278 = new THREE.Group();
    const asteroidMesh278 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh278,asteroidGroup278,203,0,115.27,.3);

    const asteroidGroup279 = new THREE.Group();
    const asteroidMesh279 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh279,asteroidGroup279,191,0,157,.13);

    const asteroidGroup280 = new THREE.Group();
    const asteroidMesh280 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh280,asteroidGroup280,232.6,0,96,.3);

    const asteroidGroup281 = new THREE.Group();
    const asteroidMesh281 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh281,asteroidGroup281,192,0,127,.3);

    const asteroidGroup282 = new THREE.Group();
    const asteroidMesh282 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh282,asteroidGroup282,211,0,94,.63);

    const asteroidGroup283 = new THREE.Group();
    const asteroidMesh283 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh283,asteroidGroup283,190.6,0,124,.3);

    const asteroidGroup284 = new THREE.Group();
    const asteroidMesh284 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh284,asteroidGroup284,189,0,122.3,.43);

    const asteroidGroup285 = new THREE.Group();
    const asteroidMesh285 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh285,asteroidGroup285,229.7,0,82.7,.13);

    const asteroidGroup286 = new THREE.Group();
    const asteroidMesh286 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh286,asteroidGroup286,215,0,62.7,.3);

    const asteroidGroup287 = new THREE.Group();
    const asteroidMesh287 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh287,asteroidGroup287,228,0,84,.3);

    const asteroidGroup288 = new THREE.Group();
    const asteroidMesh288 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh288,asteroidGroup288,228,0,68.7,.3);

    const asteroidGroup289 = new THREE.Group();
    const asteroidMesh289 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh289,asteroidGroup289,222.6,0,89.6,.3);

    const asteroidGroup290 = new THREE.Group();
    const asteroidMesh290 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh290,asteroidGroup290,243,0,21.56,.3);

    const asteroidGroup291 = new THREE.Group();
    const asteroidMesh291 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh291,asteroidGroup291,225.36,0,102.6,.53);

    const asteroidGroup292 = new THREE.Group();
    const asteroidMesh292 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh292,asteroidGroup292,223.7,0,98,.63);

    const asteroidGroup293 = new THREE.Group();
    const asteroidMesh293 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh293,asteroidGroup293,220.6,0,87.6,.3);

    const asteroidGroup294 = new THREE.Group();
    const asteroidMesh294 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh294,asteroidGroup294,173,0,175,.37);

    const asteroidGroup295 = new THREE.Group();
    const asteroidMesh295 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh295,asteroidGroup295,167,0,145,.5);

    const asteroidGroup296 = new THREE.Group();
    const asteroidMesh296 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh296,asteroidGroup296,117,0,169,1);

    const asteroidGroup297 = new THREE.Group();
    const asteroidMesh297 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh297,asteroidGroup297,142,.2,168,.35);

    const asteroidGroup298 = new THREE.Group();
    const asteroidMesh298 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh298,asteroidGroup298,110.6,0,173,.3);

    const asteroidGroup299 = new THREE.Group();
    const asteroidMesh299 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh299,asteroidGroup299,182,0,175.7,.3);

    const asteroidGroup300 = new THREE.Group();
    const asteroidMesh300 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh300,asteroidGroup300,122.36,0,187.6,.53);

    const asteroidGroup301 = new THREE.Group();
    const asteroidMesh301 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh301,asteroidGroup301,112,.49,182,.87);  

    const asteroidGroup302 = new THREE.Group();
    const asteroidMesh302 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh302,asteroidGroup302,3,0,230,.63);

    const asteroidGroup303 = new THREE.Group();
    const asteroidMesh303 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh303,asteroidGroup303,0,0,216,.53);



                                                                //BOTTOM/RIGHT       
    const asteroidGroup304 = new THREE.Group();
    const asteroidMesh304 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh304,asteroidGroup304,43,.3,221,.11);

    const asteroidGroup305 = new THREE.Group();
    const asteroidMesh305 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh305,asteroidGroup305,8,0,235,.37);

    const asteroidGroup306 = new THREE.Group();
    const asteroidMesh306 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh306,asteroidGroup306,110,0,196,.82);

    const asteroidGroup307 = new THREE.Group();
    const asteroidMesh307 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh307,asteroidGroup307,28,0,225,.35);

    const asteroidGroup308 = new THREE.Group();
    const asteroidMesh308 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh308,asteroidGroup308,6,0,252,.63);

    const asteroidGroup309 = new THREE.Group();
    const asteroidMesh309 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh309,asteroidGroup309,26,0,221,.3);

    const asteroidGroup310 = new THREE.Group();
    const asteroidMesh310 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh310,asteroidGroup310,47,0,216,.3);

    const asteroidGroup311 = new THREE.Group();
    const asteroidMesh311 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh311,asteroidGroup311,18,0,220,.25);

    const asteroidGroup313 = new THREE.Group();
    const asteroidMesh313 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh313,asteroidGroup313,18,0,218,.37);

    const asteroidGroup314 = new THREE.Group();
    const asteroidMesh314 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh314,asteroidGroup314,42,0,206,.37);

    const asteroidGroup315 = new THREE.Group();
    const asteroidMesh315 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh315,asteroidGroup315,8,0,235,.5);

    const asteroidGroup316 = new THREE.Group();
    const asteroidMesh316 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh316,asteroidGroup316,33,.2,202,.32);

    const asteroidGroup317 = new THREE.Group();
    const asteroidMesh317 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh317,asteroidGroup317,54,.2,228,.35);

    const asteroidGroup318 = new THREE.Group();
    const asteroidMesh318 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh318,asteroidGroup318,27,.2,255,1);

    const asteroidGroup319 = new THREE.Group();
    const asteroidMesh319 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh319,asteroidGroup319,8,.2,222,.27);

    const asteroidGroup320 = new THREE.Group();
    const asteroidMesh320 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh210,asteroidGroup320,56,0,208,.3);

    const asteroidGroup321 = new THREE.Group();
    const asteroidMesh321 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh321,asteroidGroup321,21,0,238,.3);

    const asteroidGroup322 = new THREE.Group();
    const asteroidMesh322 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh322,asteroidGroup322,49,0,210,.3);

    const asteroidGroup324 = new THREE.Group();
    const asteroidMesh324 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh324,asteroidGroup324,59.2,0,200,.3);

    const asteroidGroup325 = new THREE.Group();
    const asteroidMesh325 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh325,asteroidGroup325,40,0,214.5,.3);

    const asteroidGroup326 = new THREE.Group();
    const asteroidMesh326 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh326,asteroidGroup326,64,0,210,.43);

    const asteroidGroup328 = new THREE.Group();
    const asteroidMesh328 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh328,asteroidGroup328,60.8,0,207,.13);

    const asteroidGroup329 = new THREE.Group();
    const asteroidMesh329 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh329,asteroidGroup329,46,0,243,.3);

    const asteroidGroup330 = new THREE.Group();
    const asteroidMesh330 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh330,asteroidGroup330,36,0,242,.23);

    const asteroidGroup331 = new THREE.Group();
    const asteroidMesh331 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh331,asteroidGroup331,15.5,0,241,.3);

    const asteroidGroup332 = new THREE.Group();
    const asteroidMesh332 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh332,asteroidGroup332,21,.3,208,.36);

    const asteroidGroup333 = new THREE.Group();
    const asteroidMesh333 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh333,asteroidGroup333,5.27,0,243,.3);

    const asteroidGroup334 = new THREE.Group();
    const asteroidMesh334 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh334,asteroidGroup334,47,0,231,.13);

    const asteroidGroup335 = new THREE.Group();
    const asteroidMesh335 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh335,asteroidGroup335,46,0,212.6,.3);

    const asteroidGroup336 = new THREE.Group();
    const asteroidMesh336 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh336,asteroidGroup336,17,0,232,.3);

    const asteroidGroup338 = new THREE.Group();
    const asteroidMesh338 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh338,asteroidGroup338,14,0,230.6,.3);

    const asteroidGroup339 = new THREE.Group();
    const asteroidMesh339 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh339,asteroidGroup339,48,0,226,.65);

    const asteroidGroup340 = new THREE.Group();
    const asteroidMesh340 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh340,asteroidGroup340,12.3,0,229,.43);

    const asteroidGroup341 = new THREE.Group();
    const asteroidMesh341 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh341,asteroidGroup341,32.7,0,209.7,.13);

    const asteroidGroup342 = new THREE.Group();
    const asteroidMesh342 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh342,asteroidGroup342,12.7,0,226,.3);

    const asteroidGroup343 = new THREE.Group();
    const asteroidMesh343 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh343,asteroidGroup343,34,0,208,.3);

    const asteroidGroup344 = new THREE.Group();
    const asteroidMesh344 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh344,asteroidGroup344,18.7,0,228,.3);

    const asteroidGroup345 = new THREE.Group();
    const asteroidMesh345 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh345,asteroidGroup345,39.6,0,202.6,.3);

    const asteroidGroup346 = new THREE.Group();
    const asteroidMesh346 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh346,asteroidGroup346,21.6,0,223,.3);

    const asteroidGroup347 = new THREE.Group();
    const asteroidMesh347 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh347,asteroidGroup347,52.6,0,205.36,.53);

    const asteroidGroup348 = new THREE.Group();
    const asteroidMesh348 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh348,asteroidGroup348,48,0,203.7,.63);

    const asteroidGroup349 = new THREE.Group();
    const asteroidMesh349 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh349,asteroidGroup349,37.6,0,200.6,.3);

    const asteroidGroup350 = new THREE.Group();
    const asteroidMesh350 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh350,asteroidGroup350,28,.38,209,.27);

    const asteroidGroup351 = new THREE.Group();
    const asteroidMesh351 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh351,asteroidGroup351,39,.6,220,.42);

    const asteroidGroup352 = new THREE.Group();
    const asteroidMesh352 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh352,asteroidGroup352,12,0,203,.5);  

    const asteroidGroup353 = new THREE.Group();
    const asteroidMesh353 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh353,asteroidGroup353,32,.6,218,.17);

    const asteroidGroup354 = new THREE.Group();
    const asteroidMesh354 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh354,asteroidGroup354,4,.6,206,.27);

    const asteroidGroup355 = new THREE.Group();
    const asteroidMesh355 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh355,asteroidGroup355,25,.6,223,.17);

    const asteroidGroup356 = new THREE.Group();
    const asteroidMesh356 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh356,asteroidGroup356,85,0,190,.67);

    const asteroidGroup357 = new THREE.Group();
    const asteroidMesh357 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh357,asteroidGroup357,13,.6,222,.75);

    const asteroidGroup358 = new THREE.Group();
    const asteroidMesh358 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh358,asteroidGroup358,28,-.6,203,.7);

    const asteroidGroup359 = new THREE.Group();
    const asteroidMesh359 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh359,asteroidGroup359,9,.6,218,.27);

    const asteroidGroup360 = new THREE.Group();
    const asteroidMesh360 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh360,asteroidGroup360,12,-.71,258,.7);

    const asteroidGroup361 = new THREE.Group();
    const asteroidMesh361 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh361,asteroidGroup361,30,.31,206,.38);

    const asteroidGroup362 = new THREE.Group();
    const asteroidMesh362 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh362,asteroidGroup362,52,0,222,.72);

    const asteroidGroup363 = new THREE.Group();
    const asteroidMesh363 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh363,asteroidGroup363,27,.37,243,.47);

    const asteroidGroup364 = new THREE.Group();
    const asteroidMesh364 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh364,asteroidGroup364,34,.71,216,.27);

    const asteroidGroup365 = new THREE.Group();
    const asteroidMesh365 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh365,asteroidGroup365,36,.5,209,.37);

    const asteroidGroup366 = new THREE.Group();
    const asteroidMesh366 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh366,asteroidGroup366,37,-.6,232,.6);

    const asteroidGroup367 = new THREE.Group();
    const asteroidMesh367 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh367,asteroidGroup367,7,0,205,.61);

    const asteroidGroup368 = new THREE.Group();
    const asteroidMesh368 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh368,asteroidGroup368,38,0,222,.3);

    const asteroidGroup369 = new THREE.Group();
    const asteroidMesh369 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh369,asteroidGroup369,114,.49,202,.67);

    const asteroidGroup370 = new THREE.Group();
    const asteroidMesh370 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh370,asteroidGroup370,1,.31,239,.27);

    const asteroidGroup371 = new THREE.Group();
    const asteroidMesh371 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh371,asteroidGroup371,3,.51,211,.4);

    const asteroidGroup372 = new THREE.Group();
    const asteroidMesh372 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh372,asteroidGroup372,32,-.31,225,.38);  

    const asteroidGroup373 = new THREE.Group();
    const asteroidMesh373 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh373,asteroidGroup373,55,.31,198,.17);

    const asteroidGroup374 = new THREE.Group();
    const asteroidMesh374 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh374,asteroidGroup374,21,.21,233,.27);

    const asteroidGroup376 = new THREE.Group();
    const asteroidMesh376 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh376,asteroidGroup376,70,0,195,.82);

    const asteroidGroup377 = new THREE.Group();
    const asteroidMesh377 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh377,asteroidGroup377,32,-.51,235,.41);

    const asteroidGroup378 = new THREE.Group();
    const asteroidMesh378 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh378,asteroidGroup378,28.8,-.41,228,.27);

    const asteroidGroup379 = new THREE.Group();
    const asteroidMesh379 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh379,asteroidGroup379,45,0,208,.7);

    const asteroidGroup380 = new THREE.Group();
    const asteroidMesh380 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh380,asteroidGroup380,26,-.51,208,.27);

    const asteroidGroup381 = new THREE.Group();
    const asteroidMesh381 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh381,asteroidGroup381,29,.31,218,.37);

    const asteroidGroup382 = new THREE.Group();
    const asteroidMesh382 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh382,asteroidGroup382,15,-.6,206,.37);

    const asteroidGroup383 = new THREE.Group();
    const asteroidMesh383 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh383,asteroidGroup383,21,.51,250,.51);

    const asteroidGroup384 = new THREE.Group();
    const asteroidMesh384 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh384,asteroidGroup384,12,-.31,251,.57);

    const asteroidGroup385 = new THREE.Group();
    const asteroidMesh385 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh385,asteroidGroup385,25,.31,231,.47);

    const asteroidGroup386 = new THREE.Group();
    const asteroidMesh386 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh386,asteroidGroup386,43,0,199,.71);

    const asteroidGroup387 = new THREE.Group();
    const asteroidMesh387 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh387,asteroidGroup387,11,0,208,.5);

    const asteroidGroup388 = new THREE.Group();
    const asteroidMesh388 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh388,asteroidGroup388,8,-.31,235,.27);

    const asteroidGroup389 = new THREE.Group();
    const asteroidMesh389 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh389,asteroidGroup389,37,-.6,225,.5);

    const asteroidGroup390 = new THREE.Group();
    const asteroidMesh390 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh390,asteroidGroup390,22,-.41,217,.27);

    const asteroidGroup391 = new THREE.Group();
    const asteroidMesh391 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh391,asteroidGroup391,35,.51,255,.39);  

    const asteroidGroup392 = new THREE.Group();
    const asteroidMesh392 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh392,asteroidGroup392,38,.2,262,.75);

    const asteroidGroup393 = new THREE.Group();
    const asteroidMesh393 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh393,asteroidGroup393,47,-.6,218,.27);

    const asteroidGroup394 = new THREE.Group();
    const asteroidMesh394 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh394,asteroidGroup394,44,.37,246,.7);

    const asteroidGroup395 = new THREE.Group();
    const asteroidMesh395 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh395,asteroidGroup395,23,.61,212,.2);

    const asteroidGroup396 = new THREE.Group();
    const asteroidMesh396 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh396,asteroidGroup396,32,.6,257,.4);

    const asteroidGroup397 = new THREE.Group();
    const asteroidMesh397 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh397,asteroidGroup397,45,1,230.5,.17);

    const asteroidGroup398 = new THREE.Group();
    const asteroidMesh398 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh398,asteroidGroup398,20,0,203,.47);

    const asteroidGroup399 = new THREE.Group();
    const asteroidMesh399 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh399,asteroidGroup399,16,.4,217,.37);

    const asteroidGroup400 = new THREE.Group();
    const asteroidMesh400 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh400,asteroidGroup400,20,-1,215,.4);



                                                //3RD RIGHT FILLER------- BOTTOM/RIGHT/RIGHT/RIGHT
    const asteroidGroup401 = new THREE.Group();
    const asteroidMesh401 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh401,asteroidGroup401,159.6,0,162.6,.3);

    const asteroidGroup402 = new THREE.Group();
    const asteroidMesh402 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh402,asteroidGroup402,141.6,0,183,.3);

    const asteroidGroup403 = new THREE.Group();
    const asteroidMesh403 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh403,asteroidGroup403,123,.51,171,.4);        

    const asteroidGroup404 = new THREE.Group();
    const asteroidMesh404 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh404,asteroidGroup404,154,.71,176,.27);

    const asteroidGroup405 = new THREE.Group();
    const asteroidMesh405 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh405,asteroidGroup405,125,-.71,168,.27);

    const asteroidGroup406 = new THREE.Group();
    const asteroidMesh406 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh406,asteroidGroup406,174,0,160,.72);

    const asteroidGroup407 = new THREE.Group();
    const asteroidMesh407 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh407,asteroidGroup407,127,0,165,.61);

    const asteroidGroup408 = new THREE.Group();
    const asteroidMesh408 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh408,asteroidGroup408,158,0,182,.3);

    const asteroidGroup409 = new THREE.Group();
    const asteroidMesh409 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh409,asteroidGroup409,130,0,157,.7);

    const asteroidGroup410 = new THREE.Group();
    const asteroidMesh410 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh410,asteroidGroup410,121,.31,199,.27);

    const asteroidGroup411 = new THREE.Group();
    const asteroidMesh411 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh411,asteroidGroup411,172,0,150,.75);

    const asteroidGroup412 = new THREE.Group();
    const asteroidMesh412 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh412,asteroidGroup412,152,-.31,185,.38);  

    const asteroidGroup413 = new THREE.Group();
    const asteroidMesh413 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh413,asteroidGroup413,175,.31,158,.17);

    const asteroidGroup414 = new THREE.Group();
    const asteroidMesh414 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh414,asteroidGroup414,141,.21,193,.27);

    const asteroidGroup415 = new THREE.Group();
    const asteroidMesh415 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh415,asteroidGroup415,154,0,155,.7);

    const asteroidGroup416 = new THREE.Group();
    const asteroidMesh416 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh416,asteroidGroup416,140,0,157,.82);

    const asteroidGroup417 = new THREE.Group();
    const asteroidMesh417 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh417,asteroidGroup417,177,.21,165,.5);

    const asteroidGroup418 = new THREE.Group();
    const asteroidMesh418 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh418,asteroidGroup418,148.8,-.41,188,.27);

    const asteroidGroup419 = new THREE.Group();
    const asteroidMesh419 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh419,asteroidGroup419,165,0,168,.7);

    const asteroidGroup420 = new THREE.Group();
    const asteroidMesh420 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh420,asteroidGroup420,156,.31,175,.47);

    const asteroidGroup421 = new THREE.Group();
    const asteroidMesh421 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh421,asteroidGroup421,182,0,150,.73);

    const asteroidGroup422 = new THREE.Group();
    const asteroidMesh422 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh422,asteroidGroup422,145,-.31,172,.37);

    const asteroidGroup423 = new THREE.Group();
    const asteroidMesh423 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh423,asteroidGroup423,152,-.51,195,.41);  

    const asteroidGroup424 = new THREE.Group();
    const asteroidMesh424 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh424,asteroidGroup424,132,-.31,191,.27);

    const asteroidGroup425 = new THREE.Group();
    const asteroidMesh425 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh425,asteroidGroup425,145,.31,175,.37);

    const asteroidGroup426 = new THREE.Group();
    const asteroidMesh426 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh426,asteroidGroup426,182,0,157,.71);

    const asteroidGroup427 = new THREE.Group();
    const asteroidMesh427 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh427,asteroidGroup427,141,.51,170,.51);
        
    const asteroidGroup428 = new THREE.Group();
    const asteroidMesh428 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh428,asteroidGroup428,128,-.31,195,.27);

    const asteroidGroup429 = new THREE.Group();
    const asteroidMesh429 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh429,asteroidGroup429,149,.41,158,.37);

    const asteroidGroup430 = new THREE.Group();
    const asteroidMesh430 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh430,asteroidGroup430,142,-.41,177,.27);

    const asteroidGroup431 = new THREE.Group();
    const asteroidMesh431 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh431,asteroidGroup431,172,0,142,.52);

    const asteroidGroup432 = new THREE.Group();
    const asteroidMesh432 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh432,asteroidGroup432,224,.41,118,.37);

    const asteroidGroup433 = new THREE.Group();
    const asteroidMesh433 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh433,asteroidGroup433,174,-.21,148,.47);

    const asteroidGroup434 = new THREE.Group();
    const asteroidMesh434 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh434,asteroidGroup434,148,.37,152,.27);

    const asteroidGroup435 = new THREE.Group();
    const asteroidMesh435 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh435,asteroidGroup435,165,-.31,141,.7);

    const asteroidGroup436 = new THREE.Group();
    const asteroidMesh436 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh436,asteroidGroup436,190,.6,165,.7);

    const asteroidGroup437 = new THREE.Group();
    const asteroidMesh437 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh437,asteroidGroup437,203,-.7,161,.7);

    const asteroidGroup438 = new THREE.Group();
    const asteroidMesh438 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh438,asteroidGroup438,140,0,163,.47);

    const asteroidGroup439 = new THREE.Group();
    const asteroidMesh439 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh439,asteroidGroup439,170,.5,141.8,.27);

    const asteroidGroup440 = new THREE.Group();
    const asteroidMesh440 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh440,asteroidGroup440,140,-1,175,.4);

    const asteroidGroup441 = new THREE.Group();
    const asteroidMesh441 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh441,asteroidGroup441,163,.3,181,.11);

    const asteroidGroup442 = new THREE.Group();
    const asteroidMesh442 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh442,asteroidGroup442,149,.51,165,.19);  

    const asteroidGroup443 = new THREE.Group();
    const asteroidMesh443 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh443,asteroidGroup443,167,-.6,178,.27);

    const asteroidGroup444 = new THREE.Group();
    const asteroidMesh444 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh444,asteroidGroup444,131,.61,172,.52);

    const asteroidGroup445 = new THREE.Group();
    const asteroidMesh445 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh445,asteroidGroup445,165,1,190.5,.17);

    const asteroidGroup446 = new THREE.Group();
    const asteroidMesh446 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh446,asteroidGroup446,141,.51,226,.51);

    const asteroidGroup447 = new THREE.Group();
    const asteroidMesh447 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh447,asteroidGroup447,157,-.6,185,.5);

    const asteroidGroup448 = new THREE.Group();
    const asteroidMesh448 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh448,asteroidGroup448,146,-.51,168,.27);

    const asteroidGroup449 = new THREE.Group();
    const asteroidMesh449 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh449,asteroidGroup449,149,.31,178,.37);

    const asteroidGroup450 = new THREE.Group();
    const asteroidMesh450 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh450,asteroidGroup450,135,-.6,166,.37);

    const asteroidGroup451 = new THREE.Group();
    const asteroidMesh451 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh451,asteroidGroup451,175,.6,188,.62);

    const asteroidGroup452 = new THREE.Group();
    const asteroidMesh452 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh452,asteroidGroup452,132,0,163,.5);  

    const asteroidGroup453 = new THREE.Group();
    const asteroidMesh453 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh453,asteroidGroup453,160,.6,190,.417);

    const asteroidGroup454 = new THREE.Group();
    const asteroidMesh454 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh454,asteroidGroup454,124,.6,166,.27);

    const asteroidGroup455 = new THREE.Group();
    const asteroidMesh455 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh455,asteroidGroup455,122,.6,177,.74);

    const asteroidGroup456 = new THREE.Group();
    const asteroidMesh456 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh456,asteroidGroup456,203,0,150,.67);

    const asteroidGroup457 = new THREE.Group();
    const asteroidMesh457 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh457,asteroidGroup457,144,.6,190,.5);

    const asteroidGroup458 = new THREE.Group();
    const asteroidMesh458 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh458,asteroidGroup458,148,-.6,163,.47);

    const asteroidGroup459 = new THREE.Group();
    const asteroidMesh459 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh459,asteroidGroup459,129,.6,178,.27);

    const asteroidGroup460 = new THREE.Group();
    const asteroidMesh460 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh460,asteroidGroup460,170,.3,151,.27);

    const asteroidGroup461 = new THREE.Group();
    const asteroidMesh461 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh461,asteroidGroup461,150,.31,166,.38);

    const asteroidGroup462 = new THREE.Group();
    const asteroidMesh462 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh462,asteroidGroup462,165,.42,148,.41);  

    const asteroidGroup463 = new THREE.Group();
    const asteroidMesh463 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh463,asteroidGroup463,146,.37,208,.47);

    const asteroidGroup464 = new THREE.Group();
    const asteroidMesh464 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh464,asteroidGroup464,160,-.4,148,.47);

    const asteroidGroup465 = new THREE.Group();
    const asteroidMesh465 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh465,asteroidGroup465,156,.5,169,.37);

    const asteroidGroup466 = new THREE.Group();
    const asteroidMesh466 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh466,asteroidGroup466,160,-.6,154,.4);

    const asteroidGroup467 = new THREE.Group();
    const asteroidMesh467 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh467,asteroidGroup467,147,0,146,.8);

    const asteroidGroup468 = new THREE.Group();
    const asteroidMesh468 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh468,asteroidGroup468,174,0,152,.37);

    const asteroidGroup469 = new THREE.Group();
    const asteroidMesh469 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh469,asteroidGroup469,138,.49,172,.37);

    const asteroidGroup470 = new THREE.Group();
    const asteroidMesh470 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh470,asteroidGroup470,158,.4,156,.47);

    const asteroidGroup471 = new THREE.Group();
    const asteroidMesh471 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh471,asteroidGroup471,136,.4,177,.37);

    const asteroidGroup472 = new THREE.Group();
    const asteroidMesh472 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh472,asteroidGroup472,168,.32,154,.38);  

    const asteroidGroup473 = new THREE.Group();
    const asteroidMesh473 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh473,asteroidGroup473,148,.38,169,.27);

    const asteroidGroup474 = new THREE.Group();
    const asteroidMesh474 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh474,asteroidGroup474,2,.31,242,.6);

    const asteroidGroup475 = new THREE.Group();
    const asteroidMesh475 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh475,asteroidGroup475,128,0,195,.37);

    const asteroidGroup476 = new THREE.Group();
    const asteroidMesh476 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh476,asteroidGroup476,139,0,150,.52);

    const asteroidGroup477 = new THREE.Group();
    const asteroidMesh477 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh477,asteroidGroup477,148,0,185,.35);

    const asteroidGroup478 = new THREE.Group();
    const asteroidMesh478 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh478,asteroidGroup478,152,0,165,.3);

    const asteroidGroup479 = new THREE.Group();
    const asteroidMesh479 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh479,asteroidGroup479,146,0,161,.3);

    const asteroidGroup480 = new THREE.Group();
    const asteroidMesh480 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh480,asteroidGroup480,167,0,176,.3);

    const asteroidGroup481 = new THREE.Group();
    const asteroidMesh481 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh481,asteroidGroup481,180,0,170,.25);

    const asteroidGroup482 = new THREE.Group();
    const asteroidMesh482 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh482,asteroidGroup482,157.6,0,160.6,.3);

    const asteroidGroup483 = new THREE.Group();
    const asteroidMesh483 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh483,asteroidGroup483,138,0,178,.37);

    const asteroidGroup484 = new THREE.Group();
    const asteroidMesh484 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh484,asteroidGroup484,162,0,166,.37);

    const asteroidGroup485 = new THREE.Group();
    const asteroidMesh485 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh485,asteroidGroup485,128,0,195,.5);

    const asteroidGroup486 = new THREE.Group();
    const asteroidMesh486 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh486,asteroidGroup486,153,.2,162,.32);

    const asteroidGroup487 = new THREE.Group();
    const asteroidMesh487 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh487,asteroidGroup487,138,.2,185,.35);

    const asteroidGroup488 = new THREE.Group();
    const asteroidMesh488 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh488,asteroidGroup488,148,.2,175,.27);

    const asteroidGroup489 = new THREE.Group();
    const asteroidMesh489 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh489,asteroidGroup489,128,.2,182,.27);

    const asteroidGroup490 = new THREE.Group();
    const asteroidMesh490 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh490,asteroidGroup490,176,0,168,.3);

    const asteroidGroup491 = new THREE.Group();
    const asteroidMesh491 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh491,asteroidGroup491,141,0,198,.3);

    const asteroidGroup492 = new THREE.Group();
    const asteroidMesh492 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh492,asteroidGroup492,169,0,170,.3);

    const asteroidGroup493 = new THREE.Group();
    const asteroidMesh493 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh493,asteroidGroup493,154.5,0,150,.53);

    const asteroidGroup494 = new THREE.Group();
    const asteroidMesh494 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh494,asteroidGroup494,179.2,0,160,.3);

    const asteroidGroup495 = new THREE.Group();
    const asteroidMesh495 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh495,asteroidGroup495,168,0,163.7,.63);

    const asteroidGroup496 = new THREE.Group();
    const asteroidMesh496 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh496,asteroidGroup496,184,0,170,.43);

    const asteroidGroup497 = new THREE.Group();
    const asteroidMesh497 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh497,asteroidGroup497,161.7,0,145,.3);

    const asteroidGroup498 = new THREE.Group();
    const asteroidMesh498 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh498,asteroidGroup498,180.8,0,167,.13);

    const asteroidGroup499 = new THREE.Group();
    const asteroidMesh499 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh499,asteroidGroup499,162,0,205,.3);

    const asteroidGroup500 = new THREE.Group();
    const asteroidMesh500 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh500,asteroidGroup500,156,0,202,.23);

    const asteroidGroup501 = new THREE.Group();
    const asteroidMesh501 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh501,asteroidGroup501,135.5,0,201,.3);

    const asteroidGroup502 = new THREE.Group();
    const asteroidMesh502 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh502,asteroidGroup502,172.6,0,165.36,.53);

    const asteroidGroup503 = new THREE.Group();
    const asteroidMesh503 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh503,asteroidGroup503,125.27,0,203,.3);

    const asteroidGroup504 = new THREE.Group();
    const asteroidMesh504 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh504,asteroidGroup504,167,0,191,.13);

    const asteroidGroup505 = new THREE.Group();
    const asteroidMesh505 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh505,asteroidGroup505,166,0,172.6,.3);

    const asteroidGroup506 = new THREE.Group();
    const asteroidMesh506 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh506,asteroidGroup506,137,0,192,.3);

    const asteroidGroup507 = new THREE.Group();
    const asteroidMesh507 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh507,asteroidGroup507,164,0,151,.63);

    const asteroidGroup508 = new THREE.Group();
    const asteroidMesh508 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh508,asteroidGroup508,134,0,194.6,.3);

    const asteroidGroup509 = new THREE.Group();
    const asteroidMesh509 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh509,asteroidGroup509,155,0,171,.45);

    const asteroidGroup510 = new THREE.Group();
    const asteroidMesh510 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh510,asteroidGroup510,132.3,0,189,.43);

    const asteroidGroup511 = new THREE.Group();
    const asteroidMesh511 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh511,asteroidGroup511,152.7,0,169.7,.13);

    const asteroidGroup512 = new THREE.Group();
    const asteroidMesh512 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh512,asteroidGroup512,132.7,0,186,.3);

    const asteroidGroup513 = new THREE.Group();
    const asteroidMesh513 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh513,asteroidGroup513,154,0,168,.3);

    const asteroidGroup514 = new THREE.Group();
    const asteroidMesh514 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh514,asteroidGroup514,138.7,0,188,.3);

                        

                                        //BOTTOM/RIGHT ---> 4TH FILLER  -  BOTTOM/RIGHT/RIGHT
    const asteroidGroup515 = new THREE.Group();
    const asteroidMesh515 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh515,asteroidGroup515,76,0,245,1);

    const asteroidGroup516 = new THREE.Group();
    const asteroidMesh516 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh516,asteroidGroup516,79,.31,218,.37);

    const asteroidGroup517 = new THREE.Group();
    const asteroidMesh517 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh517,asteroidGroup517,70,-1,215,.4);

    const asteroidGroup518 = new THREE.Group();
    const asteroidMesh518 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh518,asteroidGroup518,110.8,0,207,.13);

    const asteroidGroup519 = new THREE.Group();
    const asteroidMesh519 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh519,asteroidGroup519,92,0,245,.3);

    const asteroidGroup520 = new THREE.Group();
    const asteroidMesh520 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh520,asteroidGroup520,86,0,242,.23);

    const asteroidGroup521 = new THREE.Group();
    const asteroidMesh521 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh521,asteroidGroup521,65.5,0,241,.3);

    const asteroidGroup522 = new THREE.Group();
    const asteroidMesh522 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh522,asteroidGroup522,93,.3,221,.11);

    const asteroidGroup523 = new THREE.Group();
    const asteroidMesh523 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh523,asteroidGroup523,55.27,0,243,.3);

    const asteroidGroup524 = new THREE.Group();
    const asteroidMesh524 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh524,asteroidGroup524,97,0,231,.13);

    const asteroidGroup525 = new THREE.Group();
    const asteroidMesh525 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh525,asteroidGroup525,96,0,212.6,.3);

    const asteroidGroup526 = new THREE.Group();
    const asteroidMesh526 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh526,asteroidGroup526,67,0,232,.3);

    const asteroidGroup527 = new THREE.Group();
    const asteroidMesh527 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh527,asteroidGroup527,94,0,191,.63);

    const asteroidGroup528 = new THREE.Group();
    const asteroidMesh528 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh528,asteroidGroup528,64,0,230.6,.3);

    const asteroidGroup529 = new THREE.Group();
    const asteroidMesh529 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh529,asteroidGroup529,85,0,211,.45);

    const asteroidGroup530 = new THREE.Group();
    const asteroidMesh530 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh530,asteroidGroup530,62.3,0,229,.43);

    const asteroidGroup531 = new THREE.Group();
    const asteroidMesh531 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh531,asteroidGroup531,82.7,0,209.7,.13);

    const asteroidGroup532 = new THREE.Group();
    const asteroidMesh532 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh532,asteroidGroup532,62.7,0,226,.3);

    const asteroidGroup533 = new THREE.Group();
    const asteroidMesh533 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh533,asteroidGroup533,84,0,208,.3);

    const asteroidGroup534 = new THREE.Group();
    const asteroidMesh534 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh534,asteroidGroup534,68.7,0,228,.3);

    const asteroidGroup535 = new THREE.Group();
    const asteroidMesh535 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh535,asteroidGroup535,89.6,0,202.6,.3);

    const asteroidGroup536 = new THREE.Group();
    const asteroidMesh536 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh536,asteroidGroup536,71.6,0,223,.3);

    const asteroidGroup537 = new THREE.Group();
    const asteroidMesh537 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh537,asteroidGroup537,102.6,0,205.36,.53);

    const asteroidGroup538 = new THREE.Group();
    const asteroidMesh538 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh538,asteroidGroup538,98,0,203.7,.63);

    const asteroidGroup539 = new THREE.Group();
    const asteroidMesh539 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh539,asteroidGroup539,87.6,0,200.6,.3);

    const asteroidGroup540 = new THREE.Group();
    const asteroidMesh540 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh540,asteroidGroup540,71,.51,210,.51);

    const asteroidGroup541 = new THREE.Group();
    const asteroidMesh541 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh541,asteroidGroup541,71,.51,210,.51);

    const asteroidGroup542 = new THREE.Group();
    const asteroidMesh542 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh542,asteroidGroup542,82,-.51,235,.41);  

    const asteroidGroup543 = new THREE.Group();
    const asteroidMesh543 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh543,asteroidGroup543,53,.51,211,.4);

    const asteroidGroup544 = new THREE.Group();
    const asteroidMesh544 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh544,asteroidGroup544,104,.71,226,.47);

    const asteroidGroup545 = new THREE.Group();
    const asteroidMesh545 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh545,asteroidGroup545,55,-.71,208,.27);

    const asteroidGroup546 = new THREE.Group();
    const asteroidMesh546 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh546,asteroidGroup546,91.7,0,185,.3);

    const asteroidGroup547 = new THREE.Group();
    const asteroidMesh547 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh547,asteroidGroup547,53,0,254,.61);

    const asteroidGroup548 = new THREE.Group();
    const asteroidMesh548 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh548,asteroidGroup548,88,0,222,.3);

    const asteroidGroup549 = new THREE.Group();
    const asteroidMesh549 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh549,asteroidGroup549,59,0,196,.7);

    const asteroidGroup550 = new THREE.Group();
    const asteroidMesh550 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh550,asteroidGroup550,51,.31,239,.27);

    const asteroidGroup551 = new THREE.Group();
    const asteroidMesh551 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh551,asteroidGroup551,102,0,190,.75);

    const asteroidGroup552 = new THREE.Group();
    const asteroidMesh552 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh552,asteroidGroup552,82,-.31,225,.38);  

    const asteroidGroup553 = new THREE.Group();
    const asteroidMesh553 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh553,asteroidGroup553,105,.31,198,.37);

    const asteroidGroup554 = new THREE.Group();
    const asteroidMesh554 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh554,asteroidGroup554,71,.21,233,.27);

    const asteroidGroup555 = new THREE.Group();
    const asteroidMesh555 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh555,asteroidGroup555,84,0,195,.7);

    const asteroidGroup556 = new THREE.Group();
    const asteroidMesh556 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh556,asteroidGroup556,120,0,195,.82);

    const asteroidGroup557 = new THREE.Group();
    const asteroidMesh557 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh557,asteroidGroup557,107,.21,205,.5);

    const asteroidGroup558 = new THREE.Group();
    const asteroidMesh558 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh558,asteroidGroup558,88.8,-.41,228,.27);

    const asteroidGroup559 = new THREE.Group();
    const asteroidMesh559 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh559,asteroidGroup559,95,0,208,.7);

    const asteroidGroup560 = new THREE.Group();
    const asteroidMesh560 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh560,asteroidGroup560,106,.31,238,.67);

    const asteroidGroup561 = new THREE.Group();
    const asteroidMesh561 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh561,asteroidGroup561,112,0,190,.73);

    const asteroidGroup562 = new THREE.Group();
    const asteroidMesh562 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh562,asteroidGroup562,75,-.31,212,.37);  

    const asteroidGroup563 = new THREE.Group();
    const asteroidMesh563 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh563,asteroidGroup563,111,.31,215,.47);

    const asteroidGroup564 = new THREE.Group();
    const asteroidMesh564 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh564,asteroidGroup564,62,-.31,231,.27);

    const asteroidGroup565 = new THREE.Group();
    const asteroidMesh565 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh565,asteroidGroup565,75,.31,215,.37);

    const asteroidGroup566 = new THREE.Group();
    const asteroidMesh566 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh566,asteroidGroup566,92,0,197,.71);

    const asteroidGroup567 = new THREE.Group();
    const asteroidMesh567 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh567,asteroidGroup567,151,0,205,.65);

    const asteroidGroup568 = new THREE.Group();
    const asteroidMesh568 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh568,asteroidGroup568,58,-.31,235,.27);

    const asteroidGroup569 = new THREE.Group();
    const asteroidMesh569 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh569,asteroidGroup569,79,.41,198,.37);

    const asteroidGroup570 = new THREE.Group();
    const asteroidMesh570 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh570,asteroidGroup570,72,-.41,217,.27);

    const asteroidGroup571 = new THREE.Group();
    const asteroidMesh571 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh571,asteroidGroup571,102,0,182,.52);

    const asteroidGroup572 = new THREE.Group();
    const asteroidMesh572 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh572,asteroidGroup572,88,.2,230,.75);  

    const asteroidGroup573 = new THREE.Group();
    const asteroidMesh573 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh573,asteroidGroup573,104,-.21,188,.47);

    const asteroidGroup574 = new THREE.Group();
    const asteroidMesh574 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh574,asteroidGroup574,78,.37,192,.27);

    const asteroidGroup575 = new THREE.Group();
    const asteroidMesh575 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh575,asteroidGroup575,95,-.31,181,.37);

    const asteroidGroup576 = new THREE.Group();
    const asteroidMesh576 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh576,asteroidGroup576,114,0,210,.43);

    const asteroidGroup577 = new THREE.Group();
    const asteroidMesh577 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh577,asteroidGroup577,93,-.7,185,.27);

    const asteroidGroup578 = new THREE.Group();
    const asteroidMesh578 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh578,asteroidGroup578,70,0,203,.47);

    const asteroidGroup579 = new THREE.Group();
    const asteroidMesh579 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh579,asteroidGroup579,120,.5,181.8,.27);

    const asteroidGroup580 = new THREE.Group();
    const asteroidMesh580 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh580,asteroidGroup580,65,-.6,206,.37);

    const asteroidGroup581 = new THREE.Group();
    const asteroidMesh581 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh581,asteroidGroup581,89,.6,220,.42);

    const asteroidGroup582 = new THREE.Group();
    const asteroidMesh582 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh582,asteroidGroup582,62,0,203,.5);  

    const asteroidGroup583 = new THREE.Group();
    const asteroidMesh583 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh583,asteroidGroup583,82,.6,218,.17);

    const asteroidGroup584 = new THREE.Group();
    const asteroidMesh584 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh584,asteroidGroup584,9,.6,206,.27);

    const asteroidGroup585 = new THREE.Group();
    const asteroidMesh585 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh585,asteroidGroup585,75,.6,223,.17);

    const asteroidGroup586 = new THREE.Group();
    const asteroidMesh586 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh586,asteroidGroup586,133,0,210,.67);

    const asteroidGroup587 = new THREE.Group();
    const asteroidMesh587 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh587,asteroidGroup587,70,.6,225,.5);

    const asteroidGroup588 = new THREE.Group();
    const asteroidMesh588 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh588,asteroidGroup588,78,-.6,203,.47);

    const asteroidGroup589 = new THREE.Group();
    const asteroidMesh589 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh589,asteroidGroup589,59,.6,218,.27);

    const asteroidGroup590 = new THREE.Group();
    const asteroidMesh590 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh590,asteroidGroup590,100,.3,191,.27);

    const asteroidGroup591 = new THREE.Group();
    const asteroidMesh591 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh591,asteroidGroup591,120,.31,218,.7);

    const asteroidGroup592 = new THREE.Group();
    const asteroidMesh592 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh592,asteroidGroup592,95,.42,188,.41);  

    const asteroidGroup593 = new THREE.Group();
    const asteroidMesh593 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh593,asteroidGroup593,68,.37,208,.27);

    const asteroidGroup594 = new THREE.Group();
    const asteroidMesh594 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh594,asteroidGroup594,90,-.4,188,.47);

    const asteroidGroup595 = new THREE.Group();
    const asteroidMesh595 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh595,asteroidGroup595,86,.5,209,.37);

    const asteroidGroup596 = new THREE.Group();
    const asteroidMesh596 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh596,asteroidGroup596,90,-.6,194,.4);

    const asteroidGroup597 = new THREE.Group();
    const asteroidMesh597 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh597,asteroidGroup597,109.2,0,200,.3);

    const asteroidGroup598 = new THREE.Group();
    const asteroidMesh598 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh598,asteroidGroup598,104,0,192,.37);

    const asteroidGroup599 = new THREE.Group();
    const asteroidMesh599 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh599,asteroidGroup599,68,.49,212,.37);

    const asteroidGroup600 = new THREE.Group();
    const asteroidMesh600 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh600,asteroidGroup600,88,.4,196,.47);

    const asteroidGroup601 = new THREE.Group();
    const asteroidMesh601 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh601,asteroidGroup601,66,.4,217,.37);

    const asteroidGroup602 = new THREE.Group();
    const asteroidMesh602 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh602,asteroidGroup602,98,.32,194,.38);  

    const asteroidGroup603 = new THREE.Group();
    const asteroidMesh603 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh603,asteroidGroup603,78,.38,209,.27);

    const asteroidGroup604 = new THREE.Group();
    const asteroidMesh604 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh604,asteroidGroup604,84.5,0,190,.53);

    const asteroidGroup605 = new THREE.Group();
    const asteroidMesh605 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh605,asteroidGroup605,58,0,235,.37);

    const asteroidGroup606 = new THREE.Group();
    const asteroidMesh606 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh606,asteroidGroup606,74,0,200,.32);

    const asteroidGroup607 = new THREE.Group();
    const asteroidMesh607 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh607,asteroidGroup607,78,0,225,.35);

    const asteroidGroup608 = new THREE.Group();
    const asteroidMesh608 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh608,asteroidGroup608,82,0,215,.3);

    const asteroidGroup609 = new THREE.Group();
    const asteroidMesh609 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh609,asteroidGroup609,76,0,221,.3);

    const asteroidGroup610 = new THREE.Group();
    const asteroidMesh610 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh610,asteroidGroup610,97,0,216,.3);

    const asteroidGroup611 = new THREE.Group();
    const asteroidMesh611 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh611,asteroidGroup611,68,0,220,.25);

    const asteroidGroup612 = new THREE.Group();
    const asteroidMesh612 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh612,asteroidGroup612,99,0,210,.3);

    const asteroidGroup613 = new THREE.Group();
    const asteroidMesh613 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh613,asteroidGroup613,68,0,218,.37);

    const asteroidGroup614 = new THREE.Group();
    const asteroidMesh614 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh614,asteroidGroup614,92,0,206,.37);

    const asteroidGroup615 = new THREE.Group();
    const asteroidMesh615 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh615,asteroidGroup615,58,0,235,.5);

    const asteroidGroup616 = new THREE.Group();
    const asteroidMesh616 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh616,asteroidGroup616,83,.2,202,.32);

    const asteroidGroup617 = new THREE.Group();
    const asteroidMesh617 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh617,asteroidGroup617,68,.2,250,.65);

    const asteroidGroup618 = new THREE.Group();
    const asteroidMesh618 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh618,asteroidGroup618,118,.2,223,.37);

    const asteroidGroup619 = new THREE.Group();
    const asteroidMesh619 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh619,asteroidGroup619,58,.2,222,.27);

    const asteroidGroup620 = new THREE.Group();
    const asteroidMesh620 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh620,asteroidGroup620,106,0,208,.3);

    const asteroidGroup621 = new THREE.Group();
    const asteroidMesh621 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh621,asteroidGroup621,71,0,238,.3);       

    const asteroidGroup622 = new THREE.Group();
    const asteroidMesh622 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh622,asteroidGroup622,79,.51,239,.39);  

    const asteroidGroup623 = new THREE.Group();
    const asteroidMesh623 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh623,asteroidGroup623,97,-.6,218,.27);

    const asteroidGroup624 = new THREE.Group();
    const asteroidMesh624 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh624,asteroidGroup624,73,.61,212,.2);

    const asteroidGroup625 = new THREE.Group();
    const asteroidMesh625 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh625,asteroidGroup625,95,1,230.5,.17);

    const asteroidGroup626 = new THREE.Group();
    const asteroidMesh626 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh626,asteroidGroup626,90,0,214.5,.3);

    const asteroidGroup627 = new THREE.Group();
    const asteroidMesh627 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMesh627,asteroidGroup627,87,-.6,225,.5);
            


                                //NEGATIVE - POSITIVE [-X,+Z]
    const asteroidInnerGroupA1 = new THREE.Group();
    const asteroidInnerMeshA1 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA1,asteroidInnerGroupA1,-145,0,130,.25);

    const asteroidInnerGroupA2 = new THREE.Group();
    const asteroidInnerMeshA2 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA2,asteroidInnerGroupA2,-142,0,140,.37);

    const asteroidInnerGroupA3 = new THREE.Group();
    const asteroidInnerMeshA3 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA3,asteroidInnerGroupA3,-171,.51,73,.4);

    const asteroidInnerGroupA4 = new THREE.Group();
    const asteroidInnerMeshA4 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA4,asteroidInnerGroupA4,-44,0,160,.28);

    const asteroidInnerGroupA5 = new THREE.Group();
    const asteroidInnerMeshA5 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA5,asteroidInnerGroupA5,-168,-.71,75,.27);

    const asteroidInnerGroupA6 = new THREE.Group();
    const asteroidInnerMeshA6 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA6,asteroidInnerGroupA6,-118,.2,155,.32);

    const asteroidInnerGroupA7 = new THREE.Group();
    const asteroidInnerMeshA7 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA7,asteroidInnerGroupA7,-165,0,77,.61);
        
    const asteroidInnerGroupA8 = new THREE.Group();
    const asteroidInnerMeshA8 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA8,asteroidInnerGroupA8,-103,.2,165,.27);

    const asteroidInnerGroupA9 = new THREE.Group();
    const asteroidInnerMeshA9 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA9,asteroidInnerGroupA9,-98,.2,170,.27);

    const asteroidInnerGroupA10 = new THREE.Group();
    const asteroidInnerMeshA10 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA10,asteroidInnerGroupA10,-90,0,175,.3);

    const asteroidInnerGroupA11 = new THREE.Group();
    const asteroidInnerMeshA11 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA11,asteroidInnerGroupA11,-78,0,164,.72);

    const asteroidInnerGroupA12 = new THREE.Group();
    const asteroidInnerMeshA12 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA12,asteroidInnerGroupA12,-78,0,180,1);

    const asteroidInnerGroupA13 = new THREE.Group();
    const asteroidInnerMeshA13 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA13,asteroidInnerGroupA13,-108,.31,125,.64);

    const asteroidInnerGroupA14 = new THREE.Group();
    const asteroidInnerMeshA14 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA14,asteroidInnerGroupA14,-132,0,100,.75);

    const asteroidInnerGroupA15 = new THREE.Group();
    const asteroidInnerMeshA15 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA15,asteroidInnerGroupA15,-155,0,104,.7);

    const asteroidInnerGroupA16 = new THREE.Group();
    const asteroidInnerMeshA16 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA16,asteroidInnerGroupA16,-105,0,167,.43);

    const asteroidInnerGroupA17 = new THREE.Group();
    const asteroidInnerMeshA17 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA17,asteroidInnerGroupA17,-154,0,79,.7);

    const asteroidInnerGroupA18 = new THREE.Group();
    const asteroidInnerMeshA18 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA18,asteroidInnerGroupA18,-175,.31,95,.37);

    const asteroidInnerGroupA19 = new THREE.Group();
    const asteroidInnerMeshA19 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA19,asteroidInnerGroupA19,-95,0,154,.9);

    const asteroidInnerGroupA20 = new THREE.Group();
    const asteroidInnerMeshA20 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA20,asteroidInnerGroupA20,-124,0,118,.8);

    const asteroidInnerGroupA21 = new THREE.Group();
    const asteroidInnerMeshA21 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA21,asteroidInnerGroupA21,-150,0,132,.73);

    const asteroidInnerGroupA22 = new THREE.Group();
    const asteroidInnerMeshA22 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA22,asteroidInnerGroupA22,-70,0,175,.33);

    const asteroidInnerGroupA23 = new THREE.Group();
    const asteroidInnerMeshA23 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA23,asteroidInnerGroupA23,-164,.31,17,.7);

    const asteroidInnerGroupA24 = new THREE.Group();
    const asteroidInnerMeshA24 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA24,asteroidInnerGroupA24,-172,-.31,95,.37);

    const asteroidInnerGroupA25 = new THREE.Group();
    const asteroidInnerMeshA25 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA25,asteroidInnerGroupA25,-110.6,0,140,.3);

    const asteroidInnerGroupA26 = new THREE.Group();
    const asteroidInnerMeshA26 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA26,asteroidInnerGroupA26,-157,0,112,.71);

    const asteroidInnerGroupA27 = new THREE.Group();
    const asteroidInnerMeshA27 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA27,asteroidInnerGroupA27,-165,0,105,.5);

    const asteroidInnerGroupA28 = new THREE.Group();
    const asteroidInnerMeshA28 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA28,asteroidInnerGroupA28,-125,0,148,.43);

    const asteroidInnerGroupA29 = new THREE.Group();
    const asteroidInnerMeshA29 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA29,asteroidInnerGroupA29,-162,.2,103,.32);        

    const asteroidInnerGroupA30 = new THREE.Group();
    const asteroidInnerMeshA30 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA30,asteroidInnerGroupA30,-177,-.41,92,.37);

    const asteroidInnerGroupA31 = new THREE.Group();
    const asteroidInnerMeshA31 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA31,asteroidInnerGroupA31,-142,0,122,.52);

    const asteroidInnerGroupA32 = new THREE.Group();
    const asteroidInnerMeshA32 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA32,asteroidInnerGroupA32,-165,.2,108,.5);

    const asteroidInnerGroupA33 = new THREE.Group();
    const asteroidInnerMeshA33 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA33,asteroidInnerGroupA33,-146,-.21,125,.7);

    const asteroidInnerGroupA34 = new THREE.Group();
    const asteroidInnerMeshA34 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA34,asteroidInnerGroupA34,-152,.37,98,.45);

    const asteroidInnerGroupA35 = new THREE.Group();
    const asteroidInnerMeshA35 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA35,asteroidInnerGroupA35,-141,-.31,115,.37);

    const asteroidInnerGroupA36 = new THREE.Group();
    const asteroidInnerMeshA36 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA36,asteroidInnerGroupA36,-70.6,0,158.6,.73);////reference71

    const asteroidInnerGroupA37 = new THREE.Group();
    const asteroidInnerMeshA37 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA37,asteroidInnerGroupA37,-130.7,0,142,.63);

    const asteroidInnerGroupA38 = new THREE.Group();
    const asteroidInnerMeshA38 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA38,asteroidInnerGroupA38,-84,0,165.7,.73);

    const asteroidInnerGroupA39 = new THREE.Group();
    const asteroidInnerMeshA39 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA39,asteroidInnerGroupA39,-64,0,170,.5);

    const asteroidInnerGroupA40 = new THREE.Group();
    const asteroidInnerMeshA40 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA40,asteroidInnerGroupA40,-145,-.7,48,.5);
        
    const asteroidInnerGroupA41 = new THREE.Group();
    const asteroidInnerMeshA41 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA41,asteroidInnerGroupA41,-163,0,90,.47);

    const asteroidInnerGroupA42 = new THREE.Group();
    const asteroidInnerMeshA42 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA42,asteroidInnerGroupA42,-110,.4,150,.6);

    const asteroidInnerGroupA43 = new THREE.Group();
    const asteroidInnerMeshA43 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA43,asteroidInnerGroupA43,-172,.61,93,.2);

    const asteroidInnerGroupA44 = new THREE.Group();
    const asteroidInnerMeshA44 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA44,asteroidInnerGroupA44,-113,.32,162,.7);

    const asteroidInnerGroupA45 = new THREE.Group();
    const asteroidInnerMeshA45 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA45,asteroidInnerGroupA45,-88,0,168,.9);

    const asteroidInnerGroupA46 = new THREE.Group();
    const asteroidInnerMeshA46 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA46,asteroidInnerGroupA46,-165,.51,99,.19);

    const asteroidInnerGroupA47 = new THREE.Group();
    const asteroidInnerMeshA47 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA47,asteroidInnerGroupA47,-166,-.6,85,.37);

    const asteroidInnerGroupA48 = new THREE.Group();
    const asteroidInnerMeshA48 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA48,asteroidInnerGroupA48,-168,-.51,96,.27);
        
    const asteroidInnerGroupA49 = new THREE.Group();
    const asteroidInnerMeshA49 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA49,asteroidInnerGroupA49,-88,0,150,.57);

    const asteroidInnerGroupA50 = new THREE.Group();
    const asteroidInnerMeshA50 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA50,asteroidInnerGroupA50,-68,0,155,.63);

    const asteroidInnerGroupA51 = new THREE.Group();
    const asteroidInnerMeshA51 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA51,asteroidInnerGroupA51,-100,0,140,.63);

    const asteroidInnerGroupA52 = new THREE.Group();
    const asteroidInnerMeshA52 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA52,asteroidInnerGroupA52,-163,0,82,.5);

    const asteroidInnerGroupA53 = new THREE.Group();
    const asteroidInnerMeshA53 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA53,asteroidInnerGroupA53,-168,.6,102,.17);

    const asteroidInnerGroupA54 = new THREE.Group();
    const asteroidInnerMeshA54 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA54,asteroidInnerGroupA54,-166,.6,74,.27);

    const asteroidInnerGroupA55 = new THREE.Group();
    const asteroidInnerMeshA55 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA55,asteroidInnerGroupA55,-151,0,114,.63);

    const asteroidInnerGroupA56 = new THREE.Group();
    const asteroidInnerMeshA56 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA56,asteroidInnerGroupA56,-177,0,29,1);

    const asteroidInnerGroupA57 = new THREE.Group();
    const asteroidInnerMeshA57 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA57,asteroidInnerGroupA57,-31,-.7,177,.5);
        
    const asteroidInnerGroupA58 = new THREE.Group();
    const asteroidInnerMeshA58 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA58,asteroidInnerGroupA58,-163,-.6,98,.47);

    const asteroidInnerGroupA59 = new THREE.Group();
    const asteroidInnerMeshA59 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA59,asteroidInnerGroupA59,-178,.6,79,.7);

    const asteroidInnerGroupA60 = new THREE.Group();
    const asteroidInnerMeshA60 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA60,asteroidInnerGroupA60,-149,.3,120,.7);

    const asteroidInnerGroupA61 = new THREE.Group();
    const asteroidInnerMeshA61 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA61,asteroidInnerGroupA61,-166,.31,100,.38);

    const asteroidInnerGroupA62 = new THREE.Group();
    const asteroidInnerMeshA62 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA62,asteroidInnerGroupA62,-145,0,111.7,.3);

    const asteroidInnerGroupA63 = new THREE.Group();
    const asteroidInnerMeshA63 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA63,asteroidInnerGroupA63,-168,.37,88,.27);

    const asteroidInnerGroupA64 = new THREE.Group();
    const asteroidInnerMeshA64 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA64,asteroidInnerGroupA64,-150,0,104.5,.53);

    const asteroidInnerGroupA65 = new THREE.Group();
    const asteroidInnerMeshA65 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA65,asteroidInnerGroupA65,-169,.5,106,.37);

    const asteroidInnerGroupA66 = new THREE.Group();
    const asteroidInnerMeshA66 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA66,asteroidInnerGroupA66,-157,-.6,56,.8);

    const asteroidInnerGroupA67 = new THREE.Group();
    const asteroidInnerMeshA67 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA67,asteroidInnerGroupA67,-144,0,95,.28);
        
    const asteroidInnerGroupA68 = new THREE.Group();
    const asteroidInnerMeshA68 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA68,asteroidInnerGroupA68,-152,0,124,.37);

    const asteroidInnerGroupA69 = new THREE.Group();
    const asteroidInnerMeshA69 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA69,asteroidInnerGroupA69,-172,.49,88,.37);

    const asteroidInnerGroupA70 = new THREE.Group();
    const asteroidInnerMeshA70 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA70,asteroidInnerGroupA70,-56,.4,178,.7);

    const asteroidInnerGroupA71 = new THREE.Group();
    const asteroidInnerMeshA71 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA71,asteroidInnerGroupA71,-177,.4,86,.37);

    const asteroidInnerGroupA72 = new THREE.Group();
    const asteroidInnerMeshA72 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA72,asteroidInnerGroupA72,-154,.32,118,.38);

    const asteroidInnerGroupA73 = new THREE.Group();
    const asteroidInnerMeshA73 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA73,asteroidInnerGroupA73,-169,.38,98,.27);

    const asteroidInnerGroupA74 = new THREE.Group();
    const asteroidInnerMeshA74 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA74,asteroidInnerGroupA74,-168,0,104,.3);

    const asteroidInnerGroupA75 = new THREE.Group();
    const asteroidInnerMeshA75 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA75,asteroidInnerGroupA75,-91,0,165,.45);

    const asteroidInnerGroupA76 = new THREE.Group();
    const asteroidInnerMeshA76 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA76,asteroidInnerGroupA76,-160,0,94,.32);

    const asteroidInnerGroupA77 = new THREE.Group();
    const asteroidInnerMeshA77 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA77,asteroidInnerGroupA77,-185,.6,31,.616);

    const asteroidInnerGroupA78 = new THREE.Group();
    const asteroidInnerMeshA78 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA78,asteroidInnerGroupA78,-176,.51,44,.819);
        
    const asteroidInnerGroupA79 = new THREE.Group();
    const asteroidInnerMeshA79 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA79,asteroidInnerGroupA79,-170,-.6,62,.647);

    const asteroidInnerGroupA80 = new THREE.Group();
    const asteroidInnerMeshA80 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA80,asteroidInnerGroupA80,-180,.37,68,.6);

    const asteroidInnerGroupA81 = new THREE.Group();
    const asteroidInnerMeshA81 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA81,asteroidInnerGroupA81,-156,0,88,1);

    const asteroidInnerGroupA82 = new THREE.Group();
    const asteroidInnerMeshA82 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA82,asteroidInnerGroupA82,-165,0,94,.35);

    const asteroidInnerGroupA83 = new THREE.Group();
    const asteroidInnerMeshA83 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA83,asteroidInnerGroupA83,-178,0,88,1);

    const asteroidInnerGroupA84 = new THREE.Group();
    const asteroidInnerMeshA84 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA84,asteroidInnerGroupA84,-166,0,112,.37);

    const asteroidInnerGroupA85 = new THREE.Group();
    const asteroidInnerMeshA85 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA85,asteroidInnerGroupA85,-40,.21,172,.5);

    const asteroidInnerGroupA86 = new THREE.Group();
    const asteroidInnerMeshA86 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA86,asteroidInnerGroupA86,-116,0,142.7,.73);

    const asteroidInnerGroupA87 = new THREE.Group();
    const asteroidInnerMeshA87 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA87,asteroidInnerGroupA87,-80,0,174.5,.3);

    const asteroidInnerGroupA88 = new THREE.Group();
    const asteroidInnerMeshA88 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA88,asteroidInnerGroupA88,-71,0,170.5,.3);

    const asteroidInnerGroupA89 = new THREE.Group();
    const asteroidInnerMeshA89 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA89,asteroidInnerGroupA89,-62,0,185.56,.3);

    const asteroidInnerGroupA90 = new THREE.Group();
    const asteroidInnerMeshA90 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA90,asteroidInnerGroupA90,-62,0,190,.73);

    const asteroidInnerGroupA91 = new THREE.Group();
    const asteroidInnerMeshA91 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA91,asteroidInnerGroupA91,-54,0,192,.37);

    const asteroidInnerGroupA92 = new THREE.Group();
    const asteroidInnerMeshA92 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA92,asteroidInnerGroupA92,-54,-.21,188,.47);

    const asteroidInnerGroupA93 = new THREE.Group();
    const asteroidInnerMeshA93 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA93,asteroidInnerGroupA93,-52,0,182,.52);

    const asteroidInnerGroupA94 = new THREE.Group();
    const asteroidInnerMeshA94 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA94,asteroidInnerGroupA94,-52,0,190,.75);

    const asteroidInnerGroupA95 = new THREE.Group();
    const asteroidInnerMeshA95 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA95,asteroidInnerGroupA95,-50,.3,191,.27);

    const asteroidInnerGroupA96 = new THREE.Group();
    const asteroidInnerMeshA96 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA96,asteroidInnerGroupA96,-50,.5,181.8,.27);

    const asteroidInnerGroupA97 = new THREE.Group();
    const asteroidInnerMeshA97 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA97,asteroidInnerGroupA97,-48,.32,194,.38);  

    const asteroidInnerGroupA98 = new THREE.Group();
    const asteroidInnerMeshA98 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA98,asteroidInnerGroupA98,-45,.42,188,.41);

    const asteroidInnerGroupA99 = new THREE.Group();
    const asteroidInnerMeshA99 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA99,asteroidInnerGroupA99,-45,-.31,181,.37);

    const asteroidInnerGroupA100 = new THREE.Group();
    const asteroidInnerMeshA100 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA100,asteroidInnerGroupA100,-44,0,191,.63);

    const asteroidInnerGroupA101 = new THREE.Group();
    const asteroidInnerMeshA101 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA101,asteroidInnerGroupA101,-40,-.4,188,.47);

    const asteroidInnerGroupA102 = new THREE.Group();
    const asteroidInnerMeshA102 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA102,asteroidInnerGroupA102,-38,.4,196,.47);

    const asteroidInnerGroupA103 = new THREE.Group();
    const asteroidInnerMeshA103 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA103,asteroidInnerGroupA103,-38,0,180.27,.3);

    const asteroidInnerGroupA104 = new THREE.Group();
    const asteroidInnerMeshA104 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA104,asteroidInnerGroupA104,-34,0,195,.7);

    const asteroidInnerGroupA105 = new THREE.Group();
    const asteroidInnerMeshA105 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA105,asteroidInnerGroupA105,-33,.31,195,.17);

    const asteroidInnerGroupA106 = new THREE.Group();
    const asteroidInnerMeshA106 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA106,asteroidInnerGroupA106,-29,.41,198,.37);

    const asteroidInnerGroupA107 = new THREE.Group();
    const asteroidInnerMeshA107 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA107,asteroidInnerGroupA107,-27,0,189,.7);

    const asteroidInnerGroupA108 = new THREE.Group();
    const asteroidInnerMeshA108 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA108,asteroidInnerGroupA108,-25,0,184,.28);

    const asteroidInnerGroupA109 = new THREE.Group();
    const asteroidInnerMeshA109 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA109,asteroidInnerGroupA109,-18,.51,188,.51);

    const asteroidInnerGroupA110 = new THREE.Group();
    const asteroidInnerMeshA110 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA110,asteroidInnerGroupA110,-17,-.31,196,.45);

    const asteroidInnerGroupA111 = new THREE.Group();
    const asteroidInnerMeshA111 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA111,asteroidInnerGroupA111,-9,0,194,.7);

    const asteroidInnerGroupA112 = new THREE.Group();
    const asteroidInnerMeshA112 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA112,asteroidInnerGroupA112,-6,0,185,.83);

    const asteroidInnerGroupA113 = new THREE.Group();
    const asteroidInnerMeshA113 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA113,asteroidInnerGroupA113,-100,0,165.8,.13);

    const asteroidInnerGroupA114 = new THREE.Group();
    const asteroidInnerMeshA114 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA114,asteroidInnerGroupA114,-102,0,156.5,.53);

    const asteroidInnerGroupA115 = new THREE.Group();
    const asteroidInnerMeshA115 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA115,asteroidInnerGroupA115,-105,.32,146,.7);

    const asteroidInnerGroupA116 = new THREE.Group();
    const asteroidInnerMeshA116 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA116,asteroidInnerGroupA116,-105,0,170.3,.43);

    const asteroidInnerGroupA117 = new THREE.Group();
    const asteroidInnerMeshA117 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA117,asteroidInnerGroupA117,-110,.4,138,.47);

    const asteroidInnerGroupA118 = new THREE.Group();
    const asteroidInnerMeshA118 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA118,asteroidInnerGroupA118,-146,0,106.,.27);

    const asteroidInnerGroupA119 = new THREE.Group();
    const asteroidInnerMeshA119 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA119,asteroidInnerGroupA119,-182,0,52,.52);

    const asteroidInnerGroupA120 = new THREE.Group();
    const asteroidInnerMeshA120 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA120,asteroidInnerGroupA120,-182,.2,78,.27);

    const asteroidInnerGroupA121 = new THREE.Group();
    const asteroidInnerMeshA121 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA121,asteroidInnerGroupA121,-181,-.31,45,.37);

    const asteroidInnerGroupA122 = new THREE.Group();
    const asteroidInnerMeshA122 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA122,asteroidInnerGroupA122,-184,0,25,.28);

    const asteroidInnerGroupA123 = new THREE.Group();
    const asteroidInnerMeshA123 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA123,asteroidInnerGroupA123,-185,-.7,43,.27);

    const asteroidInnerGroupA124 = new THREE.Group();
    const asteroidInnerMeshA124 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA124,asteroidInnerGroupA124,-185,0,41.7,.3);

    const asteroidInnerGroupA125 = new THREE.Group();
    const asteroidInnerMeshA125 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA125,asteroidInnerGroupA125,-186,0,36.5,.27);

    const asteroidInnerGroupA126 = new THREE.Group();
    const asteroidInnerMeshA126 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA126,asteroidInnerGroupA126,-188,-.21,54,.47);

    const asteroidInnerGroupA127 = new THREE.Group();
    const asteroidInnerMeshA127 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA127,asteroidInnerGroupA127,-188,.42,45,.41);

    const asteroidInnerGroupA128 = new THREE.Group();
    const asteroidInnerMeshA128 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA128,asteroidInnerGroupA128,-188,-.4,40,.47);

    const asteroidInnerGroupA129 = new THREE.Group();
    const asteroidInnerMeshA129 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA129,asteroidInnerGroupA129,-190,0,52,.75);

    const asteroidInnerGroupA130 = new THREE.Group();
    const asteroidInnerMeshA130 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA130,asteroidInnerGroupA130,-190,0,62,.73);

    const asteroidInnerGroupA131 = new THREE.Group();
    const asteroidInnerMeshA131 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA131,asteroidInnerGroupA131,-191,.3,50,.27);

    const asteroidInnerGroupA132 = new THREE.Group();
    const asteroidInnerMeshA132 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA132,asteroidInnerGroupA132,-191,0,44,.63);

    const asteroidInnerGroupA133 = new THREE.Group();
    const asteroidInnerMeshA133 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA133,asteroidInnerGroupA133,-192,0,54,.37);

    const asteroidInnerGroupA134 = new THREE.Group();
    const asteroidInnerMeshA134 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA134,asteroidInnerGroupA134,-194,.32,48,.38);

    const asteroidInnerGroupA135 = new THREE.Group();
    const asteroidInnerMeshA135 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA135,asteroidInnerGroupA135,-194,0,9,.7);

    const asteroidInnerGroupA136 = new THREE.Group();
    const asteroidInnerMeshA136 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA136,asteroidInnerGroupA136,-194,-.6,40,.4);

    const asteroidInnerGroupA137 = new THREE.Group();
    const asteroidInnerMeshA137 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA137,asteroidInnerGroupA137,-195,0,34,.7);

    const asteroidInnerGroupA138 = new THREE.Group();
    const asteroidInnerMeshA138 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA138,asteroidInnerGroupA138,-195,.31,33,.17);

    const asteroidInnerGroupA139 = new THREE.Group();
    const asteroidInnerMeshA139 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA139,asteroidInnerGroupA139,-196,.37,16,.8);

    const asteroidInnerGroupA140 = new THREE.Group();
    const asteroidInnerMeshA140 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA140,asteroidInnerGroupA140,-196,.4,38,.47);

    const asteroidInnerGroupA141 = new THREE.Group();
    const asteroidInnerMeshA141 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA141,asteroidInnerGroupA141,-120,0,147.2,.3);////

    const asteroidInnerGroupA142 = new THREE.Group();
    const asteroidInnerMeshA142 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA142,asteroidInnerGroupA142,-190,0,34.5,.53);////

    const asteroidInnerGroupA143 = new THREE.Group();
    const asteroidInnerMeshA143 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA143,asteroidInnerGroupA143,-34.5,0,190,.53);

    const asteroidInnerGroupA144 = new THREE.Group();
    const asteroidInnerMeshA144 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA144,asteroidInnerGroupA144,-36.5,0,186,.27);

    const asteroidInnerGroupA145 = new THREE.Group();
    const asteroidInnerMeshA145 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA145,asteroidInnerGroupA145,-56.5,0,186,.27);

    const asteroidInnerGroupA146 = new THREE.Group();
    const asteroidInnerMeshA146 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA146,asteroidInnerGroupA146,-41.7,0,185,.3);

    const asteroidInnerGroupA147 = new THREE.Group();
    const asteroidInnerMeshA147 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA147,asteroidInnerGroupA147,-115.5,0,128,.3);

    const asteroidInnerGroupA148 = new THREE.Group();
    const asteroidInnerMeshA148 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA148,asteroidInnerGroupA148,-198,.41,29,.37);

    const asteroidInnerGroupA149 = new THREE.Group();
    const asteroidInnerMeshA149 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA149,asteroidInnerGroupA149,-172,-.4,52,.47);

    const asteroidInnerGroupA150 = new THREE.Group();
    const asteroidInnerMeshA150 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA150,asteroidInnerGroupA150,-168,.3,91,.36);///// 

    const asteroidInnerGroupA151 = new THREE.Group();
    const asteroidInnerMeshA151 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA151,asteroidInnerGroupA151,-141.8,.5,120,.27);

    const asteroidInnerGroupA152 = new THREE.Group();
    const asteroidInnerMeshA152 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA152,asteroidInnerGroupA152,-181.8,.5,50,.27);

    const asteroidInnerGroupA153 = new THREE.Group();
    const asteroidInnerMeshA153 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA153,asteroidInnerGroupA153,-125.6,0,130.6,.3);

    const asteroidInnerGroupA154 = new THREE.Group();
    const asteroidInnerMeshA154 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA154,asteroidInnerGroupA154,-138,0,135,.35);

    const asteroidInnerGroupA155 = new THREE.Group();
    const asteroidInnerMeshA155 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA155,asteroidInnerGroupA155,-162.6,0,109.6,.3);///// 

    const asteroidInnerGroupA156 = new THREE.Group();
    const asteroidInnerMeshA156 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA156,asteroidInnerGroupA156,-169.7,0,102.7,.13);///// 

    const asteroidInnerGroupA157 = new THREE.Group();
    const asteroidInnerMeshA157 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshA157,asteroidInnerGroupA157,-100.7,0,168.7,.13);///// 


                                //MAIN ORBIT 
                                                                            //RIGHT/BOTTOM
    const asteroidGroupA1 = new THREE.Group();
    const asteroidMeshA1 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA1,asteroidGroupA1,-209.7,0,32.7,.13);

    const asteroidGroupA2 = new THREE.Group();
    const asteroidMeshA2 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA2,asteroidGroupA2,-226,0,12.7,.3);

    const asteroidGroupA3 = new THREE.Group();
    const asteroidMeshA3 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA3,asteroidGroupA3,-208,0,34,.3);

    const asteroidGroupA4 = new THREE.Group();
    const asteroidMeshA4 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA4,asteroidGroupA4,-228,0,18.7,.3);

    const asteroidGroupA5 = new THREE.Group();
    const asteroidMeshA5 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA5,asteroidGroupA5,-202.6,0,39.6,.3);

    const asteroidGroupA6 = new THREE.Group();
    const asteroidMeshA6 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA6,asteroidGroupA6,-223,0,21.6,.3);

    const asteroidGroupA7 = new THREE.Group();
    const asteroidMeshA7 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA7,asteroidGroupA7,-205.36,0,52.6,.53);

    const asteroidGroupA8 = new THREE.Group();
    const asteroidMeshA8 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA8,asteroidGroupA8,-203.7,0,48,.63);

    const asteroidGroupA9 = new THREE.Group();
    const asteroidMeshA9 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA9,asteroidGroupA9,-200.6,0,37.6,.3);  

    const asteroidGroupA10 = new THREE.Group();
    const asteroidMeshA10 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA10,asteroidGroupA10,-248,.38,40,.67);

    const asteroidGroupA11 = new THREE.Group();
    const asteroidMeshA11 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA11,asteroidGroupA11,-260,.38,12,.7);

    const asteroidGroupA12 = new THREE.Group();
    const asteroidMeshA12 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA12,asteroidGroupA12,-210,0,49,.3);

    const asteroidGroupA13 = new THREE.Group();
    const asteroidMeshA13 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA13,asteroidGroupA13,-211,0,35,.45);

    const asteroidGroupA14 = new THREE.Group();
    const asteroidMeshA14 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA14,asteroidGroupA14,-200,0,59.2,.3);

    const asteroidGroupA15 = new THREE.Group();
    const asteroidMeshA15 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA15,asteroidGroupA15,-214.5,0,40,.3);

    const asteroidGroupA16 = new THREE.Group();
    const asteroidMeshA16 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA16,asteroidGroupA16,-210,0,64,.43);

    const asteroidGroupA17 = new THREE.Group();
    const asteroidMeshA17 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA17,asteroidGroupA17,-230.6,0,14,.3);

    const asteroidGroupA18 = new THREE.Group();
    const asteroidMeshA18 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA18,asteroidGroupA18,-207,0,60.8,.13);

    const asteroidGroupA19 = new THREE.Group();
    const asteroidMeshA19 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA19,asteroidGroupA19,-243,0,46,.3);

    const asteroidGroupA20 = new THREE.Group();
    const asteroidMeshA20 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA20,asteroidGroupA20,-242,0,36,.23);

    const asteroidGroupA21 = new THREE.Group();
    const asteroidMeshA21 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA21,asteroidGroupA21,-241,0,15.5,.3);

    const asteroidGroupA22 = new THREE.Group();
    const asteroidMeshA22 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA22,asteroidGroupA22,-218,.51,73,.51);

    const asteroidGroupA23 = new THREE.Group();
    const asteroidMeshA23 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA23,asteroidGroupA23,-243,0,5.27,.3);

    const asteroidGroupA24 = new THREE.Group();
    const asteroidMeshA24 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA24,asteroidGroupA24,-231,0,47,.13);

    const asteroidGroupA25 = new THREE.Group();
    const asteroidMeshA25 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA25,asteroidGroupA25,-212.6,0,46,.3);

    const asteroidGroupA26 = new THREE.Group();
    const asteroidMeshA26 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA26,asteroidGroupA26,-232,0,17,.3);

    const asteroidGroupA27 = new THREE.Group();
    const asteroidMeshA27 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA27,asteroidGroupA27,-229,0,12.3,.43);

    const asteroidGroupA28 = new THREE.Group();
    const asteroidMeshA28 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA28,asteroidGroupA28,-222,0,38,.3);

    const asteroidGroupA29 = new THREE.Group();
    const asteroidMeshA29 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA29,asteroidGroupA29,-205,0,7,.61);      

    const asteroidGroupA30 = new THREE.Group();
    const asteroidMeshA30 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA30,asteroidGroupA30,-239,.31,1,.27);

    const asteroidGroupA31 = new THREE.Group();
    const asteroidMeshA31 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA31,asteroidGroupA31,-200,0,44,.72);

    const asteroidGroupA32 = new THREE.Group();
    const asteroidMeshA32 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA32,asteroidGroupA32,-225,-.31,2,.5);  

    const asteroidGroupA34 = new THREE.Group();
    const asteroidMeshA34 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA34,asteroidGroupA34,-233,.21,21,.27);

    const asteroidGroupA36 = new THREE.Group();
    const asteroidMeshA36 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA36,asteroidGroupA36,-208,0,71,.82);

    const asteroidGroupA37 = new THREE.Group();
    const asteroidMeshA37 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA37,asteroidGroupA37,-205,.21,57,.5);
        
    const asteroidGroupA38 = new THREE.Group();
    const asteroidMeshA38 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA38,asteroidGroupA38,-228,-.41,28.8,.27);

    const asteroidGroupA39 = new THREE.Group();
    const asteroidMeshA39 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA39,asteroidGroupA39,-208,0,45,.7);

    const asteroidGroupA40 = new THREE.Group();
    const asteroidMeshA40 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA40,asteroidGroupA40,-215,.31,36,.47);

    const asteroidGroupA42 = new THREE.Group();
    const asteroidMeshA42 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA42,asteroidGroupA42,-212,-.31,25,.37);

    const asteroidGroupA44 = new THREE.Group();
    const asteroidMeshA44 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA44,asteroidGroupA44,-231,-.31,12,.27);

    const asteroidGroupA45 = new THREE.Group();
    const asteroidMeshA45 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA45,asteroidGroupA45,-215,.31,25,.37);

    const asteroidGroupA46 = new THREE.Group();
    const asteroidMeshA46 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA46,asteroidGroupA46,-197,0,54,.71);

    const asteroidGroupA47 = new THREE.Group();
    const asteroidMeshA47 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA47,asteroidGroupA47,-205,0,35,.5);
        
    const asteroidGroupA48 = new THREE.Group();
    const asteroidMeshA48 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA48,asteroidGroupA48,-235,-.31,8,.27);

    const asteroidGroupA50 = new THREE.Group();
    const asteroidMeshA50 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA50,asteroidGroupA50,-217,-.41,22,.27);

    const asteroidGroupA52 = new THREE.Group();
    const asteroidMeshA52 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA52,asteroidGroupA52,-205,.2,38,.5);  
        
    const asteroidGroupA58 = new THREE.Group();
    const asteroidMeshA58 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA58,asteroidGroupA58,-203,0,20,.47);

    const asteroidGroupA60 = new THREE.Group();
    const asteroidMeshA60 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA60,asteroidGroupA60,-215,-1,20,.4);

    const asteroidGroupA61 = new THREE.Group();
    const asteroidMeshA61 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA61,asteroidGroupA61,-221,.3,43,.11);

    const asteroidGroupA62 = new THREE.Group();
    const asteroidMeshA62 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA62,asteroidGroupA62,-205,.51,29,.19);  

    const asteroidGroupA63 = new THREE.Group();
    const asteroidMeshA63 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA63,asteroidGroupA63,-218,-.6,47,.27);

    const asteroidGroupA64 = new THREE.Group();
    const asteroidMeshA64 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA64,asteroidGroupA64,-212,.61,23,.2);

    const asteroidGroupA65 = new THREE.Group();
    const asteroidMeshA65 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA65,asteroidGroupA65,-230.5,1,45,.17);

    const asteroidGroupA66 = new THREE.Group();
    const asteroidMeshA66 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA66,asteroidGroupA66,-208,.3,21,.36);

    const asteroidGroupA67 = new THREE.Group();
    const asteroidMeshA67 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA67,asteroidGroupA67,-225,-.6,37,.5);
        
    const asteroidGroupA68 = new THREE.Group();
    const asteroidMeshA68 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA68,asteroidGroupA68,-208,-.51,26,.27);

    const asteroidGroupA69 = new THREE.Group();
    const asteroidMeshA69 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA69,asteroidGroupA69,-218,.31,29,.37);

    const asteroidGroupA70 = new THREE.Group();
    const asteroidMeshA70 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA70,asteroidGroupA70,-206,-.6,15,.37);

    const asteroidGroupA71 = new THREE.Group();
    const asteroidMeshA71 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA71,asteroidGroupA71,-220,.6,39,.42);

    const asteroidGroupA72 = new THREE.Group();
    const asteroidMeshA72 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA72,asteroidGroupA72,-203,0,12,.5);  

    const asteroidGroupA73 = new THREE.Group();
    const asteroidMeshA73 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA73,asteroidGroupA73,-218,.6,32,.17);

    const asteroidGroupA74 = new THREE.Group();
    const asteroidMeshA74 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA74,asteroidGroupA74,-206,.6,4,.27);

    const asteroidGroupA75 = new THREE.Group();
    const asteroidMeshA75 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA75,asteroidGroupA75,-223,.6,25,.17);

    const asteroidGroupA76 = new THREE.Group();
    const asteroidMeshA76 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA76,asteroidGroupA76,-190,0,77,.67);

    const asteroidGroupA77 = new THREE.Group();
    const asteroidMeshA77 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA77,asteroidGroupA77,-212,.6,146,.75);

    const asteroidGroupA79 = new THREE.Group();
    const asteroidMeshA79 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA79,asteroidGroupA79,-218,.6,9,.27);

    const asteroidGroupA81 = new THREE.Group();
    const asteroidMeshA81 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA81,asteroidGroupA81,-206,.31,30,.38);

    const asteroidGroupA85 = new THREE.Group();
    const asteroidMeshA85 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA85,asteroidGroupA85,-209,.5,36,.37);

    const asteroidGroupA89 = new THREE.Group();
    const asteroidMeshA89 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA89,asteroidGroupA89,-212,.49,18,.37);

    const asteroidGroupA91 = new THREE.Group();
    const asteroidMeshA91 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA91,asteroidGroupA91,-217,.4,16,.37);

    const asteroidGroupA93 = new THREE.Group();
    const asteroidMeshA93 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA93,asteroidGroupA93,-254,.38,28,.7);

    const asteroidGroupA95 = new THREE.Group();
    const asteroidMeshA95 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA95,asteroidGroupA95,-235,0,8,.37);

    const asteroidGroupA96 = new THREE.Group();
    const asteroidMeshA96 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA96,asteroidGroupA96,-200,0,168,.32);

    const asteroidGroupA97 = new THREE.Group();
    const asteroidMeshA97 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA97,asteroidGroupA97,-225,0,28,.35);
        
    const asteroidGroupA98 = new THREE.Group();
    const asteroidMeshA98 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA98,asteroidGroupA98,-215,0,32,.3);

    const asteroidGroupA99 = new THREE.Group();
    const asteroidMeshA99 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA99,asteroidGroupA99,-221,0,26,.3);

    const asteroidGroupA100 = new THREE.Group();
    const asteroidMeshA100 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA100,asteroidGroupA100,-216,0,47,.3);

    const asteroidGroupA101 = new THREE.Group();
    const asteroidMeshA101 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA101,asteroidGroupA101,-220,0,18,.25);////////////////////\\\\\\

    const asteroidGroupA102 = new THREE.Group();
    const asteroidMeshA102 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA102,asteroidGroupA102,-205,0,24,.35);  

    const asteroidGroupA103 = new THREE.Group();
    const asteroidMeshA103 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA103,asteroidGroupA103,-218,0,18,.37);

    const asteroidGroupA104 = new THREE.Group();
    const asteroidMeshA104 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA104,asteroidGroupA104,-206,0,42,.37);

    const asteroidGroupA105 = new THREE.Group();
    const asteroidMeshA105 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA105,asteroidGroupA105,-235,0,8,.5);

    const asteroidGroupA106 = new THREE.Group();
    const asteroidMeshA106 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA106,asteroidGroupA106,-202,.2,33,.32);
        
    const asteroidGroupA108 = new THREE.Group();
    const asteroidMeshA108 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA108,asteroidGroupA108,-245,.2,28,.57);

    const asteroidGroupA109 = new THREE.Group();
    const asteroidMeshA109 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA109,asteroidGroupA109,-222,.2,8,.27);

    const asteroidGroupA110 = new THREE.Group();
    const asteroidMeshA110 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA110,asteroidGroupA110,-208,0,56,.3);

    const asteroidGroupA111 = new THREE.Group();
    const asteroidMeshA111 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA111,asteroidGroupA111,-238,0,21,.3);

    const asteroidGroupA112 = new THREE.Group();
    const asteroidMeshA112 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA112,asteroidGroupA112,-250,.51,21,.51);

    const asteroidGroupA113 = new THREE.Group();
    const asteroidMeshA113 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA113,asteroidGroupA113,-235,-.51,32,.41);  

    const asteroidGroupA114 = new THREE.Group();
    const asteroidMeshA114 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA114,asteroidGroupA114,-211,.51,3,.4);

    const asteroidGroupA115 = new THREE.Group();
    const asteroidMeshA115 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA115,asteroidGroupA115,-216,.71,34,.27);

    const asteroidGroupA116 = new THREE.Group();
    const asteroidMeshA116 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA116,asteroidGroupA116,-208,-.71,5,.27);



                                                        //RIGHT/BOTTOM/LEFT - 1ST FILL LEFT                         
    const asteroidGroupA117 = new THREE.Group();
    const asteroidMeshA117 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA117,asteroidGroupA117,-174.5,0,110,.3);

    const asteroidGroupA118 = new THREE.Group();
    const asteroidMeshA118 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA118,asteroidGroupA118,-188,-.41,98.8,.27);

    const asteroidGroupA119 = new THREE.Group();
    const asteroidMeshA119 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA119,asteroidGroupA119,-168,0,183,.7);

    const asteroidGroupA120 = new THREE.Group();
    const asteroidMeshA120 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA120,asteroidGroupA120,-175,.31,106,.47);

    const asteroidGroupA121 = new THREE.Group();
    const asteroidMeshA121 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA121,asteroidGroupA121,-199,.31,71,.27);

    const asteroidGroupA122 = new THREE.Group();
    const asteroidMeshA122 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA122,asteroidGroupA122,-188,0,88.7,.3);

    const asteroidGroupA123 = new THREE.Group();
    const asteroidMeshA123 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA123,asteroidGroupA123,-183,0,91.6,.3);

    const asteroidGroupA124 = new THREE.Group();
    const asteroidMeshA124 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA124,asteroidGroupA124,-165.36,0,122.6,.53);

    const asteroidGroupA125 = new THREE.Group();
    const asteroidMeshA125 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA125,asteroidGroupA125,-186,0,82.7,.3);

    const asteroidGroupA126 = new THREE.Group();
    const asteroidMeshA126 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA126,asteroidGroupA126,-191,-.31,82,.27);

    const asteroidGroupA127 = new THREE.Group();
    const asteroidMeshA127 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA127,asteroidGroupA127,-181,.6,121,.6);

    const asteroidGroupA128 = new THREE.Group();
    const asteroidMeshA128 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA128,asteroidGroupA128,-195,-.31,78,.27);

    const asteroidGroupA129 = new THREE.Group();
    const asteroidMeshA129 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA129,asteroidGroupA129,-170.7,0,113,.63);

    const asteroidGroupA130 = new THREE.Group();
    const asteroidMeshA130 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA130,asteroidGroupA130,-160.6,0,135.6,.53);

    const asteroidGroupA131 = new THREE.Group();
    const asteroidMeshA131 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA131,asteroidGroupA131,-170,.51,220,1.1);

    const asteroidGroupA132 = new THREE.Group();
    const asteroidMeshA132 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA132,asteroidGroupA132,-195,-.51,102,.41);  

    const asteroidGroupA133 = new THREE.Group();
    const asteroidMeshA133 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA133,asteroidGroupA133,-176,0,130,.52);

    const asteroidGroupA134 = new THREE.Group();
    const asteroidMeshA134 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA134,asteroidGroupA134,-182,0,108,.3);

    const asteroidGroupA135 = new THREE.Group();
    const asteroidMeshA135 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA135,asteroidGroupA135,-185,-.31,102,.38); 

    const asteroidGroupA136 = new THREE.Group();
    const asteroidMeshA136 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA136,asteroidGroupA136,-179,.71,104,.7);

    const asteroidGroupA137 = new THREE.Group();
    const asteroidMeshA137 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA137,asteroidGroupA137,-193,.21,91,.27);

    const asteroidGroupA138 = new THREE.Group();
    const asteroidMeshA138 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA138,asteroidGroupA138,-155,0,140,.82);

    const asteroidGroupA139 = new THREE.Group();
    const asteroidMeshA139 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA139,asteroidGroupA139,-165,.21,127,.5);

    const asteroidGroupA140 = new THREE.Group();
    const asteroidMeshA140 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA140,asteroidGroupA140,-175,-1,203,.74);

    const asteroidGroupA141 = new THREE.Group();
    const asteroidMeshA141 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA141,asteroidGroupA141,-184,.3,113,.8);

    const asteroidGroupA142 = new THREE.Group();
    const asteroidMeshA142 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA142,asteroidGroupA142,-191,0,117,.13);

    const asteroidGroupA143 = new THREE.Group();
    const asteroidMeshA143 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA143,asteroidGroupA143,-178,-.6,117,.27);

    const asteroidGroupA144 = new THREE.Group();
    const asteroidMeshA144 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA144,asteroidGroupA144,-172.6,0,116,.3);

    const asteroidGroupA145 = new THREE.Group();
    const asteroidMeshA145 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA145,asteroidGroupA145,-190.5,1,115,.17);

    const asteroidGroupA146 = new THREE.Group();
    const asteroidMeshA146 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA146,asteroidGroupA146,-190.6,0,84,.3);

    const asteroidGroupA147 = new THREE.Group();
    const asteroidMeshA147 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA147,asteroidGroupA147,-185,-.6,107,.5);

    const asteroidGroupA148 = new THREE.Group();
    const asteroidMeshA148 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA148,asteroidGroupA148,-192,0,97,.3);

    const asteroidGroupA149 = new THREE.Group();
    const asteroidMeshA149 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA149,asteroidGroupA149,-164,.31,197,.57);

    const asteroidGroupA150 = new THREE.Group();
    const asteroidMeshA150 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA150,asteroidGroupA150,-189,0,82.3,.43);

    const asteroidGroupA151 = new THREE.Group();
    const asteroidMeshA151 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA151,asteroidGroupA151,-180,.6,109,.42);

    const asteroidGroupA152 = new THREE.Group();
    const asteroidMeshA152 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA152,asteroidGroupA152,-201,0,85.5,.3);

    const asteroidGroupA153 = new THREE.Group();
    const asteroidMeshA153 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA153,asteroidGroupA153,-201,0,91,.13);

    const asteroidGroupA154 = new THREE.Group();
    const asteroidMeshA154 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA154,asteroidGroupA154,-203,0,75.27,.3);

    const asteroidGroupA155 = new THREE.Group();
    const asteroidMeshA155 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA155,asteroidGroupA155,-183,.6,95,.17);

    const asteroidGroupA156 = new THREE.Group();
    const asteroidMeshA156 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA156,asteroidGroupA156,-145,0,153,.67);

    const asteroidGroupA157 = new THREE.Group();
    const asteroidMeshA157 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA157,asteroidGroupA157,-185,.6,90,.5);

    const asteroidGroupA158 = new THREE.Group();
    const asteroidMeshA158 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA158,asteroidGroupA158,-170,0,134,.43);

    const asteroidGroupA159 = new THREE.Group();
    const asteroidMeshA159 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA159,asteroidGroupA159,-167,0,130.8,.13);

    const asteroidGroupA160 = new THREE.Group();
    const asteroidMeshA160 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA160,asteroidGroupA160,-205,0,112,.3);

    const asteroidGroupA161 = new THREE.Group();
    const asteroidMeshA161 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA161,asteroidGroupA161,-202,0,106,.23);

    const asteroidGroupA162 = new THREE.Group();
    const asteroidMeshA162 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA162,asteroidGroupA162,-207,.42,167,1.1);

    const asteroidGroupA163 = new THREE.Group();
    const asteroidMeshA163 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA163,asteroidGroupA163,-195,0,78,.37);      

    const asteroidGroupA164 = new THREE.Group();
    const asteroidMeshA164 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA164,asteroidGroupA164,-185,0,98,.35);
        
    const asteroidGroupA166 = new THREE.Group();
    const asteroidMeshA166 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA166,asteroidGroupA166,-175,0,102,.3);

    const asteroidGroupA165 = new THREE.Group();
    const asteroidMeshA165 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA165,asteroidGroupA165,-181,0,96,.3);

    const asteroidGroupA167 = new THREE.Group();
    const asteroidMeshA167 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA167,asteroidGroupA167,-176,0,117,.3);

    const asteroidGroupA168 = new THREE.Group();
    const asteroidMeshA168 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA168,asteroidGroupA168,-195,0,78,.5);

    const asteroidGroupA169 = new THREE.Group();
    const asteroidMeshA169 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA169,asteroidGroupA169,-185,.2,88,.35);
        
    const asteroidGroupA170 = new THREE.Group();
    const asteroidMeshA170 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA170,asteroidGroupA170,-185,.2,198,.8);//\\\\\OUTER ORBIT LONER

    const asteroidGroupA171 = new THREE.Group();
    const asteroidMeshA171 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA171,asteroidGroupA171,-168,0,126,.3);

    const asteroidGroupA172 = new THREE.Group();
    const asteroidMeshA172 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA172,asteroidGroupA172,-198,0,91,.3);

    const asteroidGroupA173 = new THREE.Group();
    const asteroidMeshA173 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA173,asteroidGroupA173,-170,0,119,.3);

    const asteroidGroupA174 = new THREE.Group();
    const asteroidMeshA174 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA174,asteroidGroupA174,-160,0,129.2,.3);



                                                //RIGHT/BOTTOM/DOWN/LEFT - 2ND FILL LEFT DOWN
    const asteroidGroupA175 = new THREE.Group();
    const asteroidMeshA175 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA175,asteroidGroupA175,-5,0,226,.43);

    const asteroidGroupA176 = new THREE.Group();
    const asteroidMeshA176 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA176,asteroidGroupA176,-210,0,132,.67);

    const asteroidGroupA177 = new THREE.Group();
    const asteroidMeshA177 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA177,asteroidGroupA177,-185,.6,130,.5);

    const asteroidGroupA179 = new THREE.Group();
    const asteroidMeshA179 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA179,asteroidGroupA179,-238,.6,59,.27);

    const asteroidGroupA180 = new THREE.Group();
    const asteroidMeshA180 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA180,asteroidGroupA180,-211,.3,100,.27);

    const asteroidGroupA181 = new THREE.Group();
    const asteroidMeshA181 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA181,asteroidGroupA181,-226,.31,80,.38);

    const asteroidGroupA182 = new THREE.Group();
    const asteroidMeshA182 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA182,asteroidGroupA182,-208,.42,95,.41);  

    const asteroidGroupA184 = new THREE.Group();
    const asteroidMeshA184 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA184,asteroidGroupA184,-208,-.4,90,.47);

    const asteroidGroupA185 = new THREE.Group();
    const asteroidMeshA185 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA185,asteroidGroupA185,-229,.5,86,.37);

    const asteroidGroupA186 = new THREE.Group();
    const asteroidMeshA186 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA186,asteroidGroupA186,-214,-.6,90,.4);

    const asteroidGroupA187 = new THREE.Group();
    const asteroidMeshA187 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA187,asteroidGroupA187,-204,0,75,.28);
        
    const asteroidGroupA188 = new THREE.Group();
    const asteroidMeshA188 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA188,asteroidGroupA188,-212,0,104,.37);

    const asteroidGroupA189 = new THREE.Group();
    const asteroidMeshA189 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA189,asteroidGroupA189,-232,.49,68,.37);

    const asteroidGroupA190 = new THREE.Group();
    const asteroidMeshA190 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA190,asteroidGroupA190,-216,.4,88,.47);

    const asteroidGroupA191 = new THREE.Group();
    const asteroidMeshA191 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA191,asteroidGroupA191,-237,.4,66,.37);

    const asteroidGroupA192 = new THREE.Group();
    const asteroidMeshA192 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA192,asteroidGroupA192,-214,.32,98,.38);  

    const asteroidGroupA193 = new THREE.Group();
    const asteroidMeshA193 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA193,asteroidGroupA193,-221,.38,122,.57);

    const asteroidGroupA194 = new THREE.Group();
    const asteroidMeshA194 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA194,asteroidGroupA194,-206,0,86.5,.27);

    const asteroidGroupA195 = new THREE.Group();
    const asteroidMeshA195 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA195,asteroidGroupA195,-195,0,118,.37);

    const asteroidGroupA196 = new THREE.Group();
    const asteroidMeshA196 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA196,asteroidGroupA196,-220,0,74,.32);

    const asteroidGroupA197 = new THREE.Group();
    const asteroidMeshA197 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA197,asteroidGroupA197,-185,0,138,.35);
        
    const asteroidGroupA198 = new THREE.Group();
    const asteroidMeshA198 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA198,asteroidGroupA198,-235,0,82,.3);

    const asteroidGroupA199 = new THREE.Group();
    const asteroidMeshA199 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA199,asteroidGroupA199,-241,0,76,.3);

    const asteroidGroupA200 = new THREE.Group();
    const asteroidMeshA200 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA200,asteroidGroupA200,-206,.51,131,.4);

    const asteroidGroupA201 = new THREE.Group();
    const asteroidMeshA201 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA201,asteroidGroupA201,-230,.51,71,.51);

    const asteroidGroupA202 = new THREE.Group();
    const asteroidMeshA202 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA202,asteroidGroupA202,-205,-.51,142,.41);

    const asteroidGroupA203 = new THREE.Group();
    const asteroidMeshA203 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA203,asteroidGroupA203,-231,.51,53,.4);

    const asteroidGroupA204 = new THREE.Group();
    const asteroidMeshA204 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA204,asteroidGroupA204,-236,.71,84,.27);

    const asteroidGroupA205 = new THREE.Group();
    const asteroidMeshA205 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA205,asteroidGroupA205,-228,-.71,55,.27);

    const asteroidGroupA206 = new THREE.Group();
    const asteroidMeshA206 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA206,asteroidGroupA206,-220,0,94,.72);

    const asteroidGroupA207 = new THREE.Group();
    const asteroidMeshA207 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA207,asteroidGroupA207,-220,0,54,.61);
        
    const asteroidGroupA208 = new THREE.Group();
    const asteroidMeshA208 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA208,asteroidGroupA208,-242,0,88,.3);

    const asteroidGroupA209 = new THREE.Group();
    const asteroidMeshA209 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA209,asteroidGroupA209,-214,0,59,.7);

    const asteroidGroupA210 = new THREE.Group();
    const asteroidMeshA210 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA210,asteroidGroupA210,-199,.31,111,.27);

    const asteroidGroupA211 = new THREE.Group();
    const asteroidMeshA211 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA211,asteroidGroupA211,-210,0,102,.75);

    const asteroidGroupA212 = new THREE.Group();
    const asteroidMeshA212 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA212,asteroidGroupA212,-185,-.31,142,.38);

    const asteroidGroupA213 = new THREE.Group();
    const asteroidMeshA213 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA213,asteroidGroupA213,-218,.31,105,.17);

    const asteroidGroupA214 = new THREE.Group();
    const asteroidMeshA214 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA214,asteroidGroupA214,-193,.21,131,.27);

    const asteroidGroupA215 = new THREE.Group();
    const asteroidMeshA215 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA215,asteroidGroupA215,-215,0,84,.7);

    const asteroidGroupA216 = new THREE.Group();
    const asteroidMeshA216 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA216,asteroidGroupA216,-215,0,120,.82);

    const asteroidGroupA217 = new THREE.Group();
    const asteroidMeshA217 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA217,asteroidGroupA217,-225,.21,107,.5);
        
    const asteroidGroupA218 = new THREE.Group();
    const asteroidMeshA218 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA218,asteroidGroupA218,-188,-.41,138.8,.27);

    const asteroidGroupA219 = new THREE.Group();
    const asteroidMeshA219 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA219,asteroidGroupA219,-108,0,175,.7);

    const asteroidGroupA220 = new THREE.Group();
    const asteroidMeshA220 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA220,asteroidGroupA220,-235,.31,86,.47);

    const asteroidGroupA221 = new THREE.Group();
    const asteroidMeshA221 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA221,asteroidGroupA221,-210,0,112,.73);

    const asteroidGroupA222 = new THREE.Group();
    const asteroidMeshA222 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA222,asteroidGroupA222,-232,-.31,75,.37);  

    const asteroidGroupA223 = new THREE.Group();
    const asteroidMeshA223 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA223,asteroidGroupA223,-215,.31,83,.17);

    const asteroidGroupA224 = new THREE.Group();
    const asteroidMeshA224 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA224,asteroidGroupA224,-191,-.31,122,.27);

    const asteroidGroupA225 = new THREE.Group();
    const asteroidMeshA225 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA225,asteroidGroupA225,-235,.31,75,.37);

    const asteroidGroupA226 = new THREE.Group();
    const asteroidMeshA226 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA226,asteroidGroupA226,-217,0,92,.71);

    const asteroidGroupA227 = new THREE.Group();
    const asteroidMeshA227 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA227,asteroidGroupA227,-225,0,85,.5);
        
    const asteroidGroupA228 = new THREE.Group();
    const asteroidMeshA228 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA228,asteroidGroupA228,-195,0.81,68,.27);

    const asteroidGroupA229 = new THREE.Group();
    const asteroidMeshA229 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA229,asteroidGroupA229,-218,.41,79,.37);

    const asteroidGroupA230 = new THREE.Group();
    const asteroidMeshA230 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA230,asteroidGroupA230,-237,-.41,72,.27);

    const asteroidGroupA231 = new THREE.Group();
    const asteroidMeshA231 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA231,asteroidGroupA231,-202,0,102,.52);

    const asteroidGroupA232 = new THREE.Group();
    const asteroidMeshA232 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA232,asteroidGroupA232,-225,.2,88,.5);  

    const asteroidGroupA233 = new THREE.Group();
    const asteroidMeshA233 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA233,asteroidGroupA233,-208,-.21,104,.47);

    const asteroidGroupA234 = new THREE.Group();
    const asteroidMeshA234 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA234,asteroidGroupA234,-212,.37,78,.27);

    const asteroidGroupA235 = new THREE.Group();
    const asteroidMeshA235 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA235,asteroidGroupA235,-201,-.31,95,.37);

    const asteroidGroupA236 = new THREE.Group();
    const asteroidMeshA236 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA236,asteroidGroupA236,-241,.3,93,.11);

    const asteroidGroupA237 = new THREE.Group();
    const asteroidMeshA237 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA237,asteroidGroupA237,-205,-.7,93,.27);
        
    const asteroidGroupA238 = new THREE.Group();
    const asteroidMeshA238 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA238,asteroidGroupA238,-223,0,70,.647);

    const asteroidGroupA239 = new THREE.Group();
    const asteroidMeshA239 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA239,asteroidGroupA239,-201.8,.5,100,.27);

    const asteroidGroupA240 = new THREE.Group();
    const asteroidMeshA240 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA240,asteroidGroupA240,-235,-1,70,.4);

    const asteroidGroupA241 = new THREE.Group();
    const asteroidMeshA241 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA241,asteroidGroupA241,-238,-.6,97,.27);

    const asteroidGroupA242 = new THREE.Group();
    const asteroidMeshA242 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA242,asteroidGroupA242,-232,.61,73,.2);

    const asteroidGroupA243 = new THREE.Group();
    const asteroidMeshA243 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA243,asteroidGroupA243,-190.5,1,155,.17);

    const asteroidGroupA244 = new THREE.Group();
    const asteroidMeshA244 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA244,asteroidGroupA244,-248,.3,71,.49);

    const asteroidGroupA245 = new THREE.Group();
    const asteroidMeshA245 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA245,asteroidGroupA245,-245,-.6,87,.5);
        
    const asteroidGroupA246 = new THREE.Group();
    const asteroidMeshA246 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA246,asteroidGroupA246,-228,-.51,76,.27);

    const asteroidGroupA247 = new THREE.Group();
    const asteroidMeshA247 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA247,asteroidGroupA247,-238,.31,79,.37);

    const asteroidGroupA248 = new THREE.Group();
    const asteroidMeshA248 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA248,asteroidGroupA248,-226,-.6,65,.37);

    const asteroidGroupA249 = new THREE.Group();
    const asteroidMeshA249 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA249,asteroidGroupA249,-240,.6,89,.42);

    const asteroidGroupA250 = new THREE.Group();
    const asteroidMeshA250 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA250,asteroidGroupA250,-193,0,109,.5);

    const asteroidGroupA251 = new THREE.Group();
    const asteroidMeshA251 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA251,asteroidGroupA251,-238,.6,82,.17);

    const asteroidGroupA252 = new THREE.Group();
    const asteroidMeshA252 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA252,asteroidGroupA252,-226,.6,54,.27);

    const asteroidGroupA253 = new THREE.Group();
    const asteroidMeshA253 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA253,asteroidGroupA253,-243,.6,75,.17);

    const asteroidGroupA254 = new THREE.Group();
    const asteroidMeshA254 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA254,asteroidGroupA254,-236,0,97,.3);

    const asteroidGroupA255 = new THREE.Group();
    const asteroidMeshA255 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA255,asteroidGroupA255,-240,0,68,.25);

    const asteroidGroupA256 = new THREE.Group();
    const asteroidMeshA256 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA256,asteroidGroupA256,-225,0,74,.35);  

    const asteroidGroupA257 = new THREE.Group();
    const asteroidMeshA257 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA257,asteroidGroupA257,-238,0,68,.37);

    const asteroidGroupA258 = new THREE.Group();
    const asteroidMeshA258 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA258,asteroidGroupA258,-226,0,92,.37);

    const asteroidGroupA259 = new THREE.Group();
    const asteroidMeshA259 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA259,asteroidGroupA259,-255,0,58,.5);

    const asteroidGroupA260 = new THREE.Group();
    const asteroidMeshA260 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA260,asteroidGroupA260,-222,.2,83,.32);

    const asteroidGroupA261 = new THREE.Group();
    const asteroidMeshA261 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA261,asteroidGroupA261,-185,.2,128,.35);
        
    const asteroidGroupA262 = new THREE.Group();
    const asteroidMeshA262 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA262,asteroidGroupA262,-235,.2,78,.27);

    const asteroidGroupA264 = new THREE.Group();
    const asteroidMeshA264 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA264,asteroidGroupA264,-242,.2,58,.27);

    const asteroidGroupA265 = new THREE.Group();
    const asteroidMeshA265 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA265,asteroidGroupA265,-228,0,106,.3);

    const asteroidGroupA266 = new THREE.Group();
    const asteroidMeshA266 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA266,asteroidGroupA266,-198,0,131,.3);

    const asteroidGroupA267 = new THREE.Group();
    const asteroidMeshA267 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA267,asteroidGroupA267,-230,0,99,.3);

    const asteroidGroupA268 = new THREE.Group();
    const asteroidMeshA268 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA268,asteroidGroupA268,-210,0,84.5,.53);

    const asteroidGroupA269 = new THREE.Group();
    const asteroidMeshA269 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA269,asteroidGroupA269,-220,0,109.2,.3);

    const asteroidGroupA270 = new THREE.Group();
    const asteroidMeshA270 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA270,asteroidGroupA270,-234.5,0,90,.3);

    const asteroidGroupA271 = new THREE.Group();
    const asteroidMeshA271 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA271,asteroidGroupA271,-230,0,114,.43);

    const asteroidGroupA272 = new THREE.Group();
    const asteroidMeshA272 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA272,asteroidGroupA272,-205,0,91.7,.3);

    const asteroidGroupA273 = new THREE.Group();
    const asteroidMeshA273 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA273,asteroidGroupA273,-227,0,110.8,.13);

    const asteroidGroupA274 = new THREE.Group();
    const asteroidMeshA274 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA274,asteroidGroupA274,-205,0,152,.3);

    const asteroidGroupA275 = new THREE.Group();
    const asteroidMeshA275 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA275,asteroidGroupA275,-202,0,146,.23);

    const asteroidGroupA276 = new THREE.Group();
    const asteroidMeshA276 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA276,asteroidGroupA276,-201,0,125.5,.3);

    const asteroidGroupA277 = new THREE.Group();
    const asteroidMeshA277 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA277,asteroidGroupA277,-201,0,131,.13);

    const asteroidGroupA278 = new THREE.Group();
    const asteroidMeshA278 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA278,asteroidGroupA278,-203,0,115.27,.3);

    const asteroidGroupA279 = new THREE.Group();
    const asteroidMeshA279 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA279,asteroidGroupA279,-191,0,157,.13);

    const asteroidGroupA280 = new THREE.Group();
    const asteroidMeshA280 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA280,asteroidGroupA280,-232.6,0,96,.3);

    const asteroidGroupA281 = new THREE.Group();
    const asteroidMeshA281 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA281,asteroidGroupA281,-192,0,127,.3);

    const asteroidGroupA282 = new THREE.Group();
    const asteroidMeshA282 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA282,asteroidGroupA282,-211,0,94,.63);

    const asteroidGroupA283 = new THREE.Group();
    const asteroidMeshA283 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA283,asteroidGroupA283,-190.6,0,124,.3);

    const asteroidGroupA284 = new THREE.Group();
    const asteroidMeshA284 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA284,asteroidGroupA284,-189,0,122.3,.43);

    const asteroidGroupA285 = new THREE.Group();
    const asteroidMeshA285 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA285,asteroidGroupA285,-229.7,0,82.7,.13);

    const asteroidGroupA286 = new THREE.Group();
    const asteroidMeshA286 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA286,asteroidGroupA286,-215,0,62.7,.3);

    const asteroidGroupA287 = new THREE.Group();
    const asteroidMeshA287 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA287,asteroidGroupA287,-228,0,84,.3);

    const asteroidGroupA288 = new THREE.Group();
    const asteroidMeshA288 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA288,asteroidGroupA288,-228,0,68.7,.3);

    const asteroidGroupA289 = new THREE.Group();
    const asteroidMeshA289 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA289,asteroidGroupA289,-222.6,0,89.6,.3);

    const asteroidGroupA290 = new THREE.Group();
    const asteroidMeshA290 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA290,asteroidGroupA290,-243,0,21.56,.3);

    const asteroidGroupA291 = new THREE.Group();
    const asteroidMeshA291 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA291,asteroidGroupA291,-225.36,0,102.6,.53);

    const asteroidGroupA292 = new THREE.Group();
    const asteroidMeshA292 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA292,asteroidGroupA292,-223.7,0,98,.63);

    const asteroidGroupA293 = new THREE.Group();
    const asteroidMeshA293 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA293,asteroidGroupA293,-220.6,0,87.6,.3);

    const asteroidGroupA294 = new THREE.Group();
    const asteroidMeshA294 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA294,asteroidGroupA294,-173,0,175,.37);

    const asteroidGroupA295 = new THREE.Group();
    const asteroidMeshA295 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA295,asteroidGroupA295,-167,0,145,.5);

    const asteroidGroupA296 = new THREE.Group();
    const asteroidMeshA296 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA296,asteroidGroupA296,-117,0,169,1);

    const asteroidGroupA297 = new THREE.Group();
    const asteroidMeshA297 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA297,asteroidGroupA297,-142,.2,168,.35);

    const asteroidGroupA298 = new THREE.Group();
    const asteroidMeshA298 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA298,asteroidGroupA298,-110.6,0,173,.3);

    const asteroidGroupA299 = new THREE.Group();
    const asteroidMeshA299 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA299,asteroidGroupA299,-182,0,175.7,.3);

    const asteroidGroupA300 = new THREE.Group();
    const asteroidMeshA300 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA300,asteroidGroupA300,-122.36,0,187.6,.53);

    const asteroidGroupA301 = new THREE.Group();
    const asteroidMeshA301 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA301,asteroidGroupA301,-112,.49,182,.87);  

    const asteroidGroupA302 = new THREE.Group();
    const asteroidMeshA302 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA302,asteroidGroupA302,-3,0,230,.63);

    const asteroidGroupA303 = new THREE.Group();
    const asteroidMeshA303 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA303,asteroidGroupA303,0,0,216,.53);

        

                                                                //BOTTOM/RIGHT       
    const asteroidGroupA304 = new THREE.Group();
    const asteroidMeshA304 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA304,asteroidGroupA304,-43,.3,221,.11);

    const asteroidGroupA305 = new THREE.Group();
    const asteroidMeshA305 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA305,asteroidGroupA305,-8,0,235,.37);

    const asteroidGroupA306 = new THREE.Group();
    const asteroidMeshA306 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA306,asteroidGroupA306,-110,0,196,.82);

    const asteroidGroupA307 = new THREE.Group();
    const asteroidMeshA307 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA307,asteroidGroupA307,-28,0,225,.35);
        
    const asteroidGroupA308 = new THREE.Group();
    const asteroidMeshA308 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA308,asteroidGroupA308,-6,0,252,.63);

    const asteroidGroupA309 = new THREE.Group();
    const asteroidMeshA309 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA309,asteroidGroupA309,-26,0,221,.3);

    const asteroidGroupA310 = new THREE.Group();
    const asteroidMeshA310 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA310,asteroidGroupA310,-47,0,216,.3);

    const asteroidGroupA311 = new THREE.Group();
    const asteroidMeshA311 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA311,asteroidGroupA311,-18,0,220,.25);

    const asteroidGroupA313 = new THREE.Group();
    const asteroidMeshA313 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA313,asteroidGroupA313,-18,0,218,.37);

    const asteroidGroupA314 = new THREE.Group();
    const asteroidMeshA314 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA314,asteroidGroupA314,-42,0,206,.37);

    const asteroidGroupA315 = new THREE.Group();
    const asteroidMeshA315 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA315,asteroidGroupA315,-8,0,235,.5);

    const asteroidGroupA316 = new THREE.Group();
    const asteroidMeshA316 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA316,asteroidGroupA316,-33,.2,202,.32);

    const asteroidGroupA317 = new THREE.Group();
    const asteroidMeshA317 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA317,asteroidGroupA317,-54,.2,228,.35);
        
    const asteroidGroupA318 = new THREE.Group();
    const asteroidMeshA318 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA318,asteroidGroupA318,-27,.2,255,1);

    const asteroidGroupA319 = new THREE.Group();
    const asteroidMeshA319 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA319,asteroidGroupA319,-8,.2,222,.27);

    const asteroidGroupA320 = new THREE.Group();
    const asteroidMeshA320 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA210,asteroidGroupA320,-56,0,208,.3);

    const asteroidGroupA321 = new THREE.Group();
    const asteroidMeshA321 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA321,asteroidGroupA321,-21,0,238,.3);

    const asteroidGroupA322 = new THREE.Group();
    const asteroidMeshA322 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA322,asteroidGroupA322,-49,0,210,.3);

    const asteroidGroupA324 = new THREE.Group();
    const asteroidMeshA324 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA324,asteroidGroupA324,-59.2,0,200,.3);

    const asteroidGroupA325 = new THREE.Group();
    const asteroidMeshA325 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA325,asteroidGroupA325,-40,0,214.5,.3);

    const asteroidGroupA326 = new THREE.Group();
    const asteroidMeshA326 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA326,asteroidGroupA326,-64,0,210,.43);

    const asteroidGroupA328 = new THREE.Group();
    const asteroidMeshA328 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA328,asteroidGroupA328,-60.8,0,207,.13);

    const asteroidGroupA329 = new THREE.Group();
    const asteroidMeshA329 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA329,asteroidGroupA329,-46,0,243,.3);

    const asteroidGroupA330 = new THREE.Group();
    const asteroidMeshA330 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA330,asteroidGroupA330,-36,0,242,.23);

    const asteroidGroupA331 = new THREE.Group();
    const asteroidMeshA331 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA331,asteroidGroupA331,-15.5,0,241,.3);

    const asteroidGroupA332 = new THREE.Group();
    const asteroidMeshA332 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA332,asteroidGroupA332,-21,.3,208,.36);

    const asteroidGroupA333 = new THREE.Group();
    const asteroidMeshA333 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA333,asteroidGroupA333,-5.27,0,243,.3);

    const asteroidGroupA334 = new THREE.Group();
    const asteroidMeshA334 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA334,asteroidGroupA334,-47,0,231,.13);

    const asteroidGroupA335 = new THREE.Group();
    const asteroidMeshA335 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA335,asteroidGroupA335,-46,0,212.6,.3);

    const asteroidGroupA336 = new THREE.Group();
    const asteroidMeshA336 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA336,asteroidGroupA336,-17,0,232,.3);

    const asteroidGroupA338 = new THREE.Group();
    const asteroidMeshA338 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA338,asteroidGroupA338,-14,0,230.6,.3);

    const asteroidGroupA339 = new THREE.Group();
    const asteroidMeshA339 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA339,asteroidGroupA339,-48,0,226,.65);

    const asteroidGroupA340 = new THREE.Group();
    const asteroidMeshA340 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA340,asteroidGroupA340,-12.3,0,229,.43);

    const asteroidGroupA341 = new THREE.Group();
    const asteroidMeshA341 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA341,asteroidGroupA341,-32.7,0,209.7,.13);

    const asteroidGroupA342 = new THREE.Group();
    const asteroidMeshA342 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA342,asteroidGroupA342,-12.7,0,226,.3);

    const asteroidGroupA343 = new THREE.Group();
    const asteroidMeshA343 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA343,asteroidGroupA343,-34,0,208,.3);

    const asteroidGroupA344 = new THREE.Group();
    const asteroidMeshA344 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA344,asteroidGroupA344,-18.7,0,228,.3);

    const asteroidGroupA345 = new THREE.Group();
    const asteroidMeshA345 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA345,asteroidGroupA345,-39.6,0,202.6,.3);

    const asteroidGroupA346 = new THREE.Group();
    const asteroidMeshA346 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA346,asteroidGroupA346,-21.6,0,223,.3);

    const asteroidGroupA347 = new THREE.Group();
    const asteroidMeshA347 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA347,asteroidGroupA347,-52.6,0,205.36,.53);

    const asteroidGroupA348 = new THREE.Group();
    const asteroidMeshA348 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA348,asteroidGroupA348,-48,0,203.7,.63);

    const asteroidGroupA349 = new THREE.Group();
    const asteroidMeshA349 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA349,asteroidGroupA349,-37.6,0,200.6,.3);

    const asteroidGroupA350 = new THREE.Group();
    const asteroidMeshA350 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA350,asteroidGroupA350,-28,.38,209,.27);

    const asteroidGroupA351 = new THREE.Group();
    const asteroidMeshA351 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA351,asteroidGroupA351,-39,.6,220,.42);

    const asteroidGroupA352 = new THREE.Group();
    const asteroidMeshA352 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA352,asteroidGroupA352,-12,0,203,.5);  

    const asteroidGroupA353 = new THREE.Group();
    const asteroidMeshA353 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA353,asteroidGroupA353,-32,.6,218,.17);

    const asteroidGroupA354 = new THREE.Group();
    const asteroidMeshA354 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA354,asteroidGroupA354,-4,.6,206,.27);

    const asteroidGroupA355 = new THREE.Group();
    const asteroidMeshA355 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA355,asteroidGroupA355,-25,.6,223,.17);

    const asteroidGroupA356 = new THREE.Group();
    const asteroidMeshA356 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA356,asteroidGroupA356,-85,0,190,.67);

    const asteroidGroupA357 = new THREE.Group();
    const asteroidMeshA357 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA357,asteroidGroupA357,-13,.6,222,.75);
        
    const asteroidGroupA358 = new THREE.Group();
    const asteroidMeshA358 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA358,asteroidGroupA358,-28,-.6,203,.7);

    const asteroidGroupA359 = new THREE.Group();
    const asteroidMeshA359 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA359,asteroidGroupA359,-9,.6,218,.27);

    const asteroidGroupA360 = new THREE.Group();
    const asteroidMeshA360 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA360,asteroidGroupA360,-12,-.71,258,.7);

    const asteroidGroupA361 = new THREE.Group();
    const asteroidMeshA361 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA361,asteroidGroupA361,-30,.31,206,.38);

    const asteroidGroupA362 = new THREE.Group();
    const asteroidMeshA362 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA362,asteroidGroupA362,-52,0,222,.72);

    const asteroidGroupA363 = new THREE.Group();
    const asteroidMeshA363 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA363,asteroidGroupA363,-27,.37,243,.47);

    const asteroidGroupA364 = new THREE.Group();
    const asteroidMeshA364 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA364,asteroidGroupA364,-34,.71,216,.27);

    const asteroidGroupA365 = new THREE.Group();
    const asteroidMeshA365 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA365,asteroidGroupA365,-36,.5,209,.37);

    const asteroidGroupA366 = new THREE.Group();
    const asteroidMeshA366 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA366,asteroidGroupA366,-37,-.6,232,.6);

    const asteroidGroupA367 = new THREE.Group();
    const asteroidMeshA367 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA367,asteroidGroupA367,-7,0,205,.61);
        
    const asteroidGroupA368 = new THREE.Group();
    const asteroidMeshA368 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA368,asteroidGroupA368,-38,0,222,.3);

    const asteroidGroupA369 = new THREE.Group();
    const asteroidMeshA369 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA369,asteroidGroupA369,-114,.49,202,.67);

    const asteroidGroupA370 = new THREE.Group();
    const asteroidMeshA370 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA370,asteroidGroupA370,-1,.31,239,.27);

    const asteroidGroupA371 = new THREE.Group();
    const asteroidMeshA371 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA371,asteroidGroupA371,-3,.51,211,.4);

    const asteroidGroupA372 = new THREE.Group();
    const asteroidMeshA372 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA372,asteroidGroupA372,-32,-.31,225,.38);  

    const asteroidGroupA373 = new THREE.Group();
    const asteroidMeshA373 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA373,asteroidGroupA373,-55,.31,198,.17);

    const asteroidGroupA374 = new THREE.Group();
    const asteroidMeshA374 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA374,asteroidGroupA374,-21,.21,233,.27);

    const asteroidGroupA376 = new THREE.Group();
    const asteroidMeshA376 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA376,asteroidGroupA376,-70,0,195,.82);

    const asteroidGroupA377 = new THREE.Group();
    const asteroidMeshA377 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA377,asteroidGroupA377,-32,-.51,235,.41);
        
    const asteroidGroupA378 = new THREE.Group();
    const asteroidMeshA378 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA378,asteroidGroupA378,-28.8,-.41,228,.27);

    const asteroidGroupA379 = new THREE.Group();
    const asteroidMeshA379 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA379,asteroidGroupA379,-45,0,208,.7);

    const asteroidGroupA380 = new THREE.Group();
    const asteroidMeshA380 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA380,asteroidGroupA380,-26,-.51,208,.27);

    const asteroidGroupA381 = new THREE.Group();
    const asteroidMeshA381 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA381,asteroidGroupA381,-29,.31,218,.37);

    const asteroidGroupA382 = new THREE.Group();
    const asteroidMeshA382 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA382,asteroidGroupA382,-15,-.6,206,.37);

    const asteroidGroupA383 = new THREE.Group();
    const asteroidMeshA383 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA383,asteroidGroupA383,-21,.51,250,.51);

    const asteroidGroupA384 = new THREE.Group();
    const asteroidMeshA384 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA384,asteroidGroupA384,-12,-.31,251,.57);

    const asteroidGroupA385 = new THREE.Group();
    const asteroidMeshA385 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA385,asteroidGroupA385,-25,.31,231,.47);

    const asteroidGroupA386 = new THREE.Group();
    const asteroidMeshA386 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA386,asteroidGroupA386,-43,0,199,.71);

    const asteroidGroupA387 = new THREE.Group();
    const asteroidMeshA387 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA387,asteroidGroupA387,-11,0,208,.5);
        
    const asteroidGroupA388 = new THREE.Group();
    const asteroidMeshA388 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA388,asteroidGroupA388,-8,-.31,235,.27);

    const asteroidGroupA389 = new THREE.Group();
    const asteroidMeshA389 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA389,asteroidGroupA389,-37,-.6,225,.5);

    const asteroidGroupA390 = new THREE.Group();
    const asteroidMeshA390 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA390,asteroidGroupA390,-22,-.41,217,.27);

    const asteroidGroupA391 = new THREE.Group();
    const asteroidMeshA391 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA391,asteroidGroupA391,-35,.51,255,.39);  

    const asteroidGroupA392 = new THREE.Group();
    const asteroidMeshA392 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA392,asteroidGroupA392,-38,.2,262,.75);

    const asteroidGroupA393 = new THREE.Group();
    const asteroidMeshA393 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA393,asteroidGroupA393,-47,-.6,218,.27);

    const asteroidGroupA394 = new THREE.Group();
    const asteroidMeshA394 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA394,asteroidGroupA394,-44,.37,246,.7);

    const asteroidGroupA395 = new THREE.Group();
    const asteroidMeshA395 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA395,asteroidGroupA395,-23,.61,212,.2);

    const asteroidGroupA396 = new THREE.Group();
    const asteroidMeshA396 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA396,asteroidGroupA396,-32,.6,257,.4);

    const asteroidGroupA397 = new THREE.Group();
    const asteroidMeshA397 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA397,asteroidGroupA397,-45,1,230.5,.17);
        
    const asteroidGroupA398 = new THREE.Group();
    const asteroidMeshA398 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA398,asteroidGroupA398,-20,0,203,.47);

    const asteroidGroupA399 = new THREE.Group();
    const asteroidMeshA399 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA399,asteroidGroupA399,-16,.4,217,.37);

    const asteroidGroupA400 = new THREE.Group();
    const asteroidMeshA400 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA400,asteroidGroupA400,-20,-1,215,.4);



                                                //3RD RIGHT FILLER------- BOTTOM/RIGHT/RIGHT/RIGHT
    const asteroidGroupA401 = new THREE.Group();
    const asteroidMeshA401 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA401,asteroidGroupA401,-159.6,0,162.6,.3);

    const asteroidGroupA402 = new THREE.Group();
    const asteroidMeshA402 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA402,asteroidGroupA402,-141.6,0,183,.3);

    const asteroidGroupA403 = new THREE.Group();
    const asteroidMeshA403 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA403,asteroidGroupA403,-123,.51,171,.4);        

    const asteroidGroupA404 = new THREE.Group();
    const asteroidMeshA404 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA404,asteroidGroupA404,-154,.71,176,.27);

    const asteroidGroupA405 = new THREE.Group();
    const asteroidMeshA405 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA405,asteroidGroupA405,-125,-.71,168,.27);

    const asteroidGroupA406 = new THREE.Group();
    const asteroidMeshA406 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA406,asteroidGroupA406,-174,0,160,.72);

    const asteroidGroupA407 = new THREE.Group();
    const asteroidMeshA407 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA407,asteroidGroupA407,-127,0,165,.61);
        
    const asteroidGroupA408 = new THREE.Group();
    const asteroidMeshA408 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA408,asteroidGroupA408,-158,0,182,.3);

    const asteroidGroupA409 = new THREE.Group();
    const asteroidMeshA409 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA409,asteroidGroupA409,-130,0,157,.7);

    const asteroidGroupA410 = new THREE.Group();
    const asteroidMeshA410 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA410,asteroidGroupA410,-121,.31,199,.27);

    const asteroidGroupA411 = new THREE.Group();
    const asteroidMeshA411 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA411,asteroidGroupA411,-172,0,150,.75);

    const asteroidGroupA412 = new THREE.Group();
    const asteroidMeshA412 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA412,asteroidGroupA412,-152,-.31,185,.38);  

    const asteroidGroupA413 = new THREE.Group();
    const asteroidMeshA413 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA413,asteroidGroupA413,-175,.31,158,.17);

    const asteroidGroupA414 = new THREE.Group();
    const asteroidMeshA414 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA414,asteroidGroupA414,-141,.21,193,.27);

    const asteroidGroupA415 = new THREE.Group();
    const asteroidMeshA415 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA415,asteroidGroupA415,-154,0,155,.7);

    const asteroidGroupA416 = new THREE.Group();
    const asteroidMeshA416 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA416,asteroidGroupA416,-140,0,157,.82);

    const asteroidGroupA417 = new THREE.Group();
    const asteroidMeshA417 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA417,asteroidGroupA417,-177,.21,165,.5);
        
    const asteroidGroupA418 = new THREE.Group();
    const asteroidMeshA418 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA418,asteroidGroupA418,-148.8,-.41,188,.27);

    const asteroidGroupA419 = new THREE.Group();
    const asteroidMeshA419 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA419,asteroidGroupA419,-165,0,168,.7);

    const asteroidGroupA420 = new THREE.Group();
    const asteroidMeshA420 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA420,asteroidGroupA420,-156,.31,175,.47);

    const asteroidGroupA421 = new THREE.Group();
    const asteroidMeshA421 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA421,asteroidGroupA421,-182,0,150,.73);

    const asteroidGroupA422 = new THREE.Group();
    const asteroidMeshA422 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA422,asteroidGroupA422,-145,-.31,172,.37);

    const asteroidGroupA423 = new THREE.Group();
    const asteroidMeshA423 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA423,asteroidGroupA423,-152,-.51,195,.41);  

    const asteroidGroupA424 = new THREE.Group();
    const asteroidMeshA424 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA424,asteroidGroupA424,-132,-.31,191,.27);

    const asteroidGroupA425 = new THREE.Group();
    const asteroidMeshA425 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA425,asteroidGroupA425,-145,.31,175,.37);

    const asteroidGroupA426 = new THREE.Group();
    const asteroidMeshA426 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA426,asteroidGroupA426,-182,0,157,.71);

    const asteroidGroupA427 = new THREE.Group();
    const asteroidMeshA427 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA427,asteroidGroupA427,-141,.51,170,.51);
            
    const asteroidGroupA428 = new THREE.Group();
    const asteroidMeshA428 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA428,asteroidGroupA428,-128,-.31,195,.27);

    const asteroidGroupA429 = new THREE.Group();
    const asteroidMeshA429 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA429,asteroidGroupA429,-149,.41,158,.37);

    const asteroidGroupA430 = new THREE.Group();
    const asteroidMeshA430 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA430,asteroidGroupA430,-142,-.41,177,.27);

    const asteroidGroupA431 = new THREE.Group();
    const asteroidMeshA431 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA431,asteroidGroupA431,-172,0,142,.52);

    const asteroidGroupA432 = new THREE.Group();
    const asteroidMeshA432 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA432,asteroidGroupA432,-224,.41,118,.37);

    const asteroidGroupA433 = new THREE.Group();
    const asteroidMeshA433 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA433,asteroidGroupA433,-174,-.21,148,.47);

    const asteroidGroupA434 = new THREE.Group();
    const asteroidMeshA434 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA434,asteroidGroupA434,-148,.37,152,.27);

    const asteroidGroupA435 = new THREE.Group();
    const asteroidMeshA435 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA435,asteroidGroupA435,-165,-.31,141,.7);

    const asteroidGroupA436 = new THREE.Group();
    const asteroidMeshA436 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA436,asteroidGroupA436,-190,.6,165,.7);

    const asteroidGroupA437 = new THREE.Group();
    const asteroidMeshA437 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA437,asteroidGroupA437,-203,-.7,161,.7);
        
    const asteroidGroupA438 = new THREE.Group();
    const asteroidMeshA438 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA438,asteroidGroupA438,-140,0,163,.47);

    const asteroidGroupA439 = new THREE.Group();
    const asteroidMeshA439 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA439,asteroidGroupA439,-170,.5,141.8,.27);

    const asteroidGroupA440 = new THREE.Group();
    const asteroidMeshA440 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA440,asteroidGroupA440,-140,-1,175,.4);

    const asteroidGroupA441 = new THREE.Group();
    const asteroidMeshA441 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA441,asteroidGroupA441,-163,.3,181,.11);

    const asteroidGroupA442 = new THREE.Group();
    const asteroidMeshA442 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA442,asteroidGroupA442,-149,.51,165,.19);  

    const asteroidGroupA443 = new THREE.Group();
    const asteroidMeshA443 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA443,asteroidGroupA443,-167,-.6,178,.27);

    const asteroidGroupA444 = new THREE.Group();
    const asteroidMeshA444 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA444,asteroidGroupA444,-131,.61,172,.52);

    const asteroidGroupA445 = new THREE.Group();
    const asteroidMeshA445 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA445,asteroidGroupA445,-165,1,190.5,.17);

    const asteroidGroupA446 = new THREE.Group();
    const asteroidMeshA446 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA446,asteroidGroupA446,-141,.51,226,.51);

    const asteroidGroupA447 = new THREE.Group();
    const asteroidMeshA447 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA447,asteroidGroupA447,-157,-.6,185,.5);
        
    const asteroidGroupA448 = new THREE.Group();
    const asteroidMeshA448 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA448,asteroidGroupA448,-146,-.51,168,.27);

    const asteroidGroupA449 = new THREE.Group();
    const asteroidMeshA449 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA449,asteroidGroupA449,-149,.31,178,.37);

    const asteroidGroupA450 = new THREE.Group();
    const asteroidMeshA450 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA450,asteroidGroupA450,-135,-.6,166,.37);

    const asteroidGroupA451 = new THREE.Group();
    const asteroidMeshA451 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA451,asteroidGroupA451,-175,.6,188,.62);

    const asteroidGroupA452 = new THREE.Group();
    const asteroidMeshA452 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA452,asteroidGroupA452,-132,0,163,.5);  

    const asteroidGroupA453 = new THREE.Group();
    const asteroidMeshA453 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA453,asteroidGroupA453,-160,.6,190,.417);

    const asteroidGroupA454 = new THREE.Group();
    const asteroidMeshA454 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA454,asteroidGroupA454,-124,.6,166,.27);

    const asteroidGroupA455 = new THREE.Group();
    const asteroidMeshA455 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA455,asteroidGroupA455,-122,.6,177,.74);

    const asteroidGroupA456 = new THREE.Group();
    const asteroidMeshA456 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA456,asteroidGroupA456,-203,0,150,.67);

    const asteroidGroupA457 = new THREE.Group();
    const asteroidMeshA457 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA457,asteroidGroupA457,-144,.6,190,.5);
        
    const asteroidGroupA458 = new THREE.Group();
    const asteroidMeshA458 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA458,asteroidGroupA458,-148,-.6,163,.47);

    const asteroidGroupA459 = new THREE.Group();
    const asteroidMeshA459 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA459,asteroidGroupA459,-129,.6,178,.27);

    const asteroidGroupA460 = new THREE.Group();
    const asteroidMeshA460 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA460,asteroidGroupA460,-170,.3,151,.27);

    const asteroidGroupA461 = new THREE.Group();
    const asteroidMeshA461 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA461,asteroidGroupA461,-150,.31,166,.38);

    const asteroidGroupA462 = new THREE.Group();
    const asteroidMeshA462 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA462,asteroidGroupA462,-165,.42,148,.41);  

    const asteroidGroupA463 = new THREE.Group();
    const asteroidMeshA463 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA463,asteroidGroupA463,-146,.37,208,.47);

    const asteroidGroupA464 = new THREE.Group();
    const asteroidMeshA464 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA464,asteroidGroupA464,-160,-.4,148,.47);

    const asteroidGroupA465 = new THREE.Group();
    const asteroidMeshA465 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA465,asteroidGroupA465,-156,.5,169,.37);

    const asteroidGroupA466 = new THREE.Group();
    const asteroidMeshA466 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA466,asteroidGroupA466,-160,-.6,154,.4);

    const asteroidGroupA467 = new THREE.Group();
    const asteroidMeshA467 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA467,asteroidGroupA467,-147,0,146,.8);
        
    const asteroidGroupA468 = new THREE.Group();
    const asteroidMeshA468 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA468,asteroidGroupA468,-174,0,152,.37);

    const asteroidGroupA469 = new THREE.Group();
    const asteroidMeshA469 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA469,asteroidGroupA469,-138,.49,172,.37);

    const asteroidGroupA470 = new THREE.Group();
    const asteroidMeshA470 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA470,asteroidGroupA470,-158,.4,156,.47);

    const asteroidGroupA471 = new THREE.Group();
    const asteroidMeshA471 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA471,asteroidGroupA471,-136,.4,177,.37);

    const asteroidGroupA472 = new THREE.Group();
    const asteroidMeshA472 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA472,asteroidGroupA472,-168,.32,154,.38);  

    const asteroidGroupA473 = new THREE.Group();
    const asteroidMeshA473 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA473,asteroidGroupA473,-148,.38,169,.27);

    const asteroidGroupA474 = new THREE.Group();
    const asteroidMeshA474 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA474,asteroidGroupA474,-2,.31,242,.6);

    const asteroidGroupA475 = new THREE.Group();
    const asteroidMeshA475 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA475,asteroidGroupA475,-128,0,195,.37);

    const asteroidGroupA476 = new THREE.Group();
    const asteroidMeshA476 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA476,asteroidGroupA476,-139,0,150,.52);

    const asteroidGroupA477 = new THREE.Group();
    const asteroidMeshA477 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA477,asteroidGroupA477,-148,0,185,.35);
        
    const asteroidGroupA478 = new THREE.Group();
    const asteroidMeshA478 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA478,asteroidGroupA478,-152,0,165,.3);

    const asteroidGroupA479 = new THREE.Group();
    const asteroidMeshA479 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA479,asteroidGroupA479,-146,0,161,.3);

    const asteroidGroupA480 = new THREE.Group();
    const asteroidMeshA480 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA480,asteroidGroupA480,-167,0,176,.3);

    const asteroidGroupA481 = new THREE.Group();
    const asteroidMeshA481 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA481,asteroidGroupA481,-180,0,170,.25);

    const asteroidGroupA482 = new THREE.Group();
    const asteroidMeshA482 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA482,asteroidGroupA482,-157.6,0,160.6,.3);

    const asteroidGroupA483 = new THREE.Group();
    const asteroidMeshA483 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA483,asteroidGroupA483,-138,0,178,.37);

    const asteroidGroupA484 = new THREE.Group();
    const asteroidMeshA484 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA484,asteroidGroupA484,-162,0,166,.37);

    const asteroidGroupA485 = new THREE.Group();
    const asteroidMeshA485 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA485,asteroidGroupA485,-128,0,195,.5);

    const asteroidGroupA486 = new THREE.Group();
    const asteroidMeshA486 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA486,asteroidGroupA486,-153,.2,162,.32);

    const asteroidGroupA487 = new THREE.Group();
    const asteroidMeshA487 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA487,asteroidGroupA487,-138,.2,185,.35);
        
    const asteroidGroupA488 = new THREE.Group();
    const asteroidMeshA488 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA488,asteroidGroupA488,-148,.2,175,.27);

    const asteroidGroupA489 = new THREE.Group();
    const asteroidMeshA489 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA489,asteroidGroupA489,-128,.2,182,.27);

    const asteroidGroupA490 = new THREE.Group();
    const asteroidMeshA490 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA490,asteroidGroupA490,-176,0,168,.3);

    const asteroidGroupA491 = new THREE.Group();
    const asteroidMeshA491 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA491,asteroidGroupA491,-141,0,198,.3);

    const asteroidGroupA492 = new THREE.Group();
    const asteroidMeshA492 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA492,asteroidGroupA492,-169,0,170,.3);

    const asteroidGroupA493 = new THREE.Group();
    const asteroidMeshA493 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA493,asteroidGroupA493,-154.5,0,150,.53);

    const asteroidGroupA494 = new THREE.Group();
    const asteroidMeshA494 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA494,asteroidGroupA494,-179.2,0,160,.3);

    const asteroidGroupA495 = new THREE.Group();
    const asteroidMeshA495 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA495,asteroidGroupA495,-168,0,163.7,.63);

    const asteroidGroupA496 = new THREE.Group();
    const asteroidMeshA496 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA496,asteroidGroupA496,-184,0,170,.43);

    const asteroidGroupA497 = new THREE.Group();
    const asteroidMeshA497 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA497,asteroidGroupA497,-161.7,0,145,.3);

    const asteroidGroupA498 = new THREE.Group();
    const asteroidMeshA498 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA498,asteroidGroupA498,-180.8,0,167,.13);

    const asteroidGroupA499 = new THREE.Group();
    const asteroidMeshA499 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA499,asteroidGroupA499,-162,0,205,.3);

    const asteroidGroupA500 = new THREE.Group();
    const asteroidMeshA500 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA500,asteroidGroupA500,-156,0,202,.23);

    const asteroidGroupA501 = new THREE.Group();
    const asteroidMeshA501 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA501,asteroidGroupA501,-135.5,0,201,.3);

    const asteroidGroupA502 = new THREE.Group();
    const asteroidMeshA502 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA502,asteroidGroupA502,-172.6,0,165.36,.53);

    const asteroidGroupA503 = new THREE.Group();
    const asteroidMeshA503 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA503,asteroidGroupA503,-125.27,0,203,.3);

    const asteroidGroupA504 = new THREE.Group();
    const asteroidMeshA504 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA504,asteroidGroupA504,-167,0,191,.13);

    const asteroidGroupA505 = new THREE.Group();
    const asteroidMeshA505 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA505,asteroidGroupA505,-166,0,172.6,.3);

    const asteroidGroupA506 = new THREE.Group();
    const asteroidMeshA506 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA506,asteroidGroupA506,-137,0,192,.3);

    const asteroidGroupA507 = new THREE.Group();
    const asteroidMeshA507 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA507,asteroidGroupA507,-164,0,151,.63);

    const asteroidGroupA508 = new THREE.Group();
    const asteroidMeshA508 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA508,asteroidGroupA508,-134,0,194.6,.3);

    const asteroidGroupA509 = new THREE.Group();
    const asteroidMeshA509 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA509,asteroidGroupA509,-155,0,171,.45);

    const asteroidGroupA510 = new THREE.Group();
    const asteroidMeshA510 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA510,asteroidGroupA510,-132.3,0,189,.43);

    const asteroidGroupA511 = new THREE.Group();
    const asteroidMeshA511 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA511,asteroidGroupA511,-152.7,0,169.7,.13);

    const asteroidGroupA512 = new THREE.Group();
    const asteroidMeshA512 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA512,asteroidGroupA512,-132.7,0,186,.3);

    const asteroidGroupA513 = new THREE.Group();
    const asteroidMeshA513 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA513,asteroidGroupA513,-154,0,168,.3);

    const asteroidGroupA514 = new THREE.Group();
    const asteroidMeshA514 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA514,asteroidGroupA514,-138.7,0,188,.3);

                            

                                            //BOTTOM/RIGHT ---> 4TH FILLER  -  BOTTOM/RIGHT/RIGHT
    const asteroidGroupA515 = new THREE.Group();
    const asteroidMeshA515 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA515,asteroidGroupA515,-76,0,245,1);

    const asteroidGroupA516 = new THREE.Group();
    const asteroidMeshA516 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA516,asteroidGroupA516,-79,.31,218,.37);

    const asteroidGroupA517 = new THREE.Group();
    const asteroidMeshA517 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA517,asteroidGroupA517,-70,-1,215,.4);

    const asteroidGroupA518 = new THREE.Group();
    const asteroidMeshA518 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA518,asteroidGroupA518,-110.8,0,207,.13);

    const asteroidGroupA519 = new THREE.Group();
    const asteroidMeshA519 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA519,asteroidGroupA519,-92,0,245,.3);

    const asteroidGroupA520 = new THREE.Group();
    const asteroidMeshA520 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA520,asteroidGroupA520,-86,0,242,.23);

    const asteroidGroupA521 = new THREE.Group();
    const asteroidMeshA521 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA521,asteroidGroupA521,-65.5,0,241,.3);

    const asteroidGroupA522 = new THREE.Group();
    const asteroidMeshA522 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA522,asteroidGroupA522,-93,.3,221,.11);

    const asteroidGroupA523 = new THREE.Group();
    const asteroidMeshA523 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA523,asteroidGroupA523,-55.27,0,243,.3);

    const asteroidGroupA524 = new THREE.Group();
    const asteroidMeshA524 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA524,asteroidGroupA524,-97,0,231,.13);

    const asteroidGroupA525 = new THREE.Group();
    const asteroidMeshA525 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA525,asteroidGroupA525,-96,0,212.6,.3);

    const asteroidGroupA526 = new THREE.Group();
    const asteroidMeshA526 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA526,asteroidGroupA526,-67,0,232,.3);

    const asteroidGroupA527 = new THREE.Group();
    const asteroidMeshA527 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA527,asteroidGroupA527,-94,0,191,.63);

    const asteroidGroupA528 = new THREE.Group();
    const asteroidMeshA528 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA528,asteroidGroupA528,-64,0,230.6,.3);

    const asteroidGroupA529 = new THREE.Group();
    const asteroidMeshA529 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA529,asteroidGroupA529,-85,0,211,.45);

    const asteroidGroupA530 = new THREE.Group();
    const asteroidMeshA530 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA530,asteroidGroupA530,-62.3,0,229,.43);

    const asteroidGroupA531 = new THREE.Group();
    const asteroidMeshA531 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA531,asteroidGroupA531,-82.7,0,209.7,.13);

    const asteroidGroupA532 = new THREE.Group();
    const asteroidMeshA532 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA532,asteroidGroupA532,-62.7,0,226,.3);

    const asteroidGroupA533 = new THREE.Group();
    const asteroidMeshA533 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA533,asteroidGroupA533,-84,0,208,.3);

    const asteroidGroupA534 = new THREE.Group();
    const asteroidMeshA534 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA534,asteroidGroupA534,-68.7,0,228,.3);

    const asteroidGroupA535 = new THREE.Group();
    const asteroidMeshA535 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA535,asteroidGroupA535,-89.6,0,202.6,.3);

    const asteroidGroupA536 = new THREE.Group();
    const asteroidMeshA536 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA536,asteroidGroupA536,-71.6,0,223,.3);

    const asteroidGroupA537 = new THREE.Group();
    const asteroidMeshA537 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA537,asteroidGroupA537,-102.6,0,205.36,.53);

    const asteroidGroupA538 = new THREE.Group();
    const asteroidMeshA538 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA538,asteroidGroupA538,-98,0,203.7,.63);

    const asteroidGroupA539 = new THREE.Group();
    const asteroidMeshA539 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA539,asteroidGroupA539,-87.6,0,200.6,.3);

    const asteroidGroupA540 = new THREE.Group();
    const asteroidMeshA540 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA540,asteroidGroupA540,-71,.51,210,.51);

    const asteroidGroupA541 = new THREE.Group();
    const asteroidMeshA541 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA541,asteroidGroupA541,-71,.51,210,.51);

    const asteroidGroupA542 = new THREE.Group();
    const asteroidMeshA542 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA542,asteroidGroupA542,-82,-.51,235,.41);  

    const asteroidGroupA543 = new THREE.Group();
    const asteroidMeshA543 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA543,asteroidGroupA543,-53,.51,211,.4);

    const asteroidGroupA544 = new THREE.Group();
    const asteroidMeshA544 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA544,asteroidGroupA544,-104,.71,226,.47);

    const asteroidGroupA545 = new THREE.Group();
    const asteroidMeshA545 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA545,asteroidGroupA545,-55,-.71,208,.27);

    const asteroidGroupA546 = new THREE.Group();
    const asteroidMeshA546 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA546,asteroidGroupA546,-91.7,0,185,.3);

    const asteroidGroupA547 = new THREE.Group();
    const asteroidMeshA547 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA547,asteroidGroupA547,-53,0,254,.61);
        
    const asteroidGroupA548 = new THREE.Group();
    const asteroidMeshA548 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA548,asteroidGroupA548,-88,0,222,.3);

    const asteroidGroupA549 = new THREE.Group();
    const asteroidMeshA549 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA549,asteroidGroupA549,-59,0,196,.7);

    const asteroidGroupA550 = new THREE.Group();
    const asteroidMeshA550 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA550,asteroidGroupA550,-51,.31,239,.27);

    const asteroidGroupA551 = new THREE.Group();
    const asteroidMeshA551 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA551,asteroidGroupA551,-102,0,190,.75);

    const asteroidGroupA552 = new THREE.Group();
    const asteroidMeshA552 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA552,asteroidGroupA552,-82,-.31,225,.38);  

    const asteroidGroupA553 = new THREE.Group();
    const asteroidMeshA553 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA553,asteroidGroupA553,-105,.31,198,.37);

    const asteroidGroupA554 = new THREE.Group();
    const asteroidMeshA554 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA554,asteroidGroupA554,-71,.21,233,.27);

    const asteroidGroupA555 = new THREE.Group();
    const asteroidMeshA555 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA555,asteroidGroupA555,-84,0,195,.7);

    const asteroidGroupA556 = new THREE.Group();
    const asteroidMeshA556 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA556,asteroidGroupA556,-120,0,195,.82);

    const asteroidGroupA557 = new THREE.Group();
    const asteroidMeshA557 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA557,asteroidGroupA557,-107,.21,205,.5);
        
    const asteroidGroupA558 = new THREE.Group();
    const asteroidMeshA558 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA558,asteroidGroupA558,-88.8,-.41,228,.27);

    const asteroidGroupA559 = new THREE.Group();
    const asteroidMeshA559 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA559,asteroidGroupA559,-95,0,208,.7);

    const asteroidGroupA560 = new THREE.Group();
    const asteroidMeshA560 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA560,asteroidGroupA560,-106,.31,238,.67);

    const asteroidGroupA561 = new THREE.Group();
    const asteroidMeshA561 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA561,asteroidGroupA561,-112,0,190,.73);

    const asteroidGroupA562 = new THREE.Group();
    const asteroidMeshA562 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA562,asteroidGroupA562,-75,-.31,212,.37);  

    const asteroidGroupA563 = new THREE.Group();
    const asteroidMeshA563 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA563,asteroidGroupA563,-111,.31,215,.47);

    const asteroidGroupA564 = new THREE.Group();
    const asteroidMeshA564 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA564,asteroidGroupA564,-62,-.31,231,.27);

    const asteroidGroupA565 = new THREE.Group();
    const asteroidMeshA565 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA565,asteroidGroupA565,-75,.31,215,.37);

    const asteroidGroupA566 = new THREE.Group();
    const asteroidMeshA566 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA566,asteroidGroupA566,-92,0,197,.71);

    const asteroidGroupA567 = new THREE.Group();
    const asteroidMeshA567 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA567,asteroidGroupA567,-151,0,205,.65);
        
    const asteroidGroupA568 = new THREE.Group();
    const asteroidMeshA568 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA568,asteroidGroupA568,-58,-.31,235,.27);

    const asteroidGroupA569 = new THREE.Group();
    const asteroidMeshA569 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA569,asteroidGroupA569,-79,.41,198,.37);

    const asteroidGroupA570 = new THREE.Group();
    const asteroidMeshA570 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA570,asteroidGroupA570,-72,-.41,217,.27);

    const asteroidGroupA571 = new THREE.Group();
    const asteroidMeshA571 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA571,asteroidGroupA571,-102,0,182,.52);

    const asteroidGroupA572 = new THREE.Group();
    const asteroidMeshA572 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA572,asteroidGroupA572,-88,.2,230,.75);  

    const asteroidGroupA573 = new THREE.Group();
    const asteroidMeshA573 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA573,asteroidGroupA573,-104,-.21,188,.47);

    const asteroidGroupA574 = new THREE.Group();
    const asteroidMeshA574 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA574,asteroidGroupA574,-78,.37,192,.27);

    const asteroidGroupA575 = new THREE.Group();
    const asteroidMeshA575 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA575,asteroidGroupA575,-95,-.31,181,.37);

    const asteroidGroupA576 = new THREE.Group();
    const asteroidMeshA576 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA576,asteroidGroupA576,-114,0,210,.43);

    const asteroidGroupA577 = new THREE.Group();
    const asteroidMeshA577 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA577,asteroidGroupA577,-93,-.7,185,.27);
        
    const asteroidGroupA578 = new THREE.Group();
    const asteroidMeshA578 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA578,asteroidGroupA578,-70,0,203,.47);

    const asteroidGroupA579 = new THREE.Group();
    const asteroidMeshA579 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA579,asteroidGroupA579,-120,.5,181.8,.27);

    const asteroidGroupA580 = new THREE.Group();
    const asteroidMeshA580 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA580,asteroidGroupA580,-65,-.6,206,.37);

    const asteroidGroupA581 = new THREE.Group();
    const asteroidMeshA581 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA581,asteroidGroupA581,-89,.6,220,.42);

    const asteroidGroupA582 = new THREE.Group();
    const asteroidMeshA582 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA582,asteroidGroupA582,-62,0,203,.5);  

    const asteroidGroupA583 = new THREE.Group();
    const asteroidMeshA583 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA583,asteroidGroupA583,-82,.6,218,.17);

    const asteroidGroupA584 = new THREE.Group();
    const asteroidMeshA584 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA584,asteroidGroupA584,-9,.6,206,.27);

    const asteroidGroupA585 = new THREE.Group();
    const asteroidMeshA585 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA585,asteroidGroupA585,-75,.6,223,.17);

    const asteroidGroupA586 = new THREE.Group();
    const asteroidMeshA586 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA586,asteroidGroupA586,-133,0,210,.67);

    const asteroidGroupA587 = new THREE.Group();
    const asteroidMeshA587 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA587,asteroidGroupA587,-70,.6,225,.5);
        
    const asteroidGroupA588 = new THREE.Group();
    const asteroidMeshA588 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA588,asteroidGroupA588,-78,-.6,203,.47);

    const asteroidGroupA589 = new THREE.Group();
    const asteroidMeshA589 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA589,asteroidGroupA589,-59,.6,218,.27);

    const asteroidGroupA590 = new THREE.Group();
    const asteroidMeshA590 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA590,asteroidGroupA590,-100,.3,191,.27);

    const asteroidGroupA591 = new THREE.Group();
    const asteroidMeshA591 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA591,asteroidGroupA591,-120,.31,218,.7);

    const asteroidGroupA592 = new THREE.Group();
    const asteroidMeshA592 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA592,asteroidGroupA592,-95,.42,188,.41);  

    const asteroidGroupA593 = new THREE.Group();
    const asteroidMeshA593 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA593,asteroidGroupA593,-68,.37,208,.27);

    const asteroidGroupA594 = new THREE.Group();
    const asteroidMeshA594 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA594,asteroidGroupA594,-90,-.4,188,.47);

    const asteroidGroupA595 = new THREE.Group();
    const asteroidMeshA595 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA595,asteroidGroupA595,-86,.5,209,.37);

    const asteroidGroupA596 = new THREE.Group();
    const asteroidMeshA596 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA596,asteroidGroupA596,-90,-.6,194,.4);

    const asteroidGroupA597 = new THREE.Group();
    const asteroidMeshA597 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA597,asteroidGroupA597,-109.2,0,200,.3);
        
    const asteroidGroupA598 = new THREE.Group();
    const asteroidMeshA598 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA598,asteroidGroupA598,-104,0,192,.37);

    const asteroidGroupA599 = new THREE.Group();
    const asteroidMeshA599 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA599,asteroidGroupA599,-68,.49,212,.37);

    const asteroidGroupA600 = new THREE.Group();
    const asteroidMeshA600 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA600,asteroidGroupA600,-88,.4,196,.47);

    const asteroidGroupA601 = new THREE.Group();
    const asteroidMeshA601 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA601,asteroidGroupA601,-66,.4,217,.37);

    const asteroidGroupA602 = new THREE.Group();
    const asteroidMeshA602 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA602,asteroidGroupA602,-98,.32,194,.38);  

    const asteroidGroupA603 = new THREE.Group();
    const asteroidMeshA603 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA603,asteroidGroupA603,-78,.38,209,.27);

    const asteroidGroupA604 = new THREE.Group();
    const asteroidMeshA604 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA604,asteroidGroupA604,-84.5,0,190,.53);

    const asteroidGroupA605 = new THREE.Group();
    const asteroidMeshA605 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA605,asteroidGroupA605,-58,0,235,.37);

    const asteroidGroupA606 = new THREE.Group();
    const asteroidMeshA606 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA606,asteroidGroupA606,-74,0,200,.32);

    const asteroidGroupA607 = new THREE.Group();
    const asteroidMeshA607 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA607,asteroidGroupA607,-78,0,225,.35);
        
    const asteroidGroupA608 = new THREE.Group();
    const asteroidMeshA608 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA608,asteroidGroupA608,-82,0,215,.3);

    const asteroidGroupA609 = new THREE.Group();
    const asteroidMeshA609 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA609,asteroidGroupA609,-76,0,221,.3);

    const asteroidGroupA610 = new THREE.Group();
    const asteroidMeshA610 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA610,asteroidGroupA610,-97,0,216,.3);

    const asteroidGroupA611 = new THREE.Group();
    const asteroidMeshA611 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA611,asteroidGroupA611,-68,0,220,.25);

    const asteroidGroupA612 = new THREE.Group();
    const asteroidMeshA612 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA612,asteroidGroupA612,-99,0,210,.3);

    const asteroidGroupA613 = new THREE.Group();
    const asteroidMeshA613 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA613,asteroidGroupA613,-68,0,218,.37);

    const asteroidGroupA614 = new THREE.Group();
    const asteroidMeshA614 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA614,asteroidGroupA614,-92,0,206,.37);

    const asteroidGroupA615 = new THREE.Group();
    const asteroidMeshA615 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA615,asteroidGroupA615,-58,0,235,.5);

    const asteroidGroupA616 = new THREE.Group();
    const asteroidMeshA616 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA616,asteroidGroupA616,-83,.2,202,.32);

    const asteroidGroupA617 = new THREE.Group();
    const asteroidMeshA617 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA617,asteroidGroupA617,-68,.2,250,.65);
        
    const asteroidGroupA618 = new THREE.Group();
    const asteroidMeshA618 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA618,asteroidGroupA618,-118,.2,223,.37);

    const asteroidGroupA619 = new THREE.Group();
    const asteroidMeshA619 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA619,asteroidGroupA619,-58,.2,222,.27);

    const asteroidGroupA620 = new THREE.Group();
    const asteroidMeshA620 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA620,asteroidGroupA620,-106,0,208,.3);

    const asteroidGroupA621 = new THREE.Group();
    const asteroidMeshA621 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA621,asteroidGroupA621,-71,0,238,.3);       

    const asteroidGroupA622 = new THREE.Group();
    const asteroidMeshA622 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA622,asteroidGroupA622,-79,.51,239,.39);  

    const asteroidGroupA623 = new THREE.Group();
    const asteroidMeshA623 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA623,asteroidGroupA623,-97,-.6,218,.27);

    const asteroidGroupA624 = new THREE.Group();
    const asteroidMeshA624 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA624,asteroidGroupA624,-73,.61,212,.2);

    const asteroidGroupA625 = new THREE.Group();
    const asteroidMeshA625 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA625,asteroidGroupA625,-95,1,230.5,.17);

    const asteroidGroupA626 = new THREE.Group();
    const asteroidMeshA626 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA626,asteroidGroupA626,-90,0,214.5,.3);

    const asteroidGroupA627 = new THREE.Group();
    const asteroidMeshA627 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshA627,asteroidGroupA627,-87,-.6,225,.5);



                                //NEGATIVE - NEGATIVE [-X,-Z]        
    const asteroidInnerGroupB1 = new THREE.Group();
    const asteroidInnerMeshB1 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB1,asteroidInnerGroupB1,-145,0,-130,.25);

    const asteroidInnerGroupB2 = new THREE.Group();
    const asteroidInnerMeshB2 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB2,asteroidInnerGroupB2,-142,0,-140,.37);

    const asteroidInnerGroupB3 = new THREE.Group();
    const asteroidInnerMeshB3 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB3,asteroidInnerGroupB3,-171,.51,-73,.4);

    const asteroidInnerGroupB4 = new THREE.Group();
    const asteroidInnerMeshB4 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB4,asteroidInnerGroupB4,-44,0,-160,.28);

    const asteroidInnerGroupB5 = new THREE.Group();
    const asteroidInnerMeshB5 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB5,asteroidInnerGroupB5,-168,-.71,-75,.27);

    const asteroidInnerGroupB6 = new THREE.Group();
    const asteroidInnerMeshB6 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB6,asteroidInnerGroupB6,-118,.2,-155,.32);

    const asteroidInnerGroupB7 = new THREE.Group();
    const asteroidInnerMeshB7 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB7,asteroidInnerGroupB7,-165,0,-77,.61);
        
    const asteroidInnerGroupB8 = new THREE.Group();
    const asteroidInnerMeshB8 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB8,asteroidInnerGroupB8,-103,.2,-165,.27);

    const asteroidInnerGroupB9 = new THREE.Group();
    const asteroidInnerMeshB9 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB9,asteroidInnerGroupB9,-98,.2,-170,.27);

    const asteroidInnerGroupB10 = new THREE.Group();
    const asteroidInnerMeshB10 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB10,asteroidInnerGroupB10,-90,0,-175,.3);

    const asteroidInnerGroupB11 = new THREE.Group();
    const asteroidInnerMeshB11 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB11,asteroidInnerGroupB11,-78,0,-164,.72);

    const asteroidInnerGroupB12 = new THREE.Group();
    const asteroidInnerMeshB12 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB12,asteroidInnerGroupB12,-78,0,-180,1);

    const asteroidInnerGroupB13 = new THREE.Group();
    const asteroidInnerMeshB13 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB13,asteroidInnerGroupB13,-108,.31,-125,.64);

    const asteroidInnerGroupB14 = new THREE.Group();
    const asteroidInnerMeshB14 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB14,asteroidInnerGroupB14,-132,0,-100,.75);

    const asteroidInnerGroupB15 = new THREE.Group();
    const asteroidInnerMeshB15 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB15,asteroidInnerGroupB15,-155,0,-104,.7);

    const asteroidInnerGroupB16 = new THREE.Group();
    const asteroidInnerMeshB16 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB16,asteroidInnerGroupB16,-105,0,-167,.43);

    const asteroidInnerGroupB17 = new THREE.Group();
    const asteroidInnerMeshB17 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB17,asteroidInnerGroupB17,-154,0,-79,.7);

    const asteroidInnerGroupB18 = new THREE.Group();
    const asteroidInnerMeshB18 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB18,asteroidInnerGroupB18,-175,.31,-95,.37);

    const asteroidInnerGroupB19 = new THREE.Group();
    const asteroidInnerMeshB19 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB19,asteroidInnerGroupB19,-95,0,-154,.9);

    const asteroidInnerGroupB20 = new THREE.Group();
    const asteroidInnerMeshB20 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB20,asteroidInnerGroupB20,-124,0,-118,.8);

    const asteroidInnerGroupB21 = new THREE.Group();
    const asteroidInnerMeshB21 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB21,asteroidInnerGroupB21,-150,0,-132,.73);

    const asteroidInnerGroupB22 = new THREE.Group();
    const asteroidInnerMeshB22 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB22,asteroidInnerGroupB22,-70,0,-175,.33);

    const asteroidInnerGroupB23 = new THREE.Group();
    const asteroidInnerMeshB23 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB23,asteroidInnerGroupB23,-164,.31,-17,.7);

    const asteroidInnerGroupB24 = new THREE.Group();
    const asteroidInnerMeshB24 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB24,asteroidInnerGroupB24,-172,-.31,-95,.37);

    const asteroidInnerGroupB25 = new THREE.Group();
    const asteroidInnerMeshB25 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB25,asteroidInnerGroupB25,-110.6,0,-140,.3);

    const asteroidInnerGroupB26 = new THREE.Group();
    const asteroidInnerMeshB26 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB26,asteroidInnerGroupB26,-157,0,-112,.71);

    const asteroidInnerGroupB27 = new THREE.Group();
    const asteroidInnerMeshB27 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB27,asteroidInnerGroupB27,-165,0,-105,.5);

    const asteroidInnerGroupB28 = new THREE.Group();
    const asteroidInnerMeshB28 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB28,asteroidInnerGroupB28,-125,0,-148,.43);

    const asteroidInnerGroupB29 = new THREE.Group();
    const asteroidInnerMeshB29 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB29,asteroidInnerGroupB29,-162,.2,-103,.32);        

    const asteroidInnerGroupB30 = new THREE.Group();
    const asteroidInnerMeshB30 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB30,asteroidInnerGroupB30,-177,-.41,-92,.37);

    const asteroidInnerGroupB31 = new THREE.Group();
    const asteroidInnerMeshB31 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB31,asteroidInnerGroupB31,-142,0,-122,.52);

    const asteroidInnerGroupB32 = new THREE.Group();
    const asteroidInnerMeshB32 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB32,asteroidInnerGroupB32,-165,.2,-108,.5);

    const asteroidInnerGroupB33 = new THREE.Group();
    const asteroidInnerMeshB33 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB33,asteroidInnerGroupB33,-146,-.21,-125,.7);

    const asteroidInnerGroupB34 = new THREE.Group();
    const asteroidInnerMeshB34 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB34,asteroidInnerGroupB34,-152,.37,-98,.45);

    const asteroidInnerGroupB35 = new THREE.Group();
    const asteroidInnerMeshB35 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB35,asteroidInnerGroupB35,-141,-.31,-115,.37);

    const asteroidInnerGroupB36 = new THREE.Group();
    const asteroidInnerMeshB36 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB36,asteroidInnerGroupB36,-70.6,0,-158.6,.73);////reference71

    const asteroidInnerGroupB37 = new THREE.Group();
    const asteroidInnerMeshB37 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB37,asteroidInnerGroupB37,-130.7,0,-142,.63);

    const asteroidInnerGroupB38 = new THREE.Group();
    const asteroidInnerMeshB38 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB38,asteroidInnerGroupB38,-84,0,-165.7,.73);

    const asteroidInnerGroupB39 = new THREE.Group();
    const asteroidInnerMeshB39 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB39,asteroidInnerGroupB39,-64,0,-170,.5);

    const asteroidInnerGroupB40 = new THREE.Group();
    const asteroidInnerMeshB40 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB40,asteroidInnerGroupB40,-145,-.7,-48,.5);
        
    const asteroidInnerGroupB41 = new THREE.Group();
    const asteroidInnerMeshB41 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB41,asteroidInnerGroupB41,-163,0,-90,.47);

    const asteroidInnerGroupB42 = new THREE.Group();
    const asteroidInnerMeshB42 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB42,asteroidInnerGroupB42,-110,.4,-150,.6);

    const asteroidInnerGroupB43 = new THREE.Group();
    const asteroidInnerMeshB43 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB43,asteroidInnerGroupB43,-172,.61,-93,.2);

    const asteroidInnerGroupB44 = new THREE.Group();
    const asteroidInnerMeshB44 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB44,asteroidInnerGroupB44,-113,.32,-162,.7);

    const asteroidInnerGroupB45 = new THREE.Group();
    const asteroidInnerMeshB45 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB45,asteroidInnerGroupB45,-88,0,-168,.9);

    const asteroidInnerGroupB46 = new THREE.Group();
    const asteroidInnerMeshB46 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB46,asteroidInnerGroupB46,-165,.51,-99,.19);

    const asteroidInnerGroupB47 = new THREE.Group();
    const asteroidInnerMeshB47 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB47,asteroidInnerGroupB47,-166,-.6,-85,.37);

    const asteroidInnerGroupB48 = new THREE.Group();
    const asteroidInnerMeshB48 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB48,asteroidInnerGroupB48,-168,-.51,-96,.27);
        
    const asteroidInnerGroupB49 = new THREE.Group();
    const asteroidInnerMeshB49 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB49,asteroidInnerGroupB49,-88,0,-150,.57);

    const asteroidInnerGroupB50 = new THREE.Group();
    const asteroidInnerMeshB50 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB50,asteroidInnerGroupB50,-68,0,-155,.63);

    const asteroidInnerGroupB51 = new THREE.Group();
    const asteroidInnerMeshB51 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB51,asteroidInnerGroupB51,-100,0,-140,.63);

    const asteroidInnerGroupB52 = new THREE.Group();
    const asteroidInnerMeshB52 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB52,asteroidInnerGroupB52,-163,0,-82,.5);

    const asteroidInnerGroupB53 = new THREE.Group();
    const asteroidInnerMeshB53 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB53,asteroidInnerGroupB53,-168,.6,-102,.17);

    const asteroidInnerGroupB54 = new THREE.Group();
    const asteroidInnerMeshB54 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB54,asteroidInnerGroupB54,-166,.6,-74,.27);

    const asteroidInnerGroupB55 = new THREE.Group();
    const asteroidInnerMeshB55 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB55,asteroidInnerGroupB55,-151,0,-114,.63);

    const asteroidInnerGroupB56 = new THREE.Group();
    const asteroidInnerMeshB56 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB56,asteroidInnerGroupB56,-177,0,-29,1);

    const asteroidInnerGroupB57 = new THREE.Group();
    const asteroidInnerMeshB57 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB57,asteroidInnerGroupB57,-31,-.7,-177,.5);
        
    const asteroidInnerGroupB58 = new THREE.Group();
    const asteroidInnerMeshB58 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB58,asteroidInnerGroupB58,-163,-.6,-98,.47);

    const asteroidInnerGroupB59 = new THREE.Group();
    const asteroidInnerMeshB59 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB59,asteroidInnerGroupB59,-178,.6,-79,.7);

    const asteroidInnerGroupB60 = new THREE.Group();
    const asteroidInnerMeshB60 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB60,asteroidInnerGroupB60,-149,.3,-120,.7);

    const asteroidInnerGroupB61 = new THREE.Group();
    const asteroidInnerMeshB61 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB61,asteroidInnerGroupB61,-166,.31,-100,.38);

    const asteroidInnerGroupB62 = new THREE.Group();
    const asteroidInnerMeshB62 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB62,asteroidInnerGroupB62,-145,0,-111.7,.3);

    const asteroidInnerGroupB63 = new THREE.Group();
    const asteroidInnerMeshB63 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB63,asteroidInnerGroupB63,-168,.37,-88,.27);

    const asteroidInnerGroupB64 = new THREE.Group();
    const asteroidInnerMeshB64 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB64,asteroidInnerGroupB64,-150,0,-104.5,.53);

    const asteroidInnerGroupB65 = new THREE.Group();
    const asteroidInnerMeshB65 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB65,asteroidInnerGroupB65,-169,.5,-106,.37);

    const asteroidInnerGroupB66 = new THREE.Group();
    const asteroidInnerMeshB66 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB66,asteroidInnerGroupB66,-157,-.6,-56,.8);

    const asteroidInnerGroupB67 = new THREE.Group();
    const asteroidInnerMeshB67 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB67,asteroidInnerGroupB67,-144,0,-95,.28);
        
    const asteroidInnerGroupB68 = new THREE.Group();
    const asteroidInnerMeshB68 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB68,asteroidInnerGroupB68,-152,0,-124,.37);

    const asteroidInnerGroupB69 = new THREE.Group();
    const asteroidInnerMeshB69 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB69,asteroidInnerGroupB69,-172,.49,-88,.37);

    const asteroidInnerGroupB70 = new THREE.Group();
    const asteroidInnerMeshB70 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB70,asteroidInnerGroupB70,-56,.4,-178,.7);

    const asteroidInnerGroupB71 = new THREE.Group();
    const asteroidInnerMeshB71 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB71,asteroidInnerGroupB71,-177,.4,-86,.37);

    const asteroidInnerGroupB72 = new THREE.Group();
    const asteroidInnerMeshB72 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB72,asteroidInnerGroupB72,-154,.32,-118,.38);

    const asteroidInnerGroupB73 = new THREE.Group();
    const asteroidInnerMeshB73 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB73,asteroidInnerGroupB73,-169,.38,-98,.27);

    const asteroidInnerGroupB74 = new THREE.Group();
    const asteroidInnerMeshB74 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB74,asteroidInnerGroupB74,-168,0,-104,.3);

    const asteroidInnerGroupB75 = new THREE.Group();
    const asteroidInnerMeshB75 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB75,asteroidInnerGroupB75,-91,0,-165,.45);

    const asteroidInnerGroupB76 = new THREE.Group();
    const asteroidInnerMeshB76 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB76,asteroidInnerGroupB76,-160,0,-94,.32);

    const asteroidInnerGroupB77 = new THREE.Group();
    const asteroidInnerMeshB77 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB77,asteroidInnerGroupB77,-185,.6,-31,.616);

    const asteroidInnerGroupB78 = new THREE.Group();
    const asteroidInnerMeshB78 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB78,asteroidInnerGroupB78,-176,.51,-44,.819);
        
    const asteroidInnerGroupB79 = new THREE.Group();
    const asteroidInnerMeshB79 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB79,asteroidInnerGroupB79,-170,-.6,-62,.647);

    const asteroidInnerGroupB80 = new THREE.Group();
    const asteroidInnerMeshB80 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB80,asteroidInnerGroupB80,-180,.37,-68,.6);

    const asteroidInnerGroupB81 = new THREE.Group();
    const asteroidInnerMeshB81 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB81,asteroidInnerGroupB81,-156,0,-88,1);

    const asteroidInnerGroupB82 = new THREE.Group();
    const asteroidInnerMeshB82 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB82,asteroidInnerGroupB82,-165,0,-94,.35);

    const asteroidInnerGroupB83 = new THREE.Group();
    const asteroidInnerMeshB83 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB83,asteroidInnerGroupB83,-178,0,-88,1);

    const asteroidInnerGroupB84 = new THREE.Group();
    const asteroidInnerMeshB84 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB84,asteroidInnerGroupB84,-166,0,-112,.37);

    const asteroidInnerGroupB85 = new THREE.Group();
    const asteroidInnerMeshB85 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB85,asteroidInnerGroupB85,-40,.21,-172,.5);

    const asteroidInnerGroupB86 = new THREE.Group();
    const asteroidInnerMeshB86 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB86,asteroidInnerGroupB86,-116,0,-142.7,.73);

    const asteroidInnerGroupB87 = new THREE.Group();
    const asteroidInnerMeshB87 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB87,asteroidInnerGroupB87,-80,0,-174.5,.3);

    const asteroidInnerGroupB88 = new THREE.Group();
    const asteroidInnerMeshB88 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB88,asteroidInnerGroupB88,-71,0,-170.5,.3);

    const asteroidInnerGroupB89 = new THREE.Group();
    const asteroidInnerMeshB89 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB89,asteroidInnerGroupB89,-62,0,-185.56,.3);

    const asteroidInnerGroupB90 = new THREE.Group();
    const asteroidInnerMeshB90 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB90,asteroidInnerGroupB90,-62,0,-190,.73);

    const asteroidInnerGroupB91 = new THREE.Group();
    const asteroidInnerMeshB91 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB91,asteroidInnerGroupB91,-54,0,-192,.37);

    const asteroidInnerGroupB92 = new THREE.Group();
    const asteroidInnerMeshB92 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB92,asteroidInnerGroupB92,-54,-.21,-188,.47);

    const asteroidInnerGroupB93 = new THREE.Group();
    const asteroidInnerMeshB93 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB93,asteroidInnerGroupB93,-52,0,-182,.52);

    const asteroidInnerGroupB94 = new THREE.Group();
    const asteroidInnerMeshB94 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB94,asteroidInnerGroupB94,-52,0,-190,.75);

    const asteroidInnerGroupB95 = new THREE.Group();
    const asteroidInnerMeshB95 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB95,asteroidInnerGroupB95,-50,.3,-191,.27);

    const asteroidInnerGroupB96 = new THREE.Group();
    const asteroidInnerMeshB96 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB96,asteroidInnerGroupB96,-50,.5,-181.8,.27);

    const asteroidInnerGroupB97 = new THREE.Group();
    const asteroidInnerMeshB97 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB97,asteroidInnerGroupB97,-48,.32,-194,.38);  

    const asteroidInnerGroupB98 = new THREE.Group();
    const asteroidInnerMeshB98 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB98,asteroidInnerGroupB98,-45,.42,-188,.41);

    const asteroidInnerGroupB99 = new THREE.Group();
    const asteroidInnerMeshB99 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB99,asteroidInnerGroupB99,-45,-.31,-181,.37);

    const asteroidInnerGroupB100 = new THREE.Group();
    const asteroidInnerMeshB100 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB100,asteroidInnerGroupB100,-44,0,-191,.63);

    const asteroidInnerGroupB101 = new THREE.Group();
    const asteroidInnerMeshB101 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB101,asteroidInnerGroupB101,-40,-.4,-188,.47);

    const asteroidInnerGroupB102 = new THREE.Group();
    const asteroidInnerMeshB102 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB102,asteroidInnerGroupB102,-38,.4,-196,.47);

    const asteroidInnerGroupB103 = new THREE.Group();
    const asteroidInnerMeshB103 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB103,asteroidInnerGroupB103,-38,0,-180.27,.3);

    const asteroidInnerGroupB104 = new THREE.Group();
    const asteroidInnerMeshB104 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB104,asteroidInnerGroupB104,-34,0,-195,.7);

    const asteroidInnerGroupB105 = new THREE.Group();
    const asteroidInnerMeshB105 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB105,asteroidInnerGroupB105,-33,.31,-195,.17);

    const asteroidInnerGroupB106 = new THREE.Group();
    const asteroidInnerMeshB106 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB106,asteroidInnerGroupB106,-29,.41,-198,.37);

    const asteroidInnerGroupB107 = new THREE.Group();
    const asteroidInnerMeshB107 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB107,asteroidInnerGroupB107,-27,0,-189,.7);

    const asteroidInnerGroupB108 = new THREE.Group();
    const asteroidInnerMeshB108 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB108,asteroidInnerGroupB108,-25,0,-184,.28);

    const asteroidInnerGroupB109 = new THREE.Group();
    const asteroidInnerMeshB109 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB109,asteroidInnerGroupB109,-18,.51,-188,.51);

    const asteroidInnerGroupB110 = new THREE.Group();
    const asteroidInnerMeshB110 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB110,asteroidInnerGroupB110,-17,-.31,-196,.45);

    const asteroidInnerGroupB111 = new THREE.Group();
    const asteroidInnerMeshB111 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB111,asteroidInnerGroupB111,-9,0,-194,.7);

    const asteroidInnerGroupB112 = new THREE.Group();
    const asteroidInnerMeshB112 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB112,asteroidInnerGroupB112,-6,0,-185,.83);

    const asteroidInnerGroupB113 = new THREE.Group();
    const asteroidInnerMeshB113 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB113,asteroidInnerGroupB113,-100,0,-165.8,.13);

    const asteroidInnerGroupB114 = new THREE.Group();
    const asteroidInnerMeshB114 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB114,asteroidInnerGroupB114,-102,0,-156.5,.53);

    const asteroidInnerGroupB115 = new THREE.Group();
    const asteroidInnerMeshB115 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB115,asteroidInnerGroupB115,-105,.32,-146,.7);

    const asteroidInnerGroupB116 = new THREE.Group();
    const asteroidInnerMeshB116 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB116,asteroidInnerGroupB116,-105,0,-170.3,.43);

    const asteroidInnerGroupB117 = new THREE.Group();
    const asteroidInnerMeshB117 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB117,asteroidInnerGroupB117,-110,.4,-138,.47);

    const asteroidInnerGroupB118 = new THREE.Group();
    const asteroidInnerMeshB118 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB118,asteroidInnerGroupB118,-146,0,-106.,.27);

    const asteroidInnerGroupB119 = new THREE.Group();
    const asteroidInnerMeshB119 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB119,asteroidInnerGroupB119,-182,0,-52,.52);

    const asteroidInnerGroupB120 = new THREE.Group();
    const asteroidInnerMeshB120 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB120,asteroidInnerGroupB120,-182,.2,-78,.27);

    const asteroidInnerGroupB121 = new THREE.Group();
    const asteroidInnerMeshB121 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB121,asteroidInnerGroupB121,-181,-.31,-45,.37);

    const asteroidInnerGroupB122 = new THREE.Group();
    const asteroidInnerMeshB122 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB122,asteroidInnerGroupB122,-184,0,-25,.28);

    const asteroidInnerGroupB123 = new THREE.Group();
    const asteroidInnerMeshB123 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB123,asteroidInnerGroupB123,-185,-.7,-43,.27);

    const asteroidInnerGroupB124 = new THREE.Group();
    const asteroidInnerMeshB124 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB124,asteroidInnerGroupB124,-185,0,-41.7,.3);

    const asteroidInnerGroupB125 = new THREE.Group();
    const asteroidInnerMeshB125 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB125,asteroidInnerGroupB125,-186,0,-36.5,.27);

    const asteroidInnerGroupB126 = new THREE.Group();
    const asteroidInnerMeshB126 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB126,asteroidInnerGroupB126,-188,-.21,-54,.47);

    const asteroidInnerGroupB127 = new THREE.Group();
    const asteroidInnerMeshB127 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB127,asteroidInnerGroupB127,-188,.42,-45,.41);

    const asteroidInnerGroupB128 = new THREE.Group();
    const asteroidInnerMeshB128 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB128,asteroidInnerGroupB128,-188,-.4,-40,.47);

    const asteroidInnerGroupB129 = new THREE.Group();
    const asteroidInnerMeshB129 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB129,asteroidInnerGroupB129,-190,0,-52,.75);

    const asteroidInnerGroupB130 = new THREE.Group();
    const asteroidInnerMeshB130 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB130,asteroidInnerGroupB130,-190,0,-62,.73);

    const asteroidInnerGroupB131 = new THREE.Group();
    const asteroidInnerMeshB131 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB131,asteroidInnerGroupB131,-191,.3,-50,.27);

    const asteroidInnerGroupB132 = new THREE.Group();
    const asteroidInnerMeshB132 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB132,asteroidInnerGroupB132,-191,0,-44,.63);

    const asteroidInnerGroupB133 = new THREE.Group();
    const asteroidInnerMeshB133 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB133,asteroidInnerGroupB133,-192,0,-54,.37);

    const asteroidInnerGroupB134 = new THREE.Group();
    const asteroidInnerMeshB134 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB134,asteroidInnerGroupB134,-194,.32,-48,.38);

    const asteroidInnerGroupB135 = new THREE.Group();
    const asteroidInnerMeshB135 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB135,asteroidInnerGroupB135,-194,0,-9,.7);

    const asteroidInnerGroupB136 = new THREE.Group();
    const asteroidInnerMeshB136 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB136,asteroidInnerGroupB136,-194,-.6,-40,.4);

    const asteroidInnerGroupB137 = new THREE.Group();
    const asteroidInnerMeshB137 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB137,asteroidInnerGroupB137,-195,0,-34,.7);

    const asteroidInnerGroupB138 = new THREE.Group();
    const asteroidInnerMeshB138 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB138,asteroidInnerGroupB138,-195,.31,-33,.17);

    const asteroidInnerGroupB139 = new THREE.Group();
    const asteroidInnerMeshB139 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB139,asteroidInnerGroupB139,-196,.37,-16,.8);

    const asteroidInnerGroupB140 = new THREE.Group();
    const asteroidInnerMeshB140 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB140,asteroidInnerGroupB140,-196,.4,-38,.47);

    const asteroidInnerGroupB141 = new THREE.Group();
    const asteroidInnerMeshB141 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB141,asteroidInnerGroupB141,-120,0,-147.2,.3);////

    const asteroidInnerGroupB142 = new THREE.Group();
    const asteroidInnerMeshB142 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB142,asteroidInnerGroupB142,-190,0,-34.5,.53);////

    const asteroidInnerGroupB143 = new THREE.Group();
    const asteroidInnerMeshB143 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB143,asteroidInnerGroupB143,-34.5,0,-190,.53);

    const asteroidInnerGroupB144 = new THREE.Group();
    const asteroidInnerMeshB144 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB144,asteroidInnerGroupB144,-36.5,0,-186,.27);

    const asteroidInnerGroupB145 = new THREE.Group();
    const asteroidInnerMeshB145 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB145,asteroidInnerGroupB145,-56.5,0,-186,.27);

    const asteroidInnerGroupB146 = new THREE.Group();
    const asteroidInnerMeshB146 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB146,asteroidInnerGroupB146,-41.7,0,-185,.3);

    const asteroidInnerGroupB147 = new THREE.Group();
    const asteroidInnerMeshB147 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB147,asteroidInnerGroupB147,-115.5,0,-128,.3);

    const asteroidInnerGroupB148 = new THREE.Group();
    const asteroidInnerMeshB148 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB148,asteroidInnerGroupB148,-198,.41,-29,.37);

    const asteroidInnerGroupB149 = new THREE.Group();
    const asteroidInnerMeshB149 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB149,asteroidInnerGroupB149,-172,-.4,-52,.47);

    const asteroidInnerGroupB150 = new THREE.Group();
    const asteroidInnerMeshB150 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB150,asteroidInnerGroupB150,-168,.3,-91,.36);///// 

    const asteroidInnerGroupB151 = new THREE.Group();
    const asteroidInnerMeshB151 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB151,asteroidInnerGroupB151,-141.8,.5,-120,.27);

    const asteroidInnerGroupB152 = new THREE.Group();
    const asteroidInnerMeshB152 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB152,asteroidInnerGroupB152,-181.8,.5,-50,.27);

    const asteroidInnerGroupB153 = new THREE.Group();
    const asteroidInnerMeshB153 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB153,asteroidInnerGroupB153,-125.6,0,-130.6,.3);

    const asteroidInnerGroupB154 = new THREE.Group();
    const asteroidInnerMeshB154 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB154,asteroidInnerGroupB154,-138,0,-135,.35);

    const asteroidInnerGroupB155 = new THREE.Group();
    const asteroidInnerMeshB155 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB155,asteroidInnerGroupB155,-162.6,0,-109.6,.3);///// 

    const asteroidInnerGroupB156 = new THREE.Group();
    const asteroidInnerMeshB156 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB156,asteroidInnerGroupB156,-169.7,0,-102.7,.13);///// 

    const asteroidInnerGroupB157 = new THREE.Group();
    const asteroidInnerMeshB157 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshB157,asteroidInnerGroupB157,-100.7,0,-168.7,.13);///// 



                                //MAIN ORBIT 
                                                                            //RIGHT/BOTTOM
    const asteroidGroupB1 = new THREE.Group();
    const asteroidMeshB1 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB1,asteroidGroupB1,-209.7,0,-32.7,.13);

    const asteroidGroupB2 = new THREE.Group();
    const asteroidMeshB2 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB2,asteroidGroupB2,-226,0,-12.7,.3);

    const asteroidGroupB3 = new THREE.Group();
    const asteroidMeshB3 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB3,asteroidGroupB3,-208,0,-34,.3);

    const asteroidGroupB4 = new THREE.Group();
    const asteroidMeshB4 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB4,asteroidGroupB4,-228,0,-18.7,.3);

    const asteroidGroupB5 = new THREE.Group();
    const asteroidMeshB5 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB5,asteroidGroupB5,-202.6,0,-39.6,.3);

    const asteroidGroupB6 = new THREE.Group();
    const asteroidMeshB6 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB6,asteroidGroupB6,-223,0,-21.6,.3);

    const asteroidGroupB7 = new THREE.Group();
    const asteroidMeshB7 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB7,asteroidGroupB7,-205.36,0,-52.6,.53);

    const asteroidGroupB8 = new THREE.Group();
    const asteroidMeshB8 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB8,asteroidGroupB8,-203.7,0,-48,.63);

    const asteroidGroupB9 = new THREE.Group();
    const asteroidMeshB9 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB9,asteroidGroupB9,-200.6,0,-37.6,.3);  

    const asteroidGroupB10 = new THREE.Group();
    const asteroidMeshB10 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB10,asteroidGroupB10,-248,.38,-40,.67);

    const asteroidGroupB11 = new THREE.Group();
    const asteroidMeshB11 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB11,asteroidGroupB11,-260,.38,-12,.7);

    const asteroidGroupB12 = new THREE.Group();
    const asteroidMeshB12 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB12,asteroidGroupB12,-210,0,-49,.3);

    const asteroidGroupB13 = new THREE.Group();
    const asteroidMeshB13 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB13,asteroidGroupB13,-211,0,-35,.45);

    const asteroidGroupB14 = new THREE.Group();
    const asteroidMeshB14 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB14,asteroidGroupB14,-200,0,-59.2,.3);

    const asteroidGroupB15 = new THREE.Group();
    const asteroidMeshB15 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB15,asteroidGroupB15,-214.5,0,-40,.3);

    const asteroidGroupB16 = new THREE.Group();
    const asteroidMeshB16 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB16,asteroidGroupB16,-210,0,-64,.43);

    const asteroidGroupB17 = new THREE.Group();
    const asteroidMeshB17 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB17,asteroidGroupB17,-230.6,0,-14,.3);

    const asteroidGroupB18 = new THREE.Group();
    const asteroidMeshB18 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB18,asteroidGroupB18,-207,0,-60.8,.13);

    const asteroidGroupB19 = new THREE.Group();
    const asteroidMeshB19 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB19,asteroidGroupB19,-243,0,-46,.3);

    const asteroidGroupB20 = new THREE.Group();
    const asteroidMeshB20 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB20,asteroidGroupB20,-242,0,-36,.23);

    const asteroidGroupB21 = new THREE.Group();
    const asteroidMeshB21 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB21,asteroidGroupB21,-241,0,-15.5,.3);

    const asteroidGroupB22 = new THREE.Group();
    const asteroidMeshB22 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB22,asteroidGroupB22,-218,.51,-73,.51);

    const asteroidGroupB23 = new THREE.Group();
    const asteroidMeshB23 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB23,asteroidGroupB23,-243,0,-5.27,.3);

    const asteroidGroupB24 = new THREE.Group();
    const asteroidMeshB24 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB24,asteroidGroupB24,-231,0,-47,.13);

    const asteroidGroupB25 = new THREE.Group();
    const asteroidMeshB25 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB25,asteroidGroupB25,-212.6,0,-46,.3);

    const asteroidGroupB26 = new THREE.Group();
    const asteroidMeshB26 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB26,asteroidGroupB26,-232,0,-17,.3);

    const asteroidGroupB27 = new THREE.Group();
    const asteroidMeshB27 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB27,asteroidGroupB27,-229,0,-12.3,.43);

    const asteroidGroupB28 = new THREE.Group();
    const asteroidMeshB28 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB28,asteroidGroupB28,-222,0,-38,.3);

    const asteroidGroupB29 = new THREE.Group();
    const asteroidMeshB29 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB29,asteroidGroupB29,-205,0,-7,.61);      

    const asteroidGroupB30 = new THREE.Group();
    const asteroidMeshB30 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB30,asteroidGroupB30,-239,.31,-1,.27);

    const asteroidGroupB31 = new THREE.Group();
    const asteroidMeshB31 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB31,asteroidGroupB31,-200,0,-44,.72);

    const asteroidGroupB32 = new THREE.Group();
    const asteroidMeshB32 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB32,asteroidGroupB32,-225,-.31,-2,.5);  

    const asteroidGroupB34 = new THREE.Group();
    const asteroidMeshB34 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB34,asteroidGroupB34,-233,.21,-21,.27);

    const asteroidGroupB36 = new THREE.Group();
    const asteroidMeshB36 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB36,asteroidGroupB36,-208,0,-71,.82);

    const asteroidGroupB37 = new THREE.Group();
    const asteroidMeshB37 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB37,asteroidGroupB37,-205,.21,-57,.5);

    const asteroidGroupB38 = new THREE.Group();
    const asteroidMeshB38 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB38,asteroidGroupB38,-228,-.41,-28.8,.27);

    const asteroidGroupB39 = new THREE.Group();
    const asteroidMeshB39 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB39,asteroidGroupB39,-208,0,-45,.7);

    const asteroidGroupB40 = new THREE.Group();
    const asteroidMeshB40 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB40,asteroidGroupB40,-215,.31,-36,.47);

    const asteroidGroupB42 = new THREE.Group();
    const asteroidMeshB42 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB42,asteroidGroupB42,-212,-.31,-25,.37);

    const asteroidGroupB44 = new THREE.Group();
    const asteroidMeshB44 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB44,asteroidGroupB44,-231,-.31,-12,.27);

    const asteroidGroupB45 = new THREE.Group();
    const asteroidMeshB45 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB45,asteroidGroupB45,-215,.31,-25,.37);

    const asteroidGroupB46 = new THREE.Group();
    const asteroidMeshB46 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB46,asteroidGroupB46,-197,0,-54,.71);

    const asteroidGroupB47 = new THREE.Group();
    const asteroidMeshB47 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB47,asteroidGroupB47,-205,0,-35,.5);

    const asteroidGroupB48 = new THREE.Group();
    const asteroidMeshB48 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB48,asteroidGroupB48,-235,-.31,-8,.27);

    const asteroidGroupB50 = new THREE.Group();
    const asteroidMeshB50 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB50,asteroidGroupB50,-217,-.41,-22,.27);

    const asteroidGroupB52 = new THREE.Group();
    const asteroidMeshB52 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB52,asteroidGroupB52,-205,.2,-38,.5);  

    const asteroidGroupB58 = new THREE.Group();
    const asteroidMeshB58 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB58,asteroidGroupB58,-203,0,-20,.47);

    const asteroidGroupB60 = new THREE.Group();
    const asteroidMeshB60 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB60,asteroidGroupB60,-215,-1,-20,.4);

    const asteroidGroupB61 = new THREE.Group();
    const asteroidMeshB61 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB61,asteroidGroupB61,-221,.3,-43,.11);

    const asteroidGroupB62 = new THREE.Group();
    const asteroidMeshB62 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB62,asteroidGroupB62,-205,.51,-29,.19);  

    const asteroidGroupB63 = new THREE.Group();
    const asteroidMeshB63 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB63,asteroidGroupB63,-218,-.6,-47,.27);

    const asteroidGroupB64 = new THREE.Group();
    const asteroidMeshB64 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB64,asteroidGroupB64,-212,.61,-23,.2);

    const asteroidGroupB65 = new THREE.Group();
    const asteroidMeshB65 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB65,asteroidGroupB65,-230.5,1,-45,.17);

    const asteroidGroupB66 = new THREE.Group();
    const asteroidMeshB66 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB66,asteroidGroupB66,-208,.3,-21,.36);

    const asteroidGroupB67 = new THREE.Group();
    const asteroidMeshB67 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB67,asteroidGroupB67,-225,-.6,-37,.5);

    const asteroidGroupB68 = new THREE.Group();
    const asteroidMeshB68 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB68,asteroidGroupB68,-208,-.51,-26,.27);

    const asteroidGroupB69 = new THREE.Group();
    const asteroidMeshB69 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB69,asteroidGroupB69,-218,.31,-29,.37);

    const asteroidGroupB70 = new THREE.Group();
    const asteroidMeshB70 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB70,asteroidGroupB70,-206,-.6,-15,.37);

    const asteroidGroupB71 = new THREE.Group();
    const asteroidMeshB71 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB71,asteroidGroupB71,-220,.6,-39,.42);

    const asteroidGroupB72 = new THREE.Group();
    const asteroidMeshB72 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB72,asteroidGroupB72,-203,0,-12,.5);  

    const asteroidGroupB73 = new THREE.Group();
    const asteroidMeshB73 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB73,asteroidGroupB73,-218,.6,-32,.17);

    const asteroidGroupB74 = new THREE.Group();
    const asteroidMeshB74 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB74,asteroidGroupB74,-206,.6,-4,.27);

    const asteroidGroupB75 = new THREE.Group();
    const asteroidMeshB75 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB75,asteroidGroupB75,-223,.6,-25,.17);

    const asteroidGroupB76 = new THREE.Group();
    const asteroidMeshB76 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB76,asteroidGroupB76,-190,0,-77,.67);

    const asteroidGroupB77 = new THREE.Group();
    const asteroidMeshB77 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB77,asteroidGroupB77,-212,.6,-146,.75);

    const asteroidGroupB79 = new THREE.Group();
    const asteroidMeshB79 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB79,asteroidGroupB79,-218,.6,-9,.27);

    const asteroidGroupB81 = new THREE.Group();
    const asteroidMeshB81 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB81,asteroidGroupB81,-206,.31,-30,.38);

    const asteroidGroupB85 = new THREE.Group();
    const asteroidMeshB85 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB85,asteroidGroupB85,-209,.5,-36,.37);

    const asteroidGroupB89 = new THREE.Group();
    const asteroidMeshB89 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB89,asteroidGroupB89,-212,.49,-18,.37);

    const asteroidGroupB91 = new THREE.Group();
    const asteroidMeshB91 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB91,asteroidGroupB91,-217,.4,-16,.37);

    const asteroidGroupB93 = new THREE.Group();
    const asteroidMeshB93 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB93,asteroidGroupB93,-254,.38,-28,.7);

    const asteroidGroupB95 = new THREE.Group();
    const asteroidMeshB95 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB95,asteroidGroupB95,-235,0,-8,.37);

    const asteroidGroupB96 = new THREE.Group();
    const asteroidMeshB96 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB96,asteroidGroupB96,-200,0,-168,.32);

    const asteroidGroupB97 = new THREE.Group();
    const asteroidMeshB97 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB97,asteroidGroupB97,-225,0,-28,.35);

    const asteroidGroupB98 = new THREE.Group();
    const asteroidMeshB98 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB98,asteroidGroupB98,-215,0,-32,.3);

    const asteroidGroupB99 = new THREE.Group();
    const asteroidMeshB99 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB99,asteroidGroupB99,-221,0,-26,.3);

    const asteroidGroupB100 = new THREE.Group();
    const asteroidMeshB100 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB100,asteroidGroupB100,-216,0,-47,.3);

    const asteroidGroupB101 = new THREE.Group();
    const asteroidMeshB101 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB101,asteroidGroupB101,-220,0,-18,.25);////////////////////\\\\\\

    const asteroidGroupB102 = new THREE.Group();
    const asteroidMeshB102 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB102,asteroidGroupB102,-205,0,-24,.35);  

    const asteroidGroupB103 = new THREE.Group();
    const asteroidMeshB103 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB103,asteroidGroupB103,-218,0,-18,.37);

    const asteroidGroupB104 = new THREE.Group();
    const asteroidMeshB104 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB104,asteroidGroupB104,-206,0,-42,.37);

    const asteroidGroupB105 = new THREE.Group();
    const asteroidMeshB105 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB105,asteroidGroupB105,-235,0,-8,.5);

    const asteroidGroupB106 = new THREE.Group();
    const asteroidMeshB106 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB106,asteroidGroupB106,-202,.2,-33,.32);

    const asteroidGroupB108 = new THREE.Group();
    const asteroidMeshB108 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB108,asteroidGroupB108,-245,.2,-28,.57);

    const asteroidGroupB109 = new THREE.Group();
    const asteroidMeshB109 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB109,asteroidGroupB109,-222,.2,-8,.27);

    const asteroidGroupB110 = new THREE.Group();
    const asteroidMeshB110 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB110,asteroidGroupB110,-208,0,-56,.3);

    const asteroidGroupB111 = new THREE.Group();
    const asteroidMeshB111 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB111,asteroidGroupB111,-238,0,-21,.3);

    const asteroidGroupB112 = new THREE.Group();
    const asteroidMeshB112 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB112,asteroidGroupB112,-250,.51,-21,.51);

    const asteroidGroupB113 = new THREE.Group();
    const asteroidMeshB113 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB113,asteroidGroupB113,-235,-.51,-32,.41);  

    const asteroidGroupB114 = new THREE.Group();
    const asteroidMeshB114 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB114,asteroidGroupB114,-211,.51,-3,.4);

    const asteroidGroupB115 = new THREE.Group();
    const asteroidMeshB115 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB115,asteroidGroupB115,-216,.71,-34,.27);

    const asteroidGroupB116 = new THREE.Group();
    const asteroidMeshB116 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB116,asteroidGroupB116,-208,-.71,-5,.27);



                                                        //RIGHT/BOTTOM/LEFT - 1ST FILL LEFT                         
    const asteroidGroupB117 = new THREE.Group();
    const asteroidMeshB117 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB117,asteroidGroupB117,-174.5,0,-110,.3);

    const asteroidGroupB118 = new THREE.Group();
    const asteroidMeshB118 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB118,asteroidGroupB118,-188,-.41,-98.8,.27);

    const asteroidGroupB119 = new THREE.Group();
    const asteroidMeshB119 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB119,asteroidGroupB119,-168,0,-183,.7);

    const asteroidGroupB120 = new THREE.Group();
    const asteroidMeshB120 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB120,asteroidGroupB120,-175,.31,-106,.47);

    const asteroidGroupB121 = new THREE.Group();
    const asteroidMeshB121 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB121,asteroidGroupB121,-199,.31,-71,.27);

    const asteroidGroupB122 = new THREE.Group();
    const asteroidMeshB122 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB122,asteroidGroupB122,-188,0,-88.7,.3);

    const asteroidGroupB123 = new THREE.Group();
    const asteroidMeshB123 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB123,asteroidGroupB123,-183,0,-91.6,.3);

    const asteroidGroupB124 = new THREE.Group();
    const asteroidMeshB124 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB124,asteroidGroupB124,-165.36,0,-122.6,.53);

    const asteroidGroupB125 = new THREE.Group();
    const asteroidMeshB125 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB125,asteroidGroupB125,-186,0,-82.7,.3);

    const asteroidGroupB126 = new THREE.Group();
    const asteroidMeshB126 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB126,asteroidGroupB126,-191,-.31,-82,.27);

    const asteroidGroupB127 = new THREE.Group();
    const asteroidMeshB127 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB127,asteroidGroupB127,-181,.6,-121,.6);

    const asteroidGroupB128 = new THREE.Group();
    const asteroidMeshB128 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB128,asteroidGroupB128,-195,-.31,-78,.27);

    const asteroidGroupB129 = new THREE.Group();
    const asteroidMeshB129 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB129,asteroidGroupB129,-170.7,0,-113,.63);

    const asteroidGroupB130 = new THREE.Group();
    const asteroidMeshB130 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB130,asteroidGroupB130,-160.6,0,-135.6,.53);

    const asteroidGroupB131 = new THREE.Group();
    const asteroidMeshB131 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB131,asteroidGroupB131,-170,.51,-220,1.1);

    const asteroidGroupB132 = new THREE.Group();
    const asteroidMeshB132 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB132,asteroidGroupB132,-195,-.51,-102,.41);  

    const asteroidGroupB133 = new THREE.Group();
    const asteroidMeshB133 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB133,asteroidGroupB133,-176,0,-130,.52);

    const asteroidGroupB134 = new THREE.Group();
    const asteroidMeshB134 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB134,asteroidGroupB134,-182,0,-108,.3);

    const asteroidGroupB135 = new THREE.Group();
    const asteroidMeshB135 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB135,asteroidGroupB135,-185,-.31,-102,.38); 

    const asteroidGroupB136 = new THREE.Group();
    const asteroidMeshB136 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB136,asteroidGroupB136,-179,.71,-104,.7);

    const asteroidGroupB137 = new THREE.Group();
    const asteroidMeshB137 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB137,asteroidGroupB137,-193,.21,-91,.27);

    const asteroidGroupB138 = new THREE.Group();
    const asteroidMeshB138 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB138,asteroidGroupB138,-155,0,-140,.82);

    const asteroidGroupB139 = new THREE.Group();
    const asteroidMeshB139 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB139,asteroidGroupB139,-165,.21,-127,.5);

    const asteroidGroupB140 = new THREE.Group();
    const asteroidMeshB140 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB140,asteroidGroupB140,-175,-1,-203,.74);

    const asteroidGroupB141 = new THREE.Group();
    const asteroidMeshB141 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB141,asteroidGroupB141,-184,.3,-113,.8);

    const asteroidGroupB142 = new THREE.Group();
    const asteroidMeshB142 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB142,asteroidGroupB142,-191,0,-117,.13);

    const asteroidGroupB143 = new THREE.Group();
    const asteroidMeshB143 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB143,asteroidGroupB143,-178,-.6,-117,.27);

    const asteroidGroupB144 = new THREE.Group();
    const asteroidMeshB144 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB144,asteroidGroupB144,-172.6,0,-116,.3);

    const asteroidGroupB145 = new THREE.Group();
    const asteroidMeshB145 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB145,asteroidGroupB145,-190.5,1,-115,.17);

    const asteroidGroupB146 = new THREE.Group();
    const asteroidMeshB146 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB146,asteroidGroupB146,-190.6,0,-84,.3);

    const asteroidGroupB147 = new THREE.Group();
    const asteroidMeshB147 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB147,asteroidGroupB147,-185,-.6,-107,.5);

    const asteroidGroupB148 = new THREE.Group();
    const asteroidMeshB148 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB148,asteroidGroupB148,-192,0,-97,.3);

    const asteroidGroupB149 = new THREE.Group();
    const asteroidMeshB149 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB149,asteroidGroupB149,-164,.31,-197,.57);

    const asteroidGroupB150 = new THREE.Group();
    const asteroidMeshB150 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB150,asteroidGroupB150,-189,0,-82.3,.43);

    const asteroidGroupB151 = new THREE.Group();
    const asteroidMeshB151 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB151,asteroidGroupB151,-180,.6,-109,.42);

    const asteroidGroupB152 = new THREE.Group();
    const asteroidMeshB152 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB152,asteroidGroupB152,-201,0,-85.5,.3);

    const asteroidGroupB153 = new THREE.Group();
    const asteroidMeshB153 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB153,asteroidGroupB153,-201,0,-91,.13);

    const asteroidGroupB154 = new THREE.Group();
    const asteroidMeshB154 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB154,asteroidGroupB154,-203,0,-75.27,.3);

    const asteroidGroupB155 = new THREE.Group();
    const asteroidMeshB155 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB155,asteroidGroupB155,-183,.6,-95,.17);

    const asteroidGroupB156 = new THREE.Group();
    const asteroidMeshB156 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB156,asteroidGroupB156,-145,0,-153,.67);

    const asteroidGroupB157 = new THREE.Group();
    const asteroidMeshB157 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB157,asteroidGroupB157,-185,.6,-90,.5);

    const asteroidGroupB158 = new THREE.Group();
    const asteroidMeshB158 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB158,asteroidGroupB158,-170,0,-134,.43);

    const asteroidGroupB159 = new THREE.Group();
    const asteroidMeshB159 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB159,asteroidGroupB159,-167,0,-130.8,.13);

    const asteroidGroupB160 = new THREE.Group();
    const asteroidMeshB160 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB160,asteroidGroupB160,-205,0,-112,.3);

    const asteroidGroupB161 = new THREE.Group();
    const asteroidMeshB161 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB161,asteroidGroupB161,-202,0,-106,.23);

    const asteroidGroupB162 = new THREE.Group();
    const asteroidMeshB162 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB162,asteroidGroupB162,-207,.42,-167,1.1);

    const asteroidGroupB163 = new THREE.Group();
    const asteroidMeshB163 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB163,asteroidGroupB163,-195,0,-78,.37);      

    const asteroidGroupB164 = new THREE.Group();
    const asteroidMeshB164 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB164,asteroidGroupB164,-185,0,-98,.35);

    const asteroidGroupB166 = new THREE.Group();
    const asteroidMeshB166 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB166,asteroidGroupB166,-175,0,-102,.3);

    const asteroidGroupB165 = new THREE.Group();
    const asteroidMeshB165 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB165,asteroidGroupB165,-181,0,-96,.3);

    const asteroidGroupB167 = new THREE.Group();
    const asteroidMeshB167 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB167,asteroidGroupB167,-176,0,-117,.3);

    const asteroidGroupB168 = new THREE.Group();
    const asteroidMeshB168 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB168,asteroidGroupB168,-195,0,-78,.5);

    const asteroidGroupB169 = new THREE.Group();
    const asteroidMeshB169 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB169,asteroidGroupB169,-185,.2,-88,.35);

    const asteroidGroupB170 = new THREE.Group();
    const asteroidMeshB170 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB170,asteroidGroupB170,-185,.2,-198,.8);//\\\\\OUTER ORBIT LONER

    const asteroidGroupB171 = new THREE.Group();
    const asteroidMeshB171 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB171,asteroidGroupB171,-168,0,-126,.3);

    const asteroidGroupB172 = new THREE.Group();
    const asteroidMeshB172 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB172,asteroidGroupB172,-198,0,-91,.3);

    const asteroidGroupB173 = new THREE.Group();
    const asteroidMeshB173 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB173,asteroidGroupB173,-170,0,-119,.3);

    const asteroidGroupB174 = new THREE.Group();
    const asteroidMeshB174 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB174,asteroidGroupB174,-160,0,-129.2,.3);



                                                //RIGHT/BOTTOM/DOWN/LEFT - 2ND FILL LEFT DOWN
    const asteroidGroupB175 = new THREE.Group();
    const asteroidMeshB175 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB175,asteroidGroupB175,-5,0,-226,.43);

    const asteroidGroupB176 = new THREE.Group();
    const asteroidMeshB176 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB176,asteroidGroupB176,-210,0,-132,.67);

    const asteroidGroupB177 = new THREE.Group();
    const asteroidMeshB177 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB177,asteroidGroupB177,-185,.6,-130,.5);

    const asteroidGroupB179 = new THREE.Group();
    const asteroidMeshB179 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB179,asteroidGroupB179,-238,.6,-59,.27);

    const asteroidGroupB180 = new THREE.Group();
    const asteroidMeshB180 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB180,asteroidGroupB180,-211,.3,-100,.27);

    const asteroidGroupB181 = new THREE.Group();
    const asteroidMeshB181 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB181,asteroidGroupB181,-226,.31,-80,.38);

    const asteroidGroupB182 = new THREE.Group();
    const asteroidMeshB182 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB182,asteroidGroupB182,-208,.42,-95,.41);  

    const asteroidGroupB184 = new THREE.Group();
    const asteroidMeshB184 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB184,asteroidGroupB184,-208,-.4,-90,.47);

    const asteroidGroupB185 = new THREE.Group();
    const asteroidMeshB185 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB185,asteroidGroupB185,-229,.5,-86,.37);

    const asteroidGroupB186 = new THREE.Group();
    const asteroidMeshB186 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB186,asteroidGroupB186,-214,-.6,-90,.4);

    const asteroidGroupB187 = new THREE.Group();
    const asteroidMeshB187 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB187,asteroidGroupB187,-204,0,-75,.28);

    const asteroidGroupB188 = new THREE.Group();
    const asteroidMeshB188 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB188,asteroidGroupB188,-212,0,-104,.37);

    const asteroidGroupB189 = new THREE.Group();
    const asteroidMeshB189 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB189,asteroidGroupB189,-232,.49,-68,.37);

    const asteroidGroupB190 = new THREE.Group();
    const asteroidMeshB190 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB190,asteroidGroupB190,-216,.4,-88,.47);

    const asteroidGroupB191 = new THREE.Group();
    const asteroidMeshB191 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB191,asteroidGroupB191,-237,.4,-66,.37);

    const asteroidGroupB192 = new THREE.Group();
    const asteroidMeshB192 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB192,asteroidGroupB192,-214,.32,-98,.38);  

    const asteroidGroupB193 = new THREE.Group();
    const asteroidMeshB193 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB193,asteroidGroupB193,-221,.38,-122,.57);

    const asteroidGroupB194 = new THREE.Group();
    const asteroidMeshB194 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB194,asteroidGroupB194,-206,0,-86.5,.27);

    const asteroidGroupB195 = new THREE.Group();
    const asteroidMeshB195 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB195,asteroidGroupB195,-195,0,-118,.37);

    const asteroidGroupB196 = new THREE.Group();
    const asteroidMeshB196 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB196,asteroidGroupB196,-220,0,-74,.32);

    const asteroidGroupB197 = new THREE.Group();
    const asteroidMeshB197 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB197,asteroidGroupB197,-185,0,-138,.35);

    const asteroidGroupB198 = new THREE.Group();
    const asteroidMeshB198 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB198,asteroidGroupB198,-235,0,-82,.3);

    const asteroidGroupB199 = new THREE.Group();
    const asteroidMeshB199 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB199,asteroidGroupB199,-241,0,-76,.3);

    const asteroidGroupB200 = new THREE.Group();
    const asteroidMeshB200 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB200,asteroidGroupB200,-206,.51,-131,.4);

    const asteroidGroupB201 = new THREE.Group();
    const asteroidMeshB201 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB201,asteroidGroupB201,-230,.51,-71,.51);

    const asteroidGroupB202 = new THREE.Group();
    const asteroidMeshB202 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB202,asteroidGroupB202,-205,-.51,-142,.41);

    const asteroidGroupB203 = new THREE.Group();
    const asteroidMeshB203 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB203,asteroidGroupB203,-231,.51,-53,.4);

    const asteroidGroupB204 = new THREE.Group();
    const asteroidMeshB204 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB204,asteroidGroupB204,-236,.71,-84,.27);

    const asteroidGroupB205 = new THREE.Group();
    const asteroidMeshB205 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB205,asteroidGroupB205,-228,-.71,-55,.27);

    const asteroidGroupB206 = new THREE.Group();
    const asteroidMeshB206 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB206,asteroidGroupB206,-220,0,-94,.72);

    const asteroidGroupB207 = new THREE.Group();
    const asteroidMeshB207 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB207,asteroidGroupB207,-220,0,-54,.61);

    const asteroidGroupB208 = new THREE.Group();
    const asteroidMeshB208 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB208,asteroidGroupB208,-242,0,-88,.3);

    const asteroidGroupB209 = new THREE.Group();
    const asteroidMeshB209 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB209,asteroidGroupB209,-214,0,-59,.7);

    const asteroidGroupB210 = new THREE.Group();
    const asteroidMeshB210 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB210,asteroidGroupB210,-199,.31,-111,.27);

    const asteroidGroupB211 = new THREE.Group();
    const asteroidMeshB211 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB211,asteroidGroupB211,-210,0,-102,.75);

    const asteroidGroupB212 = new THREE.Group();
    const asteroidMeshB212 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB212,asteroidGroupB212,-185,-.31,-142,.38);

    const asteroidGroupB213 = new THREE.Group();
    const asteroidMeshB213 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB213,asteroidGroupB213,-218,.31,-105,.17);

    const asteroidGroupB214 = new THREE.Group();
    const asteroidMeshB214 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB214,asteroidGroupB214,-193,.21,-131,.27);

    const asteroidGroupB215 = new THREE.Group();
    const asteroidMeshB215 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB215,asteroidGroupB215,-215,0,-84,.7);

    const asteroidGroupB216 = new THREE.Group();
    const asteroidMeshB216 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB216,asteroidGroupB216,-215,0,-120,.82);

    const asteroidGroupB217 = new THREE.Group();
    const asteroidMeshB217 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB217,asteroidGroupB217,-225,.21,-107,.5);

    const asteroidGroupB218 = new THREE.Group();
    const asteroidMeshB218 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB218,asteroidGroupB218,-188,-.41,-138.8,.27);

    const asteroidGroupB219 = new THREE.Group();
    const asteroidMeshB219 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB219,asteroidGroupB219,-108,0,-175,.7);

    const asteroidGroupB220 = new THREE.Group();
    const asteroidMeshB220 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB220,asteroidGroupB220,-235,.31,-86,.47);

    const asteroidGroupB221 = new THREE.Group();
    const asteroidMeshB221 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB221,asteroidGroupB221,-210,0,-112,.73);

    const asteroidGroupB222 = new THREE.Group();
    const asteroidMeshB222 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB222,asteroidGroupB222,-232,-.31,-75,.37);  

    const asteroidGroupB223 = new THREE.Group();
    const asteroidMeshB223 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB223,asteroidGroupB223,-215,.31,-83,.17);

    const asteroidGroupB224 = new THREE.Group();
    const asteroidMeshB224 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB224,asteroidGroupB224,-191,-.31,-122,.27);

    const asteroidGroupB225 = new THREE.Group();
    const asteroidMeshB225 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB225,asteroidGroupB225,-235,.31,-75,.37);

    const asteroidGroupB226 = new THREE.Group();
    const asteroidMeshB226 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB226,asteroidGroupB226,-217,0,-92,.71);

    const asteroidGroupB227 = new THREE.Group();
    const asteroidMeshB227 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB227,asteroidGroupB227,-225,0,-85,.5);

    const asteroidGroupB228 = new THREE.Group();
    const asteroidMeshB228 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB228,asteroidGroupB228,-195,0.81,-68,.27);

    const asteroidGroupB229 = new THREE.Group();
    const asteroidMeshB229 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB229,asteroidGroupB229,-218,.41,-79,.37);

    const asteroidGroupB230 = new THREE.Group();
    const asteroidMeshB230 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB230,asteroidGroupB230,-237,-.41,-72,.27);

    const asteroidGroupB231 = new THREE.Group();
    const asteroidMeshB231 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB231,asteroidGroupB231,-202,0,-102,.52);

    const asteroidGroupB232 = new THREE.Group();
    const asteroidMeshB232 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB232,asteroidGroupB232,-225,.2,-88,.5);  

    const asteroidGroupB233 = new THREE.Group();
    const asteroidMeshB233 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB233,asteroidGroupB233,-208,-.21,-104,.47);

    const asteroidGroupB234 = new THREE.Group();
    const asteroidMeshB234 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB234,asteroidGroupB234,-212,.37,-78,.27);

    const asteroidGroupB235 = new THREE.Group();
    const asteroidMeshB235 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB235,asteroidGroupB235,-201,-.31,-95,.37);

    const asteroidGroupB236 = new THREE.Group();
    const asteroidMeshB236 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB236,asteroidGroupB236,-241,.3,-93,.11);

    const asteroidGroupB237 = new THREE.Group();
    const asteroidMeshB237 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB237,asteroidGroupB237,-205,-.7,-93,.27);

    const asteroidGroupB238 = new THREE.Group();
    const asteroidMeshB238 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB238,asteroidGroupB238,-223,0,-70,.647);

    const asteroidGroupB239 = new THREE.Group();
    const asteroidMeshB239 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB239,asteroidGroupB239,-201.8,.5,-100,.27);

    const asteroidGroupB240 = new THREE.Group();
    const asteroidMeshB240 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB240,asteroidGroupB240,-235,-1,-70,.4);

    const asteroidGroupB241 = new THREE.Group();
    const asteroidMeshB241 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB241,asteroidGroupB241,-238,-.6,-97,.27);

    const asteroidGroupB242 = new THREE.Group();
    const asteroidMeshB242 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB242,asteroidGroupB242,-232,.61,-73,.2);

    const asteroidGroupB243 = new THREE.Group();
    const asteroidMeshB243 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB243,asteroidGroupB243,-190.5,1,-155,.17);

    const asteroidGroupB244 = new THREE.Group();
    const asteroidMeshB244 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB244,asteroidGroupB244,-248,.3,-71,.49);

    const asteroidGroupB245 = new THREE.Group();
    const asteroidMeshB245 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB245,asteroidGroupB245,-245,-.6,-87,.5);

    const asteroidGroupB246 = new THREE.Group();
    const asteroidMeshB246 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB246,asteroidGroupB246,-228,-.51,-76,.27);

    const asteroidGroupB247 = new THREE.Group();
    const asteroidMeshB247 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB247,asteroidGroupB247,-238,.31,-79,.37);

    const asteroidGroupB248 = new THREE.Group();
    const asteroidMeshB248 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB248,asteroidGroupB248,-226,-.6,-65,.37);

    const asteroidGroupB249 = new THREE.Group();
    const asteroidMeshB249 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB249,asteroidGroupB249,-240,.6,-89,.42);

    const asteroidGroupB250 = new THREE.Group();
    const asteroidMeshB250 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB250,asteroidGroupB250,-193,0,-109,.5);

    const asteroidGroupB251 = new THREE.Group();
    const asteroidMeshB251 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB251,asteroidGroupB251,-238,.6,-82,.17);

    const asteroidGroupB252 = new THREE.Group();
    const asteroidMeshB252 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB252,asteroidGroupB252,-226,.6,-54,.27);

    const asteroidGroupB253 = new THREE.Group();
    const asteroidMeshB253 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB253,asteroidGroupB253,-243,.6,-75,.17);

    const asteroidGroupB254 = new THREE.Group();
    const asteroidMeshB254 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB254,asteroidGroupB254,-236,0,-97,.3);

    const asteroidGroupB255 = new THREE.Group();
    const asteroidMeshB255 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB255,asteroidGroupB255,-240,0,-68,.25);

    const asteroidGroupB256 = new THREE.Group();
    const asteroidMeshB256 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB256,asteroidGroupB256,-225,0,-74,.35);  

    const asteroidGroupB257 = new THREE.Group();
    const asteroidMeshB257 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB257,asteroidGroupB257,-238,0,-68,.37);

    const asteroidGroupB258 = new THREE.Group();
    const asteroidMeshB258 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB258,asteroidGroupB258,-226,0,-92,.37);

    const asteroidGroupB259 = new THREE.Group();
    const asteroidMeshB259 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB259,asteroidGroupB259,-255,0,-58,.5);

    const asteroidGroupB260 = new THREE.Group();
    const asteroidMeshB260 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB260,asteroidGroupB260,-222,.2,-83,.32);

    const asteroidGroupB261 = new THREE.Group();
    const asteroidMeshB261 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB261,asteroidGroupB261,-185,.2,-128,.35);

    const asteroidGroupB262 = new THREE.Group();
    const asteroidMeshB262 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB262,asteroidGroupB262,-235,.2,-78,.27);

    const asteroidGroupB264 = new THREE.Group();
    const asteroidMeshB264 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB264,asteroidGroupB264,-242,.2,-58,.27);

    const asteroidGroupB265 = new THREE.Group();
    const asteroidMeshB265 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB265,asteroidGroupB265,-228,0,-106,.3);

    const asteroidGroupB266 = new THREE.Group();
    const asteroidMeshB266 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB266,asteroidGroupB266,-198,0,-131,.3);

    const asteroidGroupB267 = new THREE.Group();
    const asteroidMeshB267 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB267,asteroidGroupB267,-230,0,-99,.3);

    const asteroidGroupB268 = new THREE.Group();
    const asteroidMeshB268 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB268,asteroidGroupB268,-210,0,-84.5,.53);

    const asteroidGroupB269 = new THREE.Group();
    const asteroidMeshB269 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB269,asteroidGroupB269,-220,0,-109.2,.3);

    const asteroidGroupB270 = new THREE.Group();
    const asteroidMeshB270 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB270,asteroidGroupB270,-234.5,0,-90,.3);

    const asteroidGroupB271 = new THREE.Group();
    const asteroidMeshB271 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB271,asteroidGroupB271,-230,0,-114,.43);

    const asteroidGroupB272 = new THREE.Group();
    const asteroidMeshB272 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB272,asteroidGroupB272,-205,0,-91.7,.3);

    const asteroidGroupB273 = new THREE.Group();
    const asteroidMeshB273 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB273,asteroidGroupB273,-227,0,-110.8,.13);

    const asteroidGroupB274 = new THREE.Group();
    const asteroidMeshB274 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB274,asteroidGroupB274,-205,0,-152,.3);

    const asteroidGroupB275 = new THREE.Group();
    const asteroidMeshB275 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB275,asteroidGroupB275,-202,0,-146,.23);

    const asteroidGroupB276 = new THREE.Group();
    const asteroidMeshB276 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB276,asteroidGroupB276,-201,0,-125.5,.3);

    const asteroidGroupB277 = new THREE.Group();
    const asteroidMeshB277 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB277,asteroidGroupB277,-201,0,-131,.13);

    const asteroidGroupB278 = new THREE.Group();
    const asteroidMeshB278 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB278,asteroidGroupB278,-203,0,-115.27,.3);

    const asteroidGroupB279 = new THREE.Group();
    const asteroidMeshB279 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB279,asteroidGroupB279,-191,0,-157,.13);

    const asteroidGroupB280 = new THREE.Group();
    const asteroidMeshB280 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB280,asteroidGroupB280,-232.6,0,-96,.3);

    const asteroidGroupB281 = new THREE.Group();
    const asteroidMeshB281 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB281,asteroidGroupB281,-192,0,-127,.3);

    const asteroidGroupB282 = new THREE.Group();
    const asteroidMeshB282 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB282,asteroidGroupB282,-211,0,-94,.63);

    const asteroidGroupB283 = new THREE.Group();
    const asteroidMeshB283 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB283,asteroidGroupB283,-190.6,0,-124,.3);

    const asteroidGroupB284 = new THREE.Group();
    const asteroidMeshB284 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB284,asteroidGroupB284,-189,0,-122.3,.43);

    const asteroidGroupB285 = new THREE.Group();
    const asteroidMeshB285 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB285,asteroidGroupB285,-229.7,0,-82.7,.13);

    const asteroidGroupB286 = new THREE.Group();
    const asteroidMeshB286 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB286,asteroidGroupB286,-215,0,-62.7,.3);

    const asteroidGroupB287 = new THREE.Group();
    const asteroidMeshB287 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB287,asteroidGroupB287,-228,0,-84,.3);

    const asteroidGroupB288 = new THREE.Group();
    const asteroidMeshB288 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB288,asteroidGroupB288,-228,0,-68.7,.3);

    const asteroidGroupB289 = new THREE.Group();
    const asteroidMeshB289 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB289,asteroidGroupB289,-222.6,0,-89.6,.3);

    const asteroidGroupB290 = new THREE.Group();
    const asteroidMeshB290 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB290,asteroidGroupB290,-243,0,-21.56,.3);

    const asteroidGroupB291 = new THREE.Group();
    const asteroidMeshB291 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB291,asteroidGroupB291,-225.36,0,-102.6,.53);

    const asteroidGroupB292 = new THREE.Group();
    const asteroidMeshB292 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB292,asteroidGroupB292,-223.7,0,-98,.63);

    const asteroidGroupB293 = new THREE.Group();
    const asteroidMeshB293 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB293,asteroidGroupB293,-220.6,0,-87.6,.3);

    const asteroidGroupB294 = new THREE.Group();
    const asteroidMeshB294 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB294,asteroidGroupB294,-173,0,-175,.37);

    const asteroidGroupB295 = new THREE.Group();
    const asteroidMeshB295 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB295,asteroidGroupB295,-167,0,-145,.5);

    const asteroidGroupB296 = new THREE.Group();
    const asteroidMeshB296 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB296,asteroidGroupB296,-117,0,-169,1);

    const asteroidGroupB297 = new THREE.Group();
    const asteroidMeshB297 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB297,asteroidGroupB297,-142,.2,-168,.35);

    const asteroidGroupB298 = new THREE.Group();
    const asteroidMeshB298 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB298,asteroidGroupB298,-110.6,0,-173,.3);

    const asteroidGroupB299 = new THREE.Group();
    const asteroidMeshB299 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB299,asteroidGroupB299,-182,0,-175.7,.3);

    const asteroidGroupB300 = new THREE.Group();
    const asteroidMeshB300 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB300,asteroidGroupB300,-122.36,0,-187.6,.53);

    const asteroidGroupB301 = new THREE.Group();
    const asteroidMeshB301 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB301,asteroidGroupB301,-112,.49,-182,.87);  

    const asteroidGroupB302 = new THREE.Group();
    const asteroidMeshB302 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB302,asteroidGroupB302,-3,0,-230,.63);

    const asteroidGroupB303 = new THREE.Group();
    const asteroidMeshB303 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB303,asteroidGroupB303,0,0,-216,.53);



                                                                //BOTTOM/RIGHT       
    const asteroidGroupB304 = new THREE.Group();
    const asteroidMeshB304 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB304,asteroidGroupB304,-43,.3,-221,.11);

    const asteroidGroupB305 = new THREE.Group();
    const asteroidMeshB305 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB305,asteroidGroupB305,-8,0,-235,.37);

    const asteroidGroupB306 = new THREE.Group();
    const asteroidMeshB306 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB306,asteroidGroupB306,-110,0,-196,.82);

    const asteroidGroupB307 = new THREE.Group();
    const asteroidMeshB307 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB307,asteroidGroupB307,-28,0,-225,.35);

    const asteroidGroupB308 = new THREE.Group();
    const asteroidMeshB308 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB308,asteroidGroupB308,-6,0,-252,.63);

    const asteroidGroupB309 = new THREE.Group();
    const asteroidMeshB309 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB309,asteroidGroupB309,-26,0,-221,.3);

    const asteroidGroupB310 = new THREE.Group();
    const asteroidMeshB310 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB310,asteroidGroupB310,-47,0,-216,.3);

    const asteroidGroupB311 = new THREE.Group();
    const asteroidMeshB311 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB311,asteroidGroupB311,-18,0,-220,.25);

    const asteroidGroupB313 = new THREE.Group();
    const asteroidMeshB313 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB313,asteroidGroupB313,-18,0,-218,.37);

    const asteroidGroupB314 = new THREE.Group();
    const asteroidMeshB314 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB314,asteroidGroupB314,-42,0,-206,.37);

    const asteroidGroupB315 = new THREE.Group();
    const asteroidMeshB315 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB315,asteroidGroupB315,-8,0,-235,.5);

    const asteroidGroupB316 = new THREE.Group();
    const asteroidMeshB316 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB316,asteroidGroupB316,-33,.2,-202,.32);

    const asteroidGroupB317 = new THREE.Group();
    const asteroidMeshB317 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB317,asteroidGroupB317,-54,.2,-228,.35);

    const asteroidGroupB318 = new THREE.Group();
    const asteroidMeshB318 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB318,asteroidGroupB318,-27,.2,-255,1);

    const asteroidGroupB319 = new THREE.Group();
    const asteroidMeshB319 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB319,asteroidGroupB319,-8,.2,-222,.27);

    const asteroidGroupB320 = new THREE.Group();
    const asteroidMeshB320 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB210,asteroidGroupB320,-56,0,-208,.3);

    const asteroidGroupB321 = new THREE.Group();
    const asteroidMeshB321 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB321,asteroidGroupB321,-21,0,-238,.3);

    const asteroidGroupB322 = new THREE.Group();
    const asteroidMeshB322 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB322,asteroidGroupB322,-49,0,-210,.3);

    const asteroidGroupB324 = new THREE.Group();
    const asteroidMeshB324 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB324,asteroidGroupB324,-59.2,0,-200,.3);

    const asteroidGroupB325 = new THREE.Group();
    const asteroidMeshB325 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB325,asteroidGroupB325,-40,0,-214.5,.3);

    const asteroidGroupB326 = new THREE.Group();
    const asteroidMeshB326 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB326,asteroidGroupB326,-64,0,-210,.43);

    const asteroidGroupB328 = new THREE.Group();
    const asteroidMeshB328 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB328,asteroidGroupB328,-60.8,0,-207,.13);

    const asteroidGroupB329 = new THREE.Group();
    const asteroidMeshB329 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB329,asteroidGroupB329,-46,0,-243,.3);

    const asteroidGroupB330 = new THREE.Group();
    const asteroidMeshB330 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB330,asteroidGroupB330,-36,0,-242,.23);

    const asteroidGroupB331 = new THREE.Group();
    const asteroidMeshB331 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB331,asteroidGroupB331,-15.5,0,-241,.3);

    const asteroidGroupB332 = new THREE.Group();
    const asteroidMeshB332 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB332,asteroidGroupB332,-21,.3,-208,.36);

    const asteroidGroupB333 = new THREE.Group();
    const asteroidMeshB333 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB333,asteroidGroupB333,-5.27,0,-243,.3);

    const asteroidGroupB334 = new THREE.Group();
    const asteroidMeshB334 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB334,asteroidGroupB334,-47,0,-231,.13);

    const asteroidGroupB335 = new THREE.Group();
    const asteroidMeshB335 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB335,asteroidGroupB335,-46,0,-212.6,.3);

    const asteroidGroupB336 = new THREE.Group();
    const asteroidMeshB336 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB336,asteroidGroupB336,-17,0,-232,.3);

    const asteroidGroupB338 = new THREE.Group();
    const asteroidMeshB338 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB338,asteroidGroupB338,-14,0,-230.6,.3);

    const asteroidGroupB339 = new THREE.Group();
    const asteroidMeshB339 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB339,asteroidGroupB339,-48,0,-226,.65);

    const asteroidGroupB340 = new THREE.Group();
    const asteroidMeshB340 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB340,asteroidGroupB340,-12.3,0,-229,.43);

    const asteroidGroupB341 = new THREE.Group();
    const asteroidMeshB341 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB341,asteroidGroupB341,-32.7,0,-209.7,.13);

    const asteroidGroupB342 = new THREE.Group();
    const asteroidMeshB342 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB342,asteroidGroupB342,-12.7,0,-226,.3);

    const asteroidGroupB343 = new THREE.Group();
    const asteroidMeshB343 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB343,asteroidGroupB343,-34,0,-208,.3);

    const asteroidGroupB344 = new THREE.Group();
    const asteroidMeshB344 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB344,asteroidGroupB344,-18.7,0,-228,.3);

    const asteroidGroupB345 = new THREE.Group();
    const asteroidMeshB345 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB345,asteroidGroupB345,-39.6,0,-202.6,.3);

    const asteroidGroupB346 = new THREE.Group();
    const asteroidMeshB346 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB346,asteroidGroupB346,-21.6,0,-223,.3);

    const asteroidGroupB347 = new THREE.Group();
    const asteroidMeshB347 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB347,asteroidGroupB347,-52.6,0,-205.36,.53);

    const asteroidGroupB348 = new THREE.Group();
    const asteroidMeshB348 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB348,asteroidGroupB348,-48,0,-203.7,.63);

    const asteroidGroupB349 = new THREE.Group();
    const asteroidMeshB349 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB349,asteroidGroupB349,-37.6,0,-200.6,.3);

    const asteroidGroupB350 = new THREE.Group();
    const asteroidMeshB350 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB350,asteroidGroupB350,-28,.38,-209,.27);

    const asteroidGroupB351 = new THREE.Group();
    const asteroidMeshB351 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB351,asteroidGroupB351,-39,.6,-220,.42);

    const asteroidGroupB352 = new THREE.Group();
    const asteroidMeshB352 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB352,asteroidGroupB352,-12,0,-203,.5);  

    const asteroidGroupB353 = new THREE.Group();
    const asteroidMeshB353 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB353,asteroidGroupB353,-32,.6,-218,.17);

    const asteroidGroupB354 = new THREE.Group();
    const asteroidMeshB354 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB354,asteroidGroupB354,-4,.6,-206,.27);

    const asteroidGroupB355 = new THREE.Group();
    const asteroidMeshB355 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB355,asteroidGroupB355,-25,.6,-223,.17);

    const asteroidGroupB356 = new THREE.Group();
    const asteroidMeshB356 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB356,asteroidGroupB356,-85,0,-190,.67);

    const asteroidGroupB357 = new THREE.Group();
    const asteroidMeshB357 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB357,asteroidGroupB357,-13,.6,-222,.75);

    const asteroidGroupB358 = new THREE.Group();
    const asteroidMeshB358 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB358,asteroidGroupB358,-28,-.6,-203,.7);

    const asteroidGroupB359 = new THREE.Group();
    const asteroidMeshB359 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB359,asteroidGroupB359,-9,.6,-218,.27);

    const asteroidGroupB360 = new THREE.Group();
    const asteroidMeshB360 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB360,asteroidGroupB360,-12,-.71,-258,.7);

    const asteroidGroupB361 = new THREE.Group();
    const asteroidMeshB361 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB361,asteroidGroupB361,-30,.31,-206,.38);

    const asteroidGroupB362 = new THREE.Group();
    const asteroidMeshB362 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB362,asteroidGroupB362,-52,0,-222,.72);

    const asteroidGroupB363 = new THREE.Group();
    const asteroidMeshB363 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB363,asteroidGroupB363,-27,.37,-243,.47);

    const asteroidGroupB364 = new THREE.Group();
    const asteroidMeshB364 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB364,asteroidGroupB364,-34,.71,-216,.27);

    const asteroidGroupB365 = new THREE.Group();
    const asteroidMeshB365 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB365,asteroidGroupB365,-36,.5,-209,.37);

    const asteroidGroupB366 = new THREE.Group();
    const asteroidMeshB366 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB366,asteroidGroupB366,-37,-.6,-232,.6);

    const asteroidGroupB367 = new THREE.Group();
    const asteroidMeshB367 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB367,asteroidGroupB367,-7,0,-205,.61);

    const asteroidGroupB368 = new THREE.Group();
    const asteroidMeshB368 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB368,asteroidGroupB368,-38,0,-222,.3);

    const asteroidGroupB369 = new THREE.Group();
    const asteroidMeshB369 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB369,asteroidGroupB369,-114,.49,-202,.67);

    const asteroidGroupB370 = new THREE.Group();
    const asteroidMeshB370 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB370,asteroidGroupB370,-1,.31,-239,.27);

    const asteroidGroupB371 = new THREE.Group();
    const asteroidMeshB371 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB371,asteroidGroupB371,-3,.51,-211,.4);

    const asteroidGroupB372 = new THREE.Group();
    const asteroidMeshB372 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB372,asteroidGroupB372,-32,-.31,-225,.38);  

    const asteroidGroupB373 = new THREE.Group();
    const asteroidMeshB373 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB373,asteroidGroupB373,-55,.31,-198,.17);

    const asteroidGroupB374 = new THREE.Group();
    const asteroidMeshB374 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB374,asteroidGroupB374,-21,.21,-233,.27);

    const asteroidGroupB376 = new THREE.Group();
    const asteroidMeshB376 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB376,asteroidGroupB376,-70,0,-195,.82);

    const asteroidGroupB377 = new THREE.Group();
    const asteroidMeshB377 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB377,asteroidGroupB377,-32,-.51,-235,.41);

    const asteroidGroupB378 = new THREE.Group();
    const asteroidMeshB378 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB378,asteroidGroupB378,-28.8,-.41,-228,.27);

    const asteroidGroupB379 = new THREE.Group();
    const asteroidMeshB379 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB379,asteroidGroupB379,-45,0,-208,.7);

    const asteroidGroupB380 = new THREE.Group();
    const asteroidMeshB380 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB380,asteroidGroupB380,-26,-.51,-208,.27);

    const asteroidGroupB381 = new THREE.Group();
    const asteroidMeshB381 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB381,asteroidGroupB381,-29,.31,-218,.37);

    const asteroidGroupB382 = new THREE.Group();
    const asteroidMeshB382 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB382,asteroidGroupB382,-15,-.6,-206,.37);

    const asteroidGroupB383 = new THREE.Group();
    const asteroidMeshB383 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB383,asteroidGroupB383,-21,.51,-250,.51);

    const asteroidGroupB384 = new THREE.Group();
    const asteroidMeshB384 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB384,asteroidGroupB384,-12,-.31,-251,.57);

    const asteroidGroupB385 = new THREE.Group();
    const asteroidMeshB385 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB385,asteroidGroupB385,-25,.31,-231,.47);

    const asteroidGroupB386 = new THREE.Group();
    const asteroidMeshB386 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB386,asteroidGroupB386,-43,0,-199,.71);

    const asteroidGroupB387 = new THREE.Group();
    const asteroidMeshB387 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB387,asteroidGroupB387,-11,0,-208,.5);

    const asteroidGroupB388 = new THREE.Group();
    const asteroidMeshB388 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB388,asteroidGroupB388,-8,-.31,-235,.27);

    const asteroidGroupB389 = new THREE.Group();
    const asteroidMeshB389 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB389,asteroidGroupB389,-37,-.6,-225,.5);

    const asteroidGroupB390 = new THREE.Group();
    const asteroidMeshB390 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB390,asteroidGroupB390,-22,-.41,-217,.27);

    const asteroidGroupB391 = new THREE.Group();
    const asteroidMeshB391 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB391,asteroidGroupB391,-35,.51,-255,.39);  

    const asteroidGroupB392 = new THREE.Group();
    const asteroidMeshB392 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB392,asteroidGroupB392,-38,.2,-262,.75);

    const asteroidGroupB393 = new THREE.Group();
    const asteroidMeshB393 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB393,asteroidGroupB393,-47,-.6,-218,.27);

    const asteroidGroupB394 = new THREE.Group();
    const asteroidMeshB394 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB394,asteroidGroupB394,-44,.37,-246,.7);

    const asteroidGroupB395 = new THREE.Group();
    const asteroidMeshB395 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB395,asteroidGroupB395,-23,.61,-212,.2);

    const asteroidGroupB396 = new THREE.Group();
    const asteroidMeshB396 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB396,asteroidGroupB396,-32,.6,-257,.4);

    const asteroidGroupB397 = new THREE.Group();
    const asteroidMeshB397 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB397,asteroidGroupB397,-5,1,-230.5,.17);

    const asteroidGroupB398 = new THREE.Group();
    const asteroidMeshB398 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB398,asteroidGroupB398,-20,0,-203,.47);

    const asteroidGroupB399 = new THREE.Group();
    const asteroidMeshB399 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB399,asteroidGroupB399,-16,.4,-217,.37);

    const asteroidGroupB400 = new THREE.Group();
    const asteroidMeshB400 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB400,asteroidGroupB400,-20,-1,-215,.4);



                                                //3RD RIGHT FILLER------- BOTTOM/RIGHT/RIGHT/RIGHT
    const asteroidGroupB401 = new THREE.Group();
    const asteroidMeshB401 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB401,asteroidGroupB401,-159.6,0,-162.6,.3);

    const asteroidGroupB402 = new THREE.Group();
    const asteroidMeshB402 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB402,asteroidGroupB402,-141.6,0,-183,.3);

    const asteroidGroupB403 = new THREE.Group();
    const asteroidMeshB403 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB403,asteroidGroupB403,-123,.51,-171,.4);        

    const asteroidGroupB404 = new THREE.Group();
    const asteroidMeshB404 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB404,asteroidGroupB404,-154,.71,-176,.27);

    const asteroidGroupB405 = new THREE.Group();
    const asteroidMeshB405 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB405,asteroidGroupB405,-125,-.71,-168,.27);

    const asteroidGroupB406 = new THREE.Group();
    const asteroidMeshB406 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB406,asteroidGroupB406,-174,0,-160,.72);

    const asteroidGroupB407 = new THREE.Group();
    const asteroidMeshB407 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB407,asteroidGroupB407,-127,0,-165,.61);

    const asteroidGroupB408 = new THREE.Group();
    const asteroidMeshB408 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB408,asteroidGroupB408,-158,0,-182,.3);

    const asteroidGroupB409 = new THREE.Group();
    const asteroidMeshB409 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB409,asteroidGroupB409,-130,0,-157,.7);

    const asteroidGroupB410 = new THREE.Group();
    const asteroidMeshB410 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB410,asteroidGroupB410,-121,.31,-199,.27);

    const asteroidGroupB411 = new THREE.Group();
    const asteroidMeshB411 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB411,asteroidGroupB411,-172,0,-150,.75);

    const asteroidGroupB412 = new THREE.Group();
    const asteroidMeshB412 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB412,asteroidGroupB412,-152,-.31,-185,.38);  

    const asteroidGroupB413 = new THREE.Group();
    const asteroidMeshB413 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB413,asteroidGroupB413,-175,.31,-158,.17);

    const asteroidGroupB414 = new THREE.Group();
    const asteroidMeshB414 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB414,asteroidGroupB414,-141,.21,-193,.27);

    const asteroidGroupB415 = new THREE.Group();
    const asteroidMeshB415 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB415,asteroidGroupB415,-154,0,-155,.7);

    const asteroidGroupB416 = new THREE.Group();
    const asteroidMeshB416 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB416,asteroidGroupB416,-140,0,-157,.82);

    const asteroidGroupB417 = new THREE.Group();
    const asteroidMeshB417 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB417,asteroidGroupB417,-177,.21,-165,.5);

    const asteroidGroupB418 = new THREE.Group();
    const asteroidMeshB418 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB418,asteroidGroupB418,-148.8,-.41,-188,.27);

    const asteroidGroupB419 = new THREE.Group();
    const asteroidMeshB419 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB419,asteroidGroupB419,-165,0,-168,.7);

    const asteroidGroupB420 = new THREE.Group();
    const asteroidMeshB420 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB420,asteroidGroupB420,-156,.31,-175,.47);

    const asteroidGroupB421 = new THREE.Group();
    const asteroidMeshB421 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB421,asteroidGroupB421,-182,0,-150,.73);

    const asteroidGroupB422 = new THREE.Group();
    const asteroidMeshB422 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB422,asteroidGroupB422,-145,-.31,-172,.37);

    const asteroidGroupB423 = new THREE.Group();
    const asteroidMeshB423 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB423,asteroidGroupB423,-152,-.51,-195,.41);  

    const asteroidGroupB424 = new THREE.Group();
    const asteroidMeshB424 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB424,asteroidGroupB424,-132,-.31,-191,.27);

    const asteroidGroupB425 = new THREE.Group();
    const asteroidMeshB425 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB425,asteroidGroupB425,-145,.31,-175,.37);

    const asteroidGroupB426 = new THREE.Group();
    const asteroidMeshB426 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB426,asteroidGroupB426,-182,0,-157,.71);

    const asteroidGroupB427 = new THREE.Group();
    const asteroidMeshB427 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB427,asteroidGroupB427,-141,.51,-170,.51);
        
    const asteroidGroupB428 = new THREE.Group();
    const asteroidMeshB428 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB428,asteroidGroupB428,-128,-.31,-195,.27);

    const asteroidGroupB429 = new THREE.Group();
    const asteroidMeshB429 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB429,asteroidGroupB429,-149,.41,-158,.37);

    const asteroidGroupB430 = new THREE.Group();
    const asteroidMeshB430 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB430,asteroidGroupB430,-142,-.41,-177,.27);

    const asteroidGroupB431 = new THREE.Group();
    const asteroidMeshB431 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB431,asteroidGroupB431,-172,0,-142,.52);

    const asteroidGroupB432 = new THREE.Group();
    const asteroidMeshB432 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB432,asteroidGroupB432,-224,.41,-118,.37);

    const asteroidGroupB433 = new THREE.Group();
    const asteroidMeshB433 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB433,asteroidGroupB433,-174,-.21,-148,.47);

    const asteroidGroupB434 = new THREE.Group();
    const asteroidMeshB434 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB434,asteroidGroupB434,-148,.37,-152,.27);

    const asteroidGroupB435 = new THREE.Group();
    const asteroidMeshB435 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB435,asteroidGroupB435,-165,-.31,-141,.7);

    const asteroidGroupB436 = new THREE.Group();
    const asteroidMeshB436 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB436,asteroidGroupB436,-190,.6,-165,.7);

    const asteroidGroupB437 = new THREE.Group();
    const asteroidMeshB437 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB437,asteroidGroupB437,-203,-.7,-161,.7);

    const asteroidGroupB438 = new THREE.Group();
    const asteroidMeshB438 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB438,asteroidGroupB438,-140,0,-163,.47);

    const asteroidGroupB439 = new THREE.Group();
    const asteroidMeshB439 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB439,asteroidGroupB439,-170,.5,-141.8,.27);

    const asteroidGroupB440 = new THREE.Group();
    const asteroidMeshB440 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB440,asteroidGroupB440,-140,-1,-175,.4);

    const asteroidGroupB441 = new THREE.Group();
    const asteroidMeshB441 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB441,asteroidGroupB441,-163,.3,-181,.11);

    const asteroidGroupB442 = new THREE.Group();
    const asteroidMeshB442 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB442,asteroidGroupB442,-149,.51,-165,.19);  

    const asteroidGroupB443 = new THREE.Group();
    const asteroidMeshB443 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB443,asteroidGroupB443,-167,-.6,-178,.27);

    const asteroidGroupB444 = new THREE.Group();
    const asteroidMeshB444 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB444,asteroidGroupB444,-131,.61,-172,.52);

    const asteroidGroupB445 = new THREE.Group();
    const asteroidMeshB445 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB445,asteroidGroupB445,-165,1,-190.5,.17);

    const asteroidGroupB446 = new THREE.Group();
    const asteroidMeshB446 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB446,asteroidGroupB446,-141,.51,-226,.51);

    const asteroidGroupB447 = new THREE.Group();
    const asteroidMeshB447 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB447,asteroidGroupB447,-157,-.6,-185,.5);

    const asteroidGroupB448 = new THREE.Group();
    const asteroidMeshB448 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB448,asteroidGroupB448,-146,-.51,-168,.27);

    const asteroidGroupB449 = new THREE.Group();
    const asteroidMeshB449 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB449,asteroidGroupB449,-149,.31,-178,.37);

    const asteroidGroupB450 = new THREE.Group();
    const asteroidMeshB450 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB450,asteroidGroupB450,-135,-.6,-166,.37);

    const asteroidGroupB451 = new THREE.Group();
    const asteroidMeshB451 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB451,asteroidGroupB451,-175,.6,-188,.62);

    const asteroidGroupB452 = new THREE.Group();
    const asteroidMeshB452 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB452,asteroidGroupB452,-132,0,-163,.5);  

    const asteroidGroupB453 = new THREE.Group();
    const asteroidMeshB453 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB453,asteroidGroupB453,-160,.6,-190,.417);

    const asteroidGroupB454 = new THREE.Group();
    const asteroidMeshB454 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB454,asteroidGroupB454,-124,.6,-166,.27);

    const asteroidGroupB455 = new THREE.Group();
    const asteroidMeshB455 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB455,asteroidGroupB455,-122,.6,-177,.74);

    const asteroidGroupB456 = new THREE.Group();
    const asteroidMeshB456 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB456,asteroidGroupB456,-203,0,-150,.67);

    const asteroidGroupB457 = new THREE.Group();
    const asteroidMeshB457 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB457,asteroidGroupB457,-144,.6,-190,.5);

    const asteroidGroupB458 = new THREE.Group();
    const asteroidMeshB458 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB458,asteroidGroupB458,-148,-.6,-163,.47);

    const asteroidGroupB459 = new THREE.Group();
    const asteroidMeshB459 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB459,asteroidGroupB459,-129,.6,-178,.27);

    const asteroidGroupB460 = new THREE.Group();
    const asteroidMeshB460 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB460,asteroidGroupB460,-170,.3,-151,.27);

    const asteroidGroupB461 = new THREE.Group();
    const asteroidMeshB461 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB461,asteroidGroupB461,-150,.31,-166,.38);

    const asteroidGroupB462 = new THREE.Group();
    const asteroidMeshB462 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB462,asteroidGroupB462,-165,.42,-148,.41);  

    const asteroidGroupB463 = new THREE.Group();
    const asteroidMeshB463 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB463,asteroidGroupB463,-146,.37,-208,.47);

    const asteroidGroupB464 = new THREE.Group();
    const asteroidMeshB464 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB464,asteroidGroupB464,-160,-.4,-148,.47);

    const asteroidGroupB465 = new THREE.Group();
    const asteroidMeshB465 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB465,asteroidGroupB465,-156,.5,-169,.37);

    const asteroidGroupB466 = new THREE.Group();
    const asteroidMeshB466 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB466,asteroidGroupB466,-160,-.6,-154,.4);

    const asteroidGroupB467 = new THREE.Group();
    const asteroidMeshB467 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB467,asteroidGroupB467,-147,0,-146,.8);

    const asteroidGroupB468 = new THREE.Group();
    const asteroidMeshB468 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB468,asteroidGroupB468,-174,0,-152,.37);

    const asteroidGroupB469 = new THREE.Group();
    const asteroidMeshB469 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB469,asteroidGroupB469,-138,.49,-172,.37);

    const asteroidGroupB470 = new THREE.Group();
    const asteroidMeshB470 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB470,asteroidGroupB470,-158,.4,-156,.47);

    const asteroidGroupB471 = new THREE.Group();
    const asteroidMeshB471 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB471,asteroidGroupB471,-136,.4,-177,.37);

    const asteroidGroupB472 = new THREE.Group();
    const asteroidMeshB472 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB472,asteroidGroupB472,-168,.32,-154,.38);  

    const asteroidGroupB473 = new THREE.Group();
    const asteroidMeshB473 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB473,asteroidGroupB473,-148,.38,-169,.27);

    const asteroidGroupB474 = new THREE.Group();
    const asteroidMeshB474 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB474,asteroidGroupB474,-2,.31,-242,.6);

    const asteroidGroupB475 = new THREE.Group();
    const asteroidMeshB475 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB475,asteroidGroupB475,-128,0,-195,.37);

    const asteroidGroupB476 = new THREE.Group();
    const asteroidMeshB476 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB476,asteroidGroupB476,-139,0,-150,.52);

    const asteroidGroupB477 = new THREE.Group();
    const asteroidMeshB477 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB477,asteroidGroupB477,-148,0,-185,.35);

    const asteroidGroupB478 = new THREE.Group();
    const asteroidMeshB478 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB478,asteroidGroupB478,-152,0,-165,.3);

    const asteroidGroupB479 = new THREE.Group();
    const asteroidMeshB479 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB479,asteroidGroupB479,-146,0,-161,.3);

    const asteroidGroupB480 = new THREE.Group();
    const asteroidMeshB480 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB480,asteroidGroupB480,-167,0,-176,.3);

    const asteroidGroupB481 = new THREE.Group();
    const asteroidMeshB481 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB481,asteroidGroupB481,-180,0,-170,.25);

    const asteroidGroupB482 = new THREE.Group();
    const asteroidMeshB482 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB482,asteroidGroupB482,-157.6,0,-160.6,.3);

    const asteroidGroupB483 = new THREE.Group();
    const asteroidMeshB483 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB483,asteroidGroupB483,-138,0,-178,.37);

    const asteroidGroupB484 = new THREE.Group();
    const asteroidMeshB484 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB484,asteroidGroupB484,-162,0,-166,.37);

    const asteroidGroupB485 = new THREE.Group();
    const asteroidMeshB485 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB485,asteroidGroupB485,-128,0,-195,.5);

    const asteroidGroupB486 = new THREE.Group();
    const asteroidMeshB486 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB486,asteroidGroupB486,-153,.2,-162,.32);

    const asteroidGroupB487 = new THREE.Group();
    const asteroidMeshB487 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB487,asteroidGroupB487,-138,.2,-185,.35);

    const asteroidGroupB488 = new THREE.Group();
    const asteroidMeshB488 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB488,asteroidGroupB488,-148,.2,-175,.27);

    const asteroidGroupB489 = new THREE.Group();
    const asteroidMeshB489 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB489,asteroidGroupB489,-128,.2,-182,.27);

    const asteroidGroupB490 = new THREE.Group();
    const asteroidMeshB490 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB490,asteroidGroupB490,-176,0,-168,.3);

    const asteroidGroupB491 = new THREE.Group();
    const asteroidMeshB491 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB491,asteroidGroupB491,-141,0,-198,.3);

    const asteroidGroupB492 = new THREE.Group();
    const asteroidMeshB492 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB492,asteroidGroupB492,-169,0,-170,.3);

    const asteroidGroupB493 = new THREE.Group();
    const asteroidMeshB493 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB493,asteroidGroupB493,-154.5,0,-150,.53);

    const asteroidGroupB494 = new THREE.Group();
    const asteroidMeshB494 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB494,asteroidGroupB494,-179.2,0,-160,.3);

    const asteroidGroupB495 = new THREE.Group();
    const asteroidMeshB495 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB495,asteroidGroupB495,-168,0,-163.7,.63);

    const asteroidGroupB496 = new THREE.Group();
    const asteroidMeshB496 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB496,asteroidGroupB496,-184,0,-170,.43);

    const asteroidGroupB497 = new THREE.Group();
    const asteroidMeshB497 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB497,asteroidGroupB497,-161.7,0,-145,.3);

    const asteroidGroupB498 = new THREE.Group();
    const asteroidMeshB498 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB498,asteroidGroupB498,-180.8,0,-167,.13);

    const asteroidGroupB499 = new THREE.Group();
    const asteroidMeshB499 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB499,asteroidGroupB499,-162,0,-205,.3);

    const asteroidGroupB500 = new THREE.Group();
    const asteroidMeshB500 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB500,asteroidGroupB500,-156,0,-202,.23);

    const asteroidGroupB501 = new THREE.Group();
    const asteroidMeshB501 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB501,asteroidGroupB501,-135.5,0,-201,.3);

    const asteroidGroupB502 = new THREE.Group();
    const asteroidMeshB502 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB502,asteroidGroupB502,-172.6,0,-165.36,.53);

    const asteroidGroupB503 = new THREE.Group();
    const asteroidMeshB503 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB503,asteroidGroupB503,-125.27,0,-203,.3);

    const asteroidGroupB504 = new THREE.Group();
    const asteroidMeshB504 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB504,asteroidGroupB504,-167,0,-191,.13);

    const asteroidGroupB505 = new THREE.Group();
    const asteroidMeshB505 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB505,asteroidGroupB505,-166,0,-172.6,.3);

    const asteroidGroupB506 = new THREE.Group();
    const asteroidMeshB506 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB506,asteroidGroupB506,-137,0,-192,.3);

    const asteroidGroupB507 = new THREE.Group();
    const asteroidMeshB507 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB507,asteroidGroupB507,-164,0,-151,.63);

    const asteroidGroupB508 = new THREE.Group();
    const asteroidMeshB508 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB508,asteroidGroupB508,-134,0,-194.6,.3);

    const asteroidGroupB509 = new THREE.Group();
    const asteroidMeshB509 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB509,asteroidGroupB509,-155,0,-171,.45);

    const asteroidGroupB510 = new THREE.Group();
    const asteroidMeshB510 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB510,asteroidGroupB510,-132.3,0,-189,.43);

    const asteroidGroupB511 = new THREE.Group();
    const asteroidMeshB511 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB511,asteroidGroupB511,-152.7,0,-169.7,.13);

    const asteroidGroupB512 = new THREE.Group();
    const asteroidMeshB512 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB512,asteroidGroupB512,-132.7,0,-186,.3);

    const asteroidGroupB513 = new THREE.Group();
    const asteroidMeshB513 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB513,asteroidGroupB513,-154,0,-168,.3);

    const asteroidGroupB514 = new THREE.Group();
    const asteroidMeshB514 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB514,asteroidGroupB514,-138.7,0,-188,.3);

                        

                                        //BOTTOM/RIGHT ---> 4TH FILLER  -  BOTTOM/RIGHT/RIGHT
    const asteroidGroupB515 = new THREE.Group();
    const asteroidMeshB515 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB515,asteroidGroupB515,-76,0,-245,1);

    const asteroidGroupB516 = new THREE.Group();
    const asteroidMeshB516 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB516,asteroidGroupB516,-79,.31,-218,.37);

    const asteroidGroupB517 = new THREE.Group();
    const asteroidMeshB517 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB517,asteroidGroupB517,-70,-1,-215,.4);

    const asteroidGroupB518 = new THREE.Group();
    const asteroidMeshB518 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB518,asteroidGroupB518,-110.8,0,-207,.13);

    const asteroidGroupB519 = new THREE.Group();
    const asteroidMeshB519 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB519,asteroidGroupB519,-92,0,-245,.3);

    const asteroidGroupB520 = new THREE.Group();
    const asteroidMeshB520 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB520,asteroidGroupB520,-86,0,-242,.23);

    const asteroidGroupB521 = new THREE.Group();
    const asteroidMeshB521 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB521,asteroidGroupB521,-65.5,0,-241,.3);

    const asteroidGroupB522 = new THREE.Group();
    const asteroidMeshB522 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB522,asteroidGroupB522,-93,.3,-221,.11);

    const asteroidGroupB523 = new THREE.Group();
    const asteroidMeshB523 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB523,asteroidGroupB523,-55.27,0,-243,.3);

    const asteroidGroupB524 = new THREE.Group();
    const asteroidMeshB524 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB524,asteroidGroupB524,-97,0,-231,.13);

    const asteroidGroupB525 = new THREE.Group();
    const asteroidMeshB525 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB525,asteroidGroupB525,-96,0,-212.6,.3);

    const asteroidGroupB526 = new THREE.Group();
    const asteroidMeshB526 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB526,asteroidGroupB526,-67,0,-232,.3);

    const asteroidGroupB527 = new THREE.Group();
    const asteroidMeshB527 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB527,asteroidGroupB527,-94,0,-191,.63);

    const asteroidGroupB528 = new THREE.Group();
    const asteroidMeshB528 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB528,asteroidGroupB528,-64,0,-230.6,.3);

    const asteroidGroupB529 = new THREE.Group();
    const asteroidMeshB529 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB529,asteroidGroupB529,-85,0,-211,.45);

    const asteroidGroupB530 = new THREE.Group();
    const asteroidMeshB530 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB530,asteroidGroupB530,-62.3,0,-229,.43);

    const asteroidGroupB531 = new THREE.Group();
    const asteroidMeshB531 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB531,asteroidGroupB531,-82.7,0,-209.7,.13);

    const asteroidGroupB532 = new THREE.Group();
    const asteroidMeshB532 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB532,asteroidGroupB532,-62.7,0,-226,.3);

    const asteroidGroupB533 = new THREE.Group();
    const asteroidMeshB533 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB533,asteroidGroupB533,-84,0,-208,.3);

    const asteroidGroupB534 = new THREE.Group();
    const asteroidMeshB534 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB534,asteroidGroupB534,-68.7,0,-228,.3);

    const asteroidGroupB535 = new THREE.Group();
    const asteroidMeshB535 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB535,asteroidGroupB535,-89.6,0,-202.6,.3);

    const asteroidGroupB536 = new THREE.Group();
    const asteroidMeshB536 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB536,asteroidGroupB536,-71.6,0,-223,.3);

    const asteroidGroupB537 = new THREE.Group();
    const asteroidMeshB537 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB537,asteroidGroupB537,-102.6,0,-205.36,.53);

    const asteroidGroupB538 = new THREE.Group();
    const asteroidMeshB538 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB538,asteroidGroupB538,-98,0,-203.7,.63);

    const asteroidGroupB539 = new THREE.Group();
    const asteroidMeshB539 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB539,asteroidGroupB539,-87.6,0,-200.6,.3);

    const asteroidGroupB540 = new THREE.Group();
    const asteroidMeshB540 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB540,asteroidGroupB540,-71,.51,-210,.51);

    const asteroidGroupB541 = new THREE.Group();
    const asteroidMeshB541 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB541,asteroidGroupB541,-71,.51,-210,.51);

    const asteroidGroupB542 = new THREE.Group();
    const asteroidMeshB542 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB542,asteroidGroupB542,-82,-.51,-235,.41);  

    const asteroidGroupB543 = new THREE.Group();
    const asteroidMeshB543 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB543,asteroidGroupB543,-53,.51,-211,.4);

    const asteroidGroupB544 = new THREE.Group();
    const asteroidMeshB544 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB544,asteroidGroupB544,-104,.71,-226,.47);

    const asteroidGroupB545 = new THREE.Group();
    const asteroidMeshB545 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB545,asteroidGroupB545,-55,-.71,-208,.27);

    const asteroidGroupB546 = new THREE.Group();
    const asteroidMeshB546 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB546,asteroidGroupB546,-91.7,0,-185,.3);

    const asteroidGroupB547 = new THREE.Group();
    const asteroidMeshB547 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB547,asteroidGroupB547,-53,0,-254,.61);

    const asteroidGroupB548 = new THREE.Group();
    const asteroidMeshB548 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB548,asteroidGroupB548,-88,0,-222,.3);

    const asteroidGroupB549 = new THREE.Group();
    const asteroidMeshB549 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB549,asteroidGroupB549,-59,0,-196,.7);

    const asteroidGroupB550 = new THREE.Group();
    const asteroidMeshB550 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB550,asteroidGroupB550,-51,.31,-239,.27);

    const asteroidGroupB551 = new THREE.Group();
    const asteroidMeshB551 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB551,asteroidGroupB551,-102,0,-190,.75);

    const asteroidGroupB552 = new THREE.Group();
    const asteroidMeshB552 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB552,asteroidGroupB552,-82,-.31,-225,.38);  

    const asteroidGroupB553 = new THREE.Group();
    const asteroidMeshB553 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB553,asteroidGroupB553,-105,.31,-198,.37);

    const asteroidGroupB554 = new THREE.Group();
    const asteroidMeshB554 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB554,asteroidGroupB554,-71,.21,-233,.27);

    const asteroidGroupB555 = new THREE.Group();
    const asteroidMeshB555 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB555,asteroidGroupB555,-84,0,-195,.7);

    const asteroidGroupB556 = new THREE.Group();
    const asteroidMeshB556 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB556,asteroidGroupB556,-120,0,-195,.82);

    const asteroidGroupB557 = new THREE.Group();
    const asteroidMeshB557 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB557,asteroidGroupB557,-107,.21,-205,.5);

    const asteroidGroupB558 = new THREE.Group();
    const asteroidMeshB558 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB558,asteroidGroupB558,-88.8,-.41,-228,.27);

    const asteroidGroupB559 = new THREE.Group();
    const asteroidMeshB559 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB559,asteroidGroupB559,-95,0,-208,.7);

    const asteroidGroupB560 = new THREE.Group();
    const asteroidMeshB560 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB560,asteroidGroupB560,-106,.31,-238,.67);

    const asteroidGroupB561 = new THREE.Group();
    const asteroidMeshB561 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB561,asteroidGroupB561,-112,0,-190,.73);

    const asteroidGroupB562 = new THREE.Group();
    const asteroidMeshB562 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB562,asteroidGroupB562,-75,-.31,-212,.37);  

    const asteroidGroupB563 = new THREE.Group();
    const asteroidMeshB563 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB563,asteroidGroupB563,-111,.31,-215,.47);

    const asteroidGroupB564 = new THREE.Group();
    const asteroidMeshB564 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB564,asteroidGroupB564,-62,-.31,-231,.27);

    const asteroidGroupB565 = new THREE.Group();
    const asteroidMeshB565 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB565,asteroidGroupB565,-75,.31,-215,.37);

    const asteroidGroupB566 = new THREE.Group();
    const asteroidMeshB566 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB566,asteroidGroupB566,-92,0,-197,.71);

    const asteroidGroupB567 = new THREE.Group();
    const asteroidMeshB567 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB567,asteroidGroupB567,-151,0,-205,.65);

    const asteroidGroupB568 = new THREE.Group();
    const asteroidMeshB568 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB568,asteroidGroupB568,-58,-.31,-235,.27);

    const asteroidGroupB569 = new THREE.Group();
    const asteroidMeshB569 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB569,asteroidGroupB569,-79,.41,-198,.37);

    const asteroidGroupB570 = new THREE.Group();
    const asteroidMeshB570 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB570,asteroidGroupB570,-72,-.41,-217,.27);

    const asteroidGroupB571 = new THREE.Group();
    const asteroidMeshB571 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB571,asteroidGroupB571,-102,0,-182,.52);

    const asteroidGroupB572 = new THREE.Group();
    const asteroidMeshB572 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB572,asteroidGroupB572,-88,.2,-230,.75);  

    const asteroidGroupB573 = new THREE.Group();
    const asteroidMeshB573 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB573,asteroidGroupB573,-104,-.21,-188,.47);

    const asteroidGroupB574 = new THREE.Group();
    const asteroidMeshB574 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB574,asteroidGroupB574,-78,.37,-192,.27);

    const asteroidGroupB575 = new THREE.Group();
    const asteroidMeshB575 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB575,asteroidGroupB575,-95,-.31,-181,.37);

    const asteroidGroupB576 = new THREE.Group();
    const asteroidMeshB576 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB576,asteroidGroupB576,-114,0,-210,.43);

    const asteroidGroupB577 = new THREE.Group();
    const asteroidMeshB577 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB577,asteroidGroupB577,-93,-.7,-185,.27);

    const asteroidGroupB578 = new THREE.Group();
    const asteroidMeshB578 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB578,asteroidGroupB578,-70,0,-203,.47);

    const asteroidGroupB579 = new THREE.Group();
    const asteroidMeshB579 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB579,asteroidGroupB579,-120,.5,-181.8,.27);

    const asteroidGroupB580 = new THREE.Group();
    const asteroidMeshB580 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB580,asteroidGroupB580,-65,-.6,-206,.37);

    const asteroidGroupB581 = new THREE.Group();
    const asteroidMeshB581 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB581,asteroidGroupB581,-89,.6,-220,.42);

    const asteroidGroupB582 = new THREE.Group();
    const asteroidMeshB582 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB582,asteroidGroupB582,-62,0,-203,.5);  

    const asteroidGroupB583 = new THREE.Group();
    const asteroidMeshB583 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB583,asteroidGroupB583,-82,.6,-218,.17);

    const asteroidGroupB584 = new THREE.Group();
    const asteroidMeshB584 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB584,asteroidGroupB584,-9,.6,-206,.27);

    const asteroidGroupB585 = new THREE.Group();
    const asteroidMeshB585 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB585,asteroidGroupB585,-75,.6,-223,.17);

    const asteroidGroupB586 = new THREE.Group();
    const asteroidMeshB586 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB586,asteroidGroupB586,-133,0,-210,.67);

    const asteroidGroupB587 = new THREE.Group();
    const asteroidMeshB587 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB587,asteroidGroupB587,-70,.6,-225,.5);

    const asteroidGroupB588 = new THREE.Group();
    const asteroidMeshB588 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB588,asteroidGroupB588,-78,-.6,-203,.47);

    const asteroidGroupB589 = new THREE.Group();
    const asteroidMeshB589 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB589,asteroidGroupB589,-59,.6,-218,.27);

    const asteroidGroupB590 = new THREE.Group();
    const asteroidMeshB590 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB590,asteroidGroupB590,-100,.3,-191,.27);

    const asteroidGroupB591 = new THREE.Group();
    const asteroidMeshB591 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB591,asteroidGroupB591,-120,.31,-218,.7);

    const asteroidGroupB592 = new THREE.Group();
    const asteroidMeshB592 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB592,asteroidGroupB592,-95,.42,-188,.41);  

    const asteroidGroupB593 = new THREE.Group();
    const asteroidMeshB593 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB593,asteroidGroupB593,-68,.37,-208,.27);

    const asteroidGroupB594 = new THREE.Group();
    const asteroidMeshB594 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB594,asteroidGroupB594,-90,-.4,-188,.47);

    const asteroidGroupB595 = new THREE.Group();
    const asteroidMeshB595 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB595,asteroidGroupB595,-86,.5,-209,.37);

    const asteroidGroupB596 = new THREE.Group();
    const asteroidMeshB596 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB596,asteroidGroupB596,-90,-.6,-194,.4);

    const asteroidGroupB597 = new THREE.Group();
    const asteroidMeshB597 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB597,asteroidGroupB597,-109.2,0,-200,.3);

    const asteroidGroupB598 = new THREE.Group();
    const asteroidMeshB598 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB598,asteroidGroupB598,-104,0,-192,.37);

    const asteroidGroupB599 = new THREE.Group();
    const asteroidMeshB599 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB599,asteroidGroupB599,-68,.49,-212,.37);

    const asteroidGroupB600 = new THREE.Group();
    const asteroidMeshB600 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB600,asteroidGroupB600,-88,.4,-196,.47);

    const asteroidGroupB601 = new THREE.Group();
    const asteroidMeshB601 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB601,asteroidGroupB601,-66,.4,-217,.37);

    const asteroidGroupB602 = new THREE.Group();
    const asteroidMeshB602 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB602,asteroidGroupB602,-98,.32,-194,.38);  

    const asteroidGroupB603 = new THREE.Group();
    const asteroidMeshB603 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB603,asteroidGroupB603,-78,.38,-209,.27);

    const asteroidGroupB604 = new THREE.Group();
    const asteroidMeshB604 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB604,asteroidGroupB604,-84.5,0,-190,.53);

    const asteroidGroupB605 = new THREE.Group();
    const asteroidMeshB605 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB605,asteroidGroupB605,-58,0,-235,.37);

    const asteroidGroupB606 = new THREE.Group();
    const asteroidMeshB606 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB606,asteroidGroupB606,-74,0,-200,.32);

    const asteroidGroupB607 = new THREE.Group();
    const asteroidMeshB607 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB607,asteroidGroupB607,-78,0,-225,.35);

    const asteroidGroupB608 = new THREE.Group();
    const asteroidMeshB608 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB608,asteroidGroupB608,-82,0,-215,.3);

    const asteroidGroupB609 = new THREE.Group();
    const asteroidMeshB609 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB609,asteroidGroupB609,-76,0,-221,.3);

    const asteroidGroupB610 = new THREE.Group();
    const asteroidMeshB610 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB610,asteroidGroupB610,-97,0,-216,.3);

    const asteroidGroupB611 = new THREE.Group();
    const asteroidMeshB611 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB611,asteroidGroupB611,-68,0,-220,.25);

    const asteroidGroupB612 = new THREE.Group();
    const asteroidMeshB612 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB612,asteroidGroupB612,-99,0,-210,.3);

    const asteroidGroupB613 = new THREE.Group();
    const asteroidMeshB613 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB613,asteroidGroupB613,-68,0,-218,.37);

    const asteroidGroupB614 = new THREE.Group();
    const asteroidMeshB614 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB614,asteroidGroupB614,-92,0,-206,.37);

    const asteroidGroupB615 = new THREE.Group();
    const asteroidMeshB615 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB615,asteroidGroupB615,-58,0,-235,.5);

    const asteroidGroupB616 = new THREE.Group();
    const asteroidMeshB616 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB616,asteroidGroupB616,-83,.2,-202,.32);

    const asteroidGroupB617 = new THREE.Group();
    const asteroidMeshB617 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB617,asteroidGroupB617,-68,.2,-250,.65);

    const asteroidGroupB618 = new THREE.Group();
    const asteroidMeshB618 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB618,asteroidGroupB618,-118,.2,-223,.37);

    const asteroidGroupB619 = new THREE.Group();
    const asteroidMeshB619 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB619,asteroidGroupB619,-58,.2,-222,.27);

    const asteroidGroupB620 = new THREE.Group();
    const asteroidMeshB620 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB620,asteroidGroupB620,-106,0,-208,.3);

    const asteroidGroupB621 = new THREE.Group();
    const asteroidMeshB621 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB621,asteroidGroupB621,-71,0,-238,.3);       

    const asteroidGroupB622 = new THREE.Group();
    const asteroidMeshB622 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB622,asteroidGroupB622,-79,.51,-239,.39);  

    const asteroidGroupB623 = new THREE.Group();
    const asteroidMeshB623 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB623,asteroidGroupB623,-97,-.6,-218,.27);

    const asteroidGroupB624 = new THREE.Group();
    const asteroidMeshB624 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB624,asteroidGroupB624,-73,.61,-212,.2);

    const asteroidGroupB625 = new THREE.Group();
    const asteroidMeshB625 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB625,asteroidGroupB625,-95,1,-230.5,.17);

    const asteroidGroupB626 = new THREE.Group();
    const asteroidMeshB626 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB626,asteroidGroupB626,-90,0,-214.5,.3);

    const asteroidGroupB627 = new THREE.Group();
    const asteroidMeshB627 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshB627,asteroidGroupB627,-87,-.6,-225,.5);



                                //POSITIVE - NEGATIVE [+X,-Z]


    const asteroidInnerGroupC1 = new THREE.Group();
    const asteroidInnerMeshC1 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC1,asteroidInnerGroupC1,145,0,-130,.25);

    const asteroidInnerGroupC2 = new THREE.Group();
    const asteroidInnerMeshC2 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC2,asteroidInnerGroupC2,142,0,-140,.37);

    const asteroidInnerGroupC3 = new THREE.Group();
    const asteroidInnerMeshC3 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC3,asteroidInnerGroupC3,171,.51,-73,.4);

    const asteroidInnerGroupC4 = new THREE.Group();
    const asteroidInnerMeshC4 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC4,asteroidInnerGroupC4,44,0,-160,.28);

    const asteroidInnerGroupC5 = new THREE.Group();
    const asteroidInnerMeshC5 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC5,asteroidInnerGroupC5,168,-.71,-75,.27);

    const asteroidInnerGroupC6 = new THREE.Group();
    const asteroidInnerMeshC6 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC6,asteroidInnerGroupC6,118,.2,-155,.32);

    const asteroidInnerGroupC7 = new THREE.Group();
    const asteroidInnerMeshC7 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC7,asteroidInnerGroupC7,165,0,-77,.61);
        
    const asteroidInnerGroupC8 = new THREE.Group();
    const asteroidInnerMeshC8 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC8,asteroidInnerGroupC8,103,.2,-165,.27);

    const asteroidInnerGroupC9 = new THREE.Group();
    const asteroidInnerMeshC9 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC9,asteroidInnerGroupC9,98,.2,-170,.27);

    const asteroidInnerGroupC10 = new THREE.Group();
    const asteroidInnerMeshC10 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC10,asteroidInnerGroupC10,90,0,-175,.3);

    const asteroidInnerGroupC11 = new THREE.Group();
    const asteroidInnerMeshC11 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC11,asteroidInnerGroupC11,78,0,-164,.72);

    const asteroidInnerGroupC12 = new THREE.Group();
    const asteroidInnerMeshC12 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC12,asteroidInnerGroupC12,78,0,-180,1);

    const asteroidInnerGroupC13 = new THREE.Group();
    const asteroidInnerMeshC13 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC13,asteroidInnerGroupC13,108,.31,-125,.64);

    const asteroidInnerGroupC14 = new THREE.Group();
    const asteroidInnerMeshC14 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC14,asteroidInnerGroupC14,132,0,-100,.75);

    const asteroidInnerGroupC15 = new THREE.Group();
    const asteroidInnerMeshC15 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC15,asteroidInnerGroupC15,155,0,-104,.7);

    const asteroidInnerGroupC16 = new THREE.Group();
    const asteroidInnerMeshC16 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC16,asteroidInnerGroupC16,105,0,-167,.43);

    const asteroidInnerGroupC17 = new THREE.Group();
    const asteroidInnerMeshC17 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC17,asteroidInnerGroupC17,154,0,-79,.7);

    const asteroidInnerGroupC18 = new THREE.Group();
    const asteroidInnerMeshC18 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC18,asteroidInnerGroupC18,175,.31,-95,.37);

    const asteroidInnerGroupC19 = new THREE.Group();
    const asteroidInnerMeshC19 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC19,asteroidInnerGroupC19,95,0,-154,.9);

    const asteroidInnerGroupC20 = new THREE.Group();
    const asteroidInnerMeshC20 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC20,asteroidInnerGroupC20,124,0,-118,.8);

    const asteroidInnerGroupC21 = new THREE.Group();
    const asteroidInnerMeshC21 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC21,asteroidInnerGroupC21,150,0,-132,.73);

    const asteroidInnerGroupC22 = new THREE.Group();
    const asteroidInnerMeshC22 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC22,asteroidInnerGroupC22,70,0,-175,.33);

    const asteroidInnerGroupC23 = new THREE.Group();
    const asteroidInnerMeshC23 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC23,asteroidInnerGroupC23,164,.31,-17,.7);

    const asteroidInnerGroupC24 = new THREE.Group();
    const asteroidInnerMeshC24 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC24,asteroidInnerGroupC24,172,-.31,-95,.37);

    const asteroidInnerGroupC25 = new THREE.Group();
    const asteroidInnerMeshC25 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC25,asteroidInnerGroupC25,110.6,0,-140,.3);

    const asteroidInnerGroupC26 = new THREE.Group();
    const asteroidInnerMeshC26 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC26,asteroidInnerGroupC26,157,0,-112,.71);

    const asteroidInnerGroupC27 = new THREE.Group();
    const asteroidInnerMeshC27 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC27,asteroidInnerGroupC27,165,0,-105,.5);

    const asteroidInnerGroupC28 = new THREE.Group();
    const asteroidInnerMeshC28 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC28,asteroidInnerGroupC28,125,0,-148,.43);

    const asteroidInnerGroupC29 = new THREE.Group();
    const asteroidInnerMeshC29 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC29,asteroidInnerGroupC29,162,.2,-103,.32);        

    const asteroidInnerGroupC30 = new THREE.Group();
    const asteroidInnerMeshC30 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC30,asteroidInnerGroupC30,177,-.41,-92,.37);

    const asteroidInnerGroupC31 = new THREE.Group();
    const asteroidInnerMeshC31 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC31,asteroidInnerGroupC31,142,0,-122,.52);

    const asteroidInnerGroupC32 = new THREE.Group();
    const asteroidInnerMeshC32 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC32,asteroidInnerGroupC32,165,.2,-108,.5);

    const asteroidInnerGroupC33 = new THREE.Group();
    const asteroidInnerMeshC33 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC33,asteroidInnerGroupC33,146,-.21,-125,.7);

    const asteroidInnerGroupC34 = new THREE.Group();
    const asteroidInnerMeshC34 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC34,asteroidInnerGroupC34,152,.37,-98,.45);

    const asteroidInnerGroupC35 = new THREE.Group();
    const asteroidInnerMeshC35 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC35,asteroidInnerGroupC35,141,-.31,-115,.37);

    const asteroidInnerGroupC36 = new THREE.Group();
    const asteroidInnerMeshC36 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC36,asteroidInnerGroupC36,70.6,0,-158.6,.73);////reference71

    const asteroidInnerGroupC37 = new THREE.Group();
    const asteroidInnerMeshC37 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC37,asteroidInnerGroupC37,130.7,0,-142,.63);

    const asteroidInnerGroupC38 = new THREE.Group();
    const asteroidInnerMeshC38 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC38,asteroidInnerGroupC38,84,0,-165.7,.73);

    const asteroidInnerGroupC39 = new THREE.Group();
    const asteroidInnerMeshC39 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC39,asteroidInnerGroupC39,64,0,-170,.5);

    const asteroidInnerGroupC40 = new THREE.Group();
    const asteroidInnerMeshC40 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC40,asteroidInnerGroupC40,145,-.7,-48,.5);
        
    const asteroidInnerGroupC41 = new THREE.Group();
    const asteroidInnerMeshC41 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC41,asteroidInnerGroupC41,163,0,-90,.47);

    const asteroidInnerGroupC42 = new THREE.Group();
    const asteroidInnerMeshC42 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC42,asteroidInnerGroupC42,110,.4,-150,.6);

    const asteroidInnerGroupC43 = new THREE.Group();
    const asteroidInnerMeshC43 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC43,asteroidInnerGroupC43,172,.61,-93,.2);

    const asteroidInnerGroupC44 = new THREE.Group();
    const asteroidInnerMeshC44 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC44,asteroidInnerGroupC44,113,.32,-162,.7);

    const asteroidInnerGroupC45 = new THREE.Group();
    const asteroidInnerMeshC45 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC45,asteroidInnerGroupC45,88,0,-168,.9);

    const asteroidInnerGroupC46 = new THREE.Group();
    const asteroidInnerMeshC46 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC46,asteroidInnerGroupC46,165,.51,-99,.19);

    const asteroidInnerGroupC47 = new THREE.Group();
    const asteroidInnerMeshC47 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC47,asteroidInnerGroupC47,166,-.6,-85,.37);

    const asteroidInnerGroupC48 = new THREE.Group();
    const asteroidInnerMeshC48 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC48,asteroidInnerGroupC48,168,-.51,-96,.27);
        
    const asteroidInnerGroupC49 = new THREE.Group();
    const asteroidInnerMeshC49 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC49,asteroidInnerGroupC49,88,0,-150,.57);

    const asteroidInnerGroupC50 = new THREE.Group();
    const asteroidInnerMeshC50 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC50,asteroidInnerGroupC50,68,0,-155,.63);

    const asteroidInnerGroupC51 = new THREE.Group();
    const asteroidInnerMeshC51 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC51,asteroidInnerGroupC51,100,0,-140,.63);

    const asteroidInnerGroupC52 = new THREE.Group();
    const asteroidInnerMeshC52 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC52,asteroidInnerGroupC52,163,0,-82,.5);

    const asteroidInnerGroupC53 = new THREE.Group();
    const asteroidInnerMeshC53 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC53,asteroidInnerGroupC53,168,.6,-102,.17);

    const asteroidInnerGroupC54 = new THREE.Group();
    const asteroidInnerMeshC54 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC54,asteroidInnerGroupC54,166,.6,-74,.27);

    const asteroidInnerGroupC55 = new THREE.Group();
    const asteroidInnerMeshC55 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC55,asteroidInnerGroupC55,151,0,-114,.63);

    const asteroidInnerGroupC56 = new THREE.Group();
    const asteroidInnerMeshC56 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC56,asteroidInnerGroupC56,177,0,-29,1);

    const asteroidInnerGroupC57 = new THREE.Group();
    const asteroidInnerMeshC57 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC57,asteroidInnerGroupC57,31,-.7,-177,.5);
        
    const asteroidInnerGroupC58 = new THREE.Group();
    const asteroidInnerMeshC58 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC58,asteroidInnerGroupC58,163,-.6,-98,.47);

    const asteroidInnerGroupC59 = new THREE.Group();
    const asteroidInnerMeshC59 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC59,asteroidInnerGroupC59,178,.6,-79,.7);

    const asteroidInnerGroupC60 = new THREE.Group();
    const asteroidInnerMeshC60 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC60,asteroidInnerGroupC60,149,.3,-120,.7);

    const asteroidInnerGroupC61 = new THREE.Group();
    const asteroidInnerMeshC61 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC61,asteroidInnerGroupC61,166,.31,-100,.38);

    const asteroidInnerGroupC62 = new THREE.Group();
    const asteroidInnerMeshC62 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC62,asteroidInnerGroupC62,145,0,-111.7,.3);

    const asteroidInnerGroupC63 = new THREE.Group();
    const asteroidInnerMeshC63 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC63,asteroidInnerGroupC63,168,.37,-88,.27);

    const asteroidInnerGroupC64 = new THREE.Group();
    const asteroidInnerMeshC64 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC64,asteroidInnerGroupC64,150,0,-104.5,.53);

    const asteroidInnerGroupC65 = new THREE.Group();
    const asteroidInnerMeshC65 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC65,asteroidInnerGroupC65,169,.5,-106,.37);

    const asteroidInnerGroupC66 = new THREE.Group();
    const asteroidInnerMeshC66 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC66,asteroidInnerGroupC66,157,-.6,-56,.8);

    const asteroidInnerGroupC67 = new THREE.Group();
    const asteroidInnerMeshC67 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC67,asteroidInnerGroupC67,144,0,-95,.28);
        
    const asteroidInnerGroupC68 = new THREE.Group();
    const asteroidInnerMeshC68 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC68,asteroidInnerGroupC68,152,0,-124,.37);

    const asteroidInnerGroupC69 = new THREE.Group();
    const asteroidInnerMeshC69 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC69,asteroidInnerGroupC69,172,.49,-88,.37);

    const asteroidInnerGroupC70 = new THREE.Group();
    const asteroidInnerMeshC70 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC70,asteroidInnerGroupC70,56,.4,-178,.7);

    const asteroidInnerGroupC71 = new THREE.Group();
    const asteroidInnerMeshC71 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC71,asteroidInnerGroupC71,177,.4,-86,.37);

    const asteroidInnerGroupC72 = new THREE.Group();
    const asteroidInnerMeshC72 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC72,asteroidInnerGroupC72,154,.32,-118,.38);

    const asteroidInnerGroupC73 = new THREE.Group();
    const asteroidInnerMeshC73 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC73,asteroidInnerGroupC73,169,.38,-98,.27);

    const asteroidInnerGroupC74 = new THREE.Group();
    const asteroidInnerMeshC74 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC74,asteroidInnerGroupC74,168,0,-104,.3);

    const asteroidInnerGroupC75 = new THREE.Group();
    const asteroidInnerMeshC75 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC75,asteroidInnerGroupC75,91,0,-165,.45);

    const asteroidInnerGroupC76 = new THREE.Group();
    const asteroidInnerMeshC76 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC76,asteroidInnerGroupC76,160,0,-94,.32);

    const asteroidInnerGroupC77 = new THREE.Group();
    const asteroidInnerMeshC77 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC77,asteroidInnerGroupC77,185,.6,-31,.616);

    const asteroidInnerGroupC78 = new THREE.Group();
    const asteroidInnerMeshC78 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC78,asteroidInnerGroupC78,176,.51,-44,.819);
        
    const asteroidInnerGroupC79 = new THREE.Group();
    const asteroidInnerMeshC79 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC79,asteroidInnerGroupC79,170,-.6,-62,.647);

    const asteroidInnerGroupC80 = new THREE.Group();
    const asteroidInnerMeshC80 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC80,asteroidInnerGroupC80,180,.37,-68,.6);

    const asteroidInnerGroupC81 = new THREE.Group();
    const asteroidInnerMeshC81 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC81,asteroidInnerGroupC81,156,0,-88,1);

    const asteroidInnerGroupC82 = new THREE.Group();
    const asteroidInnerMeshC82 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC82,asteroidInnerGroupC82,165,0,-94,.35);

    const asteroidInnerGroupC83 = new THREE.Group();
    const asteroidInnerMeshC83 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC83,asteroidInnerGroupC83,178,0,-88,1);

    const asteroidInnerGroupC84 = new THREE.Group();
    const asteroidInnerMeshC84 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC84,asteroidInnerGroupC84,166,0,-112,.37);

    const asteroidInnerGroupC85 = new THREE.Group();
    const asteroidInnerMeshC85 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC85,asteroidInnerGroupC85,40,.21,-172,.5);

    const asteroidInnerGroupC86 = new THREE.Group();
    const asteroidInnerMeshC86 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC86,asteroidInnerGroupC86,116,0,-142.7,.73);

    const asteroidInnerGroupC87 = new THREE.Group();
    const asteroidInnerMeshC87 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC87,asteroidInnerGroupC87,80,0,-174.5,.3);

    const asteroidInnerGroupC88 = new THREE.Group();
    const asteroidInnerMeshC88 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC88,asteroidInnerGroupC88,71,0,-170.5,.3);

    const asteroidInnerGroupC89 = new THREE.Group();
    const asteroidInnerMeshC89 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC89,asteroidInnerGroupC89,62,0,-185.56,.3);

    const asteroidInnerGroupC90 = new THREE.Group();
    const asteroidInnerMeshC90 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC90,asteroidInnerGroupC90,62,0,-190,.73);

    const asteroidInnerGroupC91 = new THREE.Group();
    const asteroidInnerMeshC91 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC91,asteroidInnerGroupC91,54,0,-192,.37);

    const asteroidInnerGroupC92 = new THREE.Group();
    const asteroidInnerMeshC92 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC92,asteroidInnerGroupC92,54,-.21,-188,.47);

    const asteroidInnerGroupC93 = new THREE.Group();
    const asteroidInnerMeshC93 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC93,asteroidInnerGroupC93,52,0,-182,.52);

    const asteroidInnerGroupC94 = new THREE.Group();
    const asteroidInnerMeshC94 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC94,asteroidInnerGroupC94,52,0,-190,.75);

    const asteroidInnerGroupC95 = new THREE.Group();
    const asteroidInnerMeshC95 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC95,asteroidInnerGroupC95,50,.3,-191,.27);

    const asteroidInnerGroupC96 = new THREE.Group();
    const asteroidInnerMeshC96 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC96,asteroidInnerGroupC96,50,.5,-181.8,.27);

    const asteroidInnerGroupC97 = new THREE.Group();
    const asteroidInnerMeshC97 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC97,asteroidInnerGroupC97,48,.32,-194,.38);  

    const asteroidInnerGroupC98 = new THREE.Group();
    const asteroidInnerMeshC98 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC98,asteroidInnerGroupC98,45,.42,-188,.41);

    const asteroidInnerGroupC99 = new THREE.Group();
    const asteroidInnerMeshC99 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC99,asteroidInnerGroupC99,45,-.31,-181,.37);

    const asteroidInnerGroupC100 = new THREE.Group();
    const asteroidInnerMeshC100 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC100,asteroidInnerGroupC100,44,0,-191,.63);

    const asteroidInnerGroupC101 = new THREE.Group();
    const asteroidInnerMeshC101 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC101,asteroidInnerGroupC101,40,-.4,-188,.47);

    const asteroidInnerGroupC102 = new THREE.Group();
    const asteroidInnerMeshC102 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC102,asteroidInnerGroupC102,38,.4,-196,.47);

    const asteroidInnerGroupC103 = new THREE.Group();
    const asteroidInnerMeshC103 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC103,asteroidInnerGroupC103,38,0,-180.27,.3);

    const asteroidInnerGroupC104 = new THREE.Group();
    const asteroidInnerMeshC104 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC104,asteroidInnerGroupC104,34,0,-195,.7);

    const asteroidInnerGroupC105 = new THREE.Group();
    const asteroidInnerMeshC105 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC105,asteroidInnerGroupC105,33,.31,-195,.17);

    const asteroidInnerGroupC106 = new THREE.Group();
    const asteroidInnerMeshC106 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC106,asteroidInnerGroupC106,29,.41,-198,.37);

    const asteroidInnerGroupC107 = new THREE.Group();
    const asteroidInnerMeshC107 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC107,asteroidInnerGroupC107,27,0,-189,.7);

    const asteroidInnerGroupC108 = new THREE.Group();
    const asteroidInnerMeshC108 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC108,asteroidInnerGroupC108,25,0,-184,.28);

    const asteroidInnerGroupC109 = new THREE.Group();
    const asteroidInnerMeshC109 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC109,asteroidInnerGroupC109,18,.51,-188,.51);

    const asteroidInnerGroupC110 = new THREE.Group();
    const asteroidInnerMeshC110 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC110,asteroidInnerGroupC110,17,-.31,-196,.45);

    const asteroidInnerGroupC111 = new THREE.Group();
    const asteroidInnerMeshC111 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC111,asteroidInnerGroupC111,9,0,-194,.7);

    const asteroidInnerGroupC112 = new THREE.Group();
    const asteroidInnerMeshC112 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC112,asteroidInnerGroupC112,6,0,-185,.83);

    const asteroidInnerGroupC113 = new THREE.Group();
    const asteroidInnerMeshC113 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC113,asteroidInnerGroupC113,100,0,-165.8,.13);

    const asteroidInnerGroupC114 = new THREE.Group();
    const asteroidInnerMeshC114 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC114,asteroidInnerGroupC114,102,0,-156.5,.53);

    const asteroidInnerGroupC115 = new THREE.Group();
    const asteroidInnerMeshC115 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC115,asteroidInnerGroupC115,105,.32,-146,.7);

    const asteroidInnerGroupC116 = new THREE.Group();
    const asteroidInnerMeshC116 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC116,asteroidInnerGroupC116,105,0,-170.3,.43);

    const asteroidInnerGroupC117 = new THREE.Group();
    const asteroidInnerMeshC117 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC117,asteroidInnerGroupC117,110,.4,-138,.47);

    const asteroidInnerGroupC118 = new THREE.Group();
    const asteroidInnerMeshC118 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC118,asteroidInnerGroupC118,146,0,-106.,.27);

    const asteroidInnerGroupC119 = new THREE.Group();
    const asteroidInnerMeshC119 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC119,asteroidInnerGroupC119,182,0,-52,.52);

    const asteroidInnerGroupC120 = new THREE.Group();
    const asteroidInnerMeshC120 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC120,asteroidInnerGroupC120,182,.2,-78,.27);

    const asteroidInnerGroupC121 = new THREE.Group();
    const asteroidInnerMeshC121 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC121,asteroidInnerGroupC121,181,-.31,-45,.37);

    const asteroidInnerGroupC122 = new THREE.Group();
    const asteroidInnerMeshC122 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC122,asteroidInnerGroupC122,184,0,-25,.28);

    const asteroidInnerGroupC123 = new THREE.Group();
    const asteroidInnerMeshC123 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC123,asteroidInnerGroupC123,185,-.7,-43,.27);

    const asteroidInnerGroupC124 = new THREE.Group();
    const asteroidInnerMeshC124 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC124,asteroidInnerGroupC124,185,0,-41.7,.3);

    const asteroidInnerGroupC125 = new THREE.Group();
    const asteroidInnerMeshC125 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC125,asteroidInnerGroupC125,186,0,-36.5,.27);

    const asteroidInnerGroupC126 = new THREE.Group();
    const asteroidInnerMeshC126 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC126,asteroidInnerGroupC126,188,-.21,-54,.47);

    const asteroidInnerGroupC127 = new THREE.Group();
    const asteroidInnerMeshC127 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC127,asteroidInnerGroupC127,188,.42,-45,.41);

    const asteroidInnerGroupC128 = new THREE.Group();
    const asteroidInnerMeshC128 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC128,asteroidInnerGroupC128,188,-.4,-40,.47);

    const asteroidInnerGroupC129 = new THREE.Group();
    const asteroidInnerMeshC129 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC129,asteroidInnerGroupC129,190,0,-52,.75);

    const asteroidInnerGroupC130 = new THREE.Group();
    const asteroidInnerMeshC130 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC130,asteroidInnerGroupC130,190,0,-62,.73);

    const asteroidInnerGroupC131 = new THREE.Group();
    const asteroidInnerMeshC131 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC131,asteroidInnerGroupC131,191,.3,-50,.27);

    const asteroidInnerGroupC132 = new THREE.Group();
    const asteroidInnerMeshC132 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC132,asteroidInnerGroupC132,191,0,-44,.63);

    const asteroidInnerGroupC133 = new THREE.Group();
    const asteroidInnerMeshC133 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC133,asteroidInnerGroupC133,192,0,-54,.37);

    const asteroidInnerGroupC134 = new THREE.Group();
    const asteroidInnerMeshC134 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC134,asteroidInnerGroupC134,194,.32,-48,.38);

    const asteroidInnerGroupC135 = new THREE.Group();
    const asteroidInnerMeshC135 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC135,asteroidInnerGroupC135,194,0,-9,.7);

    const asteroidInnerGroupC136 = new THREE.Group();
    const asteroidInnerMeshC136 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC136,asteroidInnerGroupC136,194,-.6,-40,.4);

    const asteroidInnerGroupC137 = new THREE.Group();
    const asteroidInnerMeshC137 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC137,asteroidInnerGroupC137,195,0,-34,.7);

    const asteroidInnerGroupC138 = new THREE.Group();
    const asteroidInnerMeshC138 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC138,asteroidInnerGroupC138,195,.31,-33,.17);

    const asteroidInnerGroupC139 = new THREE.Group();
    const asteroidInnerMeshC139 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC139,asteroidInnerGroupC139,196,.37,-16,.8);

    const asteroidInnerGroupC140 = new THREE.Group();
    const asteroidInnerMeshC140 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC140,asteroidInnerGroupC140,196,.4,-38,.47);

    const asteroidInnerGroupC141 = new THREE.Group();
    const asteroidInnerMeshC141 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC141,asteroidInnerGroupC141,120,0,-147.2,.3);////

    const asteroidInnerGroupC142 = new THREE.Group();
    const asteroidInnerMeshC142 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC142,asteroidInnerGroupC142,190,0,-34.5,.53);////

    const asteroidInnerGroupC143 = new THREE.Group();
    const asteroidInnerMeshC143 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC143,asteroidInnerGroupC143,34.5,0,-190,.53);

    const asteroidInnerGroupC144 = new THREE.Group();
    const asteroidInnerMeshC144 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC144,asteroidInnerGroupC144,36.5,0,-186,.27);

    const asteroidInnerGroupC145 = new THREE.Group();
    const asteroidInnerMeshC145 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC145,asteroidInnerGroupC145,56.5,0,-186,.27);

    const asteroidInnerGroupC146 = new THREE.Group();
    const asteroidInnerMeshC146 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC146,asteroidInnerGroupC146,41.7,0,-185,.3);

    const asteroidInnerGroupC147 = new THREE.Group();
    const asteroidInnerMeshC147 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC147,asteroidInnerGroupC147,115.5,0,-128,.3);

    const asteroidInnerGroupC148 = new THREE.Group();
    const asteroidInnerMeshC148 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC148,asteroidInnerGroupC148,198,.41,-29,.37);

    const asteroidInnerGroupC149 = new THREE.Group();
    const asteroidInnerMeshC149 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC149,asteroidInnerGroupC149,172,-.4,-52,.47);

    const asteroidInnerGroupC150 = new THREE.Group();
    const asteroidInnerMeshC150 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC150,asteroidInnerGroupC150,168,.3,-91,.36);///// 

    const asteroidInnerGroupC151 = new THREE.Group();
    const asteroidInnerMeshC151 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC151,asteroidInnerGroupC151,141.8,.5,-120,.27);

    const asteroidInnerGroupC152 = new THREE.Group();
    const asteroidInnerMeshC152 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC152,asteroidInnerGroupC152,181.8,.5,-50,.27);

    const asteroidInnerGroupC153 = new THREE.Group();
    const asteroidInnerMeshC153 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC153,asteroidInnerGroupC153,125.6,0,-130.6,.3);

    const asteroidInnerGroupC154 = new THREE.Group();
    const asteroidInnerMeshC154 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC154,asteroidInnerGroupC154,138,0,-135,.35);

    const asteroidInnerGroupC155 = new THREE.Group();
    const asteroidInnerMeshC155 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC155,asteroidInnerGroupC155,162.6,0,-109.6,.3);///// 

    const asteroidInnerGroupC156 = new THREE.Group();
    const asteroidInnerMeshC156 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC156,asteroidInnerGroupC156,169.7,0,-102.7,.13);///// 

    const asteroidInnerGroupC157 = new THREE.Group();
    const asteroidInnerMeshC157 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidInnerMeshC157,asteroidInnerGroupC157,100.7,0,-168.7,.13);///// 


                                //MAIN ORBIT 
                                                                            //RIGHT/BOTTOM
    const asteroidGroupC1 = new THREE.Group();
    const asteroidMeshC1 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC1,asteroidGroupC1,209.7,0,-32.7,.13);

    const asteroidGroupC2 = new THREE.Group();
    const asteroidMeshC2 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC2,asteroidGroupC2,226,0,-12.7,.3);

    const asteroidGroupC3 = new THREE.Group();
    const asteroidMeshC3 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC3,asteroidGroupC3,208,0,-34,.3);

    const asteroidGroupC4 = new THREE.Group();
    const asteroidMeshC4 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC4,asteroidGroupC4,228,0,-18.7,.3);

    const asteroidGroupC5 = new THREE.Group();
    const asteroidMeshC5 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC5,asteroidGroupC5,202.6,0,-39.6,.3);

    const asteroidGroupC6 = new THREE.Group();
    const asteroidMeshC6 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC6,asteroidGroupC6,223,0,-21.6,.3);

    const asteroidGroupC7 = new THREE.Group();
    const asteroidMeshC7 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC7,asteroidGroupC7,205.36,0,-52.6,.53);

    const asteroidGroupC8 = new THREE.Group();
    const asteroidMeshC8 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC8,asteroidGroupC8,203.7,0,-48,.63);

    const asteroidGroupC9 = new THREE.Group();
    const asteroidMeshC9 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC9,asteroidGroupC9,200.6,0,-37.6,.3);  

    const asteroidGroupC10 = new THREE.Group();
    const asteroidMeshC10 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC10,asteroidGroupC10,248,.38,-40,.67);

    const asteroidGroupC11 = new THREE.Group();
    const asteroidMeshC11 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC11,asteroidGroupC11,260,.38,-12,.7);

    const asteroidGroupC12 = new THREE.Group();
    const asteroidMeshC12 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC12,asteroidGroupC12,210,0,-49,.3);

    const asteroidGroupC13 = new THREE.Group();
    const asteroidMeshC13 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC13,asteroidGroupC13,211,0,-35,.45);

    const asteroidGroupC14 = new THREE.Group();
    const asteroidMeshC14 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC14,asteroidGroupC14,200,0,-59.2,.3);

    const asteroidGroupC15 = new THREE.Group();
    const asteroidMeshC15 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC15,asteroidGroupC15,214.5,0,-40,.3);

    const asteroidGroupC16 = new THREE.Group();
    const asteroidMeshC16 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC16,asteroidGroupC16,210,0,-64,.43);

    const asteroidGroupC17 = new THREE.Group();
    const asteroidMeshC17 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC17,asteroidGroupC17,230.6,0,-14,.3);

    const asteroidGroupC18 = new THREE.Group();
    const asteroidMeshC18 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC18,asteroidGroupC18,207,0,-60.8,.13);

    const asteroidGroupC19 = new THREE.Group();
    const asteroidMeshC19 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC19,asteroidGroupC19,243,0,-46,.3);

    const asteroidGroupC20 = new THREE.Group();
    const asteroidMeshC20 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC20,asteroidGroupC20,242,0,-36,.23);

    const asteroidGroupC21 = new THREE.Group();
    const asteroidMeshC21 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC21,asteroidGroupC21,241,0,-15.5,.3);

    const asteroidGroupC22 = new THREE.Group();
    const asteroidMeshC22 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC22,asteroidGroupC22,218,.51,-73,.51);

    const asteroidGroupC23 = new THREE.Group();
    const asteroidMeshC23 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC23,asteroidGroupC23,243,0,-5.27,.3);

    const asteroidGroupC24 = new THREE.Group();
    const asteroidMeshC24 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC24,asteroidGroupC24,231,0,-47,.13);

    const asteroidGroupC25 = new THREE.Group();
    const asteroidMeshC25 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC25,asteroidGroupC25,212.6,0,-46,.3);

    const asteroidGroupC26 = new THREE.Group();
    const asteroidMeshC26 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC26,asteroidGroupC26,232,0,-17,.3);

    const asteroidGroupC27 = new THREE.Group();
    const asteroidMeshC27 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC27,asteroidGroupC27,229,0,-12.3,.43);

    const asteroidGroupC28 = new THREE.Group();
    const asteroidMeshC28 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC28,asteroidGroupC28,222,0,-38,.3);

    const asteroidGroupC29 = new THREE.Group();
    const asteroidMeshC29 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC29,asteroidGroupC29,205,0,-7,.61);      

    const asteroidGroupC30 = new THREE.Group();
    const asteroidMeshC30 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC30,asteroidGroupC30,239,.31,-1,.27);

    const asteroidGroupC31 = new THREE.Group();
    const asteroidMeshC31 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC31,asteroidGroupC31,200,0,-44,.72);

    const asteroidGroupC32 = new THREE.Group();
    const asteroidMeshC32 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC32,asteroidGroupC32,225,-.31,-2,.5);  

    const asteroidGroupC34 = new THREE.Group();
    const asteroidMeshC34 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC34,asteroidGroupC34,233,.21,-21,.27);

    const asteroidGroupC36 = new THREE.Group();
    const asteroidMeshC36 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC36,asteroidGroupC36,208,0,-71,.82);

    const asteroidGroupC37 = new THREE.Group();
    const asteroidMeshC37 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC37,asteroidGroupC37,205,.21,-57,.5);

    const asteroidGroupC38 = new THREE.Group();
    const asteroidMeshC38 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC38,asteroidGroupC38,228,-.41,-28.8,.27);

    const asteroidGroupC39 = new THREE.Group();
    const asteroidMeshC39 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC39,asteroidGroupC39,208,0,-45,.7);

    const asteroidGroupC40 = new THREE.Group();
    const asteroidMeshC40 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC40,asteroidGroupC40,215,.31,-36,.47);

    const asteroidGroupC42 = new THREE.Group();
    const asteroidMeshC42 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC42,asteroidGroupC42,212,-.31,-25,.37);

    const asteroidGroupC44 = new THREE.Group();
    const asteroidMeshC44 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC44,asteroidGroupC44,231,-.31,-12,.27);

    const asteroidGroupC45 = new THREE.Group();
    const asteroidMeshC45 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC45,asteroidGroupC45,215,.31,-25,.37);

    const asteroidGroupC46 = new THREE.Group();
    const asteroidMeshC46 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC46,asteroidGroupC46,197,0,-54,.71);

    const asteroidGroupC47 = new THREE.Group();
    const asteroidMeshC47 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC47,asteroidGroupC47,205,0,-35,.5);

    const asteroidGroupC48 = new THREE.Group();
    const asteroidMeshC48 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC48,asteroidGroupC48,235,-.31,-8,.27);

    const asteroidGroupC50 = new THREE.Group();
    const asteroidMeshC50 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC50,asteroidGroupC50,217,-.41,-22,.27);

    const asteroidGroupC52 = new THREE.Group();
    const asteroidMeshC52 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC52,asteroidGroupC52,205,.2,-38,.5);  

    const asteroidGroupC58 = new THREE.Group();
    const asteroidMeshC58 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC58,asteroidGroupC58,203,0,-20,.47);

    const asteroidGroupC60 = new THREE.Group();
    const asteroidMeshC60 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC60,asteroidGroupC60,215,-1,-20,.4);

    const asteroidGroupC61 = new THREE.Group();
    const asteroidMeshC61 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC61,asteroidGroupC61,221,.3,-43,.11);

    const asteroidGroupC62 = new THREE.Group();
    const asteroidMeshC62 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC62,asteroidGroupC62,205,.51,-29,.19);  

    const asteroidGroupC63 = new THREE.Group();
    const asteroidMeshC63 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC63,asteroidGroupC63,218,-.6,-47,.27);

    const asteroidGroupC64 = new THREE.Group();
    const asteroidMeshC64 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC64,asteroidGroupC64,212,.61,-23,.2);

    const asteroidGroupC65 = new THREE.Group();
    const asteroidMeshC65 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC65,asteroidGroupC65,230.5,1,-45,.17);

    const asteroidGroupC66 = new THREE.Group();
    const asteroidMeshC66 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC66,asteroidGroupC66,208,.3,-21,.36);

    const asteroidGroupC67 = new THREE.Group();
    const asteroidMeshC67 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC67,asteroidGroupC67,225,-.6,-37,.5);

    const asteroidGroupC68 = new THREE.Group();
    const asteroidMeshC68 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC68,asteroidGroupC68,208,-.51,-26,.27);

    const asteroidGroupC69 = new THREE.Group();
    const asteroidMeshC69 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC69,asteroidGroupC69,218,.31,-29,.37);

    const asteroidGroupC70 = new THREE.Group();
    const asteroidMeshC70 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC70,asteroidGroupC70,206,-.6,-15,.37);

    const asteroidGroupC71 = new THREE.Group();
    const asteroidMeshC71 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC71,asteroidGroupC71,220,.6,-39,.42);

    const asteroidGroupC72 = new THREE.Group();
    const asteroidMeshC72 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC72,asteroidGroupC72,203,0,-12,.5);  

    const asteroidGroupC73 = new THREE.Group();
    const asteroidMeshC73 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC73,asteroidGroupC73,218,.6,-32,.17);

    const asteroidGroupC74 = new THREE.Group();
    const asteroidMeshC74 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC74,asteroidGroupC74,206,.6,-4,.27);

    const asteroidGroupC75 = new THREE.Group();
    const asteroidMeshC75 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC75,asteroidGroupC75,223,.6,-25,.17);

    const asteroidGroupC76 = new THREE.Group();
    const asteroidMeshC76 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC76,asteroidGroupC76,190,0,-77,.67);

    const asteroidGroupC77 = new THREE.Group();
    const asteroidMeshC77 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC77,asteroidGroupC77,212,.6,-146,.75);

    const asteroidGroupC79 = new THREE.Group();
    const asteroidMeshC79 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC79,asteroidGroupC79,218,.6,-9,.27);

    const asteroidGroupC81 = new THREE.Group();
    const asteroidMeshC81 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC81,asteroidGroupC81,206,.31,-30,.38);

    const asteroidGroupC85 = new THREE.Group();
    const asteroidMeshC85 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC85,asteroidGroupC85,209,.5,-36,.37);

    const asteroidGroupC89 = new THREE.Group();
    const asteroidMeshC89 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC89,asteroidGroupC89,212,.49,-18,.37);

    const asteroidGroupC91 = new THREE.Group();
    const asteroidMeshC91 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC91,asteroidGroupC91,217,.4,-16,.37);

    const asteroidGroupC93 = new THREE.Group();
    const asteroidMeshC93 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC93,asteroidGroupC93,254,.38,-28,.7);

    const asteroidGroupC95 = new THREE.Group();
    const asteroidMeshC95 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC95,asteroidGroupC95,235,0,-8,.37);

    const asteroidGroupC96 = new THREE.Group();
    const asteroidMeshC96 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC96,asteroidGroupC96,200,0,-168,.32);

    const asteroidGroupC97 = new THREE.Group();
    const asteroidMeshC97 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC97,asteroidGroupC97,225,0,-28,.35);

    const asteroidGroupC98 = new THREE.Group();
    const asteroidMeshC98 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC98,asteroidGroupC98,215,0,-32,.3);

    const asteroidGroupC99 = new THREE.Group();
    const asteroidMeshC99 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC99,asteroidGroupC99,221,0,-26,.3);

    const asteroidGroupC100 = new THREE.Group();
    const asteroidMeshC100 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC100,asteroidGroupC100,216,0,-47,.3);

    const asteroidGroupC101 = new THREE.Group();
    const asteroidMeshC101 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC101,asteroidGroupC101,220,0,-18,.25);////////////////////\\\\\\

    const asteroidGroupC102 = new THREE.Group();
    const asteroidMeshC102 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC102,asteroidGroupC102,205,0,-24,.35);  

    const asteroidGroupC103 = new THREE.Group();
    const asteroidMeshC103 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC103,asteroidGroupC103,218,0,-18,.37);

    const asteroidGroupC104 = new THREE.Group();
    const asteroidMeshC104 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC104,asteroidGroupC104,206,0,-42,.37);

    const asteroidGroupC105 = new THREE.Group();
    const asteroidMeshC105 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC105,asteroidGroupC105,235,0,-8,.5);

    const asteroidGroupC106 = new THREE.Group();
    const asteroidMeshC106 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC106,asteroidGroupC106,202,.2,-33,.32);

    const asteroidGroupC108 = new THREE.Group();
    const asteroidMeshC108 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC108,asteroidGroupC108,245,.2,-28,.57);

    const asteroidGroupC109 = new THREE.Group();
    const asteroidMeshC109 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC109,asteroidGroupC109,222,.2,-8,.27);

    const asteroidGroupC110 = new THREE.Group();
    const asteroidMeshC110 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC110,asteroidGroupC110,208,0,-56,.3);

    const asteroidGroupC111 = new THREE.Group();
    const asteroidMeshC111 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC111,asteroidGroupC111,238,0,-21,.3);

    const asteroidGroupC112 = new THREE.Group();
    const asteroidMeshC112 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC112,asteroidGroupC112,250,.51,-21,.51);

    const asteroidGroupC113 = new THREE.Group();
    const asteroidMeshC113 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC113,asteroidGroupC113,235,-.51,-32,.41);  

    const asteroidGroupC114 = new THREE.Group();
    const asteroidMeshC114 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC114,asteroidGroupC114,211,.51,-3,.4);

    const asteroidGroupC115 = new THREE.Group();
    const asteroidMeshC115 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC115,asteroidGroupC115,216,.71,-34,.27);

    const asteroidGroupC116 = new THREE.Group();
    const asteroidMeshC116 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC116,asteroidGroupC116,208,-.71,-5,.27);



                                                        //RIGHT/BOTTOM/LEFT - 1ST FILL LEFT                         
    const asteroidGroupC117 = new THREE.Group();
    const asteroidMeshC117 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC117,asteroidGroupC117,174.5,0,-110,.3);

    const asteroidGroupC118 = new THREE.Group();
    const asteroidMeshC118 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC118,asteroidGroupC118,188,-.41,-98.8,.27);

    const asteroidGroupC119 = new THREE.Group();
    const asteroidMeshC119 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC119,asteroidGroupC119,168,0,-183,.7);

    const asteroidGroupC120 = new THREE.Group();
    const asteroidMeshC120 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC120,asteroidGroupC120,175,.31,-106,.47);

    const asteroidGroupC121 = new THREE.Group();
    const asteroidMeshC121 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC121,asteroidGroupC121,199,.31,-71,.27);

    const asteroidGroupC122 = new THREE.Group();
    const asteroidMeshC122 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC122,asteroidGroupC122,188,0,-88.7,.3);

    const asteroidGroupC123 = new THREE.Group();
    const asteroidMeshC123 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC123,asteroidGroupC123,183,0,-91.6,.3);

    const asteroidGroupC124 = new THREE.Group();
    const asteroidMeshC124 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC124,asteroidGroupC124,165.36,0,-122.6,.53);

    const asteroidGroupC125 = new THREE.Group();
    const asteroidMeshC125 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC125,asteroidGroupC125,186,0,-82.7,.3);

    const asteroidGroupC126 = new THREE.Group();
    const asteroidMeshC126 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC126,asteroidGroupC126,191,-.31,-82,.27);

    const asteroidGroupC127 = new THREE.Group();
    const asteroidMeshC127 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC127,asteroidGroupC127,181,.6,-121,.6);

    const asteroidGroupC128 = new THREE.Group();
    const asteroidMeshC128 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC128,asteroidGroupC128,195,-.31,-78,.27);

    const asteroidGroupC129 = new THREE.Group();
    const asteroidMeshC129 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC129,asteroidGroupC129,170.7,0,-113,.63);

    const asteroidGroupC130 = new THREE.Group();
    const asteroidMeshC130 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC130,asteroidGroupC130,160.6,0,-135.6,.53);

    const asteroidGroupC131 = new THREE.Group();
    const asteroidMeshC131 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC131,asteroidGroupC131,170,.51,-220,1.1);

    const asteroidGroupC132 = new THREE.Group();
    const asteroidMeshC132 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC132,asteroidGroupC132,195,-.51,-102,.41);  

    const asteroidGroupC133 = new THREE.Group();
    const asteroidMeshC133 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC133,asteroidGroupC133,176,0,-130,.52);

    const asteroidGroupC134 = new THREE.Group();
    const asteroidMeshC134 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC134,asteroidGroupC134,182,0,-108,.3);

    const asteroidGroupC135 = new THREE.Group();
    const asteroidMeshC135 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC135,asteroidGroupC135,185,-.31,-102,.38); 

    const asteroidGroupC136 = new THREE.Group();
    const asteroidMeshC136 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC136,asteroidGroupC136,179,.71,-104,.7);

    const asteroidGroupC137 = new THREE.Group();
    const asteroidMeshC137 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC137,asteroidGroupC137,193,.21,-91,.27);

    const asteroidGroupC138 = new THREE.Group();
    const asteroidMeshC138 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC138,asteroidGroupC138,155,0,-140,.82);

    const asteroidGroupC139 = new THREE.Group();
    const asteroidMeshC139 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC139,asteroidGroupC139,165,.21,-127,.5);

    const asteroidGroupC140 = new THREE.Group();
    const asteroidMeshC140 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC140,asteroidGroupC140,175,-1,-203,.74);

    const asteroidGroupC141 = new THREE.Group();
    const asteroidMeshC141 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC141,asteroidGroupC141,184,.3,-113,.8);

    const asteroidGroupC142 = new THREE.Group();
    const asteroidMeshC142 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC142,asteroidGroupC142,191,0,-117,.13);

    const asteroidGroupC143 = new THREE.Group();
    const asteroidMeshC143 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC143,asteroidGroupC143,178,-.6,-117,.27);

    const asteroidGroupC144 = new THREE.Group();
    const asteroidMeshC144 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC144,asteroidGroupC144,172.6,0,-116,.3);

    const asteroidGroupC145 = new THREE.Group();
    const asteroidMeshC145 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC145,asteroidGroupC145,190.5,1,-115,.17);

    const asteroidGroupC146 = new THREE.Group();
    const asteroidMeshC146 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC146,asteroidGroupC146,190.6,0,-84,.3);

    const asteroidGroupC147 = new THREE.Group();
    const asteroidMeshC147 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC147,asteroidGroupC147,185,-.6,-107,.5);

    const asteroidGroupC148 = new THREE.Group();
    const asteroidMeshC148 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC148,asteroidGroupC148,192,0,-97,.3);

    const asteroidGroupC149 = new THREE.Group();
    const asteroidMeshC149 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC149,asteroidGroupC149,164,.31,-197,.57);

    const asteroidGroupC150 = new THREE.Group();
    const asteroidMeshC150 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC150,asteroidGroupC150,189,0,-82.3,.43);

    const asteroidGroupC151 = new THREE.Group();
    const asteroidMeshC151 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC151,asteroidGroupC151,180,.6,-109,.42);

    const asteroidGroupC152 = new THREE.Group();
    const asteroidMeshC152 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC152,asteroidGroupC152,201,0,-85.5,.3);

    const asteroidGroupC153 = new THREE.Group();
    const asteroidMeshC153 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC153,asteroidGroupC153,201,0,-91,.13);

    const asteroidGroupC154 = new THREE.Group();
    const asteroidMeshC154 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC154,asteroidGroupC154,203,0,-75.27,.3);

    const asteroidGroupC155 = new THREE.Group();
    const asteroidMeshC155 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC155,asteroidGroupC155,183,.6,-95,.17);

    const asteroidGroupC156 = new THREE.Group();
    const asteroidMeshC156 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC156,asteroidGroupC156,145,0,-153,.67);

    const asteroidGroupC157 = new THREE.Group();
    const asteroidMeshC157 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC157,asteroidGroupC157,185,.6,-90,.5);

    const asteroidGroupC158 = new THREE.Group();
    const asteroidMeshC158 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC158,asteroidGroupC158,170,0,-134,.43);

    const asteroidGroupC159 = new THREE.Group();
    const asteroidMeshC159 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC159,asteroidGroupC159,167,0,-130.8,.13);

    const asteroidGroupC160 = new THREE.Group();
    const asteroidMeshC160 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC160,asteroidGroupC160,205,0,-112,.3);

    const asteroidGroupC161 = new THREE.Group();
    const asteroidMeshC161 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC161,asteroidGroupC161,202,0,-106,.23);

    const asteroidGroupC162 = new THREE.Group();
    const asteroidMeshC162 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC162,asteroidGroupC162,207,.42,-167,1.1);

    const asteroidGroupC163 = new THREE.Group();
    const asteroidMeshC163 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC163,asteroidGroupC163,195,0,-78,.37);      

    const asteroidGroupC164 = new THREE.Group();
    const asteroidMeshC164 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC164,asteroidGroupC164,185,0,-98,.35);

    const asteroidGroupC166 = new THREE.Group();
    const asteroidMeshC166 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC166,asteroidGroupC166,175,0,-102,.3);

    const asteroidGroupC165 = new THREE.Group();
    const asteroidMeshC165 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC165,asteroidGroupC165,181,0,-96,.3);

    const asteroidGroupC167 = new THREE.Group();
    const asteroidMeshC167 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC167,asteroidGroupC167,176,0,-117,.3);

    const asteroidGroupC168 = new THREE.Group();
    const asteroidMeshC168 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC168,asteroidGroupC168,195,0,-78,.5);

    const asteroidGroupC169 = new THREE.Group();
    const asteroidMeshC169 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC169,asteroidGroupC169,185,.2,-88,.35);

    const asteroidGroupC170 = new THREE.Group();
    const asteroidMeshC170 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC170,asteroidGroupC170,185,.2,-198,.8);//\\\\\OUTER ORBIT LONER

    const asteroidGroupC171 = new THREE.Group();
    const asteroidMeshC171 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC171,asteroidGroupC171,168,0,-126,.3);

    const asteroidGroupC172 = new THREE.Group();
    const asteroidMeshC172 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC172,asteroidGroupC172,198,0,-91,.3);

    const asteroidGroupC173 = new THREE.Group();
    const asteroidMeshC173 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC173,asteroidGroupC173,170,0,-119,.3);

    const asteroidGroupC174 = new THREE.Group();
    const asteroidMeshC174 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC174,asteroidGroupC174,160,0,-129.2,.3);



                                                //RIGHT/BOTTOM/DOWN/LEFT - 2ND FILL LEFT DOWN
    const asteroidGroupC175 = new THREE.Group();
    const asteroidMeshC175 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC175,asteroidGroupC175,5,0,-226,.43);

    const asteroidGroupC176 = new THREE.Group();
    const asteroidMeshC176 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC176,asteroidGroupC176,210,0,-132,.67);

    const asteroidGroupC177 = new THREE.Group();
    const asteroidMeshC177 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC177,asteroidGroupC177,185,.6,-130,.5);

    const asteroidGroupC179 = new THREE.Group();
    const asteroidMeshC179 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC179,asteroidGroupC179,238,.6,-59,.27);

    const asteroidGroupC180 = new THREE.Group();
    const asteroidMeshC180 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC180,asteroidGroupC180,211,.3,-100,.27);

    const asteroidGroupC181 = new THREE.Group();
    const asteroidMeshC181 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC181,asteroidGroupC181,226,.31,-80,.38);

    const asteroidGroupC182 = new THREE.Group();
    const asteroidMeshC182 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC182,asteroidGroupC182,208,.42,-95,.41);  

    const asteroidGroupC184 = new THREE.Group();
    const asteroidMeshC184 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC184,asteroidGroupC184,208,-.4,-90,.47);

    const asteroidGroupC185 = new THREE.Group();
    const asteroidMeshC185 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC185,asteroidGroupC185,229,.5,-86,.37);

    const asteroidGroupC186 = new THREE.Group();
    const asteroidMeshC186 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC186,asteroidGroupC186,214,-.6,-90,.4);

    const asteroidGroupC187 = new THREE.Group();
    const asteroidMeshC187 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC187,asteroidGroupC187,204,0,-75,.28);

    const asteroidGroupC188 = new THREE.Group();
    const asteroidMeshC188 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC188,asteroidGroupC188,212,0,-104,.37);

    const asteroidGroupC189 = new THREE.Group();
    const asteroidMeshC189 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC189,asteroidGroupC189,232,.49,-68,.37);

    const asteroidGroupC190 = new THREE.Group();
    const asteroidMeshC190 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC190,asteroidGroupC190,216,.4,-88,.47);

    const asteroidGroupC191 = new THREE.Group();
    const asteroidMeshC191 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC191,asteroidGroupC191,237,.4,-66,.37);

    const asteroidGroupC192 = new THREE.Group();
    const asteroidMeshC192 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC192,asteroidGroupC192,214,.32,-98,.38);  

    const asteroidGroupC193 = new THREE.Group();
    const asteroidMeshC193 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC193,asteroidGroupC193,221,.38,-122,.57);

    const asteroidGroupC194 = new THREE.Group();
    const asteroidMeshC194 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC194,asteroidGroupC194,206,0,-86.5,.27);

    const asteroidGroupC195 = new THREE.Group();
    const asteroidMeshC195 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC195,asteroidGroupC195,195,0,-118,.37);

    const asteroidGroupC196 = new THREE.Group();
    const asteroidMeshC196 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC196,asteroidGroupC196,220,0,-74,.32);

    const asteroidGroupC197 = new THREE.Group();
    const asteroidMeshC197 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC197,asteroidGroupC197,185,0,-138,.35);

    const asteroidGroupC198 = new THREE.Group();
    const asteroidMeshC198 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC198,asteroidGroupC198,235,0,-82,.3);

    const asteroidGroupC199 = new THREE.Group();
    const asteroidMeshC199 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC199,asteroidGroupC199,241,0,-76,.3);

    const asteroidGroupC200 = new THREE.Group();
    const asteroidMeshC200 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC200,asteroidGroupC200,206,.51,-131,.4);

    const asteroidGroupC201 = new THREE.Group();
    const asteroidMeshC201 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC201,asteroidGroupC201,230,.51,-71,.51);

    const asteroidGroupC202 = new THREE.Group();
    const asteroidMeshC202 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC202,asteroidGroupC202,205,-.51,-142,.41);

    const asteroidGroupC203 = new THREE.Group();
    const asteroidMeshC203 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC203,asteroidGroupC203,231,.51,-53,.4);

    const asteroidGroupC204 = new THREE.Group();
    const asteroidMeshC204 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC204,asteroidGroupC204,236,.71,-84,.27);

    const asteroidGroupC205 = new THREE.Group();
    const asteroidMeshC205 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC205,asteroidGroupC205,228,-.71,-55,.27);

    const asteroidGroupC206 = new THREE.Group();
    const asteroidMeshC206 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC206,asteroidGroupC206,220,0,-94,.72);

    const asteroidGroupC207 = new THREE.Group();
    const asteroidMeshC207 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC207,asteroidGroupC207,220,0,-54,.61);

    const asteroidGroupC208 = new THREE.Group();
    const asteroidMeshC208 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC208,asteroidGroupC208,242,0,-88,.3);

    const asteroidGroupC209 = new THREE.Group();
    const asteroidMeshC209 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC209,asteroidGroupC209,214,0,-59,.7);

    const asteroidGroupC210 = new THREE.Group();
    const asteroidMeshC210 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC210,asteroidGroupC210,199,.31,-111,.27);

    const asteroidGroupC211 = new THREE.Group();
    const asteroidMeshC211 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC211,asteroidGroupC211,210,0,-102,.75);

    const asteroidGroupC212 = new THREE.Group();
    const asteroidMeshC212 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC212,asteroidGroupC212,185,-.31,-142,.38);

    const asteroidGroupC213 = new THREE.Group();
    const asteroidMeshC213 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC213,asteroidGroupC213,218,.31,-105,.17);

    const asteroidGroupC214 = new THREE.Group();
    const asteroidMeshC214 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC214,asteroidGroupC214,193,.21,-131,.27);

    const asteroidGroupC215 = new THREE.Group();
    const asteroidMeshC215 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC215,asteroidGroupC215,215,0,-84,.7);

    const asteroidGroupC216 = new THREE.Group();
    const asteroidMeshC216 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC216,asteroidGroupC216,215,0,-120,.82);

    const asteroidGroupC217 = new THREE.Group();
    const asteroidMeshC217 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC217,asteroidGroupC217,225,.21,-107,.5);

    const asteroidGroupC218 = new THREE.Group();
    const asteroidMeshC218 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC218,asteroidGroupC218,188,-.41,-138.8,.27);

    const asteroidGroupC219 = new THREE.Group();
    const asteroidMeshC219 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC219,asteroidGroupC219,108,0,-175,.7);

    const asteroidGroupC220 = new THREE.Group();
    const asteroidMeshC220 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC220,asteroidGroupC220,235,.31,-86,.47);

    const asteroidGroupC221 = new THREE.Group();
    const asteroidMeshC221 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC221,asteroidGroupC221,210,0,-112,.73);

    const asteroidGroupC222 = new THREE.Group();
    const asteroidMeshC222 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC222,asteroidGroupC222,232,-.31,-75,.37);  

    const asteroidGroupC223 = new THREE.Group();
    const asteroidMeshC223 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC223,asteroidGroupC223,215,.31,-83,.17);

    const asteroidGroupC224 = new THREE.Group();
    const asteroidMeshC224 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC224,asteroidGroupC224,191,-.31,-122,.27);

    const asteroidGroupC225 = new THREE.Group();
    const asteroidMeshC225 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC225,asteroidGroupC225,235,.31,-75,.37);

    const asteroidGroupC226 = new THREE.Group();
    const asteroidMeshC226 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC226,asteroidGroupC226,217,0,-92,.71);

    const asteroidGroupC227 = new THREE.Group();
    const asteroidMeshC227 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC227,asteroidGroupC227,225,0,-85,.5);

    const asteroidGroupC228 = new THREE.Group();
    const asteroidMeshC228 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC228,asteroidGroupC228,195,0.81,-68,.27);

    const asteroidGroupC229 = new THREE.Group();
    const asteroidMeshC229 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC229,asteroidGroupC229,218,.41,-79,.37);

    const asteroidGroupC230 = new THREE.Group();
    const asteroidMeshC230 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC230,asteroidGroupC230,237,-.41,-72,.27);

    const asteroidGroupC231 = new THREE.Group();
    const asteroidMeshC231 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC231,asteroidGroupC231,202,0,-102,.52);

    const asteroidGroupC232 = new THREE.Group();
    const asteroidMeshC232 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC232,asteroidGroupC232,225,.2,-88,.5);  

    const asteroidGroupC233 = new THREE.Group();
    const asteroidMeshC233 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC233,asteroidGroupC233,208,-.21,-104,.47);

    const asteroidGroupC234 = new THREE.Group();
    const asteroidMeshC234 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC234,asteroidGroupC234,212,.37,-78,.27);

    const asteroidGroupC235 = new THREE.Group();
    const asteroidMeshC235 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC235,asteroidGroupC235,201,-.31,-95,.37);

    const asteroidGroupC236 = new THREE.Group();
    const asteroidMeshC236 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC236,asteroidGroupC236,241,.3,-93,.11);

    const asteroidGroupC237 = new THREE.Group();
    const asteroidMeshC237 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC237,asteroidGroupC237,205,-.7,-93,.27);

    const asteroidGroupC238 = new THREE.Group();
    const asteroidMeshC238 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC238,asteroidGroupC238,223,0,-70,.647);

    const asteroidGroupC239 = new THREE.Group();
    const asteroidMeshC239 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC239,asteroidGroupC239,201.8,.5,-100,.27);

    const asteroidGroupC240 = new THREE.Group();
    const asteroidMeshC240 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC240,asteroidGroupC240,235,-1,-70,.4);

    const asteroidGroupC241 = new THREE.Group();
    const asteroidMeshC241 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC241,asteroidGroupC241,238,-.6,-97,.27);

    const asteroidGroupC242 = new THREE.Group();
    const asteroidMeshC242 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC242,asteroidGroupC242,232,.61,-73,.2);

    const asteroidGroupC243 = new THREE.Group();
    const asteroidMeshC243 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC243,asteroidGroupC243,190.5,1,-155,.17);

    const asteroidGroupC244 = new THREE.Group();
    const asteroidMeshC244 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC244,asteroidGroupC244,248,.3,-71,.49);

    const asteroidGroupC245 = new THREE.Group();
    const asteroidMeshC245 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC245,asteroidGroupC245,245,-.6,-87,.5);

    const asteroidGroupC246 = new THREE.Group();
    const asteroidMeshC246 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC246,asteroidGroupC246,228,-.51,-76,.27);

    const asteroidGroupC247 = new THREE.Group();
    const asteroidMeshC247 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC247,asteroidGroupC247,238,.31,-79,.37);

    const asteroidGroupC248 = new THREE.Group();
    const asteroidMeshC248 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC248,asteroidGroupC248,226,-.6,-65,.37);

    const asteroidGroupC249 = new THREE.Group();
    const asteroidMeshC249 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC249,asteroidGroupC249,240,.6,-89,.42);

    const asteroidGroupC250 = new THREE.Group();
    const asteroidMeshC250 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC250,asteroidGroupC250,193,0,-109,.5);

    const asteroidGroupC251 = new THREE.Group();
    const asteroidMeshC251 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC251,asteroidGroupC251,238,.6,-82,.17);

    const asteroidGroupC252 = new THREE.Group();
    const asteroidMeshC252 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC252,asteroidGroupC252,226,.6,-54,.27);

    const asteroidGroupC253 = new THREE.Group();
    const asteroidMeshC253 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC253,asteroidGroupC253,243,.6,-75,.17);

    const asteroidGroupC254 = new THREE.Group();
    const asteroidMeshC254 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC254,asteroidGroupC254,236,0,-97,.3);

    const asteroidGroupC255 = new THREE.Group();
    const asteroidMeshC255 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC255,asteroidGroupC255,240,0,-68,.25);

    const asteroidGroupC256 = new THREE.Group();
    const asteroidMeshC256 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC256,asteroidGroupC256,225,0,-74,.35);  

    const asteroidGroupC257 = new THREE.Group();
    const asteroidMeshC257 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC257,asteroidGroupC257,238,0,-68,.37);

    const asteroidGroupC258 = new THREE.Group();
    const asteroidMeshC258 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC258,asteroidGroupC258,226,0,-92,.37);

    const asteroidGroupC259 = new THREE.Group();
    const asteroidMeshC259 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC259,asteroidGroupC259,255,0,-58,.5);

    const asteroidGroupC260 = new THREE.Group();
    const asteroidMeshC260 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC260,asteroidGroupC260,222,.2,-83,.32);

    const asteroidGroupC261 = new THREE.Group();
    const asteroidMeshC261 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC261,asteroidGroupC261,185,.2,-128,.35);

    const asteroidGroupC262 = new THREE.Group();
    const asteroidMeshC262 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC262,asteroidGroupC262,235,.2,-78,.27);

    const asteroidGroupC264 = new THREE.Group();
    const asteroidMeshC264 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC264,asteroidGroupC264,242,.2,-58,.27);

    const asteroidGroupC265 = new THREE.Group();
    const asteroidMeshC265 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC265,asteroidGroupC265,228,0,-106,.3);

    const asteroidGroupC266 = new THREE.Group();
    const asteroidMeshC266 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC266,asteroidGroupC266,198,0,-131,.3);

    const asteroidGroupC267 = new THREE.Group();
    const asteroidMeshC267 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC267,asteroidGroupC267,230,0,-99,.3);

    const asteroidGroupC268 = new THREE.Group();
    const asteroidMeshC268 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC268,asteroidGroupC268,210,0,-84.5,.53);

    const asteroidGroupC269 = new THREE.Group();
    const asteroidMeshC269 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC269,asteroidGroupC269,220,0,-109.2,.3);

    const asteroidGroupC270 = new THREE.Group();
    const asteroidMeshC270 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC270,asteroidGroupC270,234.5,0,-90,.3);

    const asteroidGroupC271 = new THREE.Group();
    const asteroidMeshC271 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC271,asteroidGroupC271,230,0,-114,.43);

    const asteroidGroupC272 = new THREE.Group();
    const asteroidMeshC272 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC272,asteroidGroupC272,205,0,-91.7,.3);

    const asteroidGroupC273 = new THREE.Group();
    const asteroidMeshC273 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC273,asteroidGroupC273,227,0,-110.8,.13);

    const asteroidGroupC274 = new THREE.Group();
    const asteroidMeshC274 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC274,asteroidGroupC274,205,0,-152,.3);

    const asteroidGroupC275 = new THREE.Group();
    const asteroidMeshC275 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC275,asteroidGroupC275,202,0,-146,.23);

    const asteroidGroupC276 = new THREE.Group();
    const asteroidMeshC276 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC276,asteroidGroupC276,201,0,-125.5,.3);

    const asteroidGroupC277 = new THREE.Group();
    const asteroidMeshC277 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC277,asteroidGroupC277,201,0,-131,.13);

    const asteroidGroupC278 = new THREE.Group();
    const asteroidMeshC278 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC278,asteroidGroupC278,203,0,-115.27,.3);

    const asteroidGroupC279 = new THREE.Group();
    const asteroidMeshC279 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC279,asteroidGroupC279,191,0,-157,.13);

    const asteroidGroupC280 = new THREE.Group();
    const asteroidMeshC280 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC280,asteroidGroupC280,232.6,0,-96,.3);

    const asteroidGroupC281 = new THREE.Group();
    const asteroidMeshC281 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC281,asteroidGroupC281,192,0,-127,.3);

    const asteroidGroupC282 = new THREE.Group();
    const asteroidMeshC282 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC282,asteroidGroupC282,211,0,-94,.63);

    const asteroidGroupC283 = new THREE.Group();
    const asteroidMeshC283 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC283,asteroidGroupC283,190.6,0,-124,.3);

    const asteroidGroupC284 = new THREE.Group();
    const asteroidMeshC284 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC284,asteroidGroupC284,189,0,-122.3,.43);

    const asteroidGroupC285 = new THREE.Group();
    const asteroidMeshC285 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC285,asteroidGroupC285,229.7,0,-82.7,.13);

    const asteroidGroupC286 = new THREE.Group();
    const asteroidMeshC286 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC286,asteroidGroupC286,215,0,-62.7,.3);

    const asteroidGroupC287 = new THREE.Group();
    const asteroidMeshC287 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC287,asteroidGroupC287,228,0,-84,.3);

    const asteroidGroupC288 = new THREE.Group();
    const asteroidMeshC288 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC288,asteroidGroupC288,228,0,-68.7,.3);

    const asteroidGroupC289 = new THREE.Group();
    const asteroidMeshC289 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC289,asteroidGroupC289,222.6,0,-89.6,.3);

    const asteroidGroupC290 = new THREE.Group();
    const asteroidMeshC290 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC290,asteroidGroupC290,243,0,-21.56,.3);

    const asteroidGroupC291 = new THREE.Group();
    const asteroidMeshC291 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC291,asteroidGroupC291,225.36,0,-102.6,.53);

    const asteroidGroupC292 = new THREE.Group();
    const asteroidMeshC292 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC292,asteroidGroupC292,223.7,0,-98,.63);

    const asteroidGroupC293 = new THREE.Group();
    const asteroidMeshC293 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC293,asteroidGroupC293,220.6,0,-87.6,.3);

    const asteroidGroupC294 = new THREE.Group();
    const asteroidMeshC294 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC294,asteroidGroupC294,173,0,-175,.37);

    const asteroidGroupC295 = new THREE.Group();
    const asteroidMeshC295 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC295,asteroidGroupC295,167,0,-145,.5);

    const asteroidGroupC296 = new THREE.Group();
    const asteroidMeshC296 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC296,asteroidGroupC296,117,0,-169,1);

    const asteroidGroupC297 = new THREE.Group();
    const asteroidMeshC297 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC297,asteroidGroupC297,142,.2,-168,.35);

    const asteroidGroupC298 = new THREE.Group();
    const asteroidMeshC298 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC298,asteroidGroupC298,110.6,0,-173,.3);

    const asteroidGroupC299 = new THREE.Group();
    const asteroidMeshC299 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC299,asteroidGroupC299,182,0,-175.7,.3);

    const asteroidGroupC300 = new THREE.Group();
    const asteroidMeshC300 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC300,asteroidGroupC300,122.36,0,-187.6,.53);

    const asteroidGroupC301 = new THREE.Group();
    const asteroidMeshC301 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC301,asteroidGroupC301,112,.49,-182,.87);  

    const asteroidGroupC302 = new THREE.Group();
    const asteroidMeshC302 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC302,asteroidGroupC302,3,0,-230,.63);

    const asteroidGroupC303 = new THREE.Group();
    const asteroidMeshC303 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC303,asteroidGroupC303,0,0,-216,.53);



                                                                //BOTTOM/RIGHT       
    const asteroidGroupC304 = new THREE.Group();
    const asteroidMeshC304 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC304,asteroidGroupC304,43,.3,-221,.11);

    const asteroidGroupC305 = new THREE.Group();
    const asteroidMeshC305 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC305,asteroidGroupC305,8,0,-235,.37);

    const asteroidGroupC306 = new THREE.Group();
    const asteroidMeshC306 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC306,asteroidGroupC306,110,0,-196,.82);

    const asteroidGroupC307 = new THREE.Group();
    const asteroidMeshC307 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC307,asteroidGroupC307,28,0,-225,.35);

    const asteroidGroupC308 = new THREE.Group();
    const asteroidMeshC308 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC308,asteroidGroupC308,6,0,-252,.63);

    const asteroidGroupC309 = new THREE.Group();
    const asteroidMeshC309 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC309,asteroidGroupC309,26,0,-221,.3);

    const asteroidGroupC310 = new THREE.Group();
    const asteroidMeshC310 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC310,asteroidGroupC310,47,0,-216,.3);

    const asteroidGroupC311 = new THREE.Group();
    const asteroidMeshC311 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC311,asteroidGroupC311,18,0,-220,.25);

    const asteroidGroupC313 = new THREE.Group();
    const asteroidMeshC313 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC313,asteroidGroupC313,18,0,-218,.37);

    const asteroidGroupC314 = new THREE.Group();
    const asteroidMeshC314 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC314,asteroidGroupC314,42,0,-206,.37);

    const asteroidGroupC315 = new THREE.Group();
    const asteroidMeshC315 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC315,asteroidGroupC315,8,0,-235,.5);

    const asteroidGroupC316 = new THREE.Group();
    const asteroidMeshC316 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC316,asteroidGroupC316,33,.2,-202,.32);

    const asteroidGroupC317 = new THREE.Group();
    const asteroidMeshC317 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC317,asteroidGroupC317,54,.2,-228,.35);

    const asteroidGroupC318 = new THREE.Group();
    const asteroidMeshC318 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC318,asteroidGroupC318,27,.2,-255,1);

    const asteroidGroupC319 = new THREE.Group();
    const asteroidMeshC319 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC319,asteroidGroupC319,8,.2,-222,.27);

    const asteroidGroupC320 = new THREE.Group();
    const asteroidMeshC320 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC210,asteroidGroupC320,56,0,-208,.3);

    const asteroidGroupC321 = new THREE.Group();
    const asteroidMeshC321 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC321,asteroidGroupC321,21,0,-238,.3);

    const asteroidGroupC322 = new THREE.Group();
    const asteroidMeshC322 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC322,asteroidGroupC322,49,0,-210,.3);

    const asteroidGroupC324 = new THREE.Group();
    const asteroidMeshC324 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC324,asteroidGroupC324,59.2,0,-200,.3);

    const asteroidGroupC325 = new THREE.Group();
    const asteroidMeshC325 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC325,asteroidGroupC325,40,0,-214.5,.3);

    const asteroidGroupC326 = new THREE.Group();
    const asteroidMeshC326 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC326,asteroidGroupC326,64,0,-210,.43);

    const asteroidGroupC328 = new THREE.Group();
    const asteroidMeshC328 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC328,asteroidGroupC328,60.8,0,-207,.13);

    const asteroidGroupC329 = new THREE.Group();
    const asteroidMeshC329 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC329,asteroidGroupC329,46,0,-243,.3);

    const asteroidGroupC330 = new THREE.Group();
    const asteroidMeshC330 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC330,asteroidGroupC330,36,0,-242,.23);

    const asteroidGroupC331 = new THREE.Group();
    const asteroidMeshC331 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC331,asteroidGroupC331,15.5,0,-241,.3);

    const asteroidGroupC332 = new THREE.Group();
    const asteroidMeshC332 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC332,asteroidGroupC332,21,.3,-208,.36);

    const asteroidGroupC333 = new THREE.Group();
    const asteroidMeshC333 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC333,asteroidGroupC333,5.27,0,-243,.3);

    const asteroidGroupC334 = new THREE.Group();
    const asteroidMeshC334 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC334,asteroidGroupC334,47,0,-231,.13);

    const asteroidGroupC335 = new THREE.Group();
    const asteroidMeshC335 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC335,asteroidGroupC335,46,0,-212.6,.3);

    const asteroidGroupC336 = new THREE.Group();
    const asteroidMeshC336 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC336,asteroidGroupC336,17,0,-232,.3);

    const asteroidGroupC338 = new THREE.Group();
    const asteroidMeshC338 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC338,asteroidGroupC338,14,0,-230.6,.3);

    const asteroidGroupC339 = new THREE.Group();
    const asteroidMeshC339 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC339,asteroidGroupC339,48,0,-226,.65);

    const asteroidGroupC340 = new THREE.Group();
    const asteroidMeshC340 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC340,asteroidGroupC340,12.3,0,-229,.43);

    const asteroidGroupC341 = new THREE.Group();
    const asteroidMeshC341 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC341,asteroidGroupC341,32.7,0,-209.7,.13);

    const asteroidGroupC342 = new THREE.Group();
    const asteroidMeshC342 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC342,asteroidGroupC342,12.7,0,-226,.3);

    const asteroidGroupC343 = new THREE.Group();
    const asteroidMeshC343 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC343,asteroidGroupC343,34,0,-208,.3);

    const asteroidGroupC344 = new THREE.Group();
    const asteroidMeshC344 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC344,asteroidGroupC344,18.7,0,-228,.3);

    const asteroidGroupC345 = new THREE.Group();
    const asteroidMeshC345 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC345,asteroidGroupC345,39.6,0,-202.6,.3);

    const asteroidGroupC346 = new THREE.Group();
    const asteroidMeshC346 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC346,asteroidGroupC346,21.6,0,-223,.3);

    const asteroidGroupC347 = new THREE.Group();
    const asteroidMeshC347 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC347,asteroidGroupC347,52.6,0,-205.36,.53);

    const asteroidGroupC348 = new THREE.Group();
    const asteroidMeshC348 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC348,asteroidGroupC348,48,0,-203.7,.63);

    const asteroidGroupC349 = new THREE.Group();
    const asteroidMeshC349 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC349,asteroidGroupC349,37.6,0,-200.6,.3);

    const asteroidGroupC350 = new THREE.Group();
    const asteroidMeshC350 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC350,asteroidGroupC350,28,.38,-209,.27);

    const asteroidGroupC351 = new THREE.Group();
    const asteroidMeshC351 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC351,asteroidGroupC351,39,.6,-220,.42);

    const asteroidGroupC352 = new THREE.Group();
    const asteroidMeshC352 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC352,asteroidGroupC352,12,0,-203,.5);  

    const asteroidGroupC353 = new THREE.Group();
    const asteroidMeshC353 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC353,asteroidGroupC353,32,.6,-218,.17);

    const asteroidGroupC354 = new THREE.Group();
    const asteroidMeshC354 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC354,asteroidGroupC354,4,.6,-206,.27);

    const asteroidGroupC355 = new THREE.Group();
    const asteroidMeshC355 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC355,asteroidGroupC355,25,.6,-223,.17);

    const asteroidGroupC356 = new THREE.Group();
    const asteroidMeshC356 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC356,asteroidGroupC356,85,0,-190,.67);

    const asteroidGroupC357 = new THREE.Group();
    const asteroidMeshC357 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC357,asteroidGroupC357,13,.6,-222,.75);

    const asteroidGroupC358 = new THREE.Group();
    const asteroidMeshC358 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC358,asteroidGroupC358,28,-.6,-203,.7);

    const asteroidGroupC359 = new THREE.Group();
    const asteroidMeshC359 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC359,asteroidGroupC359,9,.6,-218,.27);

    const asteroidGroupC360 = new THREE.Group();
    const asteroidMeshC360 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC360,asteroidGroupC360,12,-.71,-258,.7);

    const asteroidGroupC361 = new THREE.Group();
    const asteroidMeshC361 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC361,asteroidGroupC361,30,.31,-206,.38);

    const asteroidGroupC362 = new THREE.Group();
    const asteroidMeshC362 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC362,asteroidGroupC362,52,0,-222,.72);

    const asteroidGroupC363 = new THREE.Group();
    const asteroidMeshC363 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC363,asteroidGroupC363,27,.37,-243,.47);

    const asteroidGroupC364 = new THREE.Group();
    const asteroidMeshC364 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC364,asteroidGroupC364,34,.71,-216,.27);

    const asteroidGroupC365 = new THREE.Group();
    const asteroidMeshC365 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC365,asteroidGroupC365,36,.5,-209,.37);

    const asteroidGroupC366 = new THREE.Group();
    const asteroidMeshC366 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC366,asteroidGroupC366,37,-.6,-232,.6);

    const asteroidGroupC367 = new THREE.Group();
    const asteroidMeshC367 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC367,asteroidGroupC367,7,0,-205,.61);

    const asteroidGroupC368 = new THREE.Group();
    const asteroidMeshC368 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC368,asteroidGroupC368,38,0,-222,.3);

    const asteroidGroupC369 = new THREE.Group();
    const asteroidMeshC369 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC369,asteroidGroupC369,114,.49,-202,.67);

    const asteroidGroupC370 = new THREE.Group();
    const asteroidMeshC370 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC370,asteroidGroupC370,1,.31,-239,.27);

    const asteroidGroupC371 = new THREE.Group();
    const asteroidMeshC371 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC371,asteroidGroupC371,3,.51,-211,.4);

    const asteroidGroupC372 = new THREE.Group();
    const asteroidMeshC372 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC372,asteroidGroupC372,32,-.31,-225,.38);  

    const asteroidGroupC373 = new THREE.Group();
    const asteroidMeshC373 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC373,asteroidGroupC373,55,.31,-198,.17);

    const asteroidGroupC374 = new THREE.Group();
    const asteroidMeshC374 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC374,asteroidGroupC374,21,.21,-233,.27);

    const asteroidGroupC376 = new THREE.Group();
    const asteroidMeshC376 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC376,asteroidGroupC376,70,0,-195,.82);

    const asteroidGroupC377 = new THREE.Group();
    const asteroidMeshC377 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC377,asteroidGroupC377,32,-.51,-235,.41);

    const asteroidGroupC378 = new THREE.Group();
    const asteroidMeshC378 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC378,asteroidGroupC378,28.8,-.41,-228,.27);

    const asteroidGroupC379 = new THREE.Group();
    const asteroidMeshC379 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC379,asteroidGroupC379,45,0,-208,.7);

    const asteroidGroupC380 = new THREE.Group();
    const asteroidMeshC380 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC380,asteroidGroupC380,26,-.51,-208,.27);

    const asteroidGroupC381 = new THREE.Group();
    const asteroidMeshC381 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC381,asteroidGroupC381,29,.31,-218,.37);

    const asteroidGroupC382 = new THREE.Group();
    const asteroidMeshC382 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC382,asteroidGroupC382,15,-.6,-206,.37);

    const asteroidGroupC383 = new THREE.Group();
    const asteroidMeshC383 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC383,asteroidGroupC383,21,.51,-250,.51);

    const asteroidGroupC384 = new THREE.Group();
    const asteroidMeshC384 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC384,asteroidGroupC384,12,-.31,-251,.57);

    const asteroidGroupC385 = new THREE.Group();
    const asteroidMeshC385 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC385,asteroidGroupC385,25,.31,-231,.47);

    const asteroidGroupC386 = new THREE.Group();
    const asteroidMeshC386 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC386,asteroidGroupC386,43,0,-199,.71);

    const asteroidGroupC387 = new THREE.Group();
    const asteroidMeshC387 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC387,asteroidGroupC387,11,0,-208,.5);

    const asteroidGroupC388 = new THREE.Group();
    const asteroidMeshC388 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC388,asteroidGroupC388,8,-.31,-235,.27);

    const asteroidGroupC389 = new THREE.Group();
    const asteroidMeshC389 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC389,asteroidGroupC389,37,-.6,-225,.5);

    const asteroidGroupC390 = new THREE.Group();
    const asteroidMeshC390 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC390,asteroidGroupC390,22,-.41,-217,.27);

    const asteroidGroupC391 = new THREE.Group();
    const asteroidMeshC391 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC391,asteroidGroupC391,35,.51,-255,.39);  

    const asteroidGroupC392 = new THREE.Group();
    const asteroidMeshC392 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC392,asteroidGroupC392,38,.2,-262,.75);

    const asteroidGroupC393 = new THREE.Group();
    const asteroidMeshC393 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC393,asteroidGroupC393,47,-.6,-218,.27);

    const asteroidGroupC394 = new THREE.Group();
    const asteroidMeshC394 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC394,asteroidGroupC394,44,.37,-246,.7);

    const asteroidGroupC395 = new THREE.Group();
    const asteroidMeshC395 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC395,asteroidGroupC395,23,.61,-212,.2);

    const asteroidGroupC396 = new THREE.Group();
    const asteroidMeshC396 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC396,asteroidGroupC396,32,.6,-257,.4);

    const asteroidGroupC397 = new THREE.Group();
    const asteroidMeshC397 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC397,asteroidGroupC397,45,1,-230.5,.17);

    const asteroidGroupC398 = new THREE.Group();
    const asteroidMeshC398 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC398,asteroidGroupC398,20,0,-203,.47);

    const asteroidGroupC399 = new THREE.Group();
    const asteroidMeshC399 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC399,asteroidGroupC399,16,.4,-217,.37);

    const asteroidGroupC400 = new THREE.Group();
    const asteroidMeshC400 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC400,asteroidGroupC400,20,-1,-215,.4);



                                                //3RD RIGHT FILLER------- BOTTOM/RIGHT/RIGHT/RIGHT
    const asteroidGroupC401 = new THREE.Group();
    const asteroidMeshC401 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC401,asteroidGroupC401,159.6,0,-162.6,.3);

    const asteroidGroupC402 = new THREE.Group();
    const asteroidMeshC402 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC402,asteroidGroupC402,141.6,0,-183,.3);

    const asteroidGroupC403 = new THREE.Group();
    const asteroidMeshC403 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC403,asteroidGroupC403,123,.51,-171,.4);        

    const asteroidGroupC404 = new THREE.Group();
    const asteroidMeshC404 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC404,asteroidGroupC404,154,.71,-176,.27);

    const asteroidGroupC405 = new THREE.Group();
    const asteroidMeshC405 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC405,asteroidGroupC405,125,-.71,-168,.27);

    const asteroidGroupC406 = new THREE.Group();
    const asteroidMeshC406 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC406,asteroidGroupC406,174,0,-160,.72);

    const asteroidGroupC407 = new THREE.Group();
    const asteroidMeshC407 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC407,asteroidGroupC407,127,0,-165,.61);

    const asteroidGroupC408 = new THREE.Group();
    const asteroidMeshC408 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC408,asteroidGroupC408,158,0,-182,.3);

    const asteroidGroupC409 = new THREE.Group();
    const asteroidMeshC409 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC409,asteroidGroupC409,130,0,-157,.7);

    const asteroidGroupC410 = new THREE.Group();
    const asteroidMeshC410 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC410,asteroidGroupC410,121,.31,-199,.27);

    const asteroidGroupC411 = new THREE.Group();
    const asteroidMeshC411 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC411,asteroidGroupC411,172,0,-150,.75);

    const asteroidGroupC412 = new THREE.Group();
    const asteroidMeshC412 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC412,asteroidGroupC412,152,-.31,-185,.38);  

    const asteroidGroupC413 = new THREE.Group();
    const asteroidMeshC413 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC413,asteroidGroupC413,175,.31,-158,.17);

    const asteroidGroupC414 = new THREE.Group();
    const asteroidMeshC414 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC414,asteroidGroupC414,141,.21,-193,.27);

    const asteroidGroupC415 = new THREE.Group();
    const asteroidMeshC415 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC415,asteroidGroupC415,154,0,-155,.7);

    const asteroidGroupC416 = new THREE.Group();
    const asteroidMeshC416 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC416,asteroidGroupC416,140,0,-157,.82);

    const asteroidGroupC417 = new THREE.Group();
    const asteroidMeshC417 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC417,asteroidGroupC417,177,.21,-165,.5);

    const asteroidGroupC418 = new THREE.Group();
    const asteroidMeshC418 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC418,asteroidGroupC418,148.8,-.41,-188,.27);

    const asteroidGroupC419 = new THREE.Group();
    const asteroidMeshC419 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC419,asteroidGroupC419,165,0,-168,.7);

    const asteroidGroupC420 = new THREE.Group();
    const asteroidMeshC420 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC420,asteroidGroupC420,156,.31,-175,.47);

    const asteroidGroupC421 = new THREE.Group();
    const asteroidMeshC421 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC421,asteroidGroupC421,182,0,-150,.73);

    const asteroidGroupC422 = new THREE.Group();
    const asteroidMeshC422 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC422,asteroidGroupC422,145,-.31,-172,.37);

    const asteroidGroupC423 = new THREE.Group();
    const asteroidMeshC423 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC423,asteroidGroupC423,152,-.51,-195,.41);  

    const asteroidGroupC424 = new THREE.Group();
    const asteroidMeshC424 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC424,asteroidGroupC424,132,-.31,-191,.27);

    const asteroidGroupC425 = new THREE.Group();
    const asteroidMeshC425 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC425,asteroidGroupC425,145,.31,-175,.37);

    const asteroidGroupC426 = new THREE.Group();
    const asteroidMeshC426 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC426,asteroidGroupC426,182,0,-157,.71);

    const asteroidGroupC427 = new THREE.Group();
    const asteroidMeshC427 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC427,asteroidGroupC427,141,.51,-170,.51);
        
    const asteroidGroupC428 = new THREE.Group();
    const asteroidMeshC428 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC428,asteroidGroupC428,128,-.31,-195,.27);

    const asteroidGroupC429 = new THREE.Group();
    const asteroidMeshC429 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC429,asteroidGroupC429,149,.41,-158,.37);

    const asteroidGroupC430 = new THREE.Group();
    const asteroidMeshC430 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC430,asteroidGroupC430,142,-.41,-177,.27);

    const asteroidGroupC431 = new THREE.Group();
    const asteroidMeshC431 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC431,asteroidGroupC431,172,0,-142,.52);

    const asteroidGroupC432 = new THREE.Group();
    const asteroidMeshC432 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC432,asteroidGroupC432,224,.41,-118,.37);

    const asteroidGroupC433 = new THREE.Group();
    const asteroidMeshC433 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC433,asteroidGroupC433,174,-.21,-148,.47);

    const asteroidGroupC434 = new THREE.Group();
    const asteroidMeshC434 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC434,asteroidGroupC434,148,.37,-152,.27);

    const asteroidGroupC435 = new THREE.Group();
    const asteroidMeshC435 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC435,asteroidGroupC435,165,-.31,-141,.7);

    const asteroidGroupC436 = new THREE.Group();
    const asteroidMeshC436 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC436,asteroidGroupC436,190,.6,-165,.7);

    const asteroidGroupC437 = new THREE.Group();
    const asteroidMeshC437 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC437,asteroidGroupC437,203,-.7,-161,.7);

    const asteroidGroupC438 = new THREE.Group();
    const asteroidMeshC438 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC438,asteroidGroupC438,140,0,-163,.47);

    const asteroidGroupC439 = new THREE.Group();
    const asteroidMeshC439 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC439,asteroidGroupC439,170,.5,-141.8,.27);

    const asteroidGroupC440 = new THREE.Group();
    const asteroidMeshC440 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC440,asteroidGroupC440,140,-1,-175,.4);

    const asteroidGroupC441 = new THREE.Group();
    const asteroidMeshC441 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC441,asteroidGroupC441,163,.3,-181,.11);

    const asteroidGroupC442 = new THREE.Group();
    const asteroidMeshC442 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC442,asteroidGroupC442,149,.51,-165,.19);  

    const asteroidGroupC443 = new THREE.Group();
    const asteroidMeshC443 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC443,asteroidGroupC443,167,-.6,-178,.27);

    const asteroidGroupC444 = new THREE.Group();
    const asteroidMeshC444 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC444,asteroidGroupC444,131,.61,-172,.52);

    const asteroidGroupC445 = new THREE.Group();
    const asteroidMeshC445 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC445,asteroidGroupC445,165,1,-190.5,.17);

    const asteroidGroupC446 = new THREE.Group();
    const asteroidMeshC446 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC446,asteroidGroupC446,141,.51,-226,.51);

    const asteroidGroupC447 = new THREE.Group();
    const asteroidMeshC447 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC447,asteroidGroupC447,157,-.6,-185,.5);

    const asteroidGroupC448 = new THREE.Group();
    const asteroidMeshC448 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC448,asteroidGroupC448,146,-.51,-168,.27);

    const asteroidGroupC449 = new THREE.Group();
    const asteroidMeshC449 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC449,asteroidGroupC449,149,.31,-178,.37);

    const asteroidGroupC450 = new THREE.Group();
    const asteroidMeshC450 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC450,asteroidGroupC450,135,-.6,-166,.37);

    const asteroidGroupC451 = new THREE.Group();
    const asteroidMeshC451 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC451,asteroidGroupC451,175,.6,-188,.62);

    const asteroidGroupC452 = new THREE.Group();
    const asteroidMeshC452 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC452,asteroidGroupC452,132,0,-163,.5);  

    const asteroidGroupC453 = new THREE.Group();
    const asteroidMeshC453 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC453,asteroidGroupC453,160,.6,-190,.417);

    const asteroidGroupC454 = new THREE.Group();
    const asteroidMeshC454 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC454,asteroidGroupC454,124,.6,-166,.27);

    const asteroidGroupC455 = new THREE.Group();
    const asteroidMeshC455 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC455,asteroidGroupC455,122,.6,-177,.74);

    const asteroidGroupC456 = new THREE.Group();
    const asteroidMeshC456 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC456,asteroidGroupC456,203,0,-150,.67);

    const asteroidGroupC457 = new THREE.Group();
    const asteroidMeshC457 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC457,asteroidGroupC457,144,.6,-190,.5);

    const asteroidGroupC458 = new THREE.Group();
    const asteroidMeshC458 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC458,asteroidGroupC458,148,-.6,-163,.47);

    const asteroidGroupC459 = new THREE.Group();
    const asteroidMeshC459 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC459,asteroidGroupC459,129,.6,-178,.27);

    const asteroidGroupC460 = new THREE.Group();
    const asteroidMeshC460 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC460,asteroidGroupC460,170,.3,-151,.27);

    const asteroidGroupC461 = new THREE.Group();
    const asteroidMeshC461 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC461,asteroidGroupC461,150,.31,-166,.38);

    const asteroidGroupC462 = new THREE.Group();
    const asteroidMeshC462 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC462,asteroidGroupC462,165,.42,-148,.41);  

    const asteroidGroupC463 = new THREE.Group();
    const asteroidMeshC463 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC463,asteroidGroupC463,146,.37,-208,.47);

    const asteroidGroupC464 = new THREE.Group();
    const asteroidMeshC464 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC464,asteroidGroupC464,160,-.4,-148,.47);

    const asteroidGroupC465 = new THREE.Group();
    const asteroidMeshC465 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC465,asteroidGroupC465,156,.5,-169,.37);

    const asteroidGroupC466 = new THREE.Group();
    const asteroidMeshC466 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC466,asteroidGroupC466,160,-.6,-154,.4);

    const asteroidGroupC467 = new THREE.Group();
    const asteroidMeshC467 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC467,asteroidGroupC467,147,0,-146,.8);

    const asteroidGroupC468 = new THREE.Group();
    const asteroidMeshC468 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC468,asteroidGroupC468,174,0,-152,.37);

    const asteroidGroupC469 = new THREE.Group();
    const asteroidMeshC469 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC469,asteroidGroupC469,138,.49,-172,.37);

    const asteroidGroupC470 = new THREE.Group();
    const asteroidMeshC470 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC470,asteroidGroupC470,158,.4,-156,.47);

    const asteroidGroupC471 = new THREE.Group();
    const asteroidMeshC471 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC471,asteroidGroupC471,136,.4,-177,.37);

    const asteroidGroupC472 = new THREE.Group();
    const asteroidMeshC472 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC472,asteroidGroupC472,168,.32,-154,.38);  

    const asteroidGroupC473 = new THREE.Group();
    const asteroidMeshC473 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC473,asteroidGroupC473,148,.38,-169,.27);

    const asteroidGroupC474 = new THREE.Group();
    const asteroidMeshC474 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC474,asteroidGroupC474,2,.31,-242,.6);

    const asteroidGroupC475 = new THREE.Group();
    const asteroidMeshC475 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC475,asteroidGroupC475,128,0,-195,.37);

    const asteroidGroupC476 = new THREE.Group();
    const asteroidMeshC476 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC476,asteroidGroupC476,139,0,-150,.52);

    const asteroidGroupC477 = new THREE.Group();
    const asteroidMeshC477 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC477,asteroidGroupC477,148,0,-185,.35);

    const asteroidGroupC478 = new THREE.Group();
    const asteroidMeshC478 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC478,asteroidGroupC478,152,0,-165,.3);

    const asteroidGroupC479 = new THREE.Group();
    const asteroidMeshC479 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC479,asteroidGroupC479,146,0,-161,.3);

    const asteroidGroupC480 = new THREE.Group();
    const asteroidMeshC480 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC480,asteroidGroupC480,167,0,-176,.3);

    const asteroidGroupC481 = new THREE.Group();
    const asteroidMeshC481 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC481,asteroidGroupC481,180,0,-170,.25);

    const asteroidGroupC482 = new THREE.Group();
    const asteroidMeshC482 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC482,asteroidGroupC482,157.6,0,-160.6,.3);

    const asteroidGroupC483 = new THREE.Group();
    const asteroidMeshC483 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC483,asteroidGroupC483,138,0,-178,.37);

    const asteroidGroupC484 = new THREE.Group();
    const asteroidMeshC484 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC484,asteroidGroupC484,162,0,-166,.37);

    const asteroidGroupC485 = new THREE.Group();
    const asteroidMeshC485 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC485,asteroidGroupC485,128,0,-195,.5);

    const asteroidGroupC486 = new THREE.Group();
    const asteroidMeshC486 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC486,asteroidGroupC486,153,.2,-162,.32);

    const asteroidGroupC487 = new THREE.Group();
    const asteroidMeshC487 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC487,asteroidGroupC487,138,.2,-185,.35);

    const asteroidGroupC488 = new THREE.Group();
    const asteroidMeshC488 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC488,asteroidGroupC488,148,.2,-175,.27);

    const asteroidGroupC489 = new THREE.Group();
    const asteroidMeshC489 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC489,asteroidGroupC489,128,.2,-182,.27);

    const asteroidGroupC490 = new THREE.Group();
    const asteroidMeshC490 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC490,asteroidGroupC490,176,0,-168,.3);

    const asteroidGroupC491 = new THREE.Group();
    const asteroidMeshC491 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC491,asteroidGroupC491,141,0,-198,.3);

    const asteroidGroupC492 = new THREE.Group();
    const asteroidMeshC492 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC492,asteroidGroupC492,169,0,-170,.3);

    const asteroidGroupC493 = new THREE.Group();
    const asteroidMeshC493 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC493,asteroidGroupC493,154.5,0,-150,.53);

    const asteroidGroupC494 = new THREE.Group();
    const asteroidMeshC494 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC494,asteroidGroupC494,179.2,0,-160,.3);

    const asteroidGroupC495 = new THREE.Group();
    const asteroidMeshC495 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC495,asteroidGroupC495,168,0,-163.7,.63);

    const asteroidGroupC496 = new THREE.Group();
    const asteroidMeshC496 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC496,asteroidGroupC496,184,0,-170,.43);

    const asteroidGroupC497 = new THREE.Group();
    const asteroidMeshC497 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC497,asteroidGroupC497,161.7,0,-145,.3);

    const asteroidGroupC498 = new THREE.Group();
    const asteroidMeshC498 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC498,asteroidGroupC498,180.8,0,-167,.13);

    const asteroidGroupC499 = new THREE.Group();
    const asteroidMeshC499 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC499,asteroidGroupC499,162,0,-205,.3);

    const asteroidGroupC500 = new THREE.Group();
    const asteroidMeshC500 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC500,asteroidGroupC500,156,0,-202,.23);

    const asteroidGroupC501 = new THREE.Group();
    const asteroidMeshC501 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC501,asteroidGroupC501,135.5,0,-201,.3);

    const asteroidGroupC502 = new THREE.Group();
    const asteroidMeshC502 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC502,asteroidGroupC502,172.6,0,-165.36,.53);

    const asteroidGroupC503 = new THREE.Group();
    const asteroidMeshC503 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC503,asteroidGroupC503,125.27,0,-203,.3);

    const asteroidGroupC504 = new THREE.Group();
    const asteroidMeshC504 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC504,asteroidGroupC504,167,0,-191,.13);

    const asteroidGroupC505 = new THREE.Group();
    const asteroidMeshC505 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC505,asteroidGroupC505,166,0,-172.6,.3);

    const asteroidGroupC506 = new THREE.Group();
    const asteroidMeshC506 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC506,asteroidGroupC506,137,0,-192,.3);

    const asteroidGroupC507 = new THREE.Group();
    const asteroidMeshC507 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC507,asteroidGroupC507,164,0,-151,.63);

    const asteroidGroupC508 = new THREE.Group();
    const asteroidMeshC508 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC508,asteroidGroupC508,134,0,-194.6,.3);

    const asteroidGroupC509 = new THREE.Group();
    const asteroidMeshC509 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC509,asteroidGroupC509,155,0,-171,.45);

    const asteroidGroupC510 = new THREE.Group();
    const asteroidMeshC510 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC510,asteroidGroupC510,132.3,0,-189,.43);

    const asteroidGroupC511 = new THREE.Group();
    const asteroidMeshC511 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC511,asteroidGroupC511,152.7,0,-169.7,.13);

    const asteroidGroupC512 = new THREE.Group();
    const asteroidMeshC512 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC512,asteroidGroupC512,132.7,0,-186,.3);

    const asteroidGroupC513 = new THREE.Group();
    const asteroidMeshC513 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC513,asteroidGroupC513,154,0,-168,.3);

    const asteroidGroupC514 = new THREE.Group();
    const asteroidMeshC514 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC514,asteroidGroupC514,138.7,0,-188,.3);

                        

                                        //BOTTOM/RIGHT ---> 4TH FILLER  -  BOTTOM/RIGHT/RIGHT
    const asteroidGroupC515 = new THREE.Group();
    const asteroidMeshC515 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC515,asteroidGroupC515,76,0,-245,1);

    const asteroidGroupC516 = new THREE.Group();
    const asteroidMeshC516 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC516,asteroidGroupC516,79,.31,-218,.37);

    const asteroidGroupC517 = new THREE.Group();
    const asteroidMeshC517 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC517,asteroidGroupC517,70,-1,-215,.4);

    const asteroidGroupC518 = new THREE.Group();
    const asteroidMeshC518 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC518,asteroidGroupC518,110.8,0,-207,.13);

    const asteroidGroupC519 = new THREE.Group();
    const asteroidMeshC519 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC519,asteroidGroupC519,92,0,-245,.3);

    const asteroidGroupC520 = new THREE.Group();
    const asteroidMeshC520 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC520,asteroidGroupC520,86,0,-242,.23);

    const asteroidGroupC521 = new THREE.Group();
    const asteroidMeshC521 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC521,asteroidGroupC521,65.5,0,-241,.3);

    const asteroidGroupC522 = new THREE.Group();
    const asteroidMeshC522 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC522,asteroidGroupC522,93,.3,-221,.11);

    const asteroidGroupC523 = new THREE.Group();
    const asteroidMeshC523 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC523,asteroidGroupC523,55.27,0,-243,.3);

    const asteroidGroupC524 = new THREE.Group();
    const asteroidMeshC524 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC524,asteroidGroupC524,97,0,-231,.13);

    const asteroidGroupC525 = new THREE.Group();
    const asteroidMeshC525 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC525,asteroidGroupC525,96,0,-212.6,.3);

    const asteroidGroupC526 = new THREE.Group();
    const asteroidMeshC526 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC526,asteroidGroupC526,67,0,-232,.3);

    const asteroidGroupC527 = new THREE.Group();
    const asteroidMeshC527 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC527,asteroidGroupC527,94,0,-191,.63);

    const asteroidGroupC528 = new THREE.Group();
    const asteroidMeshC528 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC528,asteroidGroupC528,64,0,-230.6,.3);

    const asteroidGroupC529 = new THREE.Group();
    const asteroidMeshC529 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC529,asteroidGroupC529,85,0,-211,.45);

    const asteroidGroupC530 = new THREE.Group();
    const asteroidMeshC530 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC530,asteroidGroupC530,62.3,0,-229,.43);

    const asteroidGroupC531 = new THREE.Group();
    const asteroidMeshC531 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC531,asteroidGroupC531,82.7,0,-209.7,.13);

    const asteroidGroupC532 = new THREE.Group();
    const asteroidMeshC532 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC532,asteroidGroupC532,62.7,0,-226,.3);

    const asteroidGroupC533 = new THREE.Group();
    const asteroidMeshC533 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC533,asteroidGroupC533,84,0,-208,.3);

    const asteroidGroupC534 = new THREE.Group();
    const asteroidMeshC534 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC534,asteroidGroupC534,68.7,0,-228,.3);

    const asteroidGroupC535 = new THREE.Group();
    const asteroidMeshC535 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC535,asteroidGroupC535,89.6,0,-202.6,.3);

    const asteroidGroupC536 = new THREE.Group();
    const asteroidMeshC536 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC536,asteroidGroupC536,71.6,0,-223,.3);

    const asteroidGroupC537 = new THREE.Group();
    const asteroidMeshC537 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC537,asteroidGroupC537,102.6,0,-205.36,.53);

    const asteroidGroupC538 = new THREE.Group();
    const asteroidMeshC538 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC538,asteroidGroupC538,98,0,-203.7,.63);

    const asteroidGroupC539 = new THREE.Group();
    const asteroidMeshC539 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC539,asteroidGroupC539,87.6,0,-200.6,.3);

    const asteroidGroupC540 = new THREE.Group();
    const asteroidMeshC540 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC540,asteroidGroupC540,71,.51,-210,.51);

    const asteroidGroupC541 = new THREE.Group();
    const asteroidMeshC541 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC541,asteroidGroupC541,71,.51,-210,.51);

    const asteroidGroupC542 = new THREE.Group();
    const asteroidMeshC542 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC542,asteroidGroupC542,82,-.51,-235,.41);  

    const asteroidGroupC543 = new THREE.Group();
    const asteroidMeshC543 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC543,asteroidGroupC543,53,.51,-211,.4);

    const asteroidGroupC544 = new THREE.Group();
    const asteroidMeshC544 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC544,asteroidGroupC544,104,.71,-226,.47);

    const asteroidGroupC545 = new THREE.Group();
    const asteroidMeshC545 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC545,asteroidGroupC545,55,-.71,-208,.27);

    const asteroidGroupC546 = new THREE.Group();
    const asteroidMeshC546 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC546,asteroidGroupC546,91.7,0,-185,.3);

    const asteroidGroupC547 = new THREE.Group();
    const asteroidMeshC547 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC547,asteroidGroupC547,53,0,-254,.61);

    const asteroidGroupC548 = new THREE.Group();
    const asteroidMeshC548 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC548,asteroidGroupC548,88,0,-222,.3);

    const asteroidGroupC549 = new THREE.Group();
    const asteroidMeshC549 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC549,asteroidGroupC549,59,0,-196,.7);

    const asteroidGroupC550 = new THREE.Group();
    const asteroidMeshC550 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC550,asteroidGroupC550,51,.31,-239,.27);

    const asteroidGroupC551 = new THREE.Group();
    const asteroidMeshC551 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC551,asteroidGroupC551,102,0,-190,.75);

    const asteroidGroupC552 = new THREE.Group();
    const asteroidMeshC552 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC552,asteroidGroupC552,82,-.31,-225,.38);  

    const asteroidGroupC553 = new THREE.Group();
    const asteroidMeshC553 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC553,asteroidGroupC553,105,.31,-198,.37);

    const asteroidGroupC554 = new THREE.Group();
    const asteroidMeshC554 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC554,asteroidGroupC554,71,.21,-233,.27);

    const asteroidGroupC555 = new THREE.Group();
    const asteroidMeshC555 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC555,asteroidGroupC555,84,0,-195,.7);

    const asteroidGroupC556 = new THREE.Group();
    const asteroidMeshC556 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC556,asteroidGroupC556,120,0,-195,.82);

    const asteroidGroupC557 = new THREE.Group();
    const asteroidMeshC557 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC557,asteroidGroupC557,107,.21,-205,.5);

    const asteroidGroupC558 = new THREE.Group();
    const asteroidMeshC558 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC558,asteroidGroupC558,88.8,-.41,-228,.27);

    const asteroidGroupC559 = new THREE.Group();
    const asteroidMeshC559 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC559,asteroidGroupC559,95,0,-208,.7);

    const asteroidGroupC560 = new THREE.Group();
    const asteroidMeshC560 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC560,asteroidGroupC560,106,.31,-238,.67);

    const asteroidGroupC561 = new THREE.Group();
    const asteroidMeshC561 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC561,asteroidGroupC561,112,0,-190,.73);

    const asteroidGroupC562 = new THREE.Group();
    const asteroidMeshC562 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC562,asteroidGroupC562,75,-.31,-212,.37);  

    const asteroidGroupC563 = new THREE.Group();
    const asteroidMeshC563 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC563,asteroidGroupC563,111,.31,-215,.47);

    const asteroidGroupC564 = new THREE.Group();
    const asteroidMeshC564 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC564,asteroidGroupC564,62,-.31,-231,.27);

    const asteroidGroupC565 = new THREE.Group();
    const asteroidMeshC565 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC565,asteroidGroupC565,75,.31,-215,.37);

    const asteroidGroupC566 = new THREE.Group();
    const asteroidMeshC566 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC566,asteroidGroupC566,92,0,-197,.71);

    const asteroidGroupC567 = new THREE.Group();
    const asteroidMeshC567 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC567,asteroidGroupC567,151,0,-205,.65);

    const asteroidGroupC568 = new THREE.Group();
    const asteroidMeshC568 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC568,asteroidGroupC568,58,-.31,-235,.27);

    const asteroidGroupC569 = new THREE.Group();
    const asteroidMeshC569 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC569,asteroidGroupC569,79,.41,-198,.37);

    const asteroidGroupC570 = new THREE.Group();
    const asteroidMeshC570 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC570,asteroidGroupC570,72,-.41,-217,.27);

    const asteroidGroupC571 = new THREE.Group();
    const asteroidMeshC571 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC571,asteroidGroupC571,102,0,-182,.52);

    const asteroidGroupC572 = new THREE.Group();
    const asteroidMeshC572 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC572,asteroidGroupC572,88,.2,-230,.75);  

    const asteroidGroupC573 = new THREE.Group();
    const asteroidMeshC573 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC573,asteroidGroupC573,104,-.21,-188,.47);

    const asteroidGroupC574 = new THREE.Group();
    const asteroidMeshC574 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC574,asteroidGroupC574,78,.37,-192,.27);

    const asteroidGroupC575 = new THREE.Group();
    const asteroidMeshC575 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC575,asteroidGroupC575,95,-.31,-181,.37);

    const asteroidGroupC576 = new THREE.Group();
    const asteroidMeshC576 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC576,asteroidGroupC576,114,0,-210,.43);

    const asteroidGroupC577 = new THREE.Group();
    const asteroidMeshC577 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC577,asteroidGroupC577,93,-.7,-185,.27);

    const asteroidGroupC578 = new THREE.Group();
    const asteroidMeshC578 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC578,asteroidGroupC578,70,0,-203,.47);

    const asteroidGroupC579 = new THREE.Group();
    const asteroidMeshC579 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC579,asteroidGroupC579,120,.5,-181.8,.27);

    const asteroidGroupC580 = new THREE.Group();
    const asteroidMeshC580 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC580,asteroidGroupC580,65,-.6,-206,.37);

    const asteroidGroupC581 = new THREE.Group();
    const asteroidMeshC581 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC581,asteroidGroupC581,89,.6,-220,.42);

    const asteroidGroupC582 = new THREE.Group();
    const asteroidMeshC582 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC582,asteroidGroupC582,62,0,-203,.5);  

    const asteroidGroupC583 = new THREE.Group();
    const asteroidMeshC583 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC583,asteroidGroupC583,82,.6,-218,.17);

    const asteroidGroupC584 = new THREE.Group();
    const asteroidMeshC584 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC584,asteroidGroupC584,9,.6,-206,.27);

    const asteroidGroupC585 = new THREE.Group();
    const asteroidMeshC585 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC585,asteroidGroupC585,75,.6,-223,.17);

    const asteroidGroupC586 = new THREE.Group();
    const asteroidMeshC586 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC586,asteroidGroupC586,133,0,-210,.67);

    const asteroidGroupC587 = new THREE.Group();
    const asteroidMeshC587 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC587,asteroidGroupC587,70,.6,-225,.5);

    const asteroidGroupC588 = new THREE.Group();
    const asteroidMeshC588 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC588,asteroidGroupC588,78,-.6,-203,.47);

    const asteroidGroupC589 = new THREE.Group();
    const asteroidMeshC589 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC589,asteroidGroupC589,59,.6,-218,.27);

    const asteroidGroupC590 = new THREE.Group();
    const asteroidMeshC590 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC590,asteroidGroupC590,100,.3,-191,.27);

    const asteroidGroupC591 = new THREE.Group();
    const asteroidMeshC591 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC591,asteroidGroupC591,120,.31,-218,.7);

    const asteroidGroupC592 = new THREE.Group();
    const asteroidMeshC592 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC592,asteroidGroupC592,95,.42,-188,.41);  

    const asteroidGroupC593 = new THREE.Group();
    const asteroidMeshC593 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC593,asteroidGroupC593,68,.37,-208,.27);

    const asteroidGroupC594 = new THREE.Group();
    const asteroidMeshC594 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC594,asteroidGroupC594,90,-.4,-188,.47);

    const asteroidGroupC595 = new THREE.Group();
    const asteroidMeshC595 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC595,asteroidGroupC595,86,.5,-209,.37);

    const asteroidGroupC596 = new THREE.Group();
    const asteroidMeshC596 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC596,asteroidGroupC596,90,-.6,-194,.4);

    const asteroidGroupC597 = new THREE.Group();
    const asteroidMeshC597 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC597,asteroidGroupC597,109.2,0,-200,.3);

    const asteroidGroupC598 = new THREE.Group();
    const asteroidMeshC598 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC598,asteroidGroupC598,104,0,-192,.37);

    const asteroidGroupC599 = new THREE.Group();
    const asteroidMeshC599 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC599,asteroidGroupC599,68,.49,-212,.37);

    const asteroidGroupC600 = new THREE.Group();
    const asteroidMeshC600 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC600,asteroidGroupC600,88,.4,-196,.47);

    const asteroidGroupC601 = new THREE.Group();
    const asteroidMeshC601 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC601,asteroidGroupC601,66,.4,-217,.37);

    const asteroidGroupC602 = new THREE.Group();
    const asteroidMeshC602 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC602,asteroidGroupC602,98,.32,-194,.38);  

    const asteroidGroupC603 = new THREE.Group();
    const asteroidMeshC603 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC603,asteroidGroupC603,78,.38,-209,.27);

    const asteroidGroupC604 = new THREE.Group();
    const asteroidMeshC604 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC604,asteroidGroupC604,84.5,0,-190,.53);

    const asteroidGroupC605 = new THREE.Group();
    const asteroidMeshC605 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC605,asteroidGroupC605,58,0,-235,.37);

    const asteroidGroupC606 = new THREE.Group();
    const asteroidMeshC606 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC606,asteroidGroupC606,74,0,-200,.32);

    const asteroidGroupC607 = new THREE.Group();
    const asteroidMeshC607 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC607,asteroidGroupC607,78,0,-225,.35);

    const asteroidGroupC608 = new THREE.Group();
    const asteroidMeshC608 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC608,asteroidGroupC608,82,0,-215,.3);

    const asteroidGroupC609 = new THREE.Group();
    const asteroidMeshC609 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC609,asteroidGroupC609,76,0,-221,.3);

    const asteroidGroupC610 = new THREE.Group();
    const asteroidMeshC610 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC610,asteroidGroupC610,97,0,-216,.3);

    const asteroidGroupC611 = new THREE.Group();
    const asteroidMeshC611 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC611,asteroidGroupC611,68,0,-220,.25);

    const asteroidGroupC612 = new THREE.Group();
    const asteroidMeshC612 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC612,asteroidGroupC612,99,0,-210,.3);

    const asteroidGroupC613 = new THREE.Group();
    const asteroidMeshC613 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC613,asteroidGroupC613,68,0,-218,.37);

    const asteroidGroupC614 = new THREE.Group();
    const asteroidMeshC614 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC614,asteroidGroupC614,92,0,-206,.37);

    const asteroidGroupC615 = new THREE.Group();
    const asteroidMeshC615 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC615,asteroidGroupC615,58,0,-235,.5);

    const asteroidGroupC616 = new THREE.Group();
    const asteroidMeshC616 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC616,asteroidGroupC616,83,.2,-202,.32);

    const asteroidGroupC617 = new THREE.Group();
    const asteroidMeshC617 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC617,asteroidGroupC617,68,.2,-250,.65);

    const asteroidGroupC618 = new THREE.Group();
    const asteroidMeshC618 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC618,asteroidGroupC618,118,.2,-223,.37);

    const asteroidGroupC619 = new THREE.Group();
    const asteroidMeshC619 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC619,asteroidGroupC619,58,.2,-222,.27);

    const asteroidGroupC620 = new THREE.Group();
    const asteroidMeshC620 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC620,asteroidGroupC620,106,0,-208,.3);

    const asteroidGroupC621 = new THREE.Group();
    const asteroidMeshC621 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC621,asteroidGroupC621,71,0,-238,.3);       

    const asteroidGroupC622 = new THREE.Group();
    const asteroidMeshC622 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC622,asteroidGroupC622,79,.51,-239,.39);  

    const asteroidGroupC623 = new THREE.Group();
    const asteroidMeshC623 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC623,asteroidGroupC623,97,-.6,-218,.27);

    const asteroidGroupC624 = new THREE.Group();
    const asteroidMeshC624 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC624,asteroidGroupC624,73,.61,-212,.2);

    const asteroidGroupC625 = new THREE.Group();
    const asteroidMeshC625 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC625,asteroidGroupC625,95,1,-230.5,.17);

    const asteroidGroupC626 = new THREE.Group();
    const asteroidMeshC626 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC626,asteroidGroupC626,90,0,-214.5,.3);

    const asteroidGroupC627 = new THREE.Group();
    const asteroidMeshC627 = new THREE.Mesh(asteroidGeometry,asteroidTexture);
    createAsteroid(this._scene,asteroidMeshC627,asteroidGroupC627,87,-.6,-225,.5);
    
    function createAsteroid(scene,mesh,group,x,y,z,scale) { 
        mesh.position.set(x,y,z);
        mesh.scale.setScalar(scale)
        group.add(mesh);
        scene.add(group);
    }
        



        window.addEventListener('resize',onWindowResize);

        function onWindowResize() {
            camera.aspect = window.innerWidth/window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth,window.innerHeight);
        }
    }   
    
    
    add(obj) {
      this._saturnGroup.add(obj);
    }
    start() {
      this._animate();
    }
    _animate() {
        requestAnimationFrame(this._animate);
        this._renderer.render(this._scene, this._camera);

        //Planets
        this._sun.rotation.y += .01;
        this._mercuryGroup.rotation.y += .075;
        this._mercury.rotation.y += .008;
        this._venusGroup.rotation.y += .035;
        this._venus.rotation.y += .060;        
        this._earthGroup.rotation.y += .01;
        this._earth.rotation.y += .04;
        this._cloudGroup.rotation.y += .1;
        this._moonGroup.rotation.y -= .00075;
        this._marsGroup.rotation.y += .0075;
        this._mars.rotation.y += .3;
        this._jupiterGroup.rotation.y += .007;
        this._jupiter.rotation.y += .02;
        this._ioGroup.rotation.y += .12;
        this._europaGroup.rotation.y += .05;
        this._ganymedeGroup.rotation.y += .045;
        this._callistoGroup.rotation.y += .025;
        this._saturnGroup.rotation.y += .005;
        this._uranusGroup.rotation.y += .0035;
        this._uranus.rotation.y += .015;
        this._neptuneGroup.rotation.y += .003;
        this._neptune.rotation.y += .015;

        //Asteroids
        

        
      
    }
}
createRings();
