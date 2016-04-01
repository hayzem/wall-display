var WallDisplay = window.WallDisplay || {};

WallDisplay.visualizer = null;
WallDisplay.engine = function(){
    WallDisplay.visualizer = new Fontana.Visualizer(WallDisplay.engine.datasource,WallDisplay.Set.displays);
    return WallDisplay.visualizer.start(WallDisplay.Set.settings);
};

WallDisplay.Set = {
    displays: {},
    settings: {},
    menus: {
        mode: "#mode",
        theme: "#theme",
        transition: "#transition"
    },
    init: function(callback){
        if(this.displays.hasOwnProperty("modes")){
            callback(this.displays);
        } else {
            var _this = this;
            this.fetchDisplays(function(disdata){
                _this.displays = disdata;
                callback(disdata);
            });
        }
    },
    fetchDisplays : function(callback) {
        return $.getJSON("/public/walldisplay/themebase/displays.json", {
            now: (new Date()).getTime()
        }).success(function(data) {
            callback(data);
        });
    },
    config: function(configdata){
        this.updateSettings(configdata);
        this.setRig();
        this.activateRig();
        this.setContainers();
        this.startPseudoContent();
        return this.settings;
    },
    updateSettings: function(newsettings){
        if(newsettings.hasOwnProperty("container")){
            this.settings.container = newsettings.container;
        }else{
            this.settings.container = this.displays.container;
        }
        if(newsettings.hasOwnProperty("mode")){
            this.settings.mode = newsettings.mode;
        }else{
            this.settings.mode = this.displays.default;
        }
        if(newsettings.hasOwnProperty("theme")){
            if(this.displays.modes[this.settings.mode].themes.hasOwnProperty(newsettings.theme)){
                this.settings.theme = newsettings.theme;
            }else{
                this.settings.theme = this.displays.modes[this.settings.mode].default;
            }
        }else{
            this.settings.theme = this.displays.modes[this.settings.mode].default;
        }
        if(newsettings.hasOwnProperty("transition")){
            if(this.displays.modes[this.settings.mode].themes[this.settings.theme].transitions.hasOwnProperty(newsettings.transition)){
                this.settings.transition = newsettings.transition;
            }else{
                this.settings.transition = this.displays.modes[this.settings.mode].themes[this.settings.theme].default;
            }
        }else{
            this.settings.transition = this.displays.modes[this.settings.mode].themes[this.settings.theme].default;
        }
        if(newsettings.hasOwnProperty("template")){
            if(this.displays.templates.hasOwnProperty(newsettings.template)){
                if(this.displays.modes[this.settings.mode].themes[this.settings.theme].template === newsettings.template){
                    this.settings.template = newsettings.template;
                }else{
                    this.settings.template = this.displays.modes[this.settings.mode].themes[this.settings.theme].template;
                }
            }else{
                this.settings.template = this.displays.modes[this.settings.mode].themes[this.settings.theme].template;
            }
        }else{
            this.settings.template = this.displays.modes[this.settings.mode].themes[this.settings.theme].template;
        }
        this.settings.colors = this.displays.modes[this.settings.mode].themes[this.settings.theme].defaultcolors;
    },
    setRig: function(){
        var _this = this;
        var selected;
        var modesmenu;
        modesmenu = $(this.menus.mode);
        modesmenu.empty();
        Object.keys(this.displays.modes).forEach(function(key) {
            if(_this.settings.mode === key){
                selected = "selected='selected'";
            } else {
                selected = "";
            }
            modesmenu.append("<option value='" + key + "' "+selected+">" + _this.displays.modes[key].name + "</option>");
        });
        var thememenu;
        thememenu = $(this.menus.theme);
        thememenu.empty();            
        Object.keys(this.displays.modes[this.settings.mode].themes).forEach(function(key) {
            if(_this.settings.theme === key){
                selected = "selected='selected'";
            } else {
                selected = "";
            }
            thememenu.append("<option value='" + key + "' "+selected+" >" + _this.displays.modes[_this.settings.mode].themes[key].name + "</option>");
        });
        
        var transitionmenu;
        transitionmenu = $(this.menus.transition);
        transitionmenu.empty();
        Object.keys(this.displays.modes[this.settings.mode].themes[this.settings.theme].transitions).forEach(function(key) {
            if(_this.settings.transition === key){
                selected = "selected='selected'";
            } else {
                selected = "";
            }
            transitionmenu.append("<option value='" + key + "' "+selected+" >" + _this.displays.modes[_this.settings.mode].themes[_this.settings.theme].transitions[key].name + "</option>");
        });
    },
    setContainers : function(){
        $(".walldisplay").empty();
        $(".walldisplay").prepend(this.displays.modes[this.settings.mode].themes[this.settings.theme].parent);
        $(".walldisplay").addClass(this.displays.modes[this.settings.mode].themes[this.settings.theme].body);
        $("#display_template").val(this.displays.modes[this.settings.mode].themes[this.settings.theme].template);
    },
    activateRig: function(){
        var _this = this;
        $(this.menus.mode).change(function(e) {
            console.log("change mode:"+$(e.target).val());
            return WallDisplay.Set.updateMode($(e.target).val());
        });
        $(this.menus.theme).change(function(e) {
            console.log("change theme:"+$(e.target).val());

            return WallDisplay.Set.updateTheme($(e.target).val());
        });
        $(this.menus.transition).change(function(e) {
            console.log("change transition:"+$(e.target).val());
            return WallDisplay.Set.updateTransition($(e.target).val());
        });
    },
    updateMode: function(mode){
        this.settings.mode = mode;
        this.updateSettings(this.settings);
        return WallDisplay.Set.updateTheme(this.settings.theme);
    },
    updateTheme: function(theme){
        WallDisplay.visualizer.stop();
        this.settings.theme = theme;
        this.updateSettings(this.settings);
        this.setContainers();
        this.startPseudoContent();
        this.startEngine();
        return WallDisplay.Set.updateTransition(this.settings.transition);
    },
    updateTransition: function(transition){
        WallDisplay.visualizer.pause();
        this.settings.transition = transition;
        WallDisplay.Set.setRig();
        WallDisplay.visualizer.config(this.settings);
        console.log(this.settings);
        return WallDisplay.visualizer.resume();
    },
    updateColors: function(colors){
        return WallDisplay.visualizer.updateColors(colors);
    },
    startEngine : function(){
        WallDisplay.engine.datasource = new Fontana.datasources.HTML($(this.displays.container));
        WallDisplay.engine.datasource.getMessages();
        return WallDisplay.engine();
    },
    startPseudoContent : function (){
        var _this = this;
        var jkl = 0;
        if (typeof elementPeriod === 'function') { 
            clearInterval(elementPeriod);
        }
        var elementPeriod = setInterval((function() {
            if(typeof _this.PseudoContent[jkl] === 'undefined') {
                clearInterval(elementPeriod);
            } else {
                $(_this.displays.container).append($(nano(_this.displays.templates[_this.settings.template], _this.PseudoContent[jkl])).removeClass().addClass("fresh"));
                jkl++;
            }
        }), 1000);
    },
    PseudoContent: [
        {
            bid: 12342341234,
            cid: 12342341234,
            created_at: new Date(),
            text: "WallDisplay is a powerfull tool for eventholders!",
            media: "http://i.imgur.com/tNHci8l.jpg",
            mediasize: "992,696",
            time: "",
            user: {
                name: "WallDisplay",
                screen_name: "WallDisplay",
                profile_image_url: "/public/walldisplay/themebase/img/theeyecut.png"
            },
            icon:'symbol fa fa-twitter fa-3'
        },
        {
            bid: 8723422346,
            cid: 8723422346,
            created_at: new Date(),
            text: "WallDisplay is a powerfull tool for eventholders!",
            media: "http://images4.fanpop.com/image/photos/16300000/Random-nice-random-16383359-670-446.jpg",
            mediasize: "992,696",
            time: "",
            user: {
                name: "WallDisplay",
                screen_name: "WallDisplay",
                profile_image_url: "/public/walldisplay/themebase/img/theeyecut.png"
            },
            icon:'symbol fa fa-twitter fa-3'
        },
        {
            bid: 12342356741234,
            cid: 12342356741234,
            created_at: new Date(),
            text: "WallDisplay is a powerfull tool for eventholders!",
            media: "http://images4.fanpop.com/image/photos/23700000/Nice-View-random-23733452-500-334.jpg",
            mediasize: "992,696",
            time: "",
            user: {
                name: "WallDisplay",
                screen_name: "WallDisplay",
                profile_image_url: "/public/walldisplay/themebase/img/theeyecut.png"
            },
            icon:'symbol fa fa-twitter fa-3'
        },
        {
            bid: 12234342341234,
            cid: 12234342341234,
            created_at: new Date(),
            text: "WallDisplay is a powerfull tool for eventholders!",
            media: "http://nice-cool-pics.com/data/media/22/random_hd_wallpaper_nice-cool-pics.com__5898_.jpg",
            mediasize: "992,696",
            time: "",
            user: {
                name: "WallDisplay",
                screen_name: "WallDisplay",
                profile_image_url: "/public/walldisplay/themebase/img/theeyecut.png"
            },
            icon:'symbol fa fa-twitter fa-3'
        },
        {
            bid: 12342342341234,
            cid: 12342342341234,
            created_at: new Date(),
            text: "WallDisplay is a powerfull tool for eventholders!",
            media: "http://www.designerstalk.com/forums/attachments/photography/9638d1280231833-random-nice-photography-bryanpeterson1.jpg",
            mediasize: "992,696",
            time: "",
            user: {
                name: "WallDisplay",
                screen_name: "WallDisplay",
                profile_image_url: "/public/walldisplay/themebase/img/theeyecut.png"
            },
            icon:'symbol fa fa-twitter fa-3'
        },
        {
            bid: 56869543,
            cid: 56869543,
            created_at: new Date(),
            text: "WallDisplay is a powerfull tool for eventholders!",
            media: "http://www.designerstalk.com/forums/attachments/photography/9638d1280231833-random-nice-photography-bryanpeterson1.jpg",
            mediasize: "992,696",
            time: "",
            user: {
                name: "WallDisplay",
                screen_name: "WallDisplay",
                profile_image_url: "/public/walldisplay/themebase/img/theeyecut.png"
            },
            icon:'symbol fa fa-twitter fa-3'
        },
        {
            bid: 3564584,
            cid: 3564584,
            created_at: new Date(),
            text: "WallDisplay is a powerfull tool for eventholders!",
            media: "http://www.designerstalk.com/forums/attachments/photography/9638d1280231833-random-nice-photography-bryanpeterson1.jpg",
            mediasize: "992,696",
            time: "",
            user: {
                name: "WallDisplay",
                screen_name: "WallDisplay",
                profile_image_url: "/public/walldisplay/themebase/img/theeyecut.png"
            },
            icon:'symbol fa fa-twitter fa-3'
        },
        {
            bid: 23688,
            cid: 23688,
            created_at: new Date(),
            text: "WallDisplay is a powerfull tool for eventholders!",
            media: "http://www.designerstalk.com/forums/attachments/photography/9638d1280231833-random-nice-photography-bryanpeterson1.jpg",
            mediasize: "992,696",
            time: "",
            user: {
                name: "WallDisplay",
                screen_name: "WallDisplay",
                profile_image_url: "/public/walldisplay/themebase/img/theeyecut.png"
            },
            icon:'symbol fa fa-twitter fa-3'
        },
        {
            bid: 67867678,
            cid: 67867678,
            created_at: new Date(),
            text: "WallDisplay is a powerfull tool for eventholders! #01",
            media: "http://www.designerstalk.com/forums/attachments/photography/9638d1280231833-random-nice-photography-bryanpeterson1.jpg",
            mediasize: "992,696",
            time: "",
            user: {
                name: "WallDisplay",
                screen_name: "WallDisplay",
                profile_image_url: "/public/walldisplay/themebase/img/theeyecut.png"
            },
            icon:'symbol fa fa-twitter fa-3'
        },
        {
            bid: 345345,
            cid: 345345,
            created_at: new Date(),
            text: "WallDisplay is a powerfull tool for eventholders! #02",
            media: "http://www.designerstalk.com/forums/attachments/photography/9638d1280231833-random-nice-photography-bryanpeterson1.jpg",
            mediasize: "992,696",
            time: "",
            user: {
                name: "WallDisplay",
                screen_name: "WallDisplay",
                profile_image_url: "/public/walldisplay/themebase/img/theeyecut.png"
            },
            icon:'symbol fa fa-twitter fa-3'
        },
        {
            bid: 123123,
            cid: 123123,
            created_at: new Date(),
            text: "WallDisplay is a powerfull tool for eventholders! #03",
            media: "http://www.designerstalk.com/forums/attachments/photography/9638d1280231833-random-nice-photography-bryanpeterson1.jpg",
            mediasize: "992,696",
            time: "",
            user: {
                name: "WallDisplay",
                screen_name: "WallDisplay",
                profile_image_url: "/public/walldisplay/themebase/img/theeyecut.png"
            },
            icon:'symbol fa fa-twitter fa-3'
        }
    ]
        
};