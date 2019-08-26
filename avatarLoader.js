//  avatarLoader.js (v6.4)

    var male, female, skeleton;

    localPlayerHandler("/turn/back");
//  Disable outfit direction visible on startup.
//  localPlayer.outfit.direction.visible = false;

(function(){

//  IndexedDB first.

    var dbUSER = new zango.Db( "USER", {
        "current": true,
    });

    var selector = {_id:"avatar"};
    var collection = dbUSER.collection("current");

    collection.findOne(selector, function(err){
        if (err) throw err;
    }).then(function(json){
        if (!json) throw "Current avatar not found!";
        return localPlayer.outfit.fromJSON( json );
    }).then(function(outfit){
        if ( localPlayer.outfit.getGender("male") )
            male = outfit;
        else if ( localPlayer.outfit.getGender("female") )
            female = outfit;
    }).catch(function(err){
        console.error(err);

    //  Try localStorage.

        return new Promise(function(resolve, reject){

            var json = store("Avatar");
            if (!json) throw "Avatar not found!";

            resolve(json);

        }).then(function(json){

            localPlayer.outfit.fromJSON( json )
            .then(function(outfit){
                if ( localPlayer.outfit.getGender("male") )
                    male = outfit;
                else if ( localPlayer.outfit.getGender("female") )
                    female = outfit;
            }).catch(function(err){
                console.log(err);
                throw err;
            });

            return json;

        }).then(function(json){

        //  Update database.
            json._id = "avatar";
            return collection.insert(json, function(err){
                if (err) throw err;
            }).catch(function(err){
                console.log(err);
                throw err;
            });

        }).catch(function(err){
            console.error(err);

        //  Drop to skinned mesh loader.

            return Promise.resolve().then(function(){

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

            //  Drop to female avatar.
                localPlayerHandler("/gender/female");
                return;
            });

        });

    }).then(function(){

    //  Startup.

    //  Enable outfit direction visible.
        localPlayer.outfit.direction.visible = true;

    //  Hide loading bar.
        if (window.bootbox) window.bootbox.hideAll();

    });

})();




/*
//  avatarLoader.js (v6.3)

(function(){

    Promise.resolve( store("Avatar") ).then(function(json){

        if (!json) throw "Null avatar data!";

    //  avatar.

        return localPlayer.outfit.fromJSON( json );

    }).then(function(outfit){

        if (!outfit) throw "Null avatar outfit!";

        if ( localPlayer.outfit.getGender("male") )
            male = outfit;
        else if ( localPlayer.outfit.getGender("female") )
            female = outfit;

    }).catch(function(err){
        console.error(err);

    //  Drop to skinned mesh loader.

        return Promise.resolve().then(function(){

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

        //  Drop to female avatar.
            localPlayerHandler("/gender/female");
            return;
        });

    }).then(function(){

    //  Startup.

    //  Enable outfit direction visible.
        localPlayer.outfit.direction.visible = true;

    //  Hide loading bar.
        if (window.bootbox) window.bootbox.hideAll();

    });

})();
*/