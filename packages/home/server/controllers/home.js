/**
 * Created by laodao on 14-10-15.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    bookmarks = require('../../../bookmarks/server/controllers/bookmarks'),
    User = mongoose.model('User'),
    Channel2User = mongoose.model('Channel2User'),
    Channels = mongoose.model('Channels'),
    Bookmarks = mongoose.model('Bookmarks');

//渲染Home页面
exports.initHome = function(req,res,Home){
    if(!req.user) return res.redirect('/');
    async.parallel({
            user: function(callback){
                User.findOne({_id:req.user._id},function(err,user){
                    callback(null,user);
                });
            },
            adm: function(callback1){
                //userId:req.user._id,type:{$in:['creator','admin']}
                Channel2User.find({userId:req.user._id,type:{$in:['creator','admin']}},'channelId name logo type lastTime news',function(err,admChannels){
                    if(err) return console.log(err);
                    async.map(admChannels,function(item,callback2){
                        Bookmarks.count({channelId:item.channelId,postTime:{$gte:item.lastTime}},function(err,count){
                            item['news'] = count;
                            callback2(null,item);
                        });
                    },function(err,results){
                        results.sort(function(a,b){
                            return a.news < b.news ? 1 : -1;
                        });
                        callback1(null,results);
                    });
                });
            },
            sub: function(callback1){
                Channel2User.find({userId:req.user._id,type:'follower'},'channelId name logo type lastTime news',function(err,subChannels){
                    if(err) return console.log(err);
                    async.map(subChannels,function(item,callback2){
                        Bookmarks.count({channelId:item.channelId,postTime:{$gte:item.lastTime}},function(err,count){
                            item['news'] = count;
                            callback2(null,item);
                        });
                    },function(err,results){
                        results.sort(function(a,b){
                            return a.news < b.news ? 1 : -1;
                        });
                        callback1(null,results);
                    });
                });
            },
            creatNum: function(callback){
                Channel2User.count({userId:req.user._id,type:'creator'},function(err,count){
                    callback(null,count)
                });
            },
            news: function(callback){
                Bookmarks.find({"postUser.userId" : req.user._id,checked:{$in:[1,2]}},function(err,doc){
                    if(err) console.log(err);
                    callback(null,doc);
                });
            }
        },
        function(err, results) {
            //渲染home页面
            Home.render('index', {admChannelList:results.adm,subChannelList:results.sub,creatNum:results.creatNum,user:results.user,news:results.news}, function (err, html) {
                //Rendering a view from the Package server/views
                if(err) return console.log(err);
                res.send(html);
            });
        });
}

//添加管理员与频道对应关系
exports.addAdmChannel = function(){

};

//新建一个频道
exports.createChannel = function(req,res){
    var channels = new Channels(req.body);
    channels.tags = getTags(channels.tags);
    channels.creator = {userId:req.user._id,userName:req.user.username,userLogo:req.user.avatar};
    channels.save(function(err,doc){
        if(err){
            return res.send({info:err});
        }
        var admChannel = new Channel2User({
            userId:req.user._id,
            channelId:doc._id,
            name: channels.name,
            type: "creator",
            logo: channels.logo
        });
        admChannel.save(function(err){
            if(err){
                return res.send({info:err});
            }
            res.send({info:"success"});
        });
    });
};

//获取关注或是建立的频道
exports.getChannelsList = function(req,res){
    if(!req.user) return res.status(401).send({info:'请先登录或注册'});
    Channel2User.find({userId:req.user._id},'channelId name logo type lastTime news',function(err,channels){
        if(err) return console.log(err);
        async.map(channels,function(item,callback){
            Bookmarks.count({channelId:item.channelId,postTime:{$gte:item.lastTime}},function(err,count){
                item['news'] = count;
                callback(null,item);
            });
        },function(err,results){
            if(err) return console.log(err);
            results.sort(function(a,b){
                return a.news < b.news ? 1 : -1;
            });
            res.json(results);
        });
    });
};

//用户主页管理界面
exports.check = function(req,res,Home){
    Home.render('check', {}, function (err, html) {
        //Rendering a view from the Package server/views
        if(err) return console.log(err);
        res.send(html);
    });
}


//
exports.newsViewed = function(req,res){
    var bookmarkId = req.body.bookmarkId;
    Bookmarks.update({_id:bookmarkId},{$inc:{checked:2}},function(err,num){
        if(err) console.log(err);
        res.status(200).send({success:true,info:'此信息已经加入历史记录。'});
    });
}


//获取频道排行榜
exports.getChannelsTop = function(req,res){
    var num = req.params['num'];
    var limit = 20;
    Channels.find().sort({subNum:1}).skip(num).limit(limit).exec(function (err, channels) {
        if(err) return console.log(err);
        res.status(200).json({channels:channels});
    });
}

// //Ajax获取历史消息记录
// exports.history = function(req,res){
//     if(!req.user) return res.status(401).send({info:'请先登录或注册'});
//     var num = req.params['num'];
//     var limit = 20;
//     Bookmarks.find({"postUser.userId" : req.user._id,checked:{$in:[3,4]}}).skip(num).limit(limit).exec(function(err,doc){
//         if(err) console.log(err);
//         res.status(200).json({historys:doc});
//     });

// }

function getTags(str){
    if(!str) return [];
    str = str.toString();
    var tags = [];
    var array = str.split(/[,，]/);
    array.forEach(function(item){
        newItem = item.trim();
        if(newItem !== ''){
            tags.push(newItem);
        }
    });
    return tags;
}

//ajax加载'发现'页面内容
exports.discover = function(req,res){
    if(!req.user) return res.redirect('/');
    //number为请求次数 limit为每次返回的数量
    var number=req.query.number,limit=1;
    async.waterfall([
            function(callback1){
                Channels.find().sort({subNum:-1,time:-1}).skip((number-1)*limit).limit(limit).exec(function(err,subChannels){
                    if(err) return console.log(err);
                    async.map(subChannels,function(item,callback2){
                        Bookmarks.count({channelId:item.channelId,postTime:{$gte:item.lastTime}},function(err,count){
                            item['news'] = count;
                            callback2(null,item);
                        });
                    },function(err,results){
                        results.sort(function(a,b){
                            return a.news < b.news ? 1 : -1;
                        });
                        callback1(null,results);
                    });
                });
            },
            function(results,callback){
                Channels.find().sort({subNum:1,time:1}).limit(1).exec(function(err,doc){
                    if (err) return console.log(err);
                    if(doc.length===0) {callback(null,results,[]);}
                    else{
                        callback(null,results,doc[0]);
                    }
                })
            }],
            function(err, results,doc) {
                var isHave=true;
                if(results.length==0) {isHave=false;}
                else{
                    if (results[0]['time']+''==doc['time']+''){
                        isHave=false;
                    }
                }
                res.json({list:results,isHave:isHave});
            });
}

//ajax加载'发现'页面channels
exports.ajaxBookmarks = function(req,res){
    if(!req.user) return res.status(401).json({info:'请先注册或登录'});
    var date=req.get.date,limit=20;//date为前端当前展示的时间      
    var channelId = req.get['channelId'];
    async.parallel({
        list: function(callback){
            //获取对应频道的书签
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$gt:date}}).sort({postTime:-1}).limit(limit).exec(function (err, doc) {
                if(err) console.log(err);
                if(doc.length === 0) return callback(null,[]);
                var targetTime = doc[doc.length -1]['postTime'];//取出来的最后一天的时间
                var startDay = moment(doc[doc.length -1]['postTime']).startOf('day').toDate();
                Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]},postTime:{$gt:startDay,$lte:date}}).sort({postTime:-1}).exec(function(err,list){
                    if(err) console.log(err);
                    callback(null,listToArray(list));
                });
            })
        },
        endbookmarkId: function(callback){
            Bookmarks.find({channelId:channelId,checked:{$in:[1,3,5]}}).limit(1).sort({postTime:1}).exec(function(err,doc){
                if(err) return console.log(err);
                callback(null,doc)
            })
        }
    },function(err,results){
        results.isHave=true;//下次是否还进行ajax请求
        results.nextTime=null;//请求加载的书签的时间
        if(results.endbookmarkId.lenght===0) results.isHave=false;
        else{
            results.nextTime=results.list[results.list.length-1]['postTime'];
            if(results.list[results.list.length-1]['_id']==results.endbookmarkId[0]['_id']){
                results.isHave=false;
            }
        }
        //更新频道最后访问时间并返回数据
        Channel2User.update({channelId:channelId,userId:req.user._id},{lastTime:Date.now()},function(err){
            if(err) return console.log(err);
            res.json(results);
        });
    });
}

//ajax返回新消息
exports.newNews = function(req,res){
    if(!req.user) return res.status(401).json({info:'请先注册或登录'});
    var limit=1;
    var number = req.query.number||1;
    async.waterfall([
        function(callback){console.log(req.user._id);
            Bookmarks.find({'postUser.userId':req.user._id,checked:{$in:[1,2]}}).sort({postTime:1}).limit(1)
            .exec(function(err,doc){console.log(doc+"!!!!");callback(err,doc)});
        },
        function(doc,callback){
            Bookmarks.find({'postUser.userId':req.user._id,checked:{$in:[1,2]}}).sort({postTime:-1}).skip((number-1)*limit).limit(limit).exec(function(err,list){
                if (err) {return console.log(err);}
                var isHave=true;
                if(list.length==0) {isHave=false;}
                else{
                    if(doc[0]['postTime']+''==list[list.length-1]['postTime']+''){
                        isHave=false;
                    }
                }
                callback(err,list,isHave);
            })
        }],
        function(err,list,isHave){
            res.json({news:list,isHave:isHave});
        }
    )
}
//ajax返回历史消息
exports.newNews = function(req,res){
    if(!req.user) return res.status(401).json({info:'请先注册或登录'});
    var limit=1;
    var number = req.query.number||1;
    async.waterfall([
        function(callback){console.log(req.user._id);
            Bookmarks.find({'postUser.userId':req.user._id,checked:{$in:[3,4]}}).sort({postTime:1}).limit(1)
            .exec(function(err,doc){console.log(doc+"!!!!");callback(err,doc)});
        },
        function(doc,callback){
            Bookmarks.find({'postUser.userId':req.user._id,checked:{$in:[3,4]}}).sort({postTime:-1}).skip((number-1)*limit).limit(limit).exec(function(err,list){
                if (err) {return console.log(err);}
                var isHave=true;
                if(list.length==0) {isHave=false;}
                else{
                    if(doc[0]['postTime']+''==list[list.length-1]['postTime']+''){
                        isHave=false;
                    }
                }
                callback(err,list,isHave);
            })
        }],
        function(err,list,isHave){
            res.json({news:list,isHave:isHave});
        }
    )
}
