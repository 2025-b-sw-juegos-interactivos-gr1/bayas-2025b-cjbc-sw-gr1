// src/scene.js
// Ejemplo adaptado para cargar texturas locales desde ./assets/textures/

(function () {
  // Esperar a que cargue el DOM
  window.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function () {
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color3(0.4, 0.7, 1);

      // Cámara
      const camera = new BABYLON.ArcRotateCamera('camera1', Math.PI / 2, Math.PI / 3, 60, BABYLON.Vector3.Zero(), scene);
      camera.attachControl(canvas, true);

      // Luces
      const hemiLight = new BABYLON.HemisphericLight('hemiLight', new BABYLON.Vector3(0, 1, 0), scene);
      hemiLight.intensity = 0.8;
      hemiLight.diffuse = new BABYLON.Color3(1, 1, 1);
      hemiLight.groundColor = new BABYLON.Color3(0.1, 0.1, 0.1);

      const dirLight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-1, -2, -1), scene);
      dirLight.intensity = 0.7;

      const pointLight = new BABYLON.PointLight('pointLight', new BABYLON.Vector3(0, 10, 0), scene);
      pointLight.intensity = 0.6;

      const spotLight = new BABYLON.SpotLight('spotLight', new BABYLON.Vector3(0, 20, 0), new BABYLON.Vector3(0, -1, 0), Math.PI / 3, 2, scene);
      spotLight.intensity = 0.9;

      // Nota: coloca tus texturas en ./assets/textures/
      // Piso (césped)
      const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 50, height: 30 }, scene);
      const grassMat = new BABYLON.StandardMaterial('grassMat', scene);
      grassMat.diffuseTexture = new BABYLON.Texture('assets/textures/linesGrass.webp', scene);
      grassMat.diffuseTexture.uScale = 1;
      grassMat.diffuseTexture.vScale = 1;
      grassMat.diffuseTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
      grassMat.diffuseTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
      ground.material = grassMat;

      // Césped (plano con líneas) — textura con alpha
      const fieldLines = BABYLON.MeshBuilder.CreateGround('lines', { width: 50, height: 30 }, scene);
      const lineMat = new BABYLON.StandardMaterial('lineMat', scene);
      lineMat.diffuseTexture = new BABYLON.Texture('assets/textures/lines.svg', scene);
      lineMat.diffuseTexture.hasAlpha = true;
      fieldLines.material = lineMat;

      // Porterías (usando cubos)
      const goalMaterial = new BABYLON.StandardMaterial('goalMat', scene);
      goalMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);

      function createGoal(x) {
        const postLeft = BABYLON.MeshBuilder.CreateBox('postLeft', { height: 3, width: 0.2, depth: 0.2 }, scene);
        postLeft.position = new BABYLON.Vector3(x, 1.5, -5);
        postLeft.material = goalMaterial;

        const postRight = postLeft.clone('postRight');
        postRight.position.z = 5;

        const crossbar = BABYLON.MeshBuilder.CreateBox('crossbar', { height: 0.2, width: 0.2, depth: 10.2 }, scene);
        crossbar.position = new BABYLON.Vector3(x, 3, 0);
        crossbar.material = goalMaterial;
      }

      createGoal(25);
      createGoal(-25);

      /*
// Importar el modelo del Yeti
BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/models/", "Yeti.gltf", scene)
.then((result) => {
    const meshes = result.meshes;
    if (meshes && meshes.length) {
        const yeti = meshes[0];

        // Escala para que no se vea gigante
        yeti.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);

        // Posición en la portería derecha (x=25)
        yeti.position = new BABYLON.Vector3(24, 0, 0);

        // Girarlo hacia el campo (porque mira hacia otro lado por defecto izquierda)
        yeti.rotation = new BABYLON.Vector3(0, Math.PI / 1, 0);

        console.log("✅ Yeti ubicado en la portería derecha");
    }
})
.catch((err) => {
    console.error("❌ No se pudo cargar el modelo Yeti:", err);
});*/

    // Importar el modelo del Yeti
    BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/models/", "Yeti.gltf", scene)
    .then((result) => {
        const meshes = result.meshes;
        if (meshes && meshes.length) {
            const yeti = meshes[0];

            // Escala para que no se vea gigante
            yeti.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
            // Posición en la portería derecha (x=-25)
            yeti.position = new BABYLON.Vector3(-22, 0, 0);
            // Girarlo hacia el campo del lado derecho (porque mira hacia otro lado por defecto)
            yeti.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);

            console.log("✅ Yeti ubicado en la portería derecha");
        }
    })


    .catch((err) => {
        console.error("❌ No se pudo cargar el modelo Yeti:", err);
    });


      // Jugadores (esferas sobre cilindros)
      const playerMaterial1 = new BABYLON.StandardMaterial('team1', scene);
      playerMaterial1.diffuseColor = new BABYLON.Color3(0, 0, 0); // negro

      const playerMaterial2 = new BABYLON.StandardMaterial('team2', scene);
      playerMaterial2.diffuseColor = new BABYLON.Color3(1, 1, 1); // blanco

      function createPlayer(x, z, team) {
        const body = BABYLON.MeshBuilder.CreateCylinder('body', { diameterTop: 1, diameterBottom: 1, height: 2 }, scene);
        const head = BABYLON.MeshBuilder.CreateSphere('head', { diameter: 1 }, scene);
        head.position.y = 1.5;

        const player = BABYLON.Mesh.MergeMeshes([body, head], true, false, null, false, true);
        player.position = new BABYLON.Vector3(x, 1, z);
        player.material = (team === 1) ? playerMaterial1 : playerMaterial2;
        return player;
      }

      for (let i = 0; i < 7; i++) {
        createPlayer(-10 + i * 3, -8, 1);
        createPlayer(-10 + i * 3, 8, 2);
      }

      // Balón
      const ball = BABYLON.MeshBuilder.CreateSphere('ball', { diameter: 1 }, scene);
      ball.position.y = 0.5;
      const ballMat = new BABYLON.StandardMaterial('ballMat', scene);
  ballMat.diffuseTexture = new BABYLON.Texture('assets/textures/ball.svg', scene);
      ball.material = ballMat;

      // Tribunas
      const standMat = new BABYLON.StandardMaterial('standMat', scene);
  standMat.diffuseTexture = new BABYLON.Texture('assets/textures/stand.svg', scene);

      const stand1 = BABYLON.MeshBuilder.CreateBox('stand1', { width: 50, height: 5, depth: 3 }, scene);
      stand1.position = new BABYLON.Vector3(0, 2.5, -16);
      stand1.material = standMat;

      const stand2 = stand1.clone('stand2');
      stand2.position.z = 16;

      return scene;
    };

    const scene = createScene();

    engine.runRenderLoop(function () {
      scene.render();
    });

    window.addEventListener('resize', function () {
      engine.resize();
    });
  });
})();
