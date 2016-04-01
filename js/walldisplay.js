/* 
 * Manage wall posts
 */


var WallDisplay = window.WallDisplay || {};

WallDisplay.Client = {
    container : ".wallcontent",
    templates:{
        default :'<div id="{_id}" class="message media well mix col-md-6 col-md-offset-3 newbrick _noimage_">\
                <div class="media-body">\
                    <div class="media-heading">\
                        <figure class="pull-left media-object">\
                            <img src="{AVATAR}" width="64" height="64" alt="" class="avatar img-thumbnail">\
                        </figure>\
                        <cite>\
                            <small class="text-muted">\
                                <span class="screen_name">@{USER}</span>\
                                <time class="time pull-right" data-time="{CREATEDAT}">{AGO}</time>\
                            </small>\
                            <br>\
                            <span class="name">{USER}</span>\
                        </cite>\
                    </div>\
                    <div style="text-align:center;" class="text lead"><q style="text-align:left;float: left;">{TEXT}</q></div>\
                </div>\
                <div class="messagewrap" style="display:none;">\
                    <div class="postimage" data-imageurl="{IMG}"></div>\
                </div>\
            </div>',
        walle:'\
            <li id="{_id}" class="message _noimage_">\
                <header id="top-area" class="row media-heading">\
                    <figure id="profile-photo" class="left media-object">\
                            <img class="avatar" src="{AVATAR}" alt="">\
                    </figure>\
                    <hgroup id="profile-details" class="left">\
                        <h1 class="screen_name">{USER}</h1>\
                        <a href="#" class="name">@{USER}</a>\
                    </hgroup>\
                </header>\
                <article id="tweet" class="row text">\
                    <time class="left">\
                        <i class="fa fa-twitter"></i>\
                        <span class="time" data-time="{CREATEDAT}">{AGO}</span>\
                    </time>\
                    <p class="text left">\
                    {TEXT}\
                    </p>\
                    <div class="postimage" data-imageurl="{IMG}">\
                    </div>\
                </article>\
            </li>',
        winter:'\
                <li id="{_id}" class="message _noimage_">\
                    <aside id="sidebar">\
                        <figure id="profile-photo" class="left media-object">\
                            <img class="avatar" src="{AVATAR}" alt="">\
                        </figure>\
                        <hgroup id="profile-details" class="left">\
                            <h1 class="screen_name">{USER}</h1>\
                            <a href="#" class="name">@{USER}</a>\
                        </hgroup>\
                        <section class="clear"></section>\
                        <section class="line"></section>\
                        <article id="tweet">\
                            <p class="text left">\
                            {TEXT}\
                            </p>\
                            <div class="postimage" data-imageurl="{IMG}">\
                        </article>\
                        <a href="#" class="icon">\
                            {ICON}\
                        </a>\
                        <time>\
                            <i class="fa fa-clock-o"></i> <span class="time" data-time="{CREATEDAT}">{AGO}</span>\
                        </time>\
                    </aside>\
		</li>',
        horizon:'\
                <li id="{_id}" class="message _noimage_">\
                    <header id="header">\
                        <figure id="profile-photo" class="left media-object">\
                            <img class="avatar" src="{AVATAR}" alt="">\
                        </figure>\
                        <hgroup id="profile-details" class="left">\
                            <h1 class="screen_name">{USER}</h1>\
                            <a href="#" class="name">@{USER}</a>\
                        </hgroup>\
                        <time>\
                            <i class="fa fa-clock-o"></i> <span class="time" data-time="{CREATEDAT}">{AGO}</span>\
                        </time>\
                    </header>\
                    <article id="tweet" class="row text">\
                        <time class="left">\
                            {ICON}\
                        </time>\
                        <p class="left">\
                        {TEXT}\
                        </p>\
                        <div class="postimage" data-imageurl="{IMG}">\
                    </article>\
		</li>',
        columns: '\
                <li class="fresh" data-bid="{_id}">\
                    <header id="header">\
                        <figure id="profile-photo" class="left media-object">\
                            <img class="avatar" src="{AVATAR}" alt="">\
                        </figure>\
                        <hgroup id="profile-details" class="left">\
                            <h1 class="screen_name">{USER}</h1>\
                            <a href="#" class="name">@{USER}</a>\
                        </hgroup>\
                        <section class="clear"></section>\
                    </header>\
                    <figure id="tweet-media" class="full-image">\
                        <img src="{IMG}">\
                    </figure>\
                    <article id="tweet" class="row text">\
                        <p class="left">\
                        {TEXT}\
                        </p>\
                        <div class="postimage" data-imageurl="{IMG}">\
                    </article>\
                    <time class="left">\
                        <span class="time" data-time="{CREATEDAT}">{AGO}</span>\
                    </time>\
                    <a href="#" class="right icon">\
                        {ICON}\
                    </a>\
		</li>',
        old:'\
            <div id="{id}" class="message media well mix col-md-6 col-md-offset-3">\
                <div class="media-body">\
                    <div class="media-heading">\
                        <figure class="pull-left media-object">\
                            <img src="{user.profile_image_url}" width="64" height="64" alt="" class="avatar img-thumbnail">\
                        </figure>\
                        <cite>\
                            <small class="text-muted">\
                                <span class="screen_name">@{user.screen_name}</span>\
                                <time class="time pull-right" data-time="{created_at}">{created_at}</time>\
                            </small>\
                            <br>\
                            <span style="font-size:160%;" class="name">{user.name}</span>\
                        </cite>\
                    </div>\
                    <div class="text lead" style="font-size:210%;"><q>{text}</q></div>\
                </div>\
                <div class="messagewrap" style="display:none;">\
                    <div class="activemedia">\
                        &nbsp;&nbsp;&nbsp;&nbsp;\
                    </div>\
                </div>\
            </div>\
            ',
            main:'\
                <div id="unique-message-id" class="message">\
                    <img class="avatar" src="/img/avatar.png">\
                    <span class="name">Tweet Fontana</span>\
                    <span class="screen_name">@tweetfontana</span>\
                    <p class="text">This is a fake tweet</p>\
                </div>',
            guide:'\
                <div class="message" data-bid="{_id}">\
                    <img class="avatar" src="{AVATAR}">\
                    <span class="name">{USER}</span>\
                    <span class="screen_name">@{USER}</span>\
                    <p class="text">{TEXT}</p>\
                </div>'
        },
    bricks:[],
    displays: {},
    socket : null,
//    gotany : false,
    config : function(config){
        if (typeof config.room === 'undefined' || typeof config.token === 'undefined') {
            return false;
        }
        if (typeof config.port === 'undefined' ) {
            config.port = "8181";
        }
        if (typeof config.container === 'undefined' ) {
            config.container = ".wallcontent";
        }
        if (typeof config.theme === 'undefined' ) {
            config.theme = "default";
        }
        if (typeof config.template === 'undefined' ) {
            config.template = "default";
        }
        this.wall = config;
    },
    start : function(){
        $('.winter-fade-in  .message').css('border-color',"white");
        var _this = this;
        this.fetchDisplays(function(displays){
            _this.displays = displays;
            _this.displays = displays;
            _this.setContainers();
            _this.setColors();
            _this.openSockets();
            return _this.startEngine(displays);
        });
        
    },
    fetchDisplays : function(callback) {
        $.getJSON("/public/walldisplay/themebase/displays.json").then(function(data){
            callback(data);
        });
    },
    checkDisplays : function (){
        if (this.displays.length > 0){
            computeVariable(myVar);
        } else {
            setTimeout(this.checkDisplays(),100);
        }
    },
    setContainers : function(){
        $("body").prepend(this.displays.modes[this.wall.mode].themes[this.wall.theme].parent);
        $("body").addClass(this.displays.modes[this.wall.mode].themes[this.wall.theme].body);
    },
    setColors : function(){
//        var colorCodes = this.wall.colors.split(',');
//        console.log(colorCodes);
//        $('body').css('background-color',colorCodes[0]);
//        $('.ct-messageBox').css('border-color',colorCodes[1]);
//        $('.ct-messageBox').css('background',colorCodes[2]);
//        $('.ct-messageBox').css('color',colorCodes[3]);
//        $('.ct-screenName').find("").css('color',colorCodes[4]);
        return true;
    },
    openSockets : function(){
        var wallroom = this.wall.room;
        var walltoken = this.wall.token;
        var wallport = this.wall.port;
        this.socket = io('http://159.8.77.198:'+wallport+'/',{secure: true});
        WallDisplay.Client.socket.on('connect', function () {
            WallDisplay.Client.socket.emit('handshakeme',{room:wallroom,token:walltoken});
            console.log("WallDisplay started!" );

        });
        WallDisplay.Client.socket.on('brick', function (brick) {
            WallDisplay.Client.action(brick);
        });
    },
    startEngine : function(displays){
        $('.winter-fade-in  .message').css('border-color',"orange");
        var HTMLWall,container;
        container = $(displays.container);
        HTMLWall = function(settings) {
            visualizer = new Fontana.Visualizer(HTMLWall.datasource,displays);
            return visualizer.start(settings);
        };
        HTMLWall.datasource = new Fontana.datasources.HTML(container);
        HTMLWall.datasource.getMessages();
        return HTMLWall(this.wall);
    },
    action : function(brick){
        console.log(brick.status);
        if(this.bricksCheck(brick._id) && (brick.status === "approved" || brick.status === "done")){
            $(this.container).append(this.bricksShape(brick));
        }
    },
    bricksCheck: function(brickid){
        if(this.bricks.indexOf(brickid) > -1){
            console.log("exist");
            return false;
        }else{
            console.log("new");
            this.bricks.push(brickid);
            return true;
        }
    },
    bricksShape: function(brickdata){
        var brick = {};
        if(brickdata.source === "twitter"){
            brick = {
                bid: brickdata._id,
                cid: brickdata.data.id_str,
                created_at: brickdata.data.created_at,
                text: brickdata.data.text,
                media: "",
                time: "",
                user: {
                    name: brickdata.data.user.name,
                    screen_name: brickdata.data.user.screen_name,
                    profile_image_url: brickdata.data.user.profile_image_url.replace(/_normal/g,"")
                },
                icon:'symbol fa fa-twitter fa-3'
            }
            try {
                if(brickdata.data.entities['media']){
                    brick.media = brickdata.data.entities['media'][0].media_url + ":large";
                    brick.mediasize = brickdata.data.entities['media'][0].sizes.large.w+","+brickdata.data.entities['media'][0].sizes.large.h;
                }
            } catch (e) {  
            }
        } else if (brickdata.source === "instagram") {
            brick = {
                bid: brickdata._id,
                cid: brickdata.data.id,
                created_at: Date(brickdata.data.created_at*1000),
                text: brickdata.data.caption.text,
                media: brickdata.data.images.standard_resolution.url,
                time: "",
                user: {
                    name: brickdata.data.user.username,
                    screen_name: "",
                    profile_image_url: brickdata.data.user.profile_picture
                },
                icon: 'symbol fa-instagram fa-3'
            }
        }
        brickNode = $(nano(this.displays.templates[this.wall.template], brick));
        return brickNode.removeClass().addClass("fresh");
    },
    timeAgo: function(dateString) {
        var rightNow = new Date();
        var then = new Date(dateString);

        var diff = rightNow - then;

        var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;

        if (isNaN(diff) || diff < 0) {
            return ""; // return blank string if unknown
        }
        if (diff < second * 2) {
            // within 2 seconds
            return "right now";
        }
        if (diff < minute) {
            return Math.floor(diff / second) + " seconds ago";
        }
        if (diff < minute * 2) {
            return "about 1 minute ago";
        }
        if (diff < hour) {
            return Math.floor(diff / minute) + " minutes ago";
        }
        if (diff < hour * 2) {
            return "about 1 hour ago";
        }
        if (diff < day) {
            return  Math.floor(diff / hour) + " hours ago";
        }
        if (diff > day && diff < day * 2) {
            return "yesterday";
        }
        if (diff < day * 365) {
            return Math.floor(diff / day) + " days ago";
        }
        else {
            return "over a year ago";
        }
    }
};
        