site = new Mongo.Collection("nms_site");

site.featured = function(){
    return site.find({}, {fields: {_id: 1, name: 1, region_id: 1, province_id:1, site_id: 1, status: 1}, sort: {name: 1} });
    // var site = Sites.findOne();
    // return [
    //     Sites.find({}),
    //
    // ]
}

// site.completed = function(args){
//     let site_id = new Mongo.ObjectID(args);
//     var data_site = site.find({ _id : new Mongo.ObjectID(args) });
//     // console.log(site.find({ _id : new Mongo.ObjectID(args) }));
//     // var siteData = [];
//     _.each(data_site.fetch(), function(row){
//         // siteData.push(row);
//         let data_site_device = site_device.find({site_id : site_id});
//         // var siteDevData = [];
//         _.each(data_site_device.fetch(), function(rowSite){
//             // siteData["site_device"] = siteDevData.push();
//             // row.push({"site_device" : rowSite});
//             console.log(rowSite);
//         })
//     })
//
//     // return siteData;
// }

//
// site.findOne = function(args){
//     return _.find(site, function(row){
//         return row._id === args._id;
//     })
// }


// var featuredSkus = ["honeymoon-mars","johnny-liftoff","one-way-reentry"];
// return Products.find({sku : {$in : featuredSkus}},
//     {fields : {inventory : false, cost : false}}
// )
