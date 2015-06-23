var MRT_Express = angular.module('MRT_Express', ['ngMaterial','ngCordova']);

// Station list page controller
MRT_Express.controller('list_controller', function ($scope, $http, $cordovaGeolocation){

  $scope.url = 'http://m.j91.me';
	$scope.page = 'stations_list';
  $('svg#layer1').css('height', $(window).height()-60);

  $scope.getStationsChtMap = function($deferrd){
    var station_cht_map = {};
    return $http.get($scope.url + '/station_map/json/station_map')
      .success(function (response) {
        $scope.StationsChtMap  = response;
        $deferrd.resolve();
    })
  };

  //station-init
  $scope.initStation = function () {
    var area = 
        d3.select('svg#layer1 g')
        .selectAll('a')
        .data($scope.StationsChtMap)
        .enter()
        .append('a')
        .attr({"xlink:href":function(text){return 'platform.html?sid=' + text.sid;}});
    var text = 
        area.append('text')
        .attr({"x":function(text){return text.x;},"y":function(text){return text.y;}});
    text.append('tspan')
        .attr('class', 'cht-name')
        .text(function(text){return text.name;});
    text.append('tspan')
        .attr({"x":function(text){return text.x;},"dx":function(text){return text.en_name_1_dx == null ? "0" : text.en_name_1_dx;},"dy":"6","class":"en-name"})
        .text(function(text){return text.en_name_1;});
    text.append('tspan')
        .attr({"x":function(text){return text.x;},"dx":function(text){return text.en_name_2_dx == null ? "0" : text.en_name_2_dx;},"dy":"6","class":function(text){return text.en_name_2 == null ? "remove" : "en-name";}})
        .text(function(text){return text.en_name_2;});
    area.append('circle')
        .attr({'class':function(text){if(text.station_circle_map_cx == null){return 'remove';}},'cx':function(text){return text.station_circle_map_cx;},'cy':function(text){return text.station_circle_map_cy;},'fill': function(text){return text.station_circle_map_fill;},'r':function(text){return text.station_circle_map_r;},'stroke':function(text){return text.station_circle_map_stroke;}, 'stroke-width':function(text){return text.station_circle_map_stroke_width;}, 'stroke-miterlimit':22.9256 });
    area.append('circle')
        .attr({'class':function(text){if(text.trans_circlex == null){return 'remove';}},'cx':function(text){return text.trans_circlex;},'cy':function(text){return text.trans_circley},'r':'1.8px','fill':'#666666'});
    area.append('path')
        .attr({'class':function(text){if(text.path_d == null){return 'remove';}},'fill':'none','stroke':'#666666','stroke-width':"3px",'stroke-miterlimit':"22.9256",'d':function(text){return text.path_d;}});
    area.append('path')
        .attr({'class':function(text){if(text.path_d2 == null){return 'remove';}},'fill':'#ffffff','d':function(text){return text.path_d2;}});
    d3.selectAll('.remove').remove();
    d3.select('svg#layer1').style({'display':'block'});
  };

  $scope.zoomInit = function() {
    $scope.eventsHandler = {
      haltEventListeners: ['touchstart', 'touchend', 'touchmove', 'touchleave', 'touchcancel']
      , init: function(options) {
        var instance = options.instance
          , initialScale = 1
          , pannedX = 0
          , pannedY = 0
          // Init Hammer
          // Listen only for pointer and touch events
          this.hammer = Hammer(options.svgElement, {
            inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput
          })
          this.hammer.on('tap', function(ev){
            if (ev.target.tagName == "tspan" || ev.target.tagName == "circle" || ev.target.tagName == "path") {
              if (ev.target.__data__.sid != null) {
                document.location.href = "platform.html?sid=" + ev.target.__data__.sid;
              }
            };
          })
          // Enable pinch
          this.hammer.get('pinch').set({enable: true})
          // Handle double tap
          this.hammer.on('doubletap', function(ev){
            instance.zoomIn()
          })
          // Handle pan
          this.hammer.on('panstart panmove', function(ev){
            // On pan start reset panned variables
            if (ev.type === 'panstart') {
              pannedX = 0
              pannedY = 0
            }
            // Pan only the difference
            instance.panBy({x: ev.deltaX - pannedX, y: ev.deltaY - pannedY})
            pannedX = ev.deltaX
            pannedY = ev.deltaY
          })
          // Handle pinch
          this.hammer.on('pinchstart pinchmove', function(ev){
            // On pinch start remember initial zoom
            if (ev.type === 'pinchstart') {
              initialScale = instance.getZoom()
              instance.zoom(initialScale * ev.scale)
            }
            instance.zoom(initialScale * ev.scale)
          })
          // Prevent moving the page on some devices when panning over SVG
          options.svgElement.addEventListener('touchmove', function(e){ e.preventDefault(); });
        }
        , destroy: function(){
            this.hammer.destroy()
          }
        };
    $scope.Zoom = svgPanZoom('svg#layer1', {
      zoomEnabled: true
    , minZoom: 1.5
    , fit: 1
    , center: 1
    , refreshRate: 25
    , customEventsHandler: $scope.eventsHandler
    });
    $scope.Zoom.zoom(1.5);
  };

  $scope.init = function () {
    var dd = $.Deferred();
    $scope.getStationsChtMap(dd);
    $.when(dd).done(function(){
      $scope.initStation();
      $scope.zoomInit();
    });
    $('.index').css('overflow','hidden');
  };
	$scope.getStations = function(){
		var station = {};
	  $.ajax({
	    async: false,
	    url: $scope.url + '/station/json/station_view',
	    type: 'GET',
	    dataType: 'json',
	    success: function(data) {
	      station = data;
	    }
	  });
	  return station;
	};
	$scope.stations  = $scope.getStations();

	// Station list Search bar
	$scope.searchShow = false;
	$scope.searchToggle = function(e){
		e.preventDefault();
		$scope.searchShow = !$scope.searchShow;
		if ($scope.searchShow) {
			$(".station_list .mainnav_locationbtn_img").attr('src','images/x.png');
		}
		else if(!$scope.searchShow){
			$(".station_list .mainnav_locationbtn_img").attr('src','images/search.png');
			$scope.search = "";
		}
	};

	// Station list Line label
	$scope.slideToLine = function(e){
		e.preventDefault();	
		var href = $(event.target).parent('a').attr('href');
		var offset = $(href).offset().top-55;
		$('html, body').animate({scrollTop:offset},300);
	};

	// Open/Close Station List
  $scope.stationMenuShow = false;
	$scope.menuButton = function() {
		if ( $('.station_list').css('display') != 'none' ) {
			$('.station_list').hide('500');
			setTimeout(function () {
				$('.index').show();
			},400);
		} else {
			$('.index').hide();
			$('.station_list').show('500');
		};
	};
  $scope.MenuToggle = function(){
    $('.menulist').toggle();
  };

  $scope.backButton = function () {
    history.back();
  };

  // Get Neraly Station
  $scope.geolocation = function ($deferred, $location) {
    var options = { timeout: 8000, enableHighAccuracy: false };
    $cordovaGeolocation
      .getCurrentPosition(options)
      .then(function (position) {
        $location.push(position.coords.latitude);
        $location.push(position.coords.longitude);
        $deferred.resolve();
      }, function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
        $('.location-loader').addClass('hide');
      });
  };
  
  $scope.toRadians = function (degree) {
    return degree * Math.PI /180 ;  
  };

  $scope.distance = function (latitude1,longitude1,latitude2,longitude2) {
    //R 是地球半徑，以KM為單位
    var R=6371;
    var deltalatitude = $scope.toRadians(latitude2-latitude1);
    var detalongitude = $scope.toRadians(longitude2-longitude1);
    latitude1 = $scope.toRadians(latitude2);
    var a = Math.sin(deltalatitude/2) * Math.sin(deltalatitude/2) + Math.cos(latitude1) * Math.cos(latitude2) * Math.sin(detalongitude/2) * Math.sin(detalongitude/2);
    var c = 2 * Math.atan(Math.sqrt(a),Math.sqrt(1-a));
    var d = R * c;
    return d;
  };

  $scope.FindLocation = function () {
    $('.location-loader').removeClass('hide');
    var deferred = $.Deferred();
    var current_location = [];
    var nearly_sid = "";
    $scope.geolocation(deferred, current_location);
    $.when(deferred)
      .done(function(){
        document.location.href = "location.html?lat=" + current_location[0] + '&lon=' + current_location[1];
      });
  };

  $scope.LocationInit = function () {
    var lat = location.search.split('?lat=')[1].split('&lon=')[0],
        lon = location.search.split('?lat=')[1].split('&lon=')[1],
        match_result = {},
        match_sort = [],
        current_location = [lat,lon];
    $.each($scope.stations, function(i, station) {
      var distance_result = $scope.distance(current_location[0], current_location[1], station.lat, station.lon);
      match_sort.push(distance_result);
      match_result[distance_result] = ({sid: station.sid, name: station.name, lat: station.lat, lon: station.lon, meter: Math.floor(distance_result * 1000)});
    });
    match_sort = match_sort.sort(function (a, b){return a - b});
    $scope.nearlyData = [];
    for (var i = 0, j = 0; j < 8; i++) {
      if ( i > 0 ) {
        if ( match_result[match_sort[i]].sid != match_result[match_sort[i-1]].sid ) {
          $scope.nearlyData.push(match_result[match_sort[i]]);
          j++;
        };
      } else{
        $scope.nearlyData.push(match_result[match_sort[i]]);
        j++;
      }; 
    };
    console.log($scope.nearlyData);
  };
  $scope.menuPageContentShow = {about:false, update:true};
  $scope.closeMenuPage = function(){
    $('.menupage').toggle();
    $('body').css('overflow','auto');
    $('.menulist').toggle();
  };
  $scope.openMenuPage = function(page){
    if (page == 1) {
      $scope.menuPageContentShow.update = true;
      $scope.menuPageContentShow.about = !$scope.menuPageContentShow.update;

    }else if (page == 2) {
      $scope.menuPageContentShow.update = false;
      $scope.menuPageContentShow.about = !$scope.menuPageContentShow.update;
    };
    $('.menupage').toggle();
    $('body').css('overflow','hidden');
  };

});

// Platform page controller
MRT_Express.controller('platform_controller', function ($scope) {

  $scope.url = 'http://m.j91.me';
	// Platform page init
  $scope.Init = function () {
    var sid = location.search.split('?sid=')[1];
    if ( sid != undefined ) {
      $scope.platforms = $scope.getPlatforms(sid);
      $scope.station_name = $scope.platforms[0].station_name;
      $scope.infotmation_id = $scope.getPlatformsId($scope.platforms);
      $scope.doorView = $scope.getDoorData($scope.infotmation_id);
      $scope.platformView = $scope.getPlatformViewData($scope.infotmation_id);
      $scope.platformShow = $scope.platformEdit($scope.infotmation_id, $scope.platformView, $scope.doorView);
      $scope.swipeInit();
    } else {
      history.back();
    };  
    $('.showBigBtn').css('right',(window.innerWidth-60)/2+'px');
  };

  $scope.getPlatformsId = function (platform) {
    var platform_id = [];
    for (var i = 0; i < platform.length; i++) {
      platform_id.push(platform[i].id);
    };
    return platform_id;
  };

  $scope.getDoorData = function (id) {
    var door_data = [];
    for (var i = 0; i < id.length; i++) {
      door_data.push($scope.getDoor(id[i]));
    };
    return door_data;
  };

  $scope.getPlatformViewData = function (id) {
    var platform_data = [];
    for (var i = 0; i < id.length; i++) {
      platform_data.push($scope.getPlatformView(id[i]));
    };
    return platform_data;
  };

  $scope.platformEdit = function ($id, $data, $door) {
    var id = $id;
    var doordata = $door;
    var data = $data;
    var platformData = [];
    for (var i = 0; i < id.length; i++) {
      var platform = {};
      platform.train = {};
      platform.pid = data[i].field_platform_id;
      if ( data[i].field_station_train_direction.length == 1 ) {
        platform.line = data[i].field_station_train_direction[0].split('-')[0];
        platform.train_direction = data[i].field_station_train_direction[0].split('-')[1];
      } else{
        platform.line = data[i].field_station_train_direction[0].split('-')[0];
        platform.train_direction = data[i].field_station_train_direction[0].split('-')[1] + '、' + data[i].field_station_train_direction[1].split('-')[1];
      };
      // add empty train Object to new Object
      for (var g = 1; g <= data[i].field_train_quantity; g++) {
        var name = 'train' + g;
        platform.train[name] = {label:name, door:{}, type:[], station_place:[], exit_no:[], transfer:[]};
      };
      if ( doordata[i][0].door != null ) {
        // add empty door Object to train Object
        angular.forEach(doordata[i], function (door) {
          var name = 'train' + door.door.split('-')[0];
          platform.train[name].door[door.door] = {label:door.door, type:[], station_place:[], exit:[], exit_no:[], exit_place:[], transfer:[]};
        });
        // add all facilities_door data to new Object
        angular.forEach(data[i].field_facilities_door, function (facilities_door) {
          var train = [];
          var door_num = [];
          // add train/door data to array
          angular.forEach(facilities_door.field_door, function (door) {
            train.push('train' + door.split('-')[0]);
            door_num.push(door);
          });
          angular.forEach(facilities_door.field_facilities, function (facilities) {
            // Platform page train data
            for (var h = 0; h < train.length; h++) {
              // add facilty type to train
              if ( platform.train[train[h]].type.indexOf(facilities.field_facilities_type) < 0 ) {
                platform.train[train[h]].type.push(facilities.field_facilities_type);
              };
              // add station_place data to train
              if ( facilities.field_station_place != undefined ) {
                angular.forEach(facilities.field_station_place, function (place) {
                  if ( platform.train[train[h]].station_place.indexOf(place) < 0 ) {
                    platform.train[train[h]].station_place.push(place);
                  };
                });
              };
              // add exit data to train
              if ( facilities.field_exit != undefined ) {
                angular.forEach(facilities.field_exit, function (exit) {
                  if ( platform.train[train[h]].exit_no.indexOf(exit.field_exit_no) < 0 ) {
                    platform.train[train[h]].exit_no.push(exit.field_exit_no);
                  };
                });
              };
              // add transfer data to train
              if ( facilities.field_transfer_platform != undefined ) {
                platform.train[train[h]].transfer = (facilities.field_transfer_platform[0].line_no);
              };
            };
            // Platform page door data
            for (var h = 0; h < door_num.length; h++) {
              // add facilty type to door
              if ( platform.train[train[h]].door[door_num[h]].type.indexOf(facilities.field_facilities_type) < 0 ) {
                platform.train[train[h]].door[door_num[h]].type.push(facilities.field_facilities_type);
              };
              // add station_place data to door
              if ( facilities.field_station_place != undefined ) {
                angular.forEach(facilities.field_station_place, function (place) {
                  if ( platform.train[train[h]].door[door_num[h]].station_place.indexOf(place) < 0 ) {
                    platform.train[train[h]].door[door_num[h]].station_place.push(place);
                  };
                });
              };
              // add exit data to door
              if ( facilities.field_exit != undefined ) {
                angular.forEach(facilities.field_exit, function (exit) {
                  if ( platform.train[train[h]].door[door_num[h]].exit_no.indexOf(exit.field_exit_no) < 0 ) {
                    platform.train[train[h]].door[door_num[h]].exit_no.push(exit.field_exit_no);
                  };
                  if ( platform.train[train[h]].door[door_num[h]].exit_place.indexOf(exit.field_important_place) < 0 ) {
                    platform.train[train[h]].door[door_num[h]].exit_place.push(exit.field_important_place);
                  };
                  var exit_info = exit.field_exit_no + ' ' + exit.field_important_place;
                  if ( platform.train[train[h]].door[door_num[h]].exit.indexOf(exit_info) < 0 ) {
                    platform.train[train[h]].door[door_num[h]].exit.push(exit_info);
                  }
                });
              };
              // add transfer data to door
              if ( facilities.field_transfer_platform != undefined ) {
                platform.train[train[h]].door[door_num[h]].transfer = (facilities.field_transfer_platform[0].line_no);
              };
            };
          });
        });
      };
      platformData.push(platform);
    };
    console.log(platformData);
    return platformData;
  };

	// Get Platform list Data
	$scope.getPlatforms = function ($sid) {
    var platform = {};
    var link = $scope.url + "/platform/json/platform_view?sid=" + $sid;
    $.ajax({
      async: false,
      url: link,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        platform = data;
      }
    });
    return platform;
  };

  // Get Door Number (without same)
  $scope.getDoor = function ($id) {
    var Doorview = {};
    var link = $scope.url + "/door/json/door_view?id=" + $id;
    $.ajax({
      async: false,
      url: link,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        Doorview = data;
      }
    });
    return Doorview;
  };

  // Get Platform information Data
  $scope.getPlatformView = function ($id) {
    var platformview = {};
    var link = $scope.url + "/api/echo_service/information/" + $id;
    $.ajax({
      async: false,
      url: link,
      type: 'GET',
      dataType: 'json',
      success: function(data) {
        platformview = data;
      }
    });
    return platformview;
  };

  $scope.backButton = function () {
  	history.back();
  };
  $scope.platformBigToggle = function(event){
    event.preventDefault();
    $('html, body').animate({scrollTop:0},1);
    $('.station_platfrom_big').toggle();
    $('.station_platfrom').toggle();
  };
  $scope.rightValueC = (window.innerWidth-60)/2-30+'px';
  $scope.rightValue = (window.innerWidth-60)/2+'px';
  $scope.platformBigToggleSpecial = function (event){
      event.preventDefault();
      $('.showBigBtn').animate({width:'120px',height:'120px', right: $scope.rightValueC, opacity:'0.1'},400);
      setTimeout(function(){
        $('.station_platfrom_big').toggle();
        $('.station_platfrom').toggle();
        var href = $(event.target).attr('href');
        var offset = $(href).offset().top-200;
        $('html, body').animate({scrollTop:offset},500);
        $('.showBigBtn').animate({width:'60px',height:'60px', right:$scope.rightValue, opacity:'1'},10);
      },400);
  };

  //SwipePlatform
  $scope.currentPlatformNav = {};
  $scope.swipeInit = function(){
    $scope.speed = 500;
    $scope.currentPlatform = 0;
    $scope.deviceWith = window.innerWidth;
    $scope.maxPlatform = $scope.platforms.length;
    $scope.allWidth = $scope.maxPlatform * $scope.deviceWith;
    $('.platformContainer_platfroms').css('width',$scope.allWidth);
    $scope.platformNameStyle = function($index){
      return { "width":100/$scope.maxPlatform+"%", "left":$index/$scope.maxPlatform*100+"%"}
    };
    $scope.platformStyle = {"width": $scope.deviceWith + 'px'};
    $(".platformContainer").swipe($scope.swipeOption);
    $scope.currentPlatformNav= {
      pid : $scope.platformShow[0].pid,
      train_direction: $scope.platformShow[0].train_direction
    };
  };

  $scope.platformBigNavStyle = function(){
    return {'width':'100%'};
  };

  $scope.platformNameClass = function($index){
    if($index == $scope.currentPlatform){
      return "platform_active";
    };
  };

  $scope.changeActive = function(num){
    $('.platform_active').removeClass('platform_active');
    var target = $('.secondnav_forplatform_platformname')[num];
    if (target.classList){
      target.classList.add('platform_active');
    }
    else{
      target.className += ' ' + 'platform_active';
    };
  };

  $scope.clickScroll = function($index){
    $scope.currentPlatform = $index;
    $scope.scrollDiv($scope.deviceWith * $scope.currentPlatform, $scope.speed);
  }

  $scope.lastDiv = function($index) {
    $scope.currentPlatform = Math.max($scope.currentPlatform - 1, 0);
    var index = $scope.currentPlatform;
    $scope.currentPlatformNav.pid = $scope.platformShow[index].pid;
    $scope.currentPlatformNav.train_direction = $scope.platformShow[index].train_direction;
    $('.platform_name').text('月台'+$scope.currentPlatformNav.pid+'|往'+$scope.currentPlatformNav.train_direction);
    $scope.scrollDiv($scope.deviceWith * $scope.currentPlatform, $scope.speed);
  };

  $scope.nextDiv = function($index) {
    $scope.currentPlatform = Math.min($scope.currentPlatform + 1, $scope.maxPlatform - 1);
    var index = $scope.currentPlatform;
    $scope.currentPlatformNav.pid = $scope.platformShow[index].pid;
    $scope.currentPlatformNav.train_direction = $scope.platformShow[index].train_direction;
    $('.platform_name').text('月台'+$scope.currentPlatformNav.pid+'|往'+$scope.currentPlatformNav.train_direction);
    $scope.scrollDiv($scope.deviceWith * $scope.currentPlatform, $scope.speed);
  };

  $scope.scrollDiv = function(distance, duration) {
    $(".platformContainer_platfroms").css("transition-duration", (duration / 1000).toFixed(1) + "s");
    var value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
    $(".platformContainer_platfroms").css("transform", "translate(" + value + "px,0)");
    $scope.changeActive($scope.currentPlatform);
  };

  $scope.swipeStatus = function(event, phase, direction, distance) {
    if (phase == "move" && (direction == "left" || direction == "right")) {
      var duration = 0;
      if (direction == "left") {
        var dis = ($scope.deviceWith * $scope.currentPlatform) + distance;
        var d = dis - $scope.deviceWith * ($scope.currentPlatform);
        if (Math.abs(d)>30) {
          $scope.scrollDiv(dis, duration);
        };
      } else if (direction == "right") {
        var dis = ($scope.deviceWith * $scope.currentPlatform) - distance;
        var d = dis - $scope.deviceWith * ($scope.currentPlatform);
        if (Math.abs(d)>30) {
          $scope.scrollDiv(dis, duration);
        };
      };
    } else if (phase == "cancel") {
        $scope.scrollDiv($scope.deviceWith * $scope.currentPlatform, $scope.speed);
    } else if (phase == "end") {
      if (direction == "right") {
        $scope.lastDiv();
      } else if (direction == "left") {
        $scope.nextDiv();
      };
    };
  };

  $scope.swipeOption = {
    triggerOnTouchEnd: true,
    swipeStatus: $scope.swipeStatus,
    allowPageScroll: "vertical",
    threshold: 60
  };

  $scope.platformBigCard = {};
  $scope.cardShow = false;
  $scope.cardShowFun = function(no){
    $scope.cardShow = true;
    $scope.platformBigCard.no = no;
    $("body").css("overflow", "hidden");
  };
  $scope.cardShowFunClose = function(){
    $scope.cardShow = false;
    $("body").css("overflow", "auto");
  };


  $scope.carriageEmptyStyle = function(obj){
    var size = 0 , key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    if (size == 0) {
      return { opacity: '0.2','box-shadow':'none'};
    }
  };

  $scope.carriageEmptyShow = function(obj){
    var size = 0 , key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    if (size == 0) {
      return false;
    }
    else if(size > 0){
      return true;
    }
  };

});

MRT_Express.controller('download_controller', function ($scope, $cordovaFile, $cordovaDialogs){
  document.addEventListener("deviceready", init, false);
  function init () {
    $scope.downloadFile = function($link, $file, $folder) {
      if ($folder == undefined) {
        $folder = "";
      };
      var fileTransfer = new FileTransfer(),
          url = 'http://m.j91.me/' + $link ,
          filePath = cordova.file.dataDirectory + 'MRT-Express' + $folder + '/' + $file ;
      fileTransfer.download(url, filePath, 
        function(entry) {
          $scope.$apply(function(){
            $scope.now++;
          });
        }, 
        function(err) {
          setTimeout(function(){ 
            $scope.downloadFile($link, $file, $folder);
          }, 2000);
        });
    };
    $scope.getJsonFile = function ($file, $folder) {
      if ($folder == undefined) {
        $folder = "";
      };
      var jsondata = {};
      $cordovaFile.readAsText(cordova.file.dataDirectory + 'MRT-Express' + $folder, $file).then();
      $.ajax({
        async: false,
        url: cordova.file.dataDirectory + 'MRT-Express' + $folder + '/' + $file,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          jsondata = data;
        }
      });
      return jsondata;
    };
    $scope.stations  = $scope.getJsonFile('station_view');
    $scope.downloadInformationData = function ($data) {
      var platform_Data = $data;
      for (var j = 0; j < platform_Data.length; j++) {
        $scope.total++;
        $scope.total++;
        var id = platform_Data[j].id;
        $scope.downloadFile('door/json/door_view?id=' + id, id, '/door_view');
        $scope.downloadFile('api/echo_service/information/' + id, id, '/information');
      };
    };
    $scope.CheckPlatform = function ($sid) {
      $cordovaFile.checkFile(cordova.file.dataDirectory, 'MRT-Express/platform/' + $sid)
        .then(function (success) {
          var platformData = $scope.getJsonFile($sid, '/platform');
          $scope.downloadInformationData(platformData);
        }, function (error) {
          setTimeout(function(){ 
            $scope.CheckPlatform($sid);
          }, 2000);
        });
    };
    $scope.downloadPlatformData = function ($data) {
      var stationData = $data;
      for (var i = 0; i < stationData.length; i++) {
        $scope.total++;
        var sid = stationData[i].sid;
        $scope.downloadFile('platform/json/platform_view?sid=' + sid, sid, '/platform');
        setTimeout(function(){
          $scope.CheckPlatform(sid);
        }, 2000);
      };
    };
    $scope.CheckSID = function () {
      $cordovaFile.checkFile(cordova.file.dataDirectory, 'MRT-Express/station_map')
        .then(function (success) {
          $scope.StationsChtMap = $scope.getJsonFile('station_map');
          $scope.downloadPlatformData($scope.StationsChtMap);
        }, function (error) {
          setTimeout(function(){ 
            $scope.CheckSID();
          }, 3000);
        });
    };
    $cordovaDialogs.alert('Start Download File!', 'Need to Download', 'OK')
      .then(function() {
        $scope.total = 0;
        $scope.now = 0;
        $scope.total++;
        $scope.total++;
        $scope.downloadFile('station/json/station_view', 'station_view');
        $scope.downloadFile('station_map/json/station_map', 'station_map');
        $scope.CheckSID();
      });
  };
});

// Cordova back button function
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady(){
  document.addEventListener("backbutton", function(e){
    e.preventDefault();
    var url = location.pathname.split('/')[3];
    if (url == "index.html") {
      var display = $('.index').css('display');
      if (display == "block") {
        if (confirm("Exit App??")) {
          navigator.app.exitApp();
        };
      } else {
        $('.station_list').hide('500');
        setTimeout(function () {
          $('.index').show();
        },400);
      };
    } else if (url == "platform.html") {
      var display = $('.station_platfrom').css('display');
      if (display == "block") {
        history.back();
      } else {
        $('.station_platfrom_big').addClass('ng-hide');
        $('.station_platfrom').removeClass('ng-hide');
      };
    } else if (url == "location.html") {
      history.back();
    };
  }, false);
}