//  avatarLoader.js (v6.3)

    var male, female, skeleton;

    localPlayerHandler("/turn/back");
//  Disable outfit direction visible on startup.
//  localPlayer.outfit.direction.visible = false;

(function(){

    Promise.resolve().then(function(){

    //  male.

        var json = {};
        return db.collection("male").find().forEach(
            function(doc){
                json[doc._id] = doc;
            }, 
            function(err){
                if (err) throw err;
            }
        ).catch(function(err){
            console.error(err);
        }).then(function(){
            return localPlayer.outfit.fromJSON(json);
        }).then(function(outfit){
            male = outfit;
            debugMode && console.log({"male":male});
            return;
        });

    }).then(function(){

    //  female.

        var json = {};
        return db.collection("female").find().forEach(
            function(doc){
                json[doc._id] = doc;
            }, 
            function(err){
                if (err) throw err;
            }
        ).catch(function(err){
            console.error(err);
        }).then(function(){
            return localPlayer.outfit.fromJSON(json);
        }).then(function(outfit){
            female = outfit;
            debugMode && console.log({"female":female});
            return;
        });

    }).then(function(){

    //  skeleton.

        return db.collection("skeleton")
        .findOne({_id:"body"}, function(err){
            if (err) throw err;
        }).then(function(doc){
            return doc;
        }).catch(function(err){
            console.error(err);
        }).then(function(doc){
            return localPlayer.outfit.fromJSON({"skeleton":doc});
        }).then(function(outfit){
            skeleton = outfit.skeleton;
            debugMode && console.log({"skeleton":skeleton});
            return;
        });

    }).then(function(){

    //  avatar.

        return store("Avatar");

    }).then(function(json){
        if (!json) throw "Null avatar json data!";

        return localPlayer.outfit.fromJSON( json );

    }).then(function(outfit){
        if (!outfit) throw "Null outfit object!";

        if ( localPlayer.outfit.getGender("male") )
            male = outfit;
        else if ( localPlayer.outfit.getGender("female") )
            female = outfit;

    }).catch(function(err){
        console.error(err);

    //  Drop to female avatar.
        localPlayerHandler("/gender/female");

    }).then(function(){

    //  Startup.

    //  Enable outfit direction visible.
        localPlayer.outfit.direction.visible = true;

    //  Hide loading bar.
        if (window.bootbox) window.bootbox.hideAll();

    });

})();
