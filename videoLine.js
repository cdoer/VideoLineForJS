
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


/**
 *
 * @param id  元素id
 * @param callback 拖拽回调函数
 * @constructor
 */

function VideoLine(id,callback){
    var _this =this;
    this.time = this.vId = new Date().getTime();
    var target = this.target= $("#"+id).css("position","relative");
    this.currentTimeBox = $("<span style='position: absolute; top:2px;font-size: 12px;'></span>");
    this.hourWidth = 120;
    this.hourSplit = 6;
    this.lock = false;
    this.data = [];
    this.callback = callback;

    this.getWidth = function(){
        return target.width();
    }
    this.getHeight = function(){
        return target.height();
    }

    this.getSecondWidth = function(){
        return this.hourWidth /3600;
    }
    this.getMinutesToMillSeconds = function(minutes){
        return minutes*60*1000;
    }

    this.getMiddleLineX = function(){
        return this.getWidth()/2-0.5;
    }

    target.mousedown(function(e){
        _this.lock = true;
        var x = e.clientX;
        target.mousemove(function(event){
            var distanceX  = event.clientX-x;
            var move_seconds = -distanceX/_this.getSecondWidth();
            _this.time +=move_seconds*1000;
            _this.update(_this.time,true);
            x = event.clientX;
        });
    });

    $(document).mouseup(function(event){//鼠标抬起事件  关闭移动事件
        target.off("mousemove");
        _this.lock = false;
        if($.isFunction(_this.callback)){
            callback(_this.time);
        }
    });

    this.update = function(time,self){
        if(this.lock&&!self) return;
        var time = this.time = time;
        this.currentTimeBox.text(new Date(time).format("yyyy-MM-dd HH:mm:ss"));
        this.currentTimeBox.css({
            left:_this.getMiddleLineX()-_this.currentTimeBox.width()/2
        });
        var itemMinutes = 60/this.hourSplit;
        var itemWidth = this.hourWidth/this.hourSplit;
        this.target.find(".removeAble").remove();
        this.updateLeftOrRight(true,time,itemMinutes,itemWidth);
        this.updateLeftOrRight(false,time,itemMinutes,itemWidth);
        this.updateData(this.data);
    }

    this.updateData=function(data){
        if(!data||!$.isArray(data)) return;
        this.data = data;
        this.target.find(".removeAbleData").remove();
        $.each(data,function(index,item){
            if(!item.start||!item.end) return;
            var sx = (item.start- _this.time)/1000*_this.getSecondWidth()+_this.getMiddleLineX();
            var ex = (item.end- _this.time)/1000*_this.getSecondWidth()+_this.getMiddleLineX();
            sx=sx<0?0:sx>_this.getWidth()?_this.getWidth():sx;
            ex=ex<0?0:ex>_this.getWidth()?_this.getWidth():ex;
            var _item = $("<span  class='removeAble removeAbleData' style='position: absolute; background: dodgerblue; left:"+sx+"px; top: "+(_this.getHeight()/2-7)+"px; height:5px; width:"+(ex-sx)+"px'>");
            _this.target.append(_item);
        });
    }

    this.updateLeftOrRight = function(left,time,itemMinutes,itemWidth){
        var distanceSeconds = time%(itemMinutes*60*1000);
        var distanceX = 0;
        var nextTime = 0;
        if(distanceSeconds>0){
            nextTime = left?time-distanceSeconds:time-distanceSeconds+this.getMinutesToMillSeconds(itemMinutes)
        }else{
            nextTime = left?time-this.getMinutesToMillSeconds(itemMinutes):time+this.getMinutesToMillSeconds(itemMinutes);
        }
        distanceX = -(this.time-nextTime)/1000*_this.getSecondWidth();
        var height = 5;
        var x = this.getMiddleLineX()+distanceX;
        if(x<0||x>this.getWidth()) return;
        if(nextTime%_this.getMinutesToMillSeconds(60)==0){
            height = 10;
            var hourText = $("<span class='removeAble' style='position: absolute; font-size: 11px;'>"+new Date(nextTime).getHours()+":00</span>");
            this.target.append(hourText)
            hourText.css({
                left:x-hourText.width()/2,
                top:_this.getHeight()/2+10
            })
        }
        this.target.append($("<span class='removeAble' style='position: absolute; top:"+this.getHeight()/2+"px; background: #000; width:1px; height: "+height+"px; left: "+x+"px;'/>"));
        this.updateLeftOrRight(left,nextTime,itemMinutes,itemWidth);
    }
    var middleLine = $("<div id='middleLine"+this.vId+"' style='position: absolute; opacity: 0.6; background: red; width: 1px; " +
        "height: "+this.getHeight()+"px; left:"+this.getMiddleLineX()+"px'/>");

    target.append("<div style='position: absolute; top:"+this.getHeight()/2+"px; width: "+this.getWidth()+"px; height: 1px; background: #000;'></div>");
    target.append(middleLine)
    target.append(this.currentTimeBox)
    this.update(this.time);
}

$(function (){
    var vL = new VideoLine("videoLine",function(time){
        console.log(new Date(time).format("yyyy-MM-dd HH:mm:ss"));
    });
    var data=[{
        start:new Date().getTime()-3600*1000*5,
        end:new Date().getTime()-3600*1000*4-1800*100
    },{
        start:new Date().getTime()-3600*1000*3,
        end:new Date().getTime()-3600*1000*1
    }];

    vL.updateData(data);

})