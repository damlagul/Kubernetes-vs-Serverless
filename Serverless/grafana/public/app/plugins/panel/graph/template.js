/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register([],function(a,b){"use strict";var c;b&&b.id;return{setters:[],execute:function(){c='\n<div class="graph-wrapper" ng-class="{\'graph-legend-rightside\': ctrl.panel.legend.rightSide}">\n  <div class="graph-canvas-wrapper">\n\n    <div class="datapoints-warning" ng-if="ctrl.dataWarning">\n      <span class="small" bs-tooltip="ctrl.dataWarning.tip">{{ctrl.dataWarning.title}}</span>\n    </div>\n\n    <div grafana-graph class="histogram-chart" ng-dblclick="ctrl.zoomOut()">\n    </div>\n\n  </div>\n\n  <div class="graph-legend-wrapper" graph-legend></div>\n  </div>\n\n<div class="clearfix"></div>\n',a("default",c)}}});