var scoreText = '';
var textTop = 110;

class SceneC extends Phaser.Scene{
    puntajes;
    totJugadores;
    database;
    
    
    constructor(){
        super({key: 'SceneC'});
    }

    preload(){
        

    }

    create(){
        this.database = firebase.database().ref('jumpman');
        this.database.on('value', (snapshot) => {
            let data = snapshot.val();
            this.puntajes = Object.entries(data).sort((a, b) => a[1].puntaje - b[1].puntaje).reverse();
            this.totJugadores = data.length;
            
            scoreText = this.add.text(game.config.width / 8, 10, `          RANKING         `, { fontSize: '32px', fill: '#999' });
            scoreText = this.add.text(game.config.width / 8, 60, `Lugar       ${"Nombre".padEnd(10)}    Puntos`, { fontSize: '32px', fill: '#999' });
            for(var p=0; p < this.puntajes.length; p++){
                scoreText = this.add.text(game.config.width / 8, textTop, `${p + 1}°       ${(this.puntajes[p][0]).padEnd(16)}   ${this.puntajes[p][1].puntaje}`, { fontSize: '32px', fill: '#999' });
                textTop += 50;
            }

          });
    }

    update(time, delta){

    }
}