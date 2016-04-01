        
<link as="script" href="/js/tlib.js" rel="preload" />
<link as="script" href="/js/engine.js" rel="preload" />
<link as="script" href="/js/walldisplay.js" rel="preload" />
<link as="script" href="http://domain:socketPort/socket.io/socket.io.js" rel="preload" />

<script>
    $(function () {
        WallDisplay.Client.config({
            room:"socketsRoom",
            token:"token",
            port: "socketPort",
            mode:"displayMode",
            transition: "displayTransition",
            theme:"displayTheme",
            template:"postTemplate",
            colors:"displayColors",
            postimages: true
        });
        WallDisplay.Client.start();
    });
</script>