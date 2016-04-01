/* 
 * Manage wall posts
 */

var WallDisplay = window.WallDisplay || {};
var hoverApprove=false;
var hoverDecline=false;

WallDisplay.Server = {
    containerNew : "#newposts",
    containerApproved : "#approvedposts",
    containerDeclined : "#declinedposts",
   // hoverApprove:false,
    hoverDecline:false,
    newPostsHeight:0,
    templateActive : 2,
    template:[
        '<div id="{b_id}" class="postbox">\n\
            <div class="postbox-header">\n\
                <span class="postbox-time">{AGO}</span>\n\
            </div>\n\
            <div class="postbox-body">\n\
                <div class="postbox-avatar">\n\
                    <img src="{AVATAR}" /><br>@{USER}\n\
                </div>\n\
                <div class="postbox-post">\n\
                    <p>{TEXT}</p>\n\
                </div>\n\
                <div class="postbox-postimage"> \n\
                    {IMG}\n\
                </div>\n\
                <div class="clear"></div>\n\
            </div>\n\
            <div class="postbox-footer">\n\
                <div class="actions" style="float:right;">\n\
                    [PostID:{POSTID}]\n\
                    <a id="{_id}" href="#" onClick="wtwall.Show(this.id)" class="btn btn-sm btn-white">\n\
                    <i class="fa fa-edit"></i>&nbsp;Onayla</a>&nbsp;\n\
                    <a id="{_id}" href="#" onClick="wtwall.dontShow(this.id)" class="btn btn-sm btn-white">\n\
                    <i class="fa fa-user"></i>&nbsp;Reddet</a>\n\
                </div>\n\
            </div>\n\
            <div class="clear"></div>\n\
        </div>\n\
        <div class="clear"></div>',
        '<div id="{b_id}" class="col-md-3 mix wallportlet" style="display: inline-block;">\
            <div class="portlet box">\
                <div class="portlet-header">\
                    <a id="{_id}" href="#" onClick="WallDisplay.Server.bricksDecline(this.id)">\
                        <i class="fa fa-times"></i>\
                        Decline\
                    </a>\
                    <a style="float: right;" id="{_id}" href="#" onClick="WallDisplay.Server.bricksApprove(this.id)">\
                        <i class="fa fa-check-square-o"></i>\
                        Approve\
                    </a>\
                </div>\
                <div style="min-height: 180px;" class="portlet-body">\
                    {TEXT}\
                    <div class="post-image"> \
                        {IMG}\
                    </div>\
                </div>\
                <div class="portlet-header">\
                    <img style="float:left;" src="{AVATAR}" />\
                    <span style="float:left;">@{USER}</span>\
                    <span style="float:right;">{AGO}</span>\
                </div>\
            </div>\
        </div>',
        '<div id="{b_id}" class="postbox bordershadow">\
            <div class="postbox-header">\
                <a class="declinebutton" style="color:red;" id="{_id}" href="#" onClick="WallDisplay.Server.bricksDecline(this.id)">\
                    <i class="fa fa-times"></i>\
                    Decline\
                </a>\
                <a class="removebutton" style="color:red;" id="{_id}" href="#" onClick="WallDisplay.Server.bricksRemove(this.id)">\
                    <i class="fa fa-times"></i>\
                    Remove\
                </a>\
                <a class="approvebutton" style="float: right; color:green;" id="{_id}" href="#" onClick="WallDisplay.Server.bricksApprove(this.id)">\
                    <i class="fa fa-check-square-o"></i>\
                    Approve\
                </a>\
            </div>\
            <div class="postbox-body">\
                {TEXT}\
                <div class="postbox-image"> \
                    {IMG}\
                </div>\
            </div>\
            <div class="postbox-footer">\
                <img style="float:left;max-height: 70px;" src="{AVATAR}" />\
                <span style="float:left;">@{USER}</span>\
                <span style="float:right;"> {ICON}&nbsp;</span>\
                <span style="float:right;">&nbsp;{AGO}</span>\
            </div>\
        </div>'
    ],
    bricks:{
        newbricks:[],
        approvedbricks:[],
        declinedbricks:[],
        twitterbricks:[],
        instagrambricks:[]
    },
    socket : null,
    config : function(config){
        if (typeof config.room === 'undefined' || typeof config.token === 'undefined') {
            return false;
        }
        if (typeof config.port === 'undefined' ) {
            config.port = "8080";
        }
        if (typeof config.container === 'undefined' ) {
            config.container = ".wallcontent";
        }
//        console.log(JSON.stringify(config));
        this.wall = config;
        this.statStart();
    },

    start : function(){
        var wallroom = this.wall.room;
        var walltoken = this.wall.token;
        var wallport = this.wall.port;
        this.socket = io('http://159.8.77.198:'+wallport+'/');
        WallDisplay.Server.socket.on('connect', function () {
            WallDisplay.Server.socket.emit('handshakeme',{room:wallroom,token:walltoken});
            console.log("WallDisplay started!");
        });
        WallDisplay.Server.socket.on('brick', function (brick) {
            console.log("New brick recieved! "+brick.wallcode);
            WallDisplay.Server.action(brick);
        });
        WallDisplay.Server.socket.on('brick.pending', function (brick) {
            console.log("Pending brick recieved! "+brick.wallcode);
            WallDisplay.Server.action(brick);
        });
        WallDisplay.Server.socket.on('brick.update', function (updateddata) {
            console.log("Updated brick recieved!");
            console.log(WallDisplay.Server.bricks);
            WallDisplay.Server.actionUpdate(updateddata);
        });
        WallDisplay.Server.socket.on('statistics', function (statdata) {
            WallDisplay.Server.statUpdate(statdata);
        });
    },
    
    action : function(brick){
        if(brick.source === "twitter" && this.bricksCheck("twitterbricks",brick.data.id_str) === false){
            return false;
        }else if(brick.source === "instagram" && this.bricksCheck("instagrambricks",brick.data.id) === false){
            return false;
        }
        if(brick.status === "pending" || brick.status === "waitingforapproval"){
            if(this.bricksCheck("newbricks",brick._id)){
                $(this.containerNew).append(this.bricksShape(brick));
//                $('#newposts').animate({
//                    scrollTop: $("#b_"+brick._id).offset().top + $("#b_"+brick._id)[0]
//                }, 1000);

//-------------//-----AutoScroll
                var AutoscrollChecked = $('#AutoscrollCheckbox').prop('checked') === true;

                $('.approvebutton').mouseover(function () {
//                    console.log("approve in!");
                    hoverApprove = true;

                });
                $('.approvebutton').mouseout(function () {
//                    console.log("approve out!");
                    hoverApprove = false;
                });
                $('.declinebutton').mouseover(function () {
//                    console.log("approve in!");

                    hoverDecline = true;
                });
                $('.declinebutton').mouseout(function () {
//                    console.log("approve out!");
                    hoverDecline = false;
                });


//                console.log("ApproveHover: "+ hoverApprove +" Autocheckbox "+AutoscrollChecked);

                this.newPostsHeight = $('#newposts')[0].scrollHeight;
                if(!hoverApprove){
                    if(AutoscrollChecked){
                        if(!hoverDecline){
                            $('#newposts.portlet-body').animate({scrollTop: this.newPostsHeight}, 1000);
                        }
                     //   $('#newposts.portlet-body').scrollTop(newPostsHeight);
                    }
                        //console.log($('.approvebutton').is(":hover"));
                }
//                console.log(this.newPostsHeight);
//-------------//-----AutoScroll
                
            }
        }else if(brick.status === "approved" || brick.status === "done"){
            if(this.bricksCheck("approvedbricks",brick._id)){
                $(this.containerApproved).append(this.bricksShape(brick));
            }
        }else if(brick.status === "declined"){
            if(this.bricksCheck("declinedbricks",brick._id)){
                $(this.containerDeclined).append(this.bricksShape(brick));
            }
        }else{
            console.log("brick status undefined! brick.status:"+brick.status);
        }
    },
    actionUpdate : function(updateddata){
        var brickstatus =this.bricksCheckStatus(updateddata._id);
        if(updateddata.action !== brickstatus && brickstatus !== false){
            this.bricksCleanID(updateddata._id);
            if(updateddata.action === "approved"){
                this.bricks.approvedbricks.push(updateddata._id);
                $('#b_'+updateddata._id).appendTo(this.containerApproved);
            }else if(updateddata.action === "declined"){
                this.bricks.declinedbricks.push(updateddata._id);
                $('#b_'+updateddata._id).appendTo(this.containerDeclined);
            }
        }
    },
    bricksCheck: function(type,brickid){
        if($.inArray(brickid, this.bricks[type]) === -1){
            this.bricks[type].push(brickid);
            return true;
        }else{
            return false;
        }
    },
    bricksCheckStatus: function(bid){
        var i = this.bricks.newbricks.indexOf(bid);
        if(i > -1){
            return "pending";
        }
        var i = this.bricks.declinedbricks.indexOf(bid);
        if(i > -1){
            return "declined";
        }
        var i = this.bricks.approvedbricks.indexOf(bid);
        if(i > -1){
            return "approved";
        }
        return false;
    },
    bricksCleanID: function(bid){
        var i = this.bricks.newbricks.indexOf(bid);
        if(i > -1){
            this.bricks.newbricks.splice(i,1);
        }
        var i = this.bricks.declinedbricks.indexOf(bid);
        if(i > -1){
            this.bricks.declinedbricks.splice(i,1);
        }
        var i = this.bricks.approvedbricks.indexOf(bid);
        if(i > -1){
            this.bricks.approvedbricks.splice(i,1);
        }
        return true;
    },
    bricksShape: function(brickdata){
        if(brickdata.source === "twitter"){
            var tweet = brickdata.data;
            var img = '';
            var url = 'http://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
            try {
              if (tweet.entities['media']) {
                img = '<a href="' + url + '" target="_blank"><img src="' + tweet.entities['media'][0].media_url + ':small" /></a>';
              }
            } catch (e) {  
              //no media
            }
            return this.template[this.templateActive]
                .replace(/{_id}/g, brickdata._id)
                .replace(/{b_id}/g, "b_"+brickdata._id)
                .replace(/{POSTID}/g, tweet.id_str)
                .replace(/{USER}/g, tweet.user.screen_name)
                .replace(/{AVATAR}/g, tweet.user.profile_image_url)
                .replace(/{TEXT}/g, tweet.text) 
                .replace(/{IMG}/g, img)          
                .replace(/{ICON}/, '<i class="fa fa-twitter fa-3"></i>')
                .replace(/{AGO}/g, this.timeAgo(tweet.created_at))
                .replace(/{URL}/g, url);
        } else if(brickdata.source === "instagram"){
            var insta = brickdata.data;
            var url = 'http://instagram.com/' + insta.user.username;
            var img = '<a href="' + url + '" target="_blank"><img src="' + insta.images.low_resolution.url + '" /></a>';
            return this.template[this.templateActive]
                .replace(/{_id}/g, brickdata._id)
                .replace(/{b_id}/g, "b_"+brickdata._id)
                .replace(/{POSTID}/g, insta.id)
                .replace(/{USER}/g, insta.user.username)
                .replace(/{AVATAR}/g, insta.user.profile_picture)
                .replace(/{TEXT}/g, insta.caption.text) 
                .replace(/{IMG}/, img)                    
                .replace(/{ICON}/, '<i class="fa fa-instagram fa-3"></i>')          
                .replace(/{AGO}/g, this.timeAgo(Date(insta.created_at*1000)))
                .replace(/{URL}/g, url);
                
        } else if(brickdata.source === "facebook"){
            
        }
    },
    timeAgo: function(dateString) {
        var rightNow = new Date();
        var then = new Date(dateString);

        if ($.browser.msie) {
            // IE can't parse these crazy Ruby dates
            then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
        }

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
    },
    statContainer : "#topbar-info",
    statTemplate : '<div class="statistics">\
                        <span>Toplam <a class="statthread"> <span id="" class="stat badge badge-blue">0 </span></a></span>\
                        <a>Bekleyen<a class="statthread"><span id="" class="stat badge badge-orange">0</span></a></a>\
                        <a>Onaylanmamış<a class="statthread"><span id="" class="stat badge badge-green">0</span></a></a>\
                        <a>Onaylanmış<a class="statthread"><span id="" class="stat badge badge-red">0</span></a></a>\
                    </div>',
    statStart : function(){
        $(this.statContainer).append(this.statTemplate);
        $("#stats").css("display","inline-block");
    },
    statUpdate : function(statdata){
        $('#totalposts').text(statdata.total);
        $('#pending').text(statdata.pending);
        $('#waitingforapproval').text(statdata.waitingforapproval);
        $('#approved').text(statdata.approved);
        $('#twitter').text(statdata.twitter);
        $('#instagram').text(statdata.instagram);
    },
    bricksApprove: function(identifier){
        this.bricksCleanID(identifier);
        this.bricks.approvedbricks.push(identifier);
        WallDisplay.Server.socket.emit('postUpdate', {action:"approved",room:this.wall.room,_id:identifier}); 
//        $('#b_'+identifier).remove();
        $('#b_'+identifier).appendTo(this.containerApproved);
    },
    bricksDecline: function(identifier){
        this.bricksCleanID(identifier);
        this.bricks.declinedbricks.push(identifier);
        WallDisplay.Server.socket.emit('postUpdate', {action:"declined",room:this.wall.room,_id:identifier}); 
//        $('#b_'+identifier).remove();
        $('#b_'+identifier).appendTo(this.containerDeclined);
    },
    bricksRemove: function(identifier){
        this.bricksCleanID(identifier);
        WallDisplay.Server.socket.emit('postUpdate', {action:"removed",room:this.wall.room,_id:identifier}); 
        $('#b_'+identifier).remove();
    },
    bricksGetDeclined: function(){
        WallDisplay.Server.socket.emit('postList', {action:"getDeclinedList",room:this.wall.room,count:20}); 
    },
    bricksGetApproved: function(){
        WallDisplay.Server.socket.emit('postList', {action:"getApprovedList",room:this.wall.room,count:20}); 
    }
};
        