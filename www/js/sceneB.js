var platforms = null;
var score = 0;
var scoreText = '';
var player;
var cursors;
var stars;
var bombs;

class SceneB extends Phaser.Scene{
    userText;

    constructor(){
        super({key: 'SceneB'});
    }
    
    //Se ejecutará antes de que el juego cargue. Es un buen lugar para importar aquellos archivos que usemos en éste.
    preload () {
        this.load.image('sky', 'assets/sky.png');
        // el suelo es una imagen de 400x32 px
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 
            'assets/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.image('btn-game-over', 'assets/gameover2.png');
    }
    
    //Se ejecutará al momento de que el juego inicie. Es un buen lugar para ingresar todos los objetos que se mostrarán en pantalla.
    create () {   
        
        this.add.image(400, 300, 'sky');
        platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody(); // añadimos la plataforma de más abajo, duplicamos sus dimensiones y actualizamos. Después de redimensionar será una imagen de 800x64px
        // luego añadimos otras plataformas en pantalla
        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
    
        /*
        // añadimos el sprite
        star = this.physics.add.sprite(400, 450, 'star');
        // fijamos un rebote y limitamos al mundo visible
        star.setBounce(0.2);
        star.setCollideWorldBounds(true);
        // fijamos su gravedad
        star.body.setGravityY(300);
        // evitamos que traspase las plataformas
        //this.physics.add.collider(star, platforms);
        */
       
        player = this.physics.add.sprite(100, 450, 'dude');
    
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        // fijamos su gravedad
        player.body.setGravityY(300);
    
        this.physics.add.collider(player, platforms);
    
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),  //Se mostrarán los fotogramas del 0 al 3
            frameRate: 10,
            repeat: -1  //La animación debe repetirse
        });
    
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],  //Se muestra el fotograma 4
            frameRate: 20
        });
    
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),  //Se mostrarán los fotogramas del 5 al 8
            frameRate: 10,
            repeat: -1  //La animación debe repetirse
        });
    
        cursors = this.input.keyboard.createCursorKeys();
    
        //Agregando las estrellas
        stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        stars.children.iterate(function (child) {
        
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        
        });
    
        this.physics.add.collider(stars, platforms);
    
        this.physics.add.overlap(player, stars, collectStar, null, this);
        
        function collectStar (player, star)
        {
            star.disableBody(true, true);
    
            //Actualizando el puntaje del personaje
            score += 10;
            scoreText.setText('Score: ' + score);
    
            if (stars.countActive(true) === 0)
            {
                stars.children.iterate(function (child) {
    
                    child.enableBody(true, child.x, 0, true, true);
    
                });
    
                var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
    
                var bomb = bombs.create(x, 16, 'bomb');
                bomb.setBounce(1);
                bomb.setCollideWorldBounds(true);
                bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            }
        }
    
        //Configurando el cuadro de texto del puntaje
        scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        console.log(usuario)
        this.userText = this.add.text(game.config.width / 2, 16, usuario.displayName.padStart(20), { fontSize: '32px', fill: '#000' });
    
        bombs = this.physics.add.group();
    
        this.physics.add.collider(bombs, platforms);
    
        this.physics.add.collider(player, bombs, hitBomb, null, this);
    
    
    
        function hitBomb (player, bomb)
        {
            this.physics.pause();
            player.setTint(0xff0000);
            player.anims.play('turn');
            
            //Agregando el botón de reiniciar una vez el juego haya terminado
            const button = this.add.sprite( (game.config.width / 2) - 53, game.config.height / 2, 'btn-game-over')
            setTimeout(async ()=>{
                await firebase.database().ref('jumpman/' + usuario.displayName).set({
                    puntaje: score,
                }).catch(error => {
                    console.log(error);
                    alert('No pudimos registrar tu puntaje. Lo sentimos.');
                });
                this.scene.start("SceneC");
                this.scene.bringToTop("SceneC");
            },3000);
            /*
            .setInteractive()
            .on('pointerdown', async () => 
                {
                    await firebase.database().ref('jumpman/' + usuario.displayName).set({
                        puntaje: score,
                    }).catch(error => {
                        console.log(error);
                        alert('No pudimos registrar tu puntaje. Lo sentimos.');
                    });
                    this.scene.start("SceneC");
                    this.scene.bringToTop("SceneC");
                }
            );
            */
        }
        
    }
    
    //Se ejecutará periódicamente . Es un buen lugar para revisar eventos como la colisión entre objetos del juego.
    update () {
        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);
    
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);
    
            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);
    
            player.anims.play('turn');
        }
    
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-480);  //Configurando la altura del salto
        }
    }
}
