scope = new Mongo.Collection("nms_scope");

scope.featured = function(){
    return scope.find({});
    // var site = Sites.findOne();
    // return [
    //     Sites.find({}),
    //
    // ]
}


// var featuredSkus = ["honeymoon-mars","johnny-liftoff","one-way-reentry"];
// return Products.find({sku : {$in : featuredSkus}},
//     {fields : {inventory : false, cost : false}}
// )
