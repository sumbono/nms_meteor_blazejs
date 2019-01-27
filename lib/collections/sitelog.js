Sitelog = new Mongo.Collection('nms_sitelog');

export default Sitelog;

// sitelog = new Mongo.Collection("nms_sitelog");

// sitelog.featured = function(){
// //     aktivasi 20180905
//     var sitedev = site_device.find();
//     if(sitedev.count() > 0){
//         var data = [];
//         _.each(sitedev.fetch(), function(row){
//             data.push(row.dev_id);
//         })
    
//         let result = [];
//         for (let index = 0; index < data.length; index++) {
//             let el = data[index];
//             if (!result.includes(el)) result.push(el);
//         }
    
//         _.each(result, function(dev_id){
//             // return sitelog.findOne({ dev_id : args.dev_id }, { sort:{ createdOn : -1 } } );
//             // var d = sitelog.findOne({ dev_id : dev_id }, { sort: { createdOn : -1 } } );
//             var d = sitelog.findOne({ dev_id : dev_id }, { sort: { _id : -1 } } );
//             if(typeof d !== 'undefined'){
//                 console.log(d);
//             }
//         })
//     }
// //     return sitelog.find();
// //     return sitelog.find({ dev_id : args.dev_id }, { sort:{ createdOn : -1 }, limit : 1 } );
//     return sitelog.find({ dev_id : args.dev_id }, { sort:{ _id : -1 }, limit : 1 } );
// }
