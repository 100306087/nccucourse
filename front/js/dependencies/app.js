angular.module('fanpage2app', ['ngMaterial'])

.controller('AppCtrl', function($scope,$http,$location) {

  $scope.init = function(){
    if ($location.path().length<1) {
      console.log('nothing');
    }
    else{
      console.log($location.path());
      var par = $location.path().split('?')[1].split('&');
      for (var i = par.length - 1; i >= 0; i--) {
        par[i]= par[i].split('=');
      };
      $('.searcharea').animate({'margin-top':'50'},500);
      $scope.show.searchList = true;
      $scope.params = {department:par[0][1],time:par[1][1],star:par[2][1],key:par[3][1]};
      console.log($scope.params);
      $scope.tags = $scope.params.department.split(',');
      $scope.tags2 = $scope.params.time.split(',');
      $scope.tags3 = $scope.params.stars;
      $('.swaerch_key').val($scope.params.key);
      // $http.get(apiUrl+'?department='+$scope.tags+'&time='+$scope.tags+'&star='+$scope.tag3+'&key='+key)
      //   .success(function(response){
      //     $scope.courses = response;
      //   });
    }
  };

  $scope.show = {
    searchList:false
  };
  $scope.cleanSearch = function(){
    location.assign('/');
  };

  $scope.removeArrayItem = function(array,item){
    for (var i = array.length - 1; i >= 0; i--) {
      if(array[i] == item){
        array.splice(i, 1);
      }
    }
  };
  
  $scope.departments = ['法律系','資管系','應數系'];
  $scope.days = ['星期一早上','星期一中午','星期一下午','星期二','星期三','星期四','星期五'];
  $scope.stars = ['1顆星以上','2顆星以上','3顆星以上','4顆星以上','5顆星以上'];
  $scope.tag3 = '1顆星以上';
  $scope.tags = ['法律系'];
  $scope.tags2 = [];
  $scope.courses = [
    {name:'python程式入門',time:'星期三D~6',teacher:'曾正男',scores:'75~80',star:'5顆星'},
    {name:'python程式入門',time:'星期三D~6',teacher:'曾正男',scores:'75~80',star:'5顆星'},
    {name:'python程式入門',time:'星期三D~6',teacher:'曾正男',scores:'75~80',star:'5顆星'},
    {name:'python程式入門',time:'星期三D~6',teacher:'曾正男',scores:'75~80',star:'5顆星'},
    {name:'python程式入門',time:'星期三D~6',teacher:'曾正男',scores:'75~80',star:'5顆星'},
    {name:'python程式入門',time:'星期三D~6',teacher:'曾正男',scores:'75~80',star:'5顆星'},
  ];

  $scope.addTag = function(tag){
    var repeat;
    for (var i = $scope.tags.length - 1; i >= 0; i--) {
      if ($scope.tags[i] == tag){
        repeat = true;
      }
    }
    if (!repeat) {
        $scope.tags.push(tag); 
    }
  };
  $scope.addTag2 = function(tag){
    var repeat;
    for (var i = $scope.tags.length - 1; i >= 0; i--) {
      if ($scope.tags2[i] == tag){
        repeat = true;
      }
    }
    if (!repeat) {
        $scope.tags2.push(tag); 
    }
  };

  $scope.deleteTag = function(tag){
    console.log(tag);
    $scope.removeArrayItem($scope.tags, tag);
  };
  $scope.deleteTag2 = function(tag){
    console.log(tag);
    $scope.removeArrayItem($scope.tags2, tag);
  };

  $scope.search = function(){
    var key = $('.swaerch_key').val();
    console.log('系所：'+$scope.tags+'/時間：'+$scope.tags2+'/星星：'+$scope.tag3+'/關鍵字：'+key);
    $('.searcharea').animate({'margin-top':'50'},500);
    // $http.get(apiUrl+'?department='+$scope.tags+'&time='+$scope.tags+'&star='+$scope.tag3+'&key='+key)
    //   .success(function(response){
    //     $scope.courses = response;
    //   });
    $location.path('?department='+$scope.tags+'&time='+$scope.tags2+'&star='+$scope.tag3+'&key='+key+'&page=1&sort=rate');
    console.log($location.path());
    $scope.show.searchList = true;
  }



});