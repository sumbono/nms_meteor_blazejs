dashboard_tx_graph = new Mongo.Collection('nms_dashboard_tx_graph');

dashboard_tx_graph.featured = function() {
  return dashboard_tx_graph.find({}, { fields: {_id: 1, site: 1, site_id: 1, fordward: 1, reverse: 1}, sort: {site: 1} });
}