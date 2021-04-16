class SceneNombre extends Phaser.Scene{
    buttonPlay;

    constructor(){
        super({key: 'SceneNombre'})
    }

    preload(){
        this.load.image('bgUserName', 'assets/login.png');
        this.load.image('buttonPlay', 'assets/btn-jugar.png');
    }

    create(){
        this.add.image(400, 300, 'bgUserName');
        document.getElementById('txt-username').style.display = 'block';
        this.buttonPlay = this.add.sprite((game.config.width / 2) - 52.5, game.config.height - 200, 'buttonPlay').setInteractive();
        this.buttonPlay.on('pointerover', function (event) { game.canvas.style.cursor = "pointer"; });
        this.buttonPlay.on('pointerout', function (event) { game.canvas.style.cursor = "default"; });
        this.buttonPlay.on('pointerdown', 
            () => {
                this.actualizarNombre();
            }
        ); 
        
    }

    update(time, delta){

    }

    actualizarNombre(){
        let txtUserName = document.getElementById('txt-username');

        var user = firebase.auth().currentUser;

        user.updateProfile({
        displayName: txtUserName.value,
        }).then(()=> {
            usuario = firebase.auth().currentUser;
            txtUserName.style.display = 'none';
            this.scene.start("SceneB"); 
            this.scene.bringToTop("SceneB");
        }).catch(function(error) {
            alert('Ocurrió un error al intentar registrar tu nombre: ' + error.message + '\nIntentalo nuevamente.');
        });
    }

}