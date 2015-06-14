angular.module('fanpage2app', ['ngMaterial'])

.controller('AppCtrl', function($scope) {

  $scope.show = {
    searchList:false
  };

  $scope.removeArrayItem = function(array,item){
    for (var i = array.length - 1; i >= 0; i--) {
      if(array[i] == item){
        array.splice(i, 1);
      }
    }
  };
  
  $scope.departments = ['法律系','資管系','應數系'];
  $scope.days = ['星期一','星期二','星期三','星期四','星期五'];
  $scope.stars = ['1顆星以上','2顆星以上','3顆星以上','4顆星以上','5顆星以上'];
  $scope.tag3 = '1顆星以上';
  $scope.tags = ['法律系'];
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

  $scope.deleteTag = function(tag){
    console.log(tag);
    $scope.removeArrayItem($scope.tags, tag);
  };

  $scope.search = function(){
    $('.searcharea').animate({'margin-top':'50'},500);
    $scope.show.searchList = true;
  }



});