$(function(){


var theme = {
		  color: [
			  '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
			  '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
		  ],

		  title: {
			  itemGap: 8,
			  textStyle: {
				  fontWeight: 'normal',
				  color: '#408829'
			  }
		  },

		  dataRange: {
			  color: ['#1f610a', '#97b58d']
		  },

		  toolbox: {
			  color: ['#408829', '#408829', '#408829', '#408829']
		  },

		  tooltip: {
			  backgroundColor: 'rgba(0,0,0,0.5)',
			  axisPointer: {
				  type: 'line',
				  lineStyle: {
					  color: '#408829',
					  type: 'dashed'
				  },
				  crossStyle: {
					  color: '#408829'
				  },
				  shadowStyle: {
					  color: 'rgba(200,200,200,0.3)'
				  }
			  }
		  },

		  dataZoom: {
			  dataBackgroundColor: '#eee',
			  fillerColor: 'rgba(64,136,41,0.2)',
			  handleColor: '#408829'
		  },
		  grid: {
			  borderWidth: 0
		  },

		  categoryAxis: {
			  axisLine: {
				  lineStyle: {
					  color: '#408829'
				  }
			  },
			  splitLine: {
				  lineStyle: {
					  color: ['#eee']
				  }
			  }
		  },

		  valueAxis: {
			  axisLine: {
				  lineStyle: {
					  color: '#408829'
				  }
			  },
			  splitArea: {
				  show: true,
				  areaStyle: {
					  color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
				  }
			  },
			  splitLine: {
				  lineStyle: {
					  color: ['#eee']
				  }
			  }
		  },
		  timeline: {
			  lineStyle: {
				  color: '#408829'
			  },
			  controlStyle: {
				  normal: {color: '#408829'},
				  emphasis: {color: '#408829'}
			  }
		  },

		  k: {
			  itemStyle: {
				  normal: {
					  color: '#68a54a',
					  color0: '#a9cba2',
					  lineStyle: {
						  width: 1,
						  color: '#408829',
						  color0: '#86b379'
					  }
				  }
			  }
		  },
		  map: {
			  itemStyle: {
				  normal: {
					  areaStyle: {
						  color: '#ddd'
					  },
					  label: {
						  textStyle: {
							  color: '#c12e34'
						  }
					  }
				  },
				  emphasis: {
					  areaStyle: {
						  color: '#99d2dd'
					  },
					  label: {
						  textStyle: {
							  color: '#c12e34'
						  }
					  }
				  }
			  }
		  },
		  force: {
			  itemStyle: {
				  normal: {
					  linkStyle: {
						  strokeColor: '#408829'
					  }
				  }
			  }
		  },
		  chord: {
			  padding: 4,
			  itemStyle: {
				  normal: {
					  lineStyle: {
						  width: 1,
						  color: 'rgba(128, 128, 128, 0.5)'
					  },
					  chordStyle: {
						  lineStyle: {
							  width: 1,
							  color: 'rgba(128, 128, 128, 0.5)'
						  }
					  }
				  },
				  emphasis: {
					  lineStyle: {
						  width: 1,
						  color: 'rgba(128, 128, 128, 0.5)'
					  },
					  chordStyle: {
						  lineStyle: {
							  width: 1,
							  color: 'rgba(128, 128, 128, 0.5)'
						  }
					  }
				  }
			  }
		  },
		  gauge: {
			  startAngle: 225,
			  endAngle: -45,
			  axisLine: {
				  show: true,
				  lineStyle: {
					  color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
					  width: 8
				  }
			  },
			  axisTick: {
				  splitNumber: 10,
				  length: 12,
				  lineStyle: {
					  color: 'auto'
				  }
			  },
			  axisLabel: {
				  textStyle: {
					  color: 'auto'
				  }
			  },
			  splitLine: {
				  length: 18,
				  lineStyle: {
					  color: 'auto'
				  }
			  },
			  pointer: {
				  length: '90%',
				  color: 'auto'
			  },
			  title: {
				  textStyle: {
					  color: '#333'
				  }
			  },
			  detail: {
				  textStyle: {
					  color: 'auto'
				  }
			  }
		  },
		  textStyle: {
			  fontFamily: 'Arial, Verdana, sans-serif'
		  }
	  };
	
var dataStyle = {
	normal: {
	  label: {
		show: false
	  },
	  labelLine: {
		show: false
	  }
	}
};

var placeHolderStyle = {
	normal: {
	  color: 'rgba(0,0,0,0)',
	  label: {
		show: false
	  },
	  labelLine: {
		show: false
	  }
	},
	emphasis: {
	  color: 'rgba(0,0,0,0)'
	}
};		
		
if ($('#echart_mini_pie').length ){ 
	if( typeof (echarts) === 'undefined'){ return; }
//				console.log('init_echarts');
			  
			  var echartMiniPie = echarts.init(document.getElementById('echart_mini_pie'), theme);

			  echartMiniPie .setOption({
				title: {
				  text: '',
				  subtext: '',
				  sublink: '',
				  x: 'center',
				  y: 'center',
				  itemGap: 10,
				  textStyle: {
					color: 'rgba(30,144,255,0.8)',
					fontFamily: '微软雅黑',
					fontSize: 12,
					fontWeight: 'bolder'
				  }
				},
				tooltip: {
				  show: true,
				  formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
				  orient: 'vertical',
				  x: 170,
				  y: 5,
				  itemGap: 7,
				  data: ['68% Dewpoint 1', '29% Dewpoint 2', '3% Dewpoint 3', '29% Dewpoint 4'],
				},
				toolbox: {
				  show: true,
				  feature: {
					mark: {
					  show: true
					},
					dataView: {
					  show: false,
					  title: "Text View",
					  lang: [
						"Text View",
						"Close",
						"Refresh",
					  ],
					  readOnly: false
					},
					restore: {
					  show: false,
					  title: "Restore"
					},
					saveAsImage: {
					  show: false,
					  title: "Save Image"
					}
				  }
				},
				series: [{
				  name: '1',
				  type: 'pie',
				  clockWise: false,
				  radius: [65, 80],
				  itemStyle: dataStyle,
				  data: [{
					value: 68,
					name: '68% Dewpoint 1'
				  }, {
					value: 32,
					name: 'invisible',
					itemStyle: placeHolderStyle
				  }]
				}, {
				  name: '2',
				  type: 'pie',
				  clockWise: false,
				  radius: [50, 65],
				  itemStyle: dataStyle,
				  data: [{
					value: 29,
					name: '29% Dewpoint 2'
				  }, {
					value: 71,
					name: 'invisible',
					itemStyle: placeHolderStyle
				  }]
				}, {
				  name: '3',
				  type: 'pie',
				  clockWise: false,
				  radius: [35, 50],
				  itemStyle: dataStyle,
				  data: [{
					value: 30,
					name: '3% Dewpoint 3'
				  }, {
					value: 70,
					name: 'invisible',
					itemStyle: placeHolderStyle
				  }]
				}, {
				  name: '4',
				  type: 'pie',
				  clockWise: false,
				  radius: [0, 35],
				  itemStyle: dataStyle,
				  data: [{
					value: 15,
					name: '29% Dewpoint 4'
				  }, {
					value: 85,
					name: 'invisible',
					itemStyle: placeHolderStyle
				  }]
				}]
			  });
			  
			}	
	
	
	
	if ($('#chart_gauge_01').length){ 
		
		if( typeof (Gauge) === 'undefined'){ return; }
		
		  var chart_gauge_settings = {
			  lines: 12,
			  angle: 0,
			  lineWidth: 0.4,
			  pointer: {
				  length: 0.75,
				  strokeWidth: 0.042,
				  color: '#1D212A'
			  },
			  limitMax: 'false',
			  colorStart: '#00cdff',
			  colorStop: '#00c0ef',
			  strokeColor: '#F0F3F3',
			  generateGradient: true
		  };
		
		var chart_gauge_01_elem = document.getElementById('chart_gauge_01');
		var chart_gauge_01 = new Gauge(chart_gauge_01_elem).setOptions(chart_gauge_settings);
			
		}
	
		
		if ($('#gauge-text').length){ 
		
			chart_gauge_01.maxValue = 100;
			chart_gauge_01.animationSpeed = 32;
			chart_gauge_01.set(28);
			chart_gauge_01.setTextField(document.getElementById("gauge-text"));
		
		}
		
		if ($('#chart_gauge_02').length){
		
			var chart_gauge_02_elem = document.getElementById('chart_gauge_02');
			var chart_gauge_02 = new Gauge(chart_gauge_02_elem).setOptions(chart_gauge_settings);
			
		}
		
		
		if ($('#gauge-text2').length){
			
			chart_gauge_02.maxValue = 9000;
			chart_gauge_02.animationSpeed = 32;
			chart_gauge_02.set(2400);
			chart_gauge_02.setTextField(document.getElementById("gauge-text2"));
		
		}
	
	
	
	//-----------------
  //- SPARKLINE BAR -
  //-----------------
	if($('.sparkbar').length){
	  $('.sparkbar').each(function () {
		var $this = $(this);
		$this.sparkline('html', {
		  type: 'bar',
		  height: $this.data('height') ? $this.data('height') : '30',
		  barColor: $this.data('color')
		});
	  });
	}
	
	if($(".sparkline_discreet").length){
		$(".sparkline_discreet").sparkline([4, 6, 7, 7, 4, 3, 2, 1, 4, 4, 2, 4, 3, 7, 8, 9, 7], {
					type: 'discrete',
					barWidth: 3,
					lineColor: '#26B99A',
					width: '85',
				});
	}
	
});