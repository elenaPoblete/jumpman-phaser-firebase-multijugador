const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [SceneA, SceneB, SceneC, SceneNombre]
};
var game = new Phaser.Game(config);

var usuario = 'Desconocido';

//document.getElementById('img-show-password').addEventListener('click', showPassword);

$(function(){
    $("#img-show-password").on("click",() => {
        showPassword()
    })
})


function showPassword(){
    let img = $('#img-show-password');
    let chk = $('#chk-show-password');
    let pwd = $('#txt-password');
    if(chk.prop("checked")){
        img.attr("src",'assets/eye-off.png');
        chk.prop("checked", false);
        pwd.attr("type", "password");
    }else{
        img.attr("src",'assets/eye-on.png');
        chk.prop("checked", true);
        pwd.attr("type", "text");
    }
}