var app = angular.module('fanpage2app', ['ngMaterial']);

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});

app.controller('AppCtrl', function($scope,$http,$location) {

  $scope.init = function(){
    $http.get('http://140.119.19.39:8000/islogin').success(function(response) {
      if (response.result == 'success') {$scope.member = '我的推薦';}
      else{
        $scope.member = '登入';
        $('.member').attr('href',"http://140.119.19.39:8000/login/facebook/?next=http://140.119.19.39:8000/static/index/");
      }
    });
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
      $scope.params = {department:par[0][1],time:par[1][1],stars:par[2][1],key:par[3][1],page:par[4][1]};
      console.log($scope.params);
      if ($scope.params.department.length>0) {
        $scope.tags = $scope.params.department.split(',');
      }
      if ($scope.params.time.length>0) {
        $scope.tags2 = $scope.params.time.split(',');
      }
      $scope.tags3 = $scope.params.stars+'顆星以上';

      $('.swaerch_key').val($scope.params.key);
      $http.get('http://140.119.19.39:8000/dosearch/'+'?department='+$scope.params.department+'&time='+$scope.params.time+'&stars='+$scope.params.stars+'&key='+$scope.params.key+'&page=1')
      .success(function(response){
        $scope.courses = response.courses;
        console.log($scope.courses);
        if (response.allnumber > 100) { response.allnumber = 101};
        $scope.courses.quantity = response.allnumber;
        $scope.pager = [];
        page = Math.floor(($scope.courses.quantity-1)/10);
        for (var i = 0; i<page; i++) {
          $scope.pager[i] = i+1;
        };
        setTimeout(function(){$('.pager'+$scope.params.page).addClass('active');},100);
      });
    }
  };

  $scope.show = {
    searchList:false
  };
  $scope.cleanSearch = function(){
    location.assign('index.html');
  };

  $scope.removeArrayItem = function(array,item){
    for (var i = array.length - 1; i >= 0; i--) {
      if(array[i] == item){
        array.splice(i, 1);
      }
    }
  };
  
  $scope.departments = ['法律系','資管系','應數系'];
  $scope.days = ['一','二','三','四','五'];
  $scope.stars = ['1顆星以上','2顆星以上','3顆星以上','4顆星以上','5顆星以上'];
  $scope.tag3 = '1顆星以上';
  $scope.tags = [];
  $scope.tags2 = [];

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

  $scope.search = function(num){
    var key = $('.swaerch_key').val();
    console.log('系所：'+$scope.tags+'/時間：'+$scope.tags2+'/星星：'+$scope.tag3.split('')[0]+'/關鍵字：'+key);
    $('.searcharea').animate({'margin-top':'50'},500);
    $http.get('http://140.119.19.39:8000/dosearch/'+'?department='+$scope.tags+'&time='+$scope.tags2+'&stars='+$scope.tag3.split('')[0]+'&key='+key+'&page='+num)
      .success(function(response){
          $scope.courses = response.courses;
          console.log($scope.courses);
          if (response.allnumber > 101) { response.allnumber = 101};
          $scope.courses.quantity = response.allnumber;
          $scope.pager = [];
          page = Math.floor(($scope.courses.quantity-1)/10);
          for (var i = 0; i<page; i++) {
            $scope.pager[i] = i+1;
          };
          $('.active').removeClass('active');
          $('.pager'+num).addClass('active');
      });
    $location.path('?department='+$scope.tags+'&time='+$scope.tags2+'&stars='+$scope.tag3.split('')[0]+'&key='+key+'&page='+num);
    $scope.show.searchList = true;
  };
  $scope.goCourse = function(id){
    location.assign('course.html?id='+id);
  };
  $scope.changePage = function(e,n){
    e.preventDefault();
    $scope.search(n);
  };
});

app.controller('CourseCtrl',function($scope, $http){
  $scope.init = function(){
    $http.get('http://140.119.19.39:8000/islogin').success(function(response) {
      if (response.result == 'success') {$scope.member = '我的推薦';}
      else{
        $scope.member = '登入';
        $('.member').attr('href',"http://140.119.19.39:8000/login/facebook/?next=http://140.119.19.39:8000/static/index/");
      }
    });
    var id = location.search.split('?id=')[1];
    $http.get('http://140.119.19.39:8000/moreinfor/?courseid='+id)
    .success(function(response){
      console.log(response);
      $scope.courseContent = response.course[0];
      $scope.courseReview = response.reviews;
      var total = 0;
      for (var i = $scope.courseReview.length - 1; i >= 0; i--) {
        total = total + $scope.courseReview[i].course_score;
        $scope.courseReview[i].user = '姚德謙';
        $scope.courseReview[i].user_img = 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xfp1/v/t1.0-1/c0.1.200.200/p200x200/10710822_4837200824027_8896810305686034197_n.jpg?oh=7cac56ff27589abf2cc820b14d852d3d&oe=5634015F&__gda__=1441543593_09ae7ac2107cdd7c0be1b229abe62e18';
      }
      var avStar = Math.floor(total/$scope.courseReview.length+0.5);
      for (var i = avStar - 1; i >= 0; i--) {
        var content = "<img src='img/starfull.png'>";
        $('.stars').append(content);
      };
      for (var i = 5 - avStar - 1; i >= 0; i--) {
        var content = "<img src='img/starno.png'>";
        $('.stars').append(content);
      };
    });
  };
  $scope.scores = 3; 
  $scope.go = function(id){
    var offset = $(id).offset().top;
    $('html, body').animate({scrollTop:offset},1000);
  };
  $scope.giveScore = function(num){
    $('.starSelector img').each(function(index){
      if (index<=num-1) { $(this).attr('src', 'img/starfull.png');}
      else{$(this).attr('src', 'img/starno.png');}
    });
    $scope.scores = num;
  };
  $scope.resP;
  $scope.commit = function(){
    var postStuff = {
      course_id: $scope.courseContent.course_c_id,
      score: $scope.scores,
      comment: $scope.resP
    };
    $http.post('http://140.119.19.39:8000/score/',postStuff)
      .success(function(response){
        $scope.resP = '';
        console.log(response);
      });
  }
  $scope.cleanSearch = function(){
    location.assign('index.html');
  };

});

















