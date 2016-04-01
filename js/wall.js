/* 
 * WallDisplay wall server js
 */


/* global socket */

function WallDisplay(config) // Constructor
{
    if (typeof config.room === 'undefined' || typeof config.token === 'undefined') {
        return false;
    }
    if (typeof config.port === 'undefined' ) {
        config.port = "8181";
    }
    if (typeof config.facadeobj === 'undefined' ) {
        config.facadeobj = "wtwall";
    }
    if (typeof config.container === 'undefined' ) {
        config.container = ".wallcontent";
    }
    if (typeof config.transition === 'undefined' ) {
        config.transition = "hinge";
    }
    if (typeof config.mode === 'undefined' ) {
        config.mode = "onebyone";
    }
    this.wall = config;
    return this.start();
}


WallDisplay.prototype.start = function(){
    var wallroom = this.wall.room;
    var walltoken = this.wall.token;
    var ui_mode = this.wall.mode;
    var ui_transition = this.wall.transition;
    window.wtwall.init(this.wall);
    var socket = io('http://domain:'+this.wall.port+'/');
    socket.on('connect', function () {
        socket.emit('handshakeme',{room:wallroom,token:walltoken});
        socket.on('brick', function (brick) {
            console.log("New brick recieved!");
            window.wtwall.postToWall(brick);
        });
        console.log("WallDisplay started!");
    });
    var HTMLWall,container;
    container = $(this.wall.container);
    HTMLWall = function(settings) {
        visualizer = new Fontana.Visualizer(container, HTMLWall.datasource);
        return visualizer.start(settings);
    };
    HTMLWall.datasource = new Fontana.datasources.HTML(container);
    HTMLWall.datasource.getMessages();
    return HTMLWall({
        mode: ui_mode,
        transition: ui_transition,
        postimage:true
    });
};


