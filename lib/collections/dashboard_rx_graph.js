dashboard_rx_graph = new Mongo.Collection('nms_dashboard_rx_graph');

dashboard_rx_graph.featured = function() {
  return dashboard_rx_graph.find({}, { fields: {_id: 1, site: 1, site_id: 1, link: 1, signal_strength: 1}, sort: {site: 1} });
}