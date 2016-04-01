

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