# VideoLineForJS  视频轴JS版   视频回放轴  海康威视  海康

![演示图片](https://github.com/cdoer/VideoLineForJS/blob/master/videoLineForJS.gif)

```
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
```
