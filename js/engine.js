/*
# Fontana Datasources

There are three different types of Datasources:

 * Fontana.datasources.Static
 * Fontana.datasources.HTML
 * Fontana.datasources.TwitterSearch

Each datasource implements a `getMessages` method that takes a callback.
The callback is called with a list of messages in the following format:

``` javascript
{
    'id': 'unique-id',
    'created_at': new Date().toString(),
    'text': 'A fake Tweet, in a fake JSON response',
    'user': {
        'name': 'Tweet Fontana',
        'screen_name': 'tweetfontana',
        'profile_image_url': '/img/avatar.png'
    }
}
```

Note that this is the minimum set of keys, some implementations (most notabily
the Twitter datasource) will provide a richer set of keys.
*/
(function() {
    var _base,
        __indexOf = [].indexOf || function(item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };

    if (this.Fontana == null) {
        this.Fontana = {};
    }

    if ((_base = this.Fontana).datasources == null) {
        _base.datasources = {};
    }

    this.Fontana.datasources.Static = (function() {
        /*
        The Static datasource is constructed with a list of messages.
        * setMessages extendeds the list of messages.
        * getMessages will call a callback with the same list of messages.
        */

        function Static(messages) {
            this.messages = messages != null ? messages : [];
        }

        Static.prototype.setMessages = function(messages) {
            if (this.messages == null) {
                this.messages = [];
            }
            return this.mesages = messages.concat(this.mesages);
        };

        Static.prototype.getMessages = function(callback) {
            var _this = this;
            if (callback) {
                return setTimeout((function() {
                    return callback(_this.messages);
                }), 0);
            }
        };

        return Static;

    })();

    this.Fontana.datasources.HTML = (function() {
        /*
        The HTML datasource should be initialized with a jQuery node.
        * extractMessages returns the messages found in the given node, it
          extracts the content from a specific HTML structure e.g.:
          ```
          <div id="unique-message-id" class="message">
              <img class="avatar" src="/img/avatar.png">
              <span class="name">Tweet Fontana</span>
              <span class="screen_name">@tweetfontana</span>
              <p class="text">This is a fake tweet</p>
          </div>
          ```
          Only the id and class names are important.
        * getMessages uses extractMessages to keep a running list of messages.
          It calls the callback with this list. Repeated calls to getMessages
          will extract new messages from the same node.
        */

        function HTML(container) {
            this.container = container;
            this.messages = [];
        }

        HTML.prototype.extractMessages = function() {
            var messages;
            messages = [];
            $('.fresh', this.container).each(function(i, message) {
                messages.push({
                    bid: message.id,
                    created_at: new Date().toString(),
                    text: $('.text', message).text(),
                    media: $('.postimage', message).attr('data-imageurl'),
                    mediasize: $('.postimage', message).attr('data-imagesize'),
                    time: $('.time', message).attr('data-time'),
                    user: {
                        name: $('.name', message).text(),
                        screen_name: $('.screen_name', message).text().replace(/^@/, ''),
                        profile_image_url: $('.avatar', message).attr('src')
                    },
                    icon: $('.symbol', message).attr('class')
                });
                return $(message).remove();
            });
            return messages;
        };

        HTML.prototype.getMessages = function(callback) {
            var ids, m, messages,
                _this = this;
            ids = [
                (function() {
                    var _i, _len, _ref, _results;
                    _ref = this.messages;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        m = _ref[_i];
                        _results.push(m.id);
                    }
                    return _results;
                }).call(this)
            ];
            messages = [];
            this.extractMessages().forEach(function(message) {
                var _ref;
                if (_ref = message.id, __indexOf.call(ids, _ref) < 0) {
                    return messages.push(message);
                }
            });
            this.messages = messages.concat(this.messages);
            if (callback) {
                return setTimeout((function() {
                    return callback(_this.messages);
                }), 0);
            }
        };

        return HTML;

    })();

}).call(this);

/*
# Fontana utils
*/


(function() {
    var monthNames, vendors, _base;

    if (this.Fontana == null) {
        this.Fontana = {};
    }

    if ((_base = this.Fontana).utils == null) {
        _base.utils = {};
    }

    monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    this.Fontana.utils.prettyDate = function(time) {
        var date, day_diff, diff, now;
        date = new Date(time);
        now = (new Date()).getTime();
        diff = (now - date.getTime()) / 1000;
        day_diff = Math.floor(diff / 86400);
        if (isNaN(date)) {
            return time;
        }
        if (isNaN(day_diff) || day_diff < 0 || day_diff >= 1) {
            if (day_diff <= 365) {
                return "" + (date.getDate()) + " " + monthNames[date.getMonth()];
            } else {
                return "" + (date.getDate()) + " " + monthNames[date.getMonth()] + " " + (date.getFullYear());
            }
        }
        if (!day_diff && diff < 10) {
            return "just now";
        }
        if (!day_diff && diff < 60) {
            return "" + (Math.floor(diff)) + "s";
        }
        if (!day_diff && diff < 3600) {
            return "" + (Math.floor(diff / 60)) + "m";
        }
        if (!day_diff && diff < 86400) {
            return "" + (Math.floor(diff / 3600)) + "h";
        }
    };

    vendors = ['webkit', 'moz', 'ms'];

    this.Fontana.utils.requestFullScreen = function(el) {
        var request;
        request = el.requestFullscreen || el.requestFullScreen;
        vendors.some(function(vendor) {
            if (request == null) {
                request = el[vendor + 'RequestFullScreen'];
            }
            return !!request;
        });
        if (request) {
            return request.call(el, Element.ALLOW_KEYBOARD_INPUT);
        }
    };

    this.Fontana.utils.cancelFullScreen = function() {
        var request;
        request = document.exitFullscreen || document.cancelFullScreen;
        vendors.some(function(vendor) {
            if (request == null) {
                request = document[vendor + 'CancelFullScreen'];
            }
            return !!request;
        });
        if (request) {
            return request.call(document);
        }
    };

    this.Fontana.utils.isFullScreen = function() {
        var request;
        request = document.fullScreen || document.isFullScreen;
        vendors.some(function(vendor) {
            if (request == null) {
                request = document[vendor + 'FullScreen'] || document[vendor + 'IsFullScreen'];
            }
            return !!request;
        });
        return !!request;
    };

}).call(this);

/*
# Fontana feed visualizer.
*/


(function() {
    var modes,themes,transitions,messagelayout,messageTemplate,transitionModes,activeMode,activeTheme,activeTransition,activeTemplate,activeColors;

    if (this.Fontana === null) {
        this.Fontana = {};
    }
    
    messagelayout = '';
    messageTemplate = '\
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
    ';
    
    messageTemplate = '<div id="{id}" class="message media well col-md-6 col-md-offset-3">\
    <figure class="pull-left media-object">\
        <img src="{user.profile_image_url}" width="64" height="64" alt="" class="avatar img-thumbnail">\
    </figure>\
    <div class="media-body">\
        <div class="media-heading">\
            <cite>\
                <span class="name">{user.name}</span>\
                <small class="text-muted">\
                    <span class="screen_name">@{user.screen_name}</span>\
                    <time class="time pull-right" data-time="{created_at}">{created_at}</time>\
                </small>\
            </cite>\
        </div>\
        <div class="text lead"><q>{text}</q></div>\
    </div>\
</div>';
    
    activeMode = "onebyone";
    activeTheme = "default";
    activeTransition = "hinge";
    activeTemplate = "default";
    activeColors = [];
        
    Fontana.Visualizer = (function() {
        function Visualizer(datasource,displays) {
            this.container = $(displays.container);
            this.visualcontent = $(displays.visualcontent);
            this.datasource = datasource;
            this.displays = displays;
            this.paused = false;
            this.fetchMessagesTimer = -1;
            this.animationTimer = -1;
            this.featuredTimer = -1;
            this.firstrun = true;
            this.bgpos = 0;
        }

        Visualizer.prototype.start = function(settings) {
            this.fetchMessages(true);
            this.container.empty();
            if(this.displays.length > 0){
                this.config(settings,this.displays);
                return this.scheduleUpdateAllTimes();
            } else {
                var _this = this;
                this.fetchDisplays(function(displays){
                    _this.displays = displays;
                    _this.config(settings,displays);
                    return _this.scheduleUpdateAllTimes();
                });
            }
        };

        Visualizer.prototype.config = function(settings) {
            var _this = this; 
            $.each(_this.displays.modes,function(mode) {
                _this.container.removeClass(mode);
                $.each(_this.displays.modes[mode].themes,function(theme) {
                    _this.container.removeClass(theme);
                    $.each(_this.displays.modes[mode].themes[theme].transitions,function(transition) {
                        _this.container.removeClass(transition);
                        _this.visualcontent.removeClass(transition+"-media");
                    });
                });
            });
            if (settings && settings.mode && _this.displays.modes.hasOwnProperty(settings.mode) > -1) {
                _this.container.addClass(settings.mode);
                activeMode = settings.mode;
            } else {
                _this.container.addClass(activeMode);
            }
            if (settings && settings.theme && _this.displays.modes[activeMode].themes.hasOwnProperty(settings.theme) > -1) {
                _this.container.addClass(settings.theme);
                activeTheme = settings.theme;
            } else {
                _this.container.addClass(activeTheme);
            }
            if (settings && settings.transition && _this.displays.modes[activeMode].themes[activeTheme].transitions.hasOwnProperty(settings.transition) > -1) {
                activeTransition = settings.transition;
                _this.container.addClass(settings.transition);
                _this.visualcontent.addClass(settings.transition+"-media");
            } else {
                _this.container.addClass(activeTransition);
                _this.visualcontent.addClass(activeTransition+"-media");
            }
            if (settings && settings.transition && _this.displays.templates.hasOwnProperty(settings.template) > -1) {
                activeTemplate = settings.template;
            }
            if (settings && settings.transition && _this.displays.templates.hasOwnProperty(settings.template) > -1) {
                activeTemplate = settings.template;
            }
            if (settings && settings.colors && _this.displays.modes[activeMode].themes[activeTheme].hasOwnProperty("defaultcolors") > -1) {
                activeColors = settings.colors;
            }
            if (settings && settings.visual) {
                this.displays.visual = settings.visual;
            }
            return true;
        };

        Visualizer.prototype.fetchDisplays = function(callback) {
            $.getJSON("/public/walldisplay/themebase/displays.json").then(function(data){
                callback(data);
            });
        };

        Visualizer.prototype.pause = function() {
            if (!this.paused) {
                clearTimeout(this.fetchMessagesTimer);
                clearTimeout(this.animationTimer);
                return this.paused = true;
            }
        };

        Visualizer.prototype.resume = function() {
            if (this.paused) {
                this.fetchMessages();
                this.animate();
                return this.paused = false;
            }
        };

        Visualizer.prototype.stop = function() {
            this.pause();
            return this.container.empty();
        };

        Visualizer.prototype.fetchMessages = function(initial) {
            var _this = this;
            if (initial === null) {
                initial = false;
            }
            return this.datasource.getMessages(function(data) {
                _this.renderMessages(data, initial);
                return _this.scheduleFetchMessages();
            });
        };

        Visualizer.prototype.renderMessages = function(messages, initial) {
            var _this = this;
            if (initial === null) {
                initial = false;
            }
            messages.reverse().forEach(function(message) {
                var messageNode;
                if (!$("#" + message.bid).length) {
                    if (message.entities) {
                        message.text = twttr.txt.autoLinkWithJSON(message.text, message.entities, {
                            targetBlank: true
                        });
                    } else {
                        message.text = twttr.txt.autoLink(message.text, {
                            targetBlank: true
                        });
                    }
                    messageNode = $(nano(_this.displays.templates[activeTemplate], message));
                    _this.updateTime(messageNode);
                    return _this.container.append(messageNode);
                }
            });
            if (initial) {
                return this.scheduleAnimation();
            }
        };

        Visualizer.prototype.checkNewBricks = function(times,grids){
            if($(".newbrick", this.container).length >= times*grids){
                return true;
            }else{
                return false;
            }
        };
        
        Visualizer.prototype.getBackgroundPercentage = function(size){
            var imagewh = size.split(",");
//            console.log("height,width");
//            console.log($(window).width(),$(window).height());
//            if($(window).width() > imagewh[0]){
                var rate = $(window).width()/imagewh[0];
//            } else {
//                var rate = imagewh[0]/$(window).width();
//            }
            
            var newimageheight = rate * imagewh[1];
            if(newimageheight > $(window).height()){
                var per =  (((newimageheight - $(window).height())/$(window).height())*50);
                if(per > 40){
                    return 40;
                }
//                console.log("percentage:"+per);
                return per;
//                return (newimageheight - $(window).height());
            } else {
                return 0;
            }
        };
        
        Visualizer.prototype.animateBackground = function(container,timer,percentage){
            $(container).animate({
                'background-position-y': ''+percentage+'%'
            }, timer, 'linear');
//            }, timer, 'linear', this.animateBackground());
        };
        Visualizer.prototype.setColors = function(id){
            $("body").css("background-color",activeColors[0]);
            this.displays.modes[activeMode].themes[activeTheme].colortemplate.forEach(function(ct){
                if(ct[0] === ""){
                    $("#"+id).css(ct[1],activeColors[ct[2]]);
                }else{
                    $("#"+id).find(ct[0]).css(ct[1],activeColors[ct[2]]);
                }
                console.log(ct);
            });
        };
        Visualizer.prototype.updateColors = function(colors){
            activeColors = colors;
            return true;
        };

        Visualizer.prototype.animate = function() {
//            this.scheduleFeatured();
            var messages, next, prev;
            
            var groups = [
                {
                    class:"prev-group",
                    prefix:"prev",
                    team: "tail",
                    mission: "oldbrick",
                    nextclass: "focus-group",
                    nextprefix: "focus"
                },
                {
                    class:"focus-group",
                    prefix:"focus",
                    team: "none",
                    nextclass: "next-group",
                    nextprefix: "next"
                },
                {
                    class:"next-group",
                    prefix:"next",
                    team: "explorer",
                    mission: "newbrick",
                    nextclass: "newbrick",
                    nextprefix: ""
                }
            ];
             if(activeMode === "onebyone"){
                messages = $(".message", this.container);
//                this.firstrun = false;
//                $('body').addClass('loaded');
                if(this.firstrun === true){
                    console.log("true");
                    if(messages.length > 1){
                        $('body').addClass('loaded');
                        this.firstrun = false;
                    }
                } else {
                    
                    //check if there is newer brick and jump the animation to it
                    // use .newbrick for that
                    messages.removeClass("next next-one focus prev-one prev ");
                    if (!this.current) {
                        this.current = $(".message:first", this.container);
                    } else {
                        this.current = !this.current.next().length ? $(".message:first", this.container) : this.current.next();
                    }
                    this.setColors(this.current.attr("id"));
                    next = this.current.next();
                    if (!next.length) {
                        next = $(".message:first", this.container);
                    }
                    this.current.addClass("focus");
                    //START - POSTIMAGE 
                    var imageurl = $(".focus .postimage").attr("data-imageurl");
                    console.log(this.displays.visual);
                    if(imageurl === "" && this.displays.visual.noimageshow === true){
                        console.log("noimageshow on");
                        imageurl = this.displays.visual.noimages[Math.floor(Math.random()*this.displays.visual.noimages.length)]; 
                        $(".visualcontent").css('background-image','url("'+imageurl+'")');
                        $(".visualcontent").css("background-position-y","0");
                        this.animateBackground(".visualcontent",5000,this.getBackgroundPercentage($(".focus .postimage").attr("data-imagesize")));
//                      
                    } else {
//                        $(".visualcontent").css('background-image','none');
                        $(".visualcontent").css('background-image','url("'+imageurl+'")');
                        $(".visualcontent").css("background-position-y","0");
                        this.animateBackground(".visualcontent",5000,this.getBackgroundPercentage($(".focus .postimage").attr("data-imagesize")));
//                    
                    }
                    
//                        $(".visualcontent").css('background-image','url("'+imageurl+'")');
//                        $(".visualcontent").css("background-position-y","0");
//                        this.animateBackground(".visualcontent",5000,this.getBackgroundPercentage($(".focus .postimage").attr("data-imagesize")));
////                        $('.visualcontent').stop().animate({
////                            'background-position-x': '0%',
//                            'background-position-y': '50%'
//                          }, 6000, 'linear');
//                        var bgpos = 0;
//                        setInterval((function() {
//                            $(".visualcontent").css("background-position","0 -"+bgpos+"px");
//                            bgpos = bgpos + 1;
//                            console.log("position:"+bgpos);
//                        }), 100);
//                        $(".visualcontent").animate({backgroundPosition:"(0 -500px)"}, {duration:500});
//                        $(".visualcontent").css('background-position','"50% '+this.getBackgroundPercentage($(".focus .postimage").attr("data-imagesize"))+'%"');
//                        $(".visualcontent").css('background-position','"50% '+this.getBackgroundPercentage($(".focus .postimage").attr("data-imagesize"))+'%"');
//                        $(".visualcontent").css('background-position','50% '+this.getBackgroundPercentage($(".focus .postimage").attr("data-imagesize"))+'%');
//                        console.log(this.getBackgroundPercentage($(".focus .postimage").attr("data-imagesize")));
                    

                    //END - POSTIMAGE
                    next.addClass("next-one");
                    next.nextAll(":not(.focus)").addClass("next");
                    prev = this.current.prev();
                    if (!prev.length) {
                        prev = $(".message:last", this.container);
                    }
                    prev.addClass("prev-one").addClass("oldbrick").removeClass("next").removeClass("newbrick");
                    prev.prevAll(":not(.next-one):not(.next):not(.focus)").addClass("prev");
                }
                return this.scheduleAnimation();
            } else {
                var mission,grids;
                grids = this.displays.modes[activeMode].themes[activeTheme].grids;
                if(this.firstrun === true){
                    if(this.checkNewBricks(3,grids)){
                        for (var k in groups){
                            var group = groups[k];
                            for (var i = 0; i < grids; i++) {
                                var n = i+1;
                                $(".newbrick:first", this.container).addClass(group.class).addClass(group.prefix+"-"+n).removeClass("newbrick");
                            }
                        }
                        $('body').addClass('loaded');
                        this.firstrun = false;
                    }
                } else {
                    if(this.checkNewBricks(1,grids)){
                        mission = "newbrick";
                    }else{
                        mission = "oldbrick";
                    }
                    for (var k in groups){
                        var group = groups[k];
                        for (var i = 0; i < grids; i++) {
                            var n = i+1;
                            var current,next;
                            if(group.team === "explorer"){
                                next = $("."+mission+":first", this.container);
                                next.addClass(group.class).addClass(group.prefix+"-"+n).removeClass(mission);
                            } else if(group.team === "tail"){
                                current = $(".wallcontent > ."+group.prefix+"-"+n+"");
                                current.removeClass(group.prefix+"-"+n).removeClass(group.class);
                                current.addClass(group.mission);
                                next = $(".wallcontent > ."+group.nextprefix+"-"+n+"");
                                next.removeClass(group.nextclass).removeClass(group.nextprefix+"-"+n);
                                next.addClass(group.class).addClass(group.prefix+"-"+n);
                            } else {
                                next = $(".wallcontent > ."+group.nextprefix+"-"+n+"");
                                next.addClass(group.class).addClass(group.prefix+"-"+n).removeClass(group.nextclass).removeClass(group.nextprefix+"-"+n);
                            }
                        }
                    }
                }
                return this.scheduleAnimation();
            }
        };

        Visualizer.prototype.updateAllTimes = function() {
            var _this = this;
            $(".message", this.container).each(function(i, message) {
                return _this.updateTime(message);
            });
            return this.scheduleUpdateAllTimes();
        };

        Visualizer.prototype.updateTime = function(message) {
            var time;
            time = $(".time", message);
            return time.text(Fontana.utils.prettyDate(time.data("time")));
        };

        Visualizer.prototype.scheduleAnimation = function() {
            var delay,
                _this = this;
            if(this.animationTimer === -1 ){
                delay = 0;
            }else{
                if(activeMode === "onebyone"){
                    delay = 6000;
                }else if(activeMode === "grid"){
                    delay = 8000;
                }
            }            
            return this.animationTimer = setTimeout((function() {
                return _this.animate();
            }), delay);
        };
        
        Visualizer.prototype.scheduleFeatured = function() {
            if(activeMode === "grid"){
                var delay = 10000;
                return this.featuredTimer = setTimeout((function() {
                    var messages = $(".message", this.container);
                    var totalmessage = messages.length;
                    $(".message:eq("+ Math.floor(Math.random() * totalmessage) + 1 +")", this.container).addClass("featured");
                }), delay);
            }
        };

        Visualizer.prototype.scheduleFetchMessages = function() {
            var _this = this;
            return this.fetchMessagesTimer = setTimeout((function() {
                return _this.fetchMessages();
            }), 10000);
        };

        Visualizer.prototype.scheduleUpdateAllTimes = function() {
            var _this = this;
            return setTimeout((function() {
                return _this.updateAllTimes();
            }), 20000);
        };

        return Visualizer;

    })();

    this.Fontana.Visualizer.transitions = transitions;
    this.Fontana.Visualizer.transitionModes = transitionModes;

}).call(this);