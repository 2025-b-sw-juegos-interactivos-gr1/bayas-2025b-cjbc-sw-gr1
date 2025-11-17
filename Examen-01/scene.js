(function() {
    window.addEventListener('DOMContentLoaded', function () {
        
        const canvas = document.getElementById("renderCanvas");
        const engine = new BABYLON.Engine(canvas, true);

        
        // Variable de estado
        let paqueteEnMano = false;
        
        // Mapa de teclas
        let inputMap = {};

        const createScene = function () {

            const scene = new BABYLON.Scene(engine);
            const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 10, -15), scene);
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.attachControl(canvas, true);

            // Luz hemisférica
            const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
            
            //suelo con textura de nieve
            const matSuelo = new BABYLON.StandardMaterial("matSuelo", scene);
            matSuelo.diffuseTexture = new BABYLON.Texture('assets/textures/nieve.jpg', scene);
            
            // Crear el suelo
            const suelo = BABYLON.MeshBuilder.CreateGround("suelo", { width: 20, height: 20 }, scene);
            suelo.material = matSuelo;

            let jugador; 
            let paquete;
            let trineo;
            
            function crearRegalo(scene) {
                return BABYLON.SceneLoader.ImportMeshAsync(
                    null, 
                    "assets/models/gift_box/", 
                    "scene.gltf", 
                    scene
                ).then((result) => {
                    const nuevo = result.meshes[0];
                    nuevo.scaling = new BABYLON.Vector3(0.005, 0.005, 0.005);
                    nuevo.position = new BABYLON.Vector3(5, 0.25, 5); // POSICIÓN ORIGINAL
                    nuevo.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
                    return nuevo;
                });
            }

            // Importar el modelo del santa
            BABYLON.SceneLoader.ImportMeshAsync(null, "assets/models/santa/", "scene.gltf", scene)
            .then((result) => {
                const santaRoot = new BABYLON.TransformNode("santaRoot", scene);

                result.meshes.forEach(m => {
                    if (m.parent === null) {
                        m.parent = santaRoot;
                    }
                });

                jugador = santaRoot;
                
                // ESCALA, POSICIÓN Y ROTACIÓN DEL MODELO COMPLETO
                jugador.scaling = new BABYLON.Vector3(2, 2, 2);
                jugador.position = new BABYLON.Vector3(0, 0, 0);
                jugador.rotation = new BABYLON.Vector3(0, Math.PI, 0);

                console.log("Santa está listo y es el jugador");
            })
            .catch((err) => {
                console.error("❌ No se pudo cargar el modelo Santa:", err);
            });

            // Importar el modelo del regalo
            crearRegalo(scene).then(r => {
                paquete = r;
                console.log("Primer regalo listo");
            });


            // Importar el modelo del trineo
            BABYLON.SceneLoader.ImportMeshAsync(null, "assets/models/trineoSolo/", "scene.gltf", scene)
            .then((result) => {
                const meshes = result.meshes;
                if (meshes && meshes.length) {
                    trineo = meshes[0];

                    // Agrandar el trineo
                    trineo.scaling = new BABYLON.Vector3(2.5, 2.5, 2.5);
                    trineo.position = new BABYLON.Vector3(-5, 0.01, -7);
                    // Girarlo hacia el campo del lado derecho (porque mira hacia otro lado por defecto)
                    trineo.rotation = new BABYLON.Vector3(0, Math.PI / 0.5, 0);

                    console.log("✅ trineo ubicado");
                }
            })

            .catch((err) => {
                console.error("❌ No se pudo cargar el modelo Trineo:", err);
            });

            //importar el modelo de la Casa de navidad
            BABYLON.SceneLoader.ImportMeshAsync(null, "assets/models/house/", "scene.gltf", scene)
            .then((result) => {
                const meshes = result.meshes;
                if (meshes && meshes.length) {
                    const house = meshes[0];

                    // Escala para que no se vea gigante
                    house.scaling = new BABYLON.Vector3(0.7, 0.7, 0.7);
                    house.position = new BABYLON.Vector3(7, 0.1, 8);
                    
                    

                    console.log("✅ House ubicado");
                }
            })

            .catch((err) => {
                console.error("❌ No se pudo cargar el modelo House:", err);
            });

            
            scene.actionManager = new BABYLON.ActionManager(scene);

            scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, evt => {
                inputMap[evt.sourceEvent.key.toLowerCase()] = true;
            }));
            scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, evt => {
                inputMap[evt.sourceEvent.key.toLowerCase()] = false;
            }));

            scene.onKeyboardObservable.add(kbInfo => {
                if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN && kbInfo.event.key === " ") {
                    if (!paqueteEnMano) {
                        if (BABYLON.Vector3.Distance(jugador.position, paquete.position) < 2) {
                            paquete.scaling = new BABYLON.Vector3(0.0025, 0.0025, 0.0025);
                            paquete.parent = jugador;
                            paquete.position.set(0.3, 0.7, 0.3);
                            paqueteEnMano = true;
                            console.log("Regalo recogido");

                        }
                    } else {
                        if (BABYLON.Vector3.Distance(jugador.position, trineo.position) < 2) {
                            paquete.parent = null;
                            paquete.position.copyFrom(trineo.position);
                            paquete.scaling = new BABYLON.Vector3(0.005, 0.005, 0.005);
                            paquete.position.y = 1;
                            paqueteEnMano = false;

                            crearRegalo(scene).then(r => {
                                paquete = r;
                                console.log("Nuevo regalo listo");
                            });
                            
                            // Incrementar el contador de regalos colocados
                            window.incrementarRegalosColocados();
                        }
                    }
                }
            });

            const velocidad = 0.15;
            scene.onBeforeRenderObservable.add(() => {
                if (inputMap["w"]) {
                    jugador.position.z += velocidad;
                    jugador.rotation.y = 0;
                }
                
                if (inputMap["s"]){ 
                    jugador.position.z -= velocidad;
                    jugador.rotation.y = Math.PI;
                }
                if (inputMap["a"]) {
                    jugador.position.x -= velocidad;
                    jugador.rotation.y = -Math.PI / 2;
                }

                if (inputMap["d"]) {
                    jugador.position.x += velocidad;
                    jugador.rotation.y = Math.PI / 2;
                }

                if (inputMap["w"] && inputMap["a"]) {
                    jugador.rotation.y = -Math.PI / 4;
                }

                if (inputMap["w"] && inputMap["d"]) {
                    jugador.rotation.y = Math.PI / 4;
                }

                if (inputMap["s"] && inputMap["a"]) {
                    jugador.rotation.y = -3 * Math.PI / 4;
                }

                if (inputMap["s"] && inputMap["d"]) {
                    jugador.rotation.y = 3 * Math.PI / 4;
                }

            });

            return scene;

        };

        const scene = createScene();
        engine.runRenderLoop(() => scene.render());
        window.addEventListener("resize", () => engine.resize());


    });

})();