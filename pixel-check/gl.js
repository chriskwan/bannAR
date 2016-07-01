document.addEventListener("DOMContentLoaded", function(event) {
  console.log("dsjkflsjflsjdfl")
    var renderer = new THREE.WebGLRenderer({ alpha: true } );
    renderer.setSize( 800, 600 );
    document.getElementById("container").appendChild( renderer.domElement );

    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(
        35,             // Field of view
        800 / 600,      // Aspect ratio
        0.1,            // Near plane
        10000           // Far plane
    );
    camera.position.set( 20, 20, 100 );
    camera.lookAt( scene.position );

    var geometry = new THREE.BoxGeometry( 50, 10, 2 );
    var material = new THREE.MeshLambertMaterial( { color: 0xFF0000 } );
    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    var light = new THREE.PointLight( 0xFFFF00 );
    light.position.set( 10, 0, 10 );
    scene.add( light );

    // renderer.setClearColor( 0xdddddd, 1);
    renderer.setClearColor( 0x000000, 0 ); // the default
    renderer.render( scene, camera );
});
