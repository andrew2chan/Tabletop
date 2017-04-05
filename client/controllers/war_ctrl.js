var app = angular.module('views');

app.controller('warCardGameController', function($scope) {
  var initScene = function() {
    var scene, camera, renderer;
    var geometry, material, mesh, table, cards = [], card, cardback;
    var loadingScreen = {
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000),
    };

    var loadedResources = false;
    var loadingManager = null;

    init();
    animate();

    function init() {

    	scene = new THREE.Scene();
      var x = xPiece();
      var o = oPiece();
      loadingScreen.x = x;
      loadingScreen.o = o;

    	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
      camera.position.y = 1000;
    	camera.position.z = 1500;
      camera.lookAt(new THREE.Vector3(0,0,0));

      loadingScreen.camera.position.z = 5;
      loadingScreen.x.position.set(-1,0,0);
      loadingScreen.o.position.set(1,0,0);
      loadingScreen.scene.add(loadingScreen.x);
      loadingScreen.scene.add(loadingScreen.o);

      loadingManager = new THREE.LoadingManager();

      var loader = new THREE.TextureLoader(loadingManager);

      loadingManager.onLoad = function() {
        loadedResources = true;
      }

      loader.load('images/wood4.png', function ( texture ) {
        geometry = new THREE.BoxGeometry( 2000, 50, 2000 );
        material = new THREE.MeshBasicMaterial( { map: texture } );

        table = new THREE.Mesh( geometry, material );
        table.position.y = -200;
        scene.add( table );
      });

      createCards();

    	renderer = new THREE.WebGLRenderer();
    	renderer.setSize( window.innerWidth, window.innerHeight );

    	document.getElementById("war").appendChild( renderer.domElement );

    }

    function createCards() {
      var i = 0;
      var loader = new THREE.TextureLoader(loadingManager);

      var nextCard = 0;
      var heightIncrements = 0;

      loader.load('images/cardback.png', function ( cardBack ) {
        cardback = new THREE.MeshBasicMaterial( { map: cardBack } );
        for (i = 0; i < 52; i++) {
          nextCard = i+1;
            loader.load('images/' + nextCard + '.png', function ( face ) {
              material = new THREE.MeshBasicMaterial( { map: face } );
              var materials = [
                new THREE.MeshBasicMaterial( { color: 0xffffff } ), // right
                new THREE.MeshBasicMaterial( { color: 0xffffff } ), // left
                cardback, // top
                material, // bottom
                new THREE.MeshBasicMaterial( { color: 0xffffff } ), // back
                new THREE.MeshBasicMaterial( { color: 0xffffff } )  // front
              ]

              var cubeSidesMaterial = new THREE.MultiMaterial( materials );
              var cubeGeometry = new THREE.BoxBufferGeometry( 300, 5, 400, 1, 1, 1 );
              var newCard = new THREE.Mesh( cubeGeometry, cubeSidesMaterial );
              newCard.position.y = heightIncrements;
              heightIncrements += 10;
              cards.push(newCard);
              scene.add(newCard);
            }); // end card loads
        }
      }); //end cardback load

    }

    function xPiece() {
      var group = new THREE.Group();
      var geometry2 = new THREE.BoxGeometry( 0.25, 1, 0.1 );
      var material2 = new THREE.MeshBasicMaterial( { color: 0xffffff } );

      var xproto1 = new THREE.Mesh( geometry2, material2 );
      group.add( xproto1 );
      var xproto2 = new THREE.Mesh( geometry2, material2 );
      group.add( xproto2 );
      xproto1.rotation.z = 180;
      xproto2.rotation.z = -180;
      return group;
    }

    function oPiece() {
      var geometry2 = new THREE.RingGeometry( 0.25, 0.5, 32 );
      var material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
      var mesh2 = new THREE.Mesh( geometry2, material2 );
      return mesh2;
    }

    function animate() {

      if(!loadedResources) {
        requestAnimationFrame( animate );

        loadingScreen.x.rotation.y += 0.05;
        loadingScreen.o.rotation.x += 0.05;
        loadingScreen.x.position.y = Math.sin(loadingScreen.x.rotation.y);
        loadingScreen.o.position.y = -Math.sin(loadingScreen.x.rotation.y);

        renderer.render( loadingScreen.scene, loadingScreen.camera );
        return;
      }

    	requestAnimationFrame( animate );

    	renderer.render( scene, camera );

    }
  }

  window.onload = initScene();
});