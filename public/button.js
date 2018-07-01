$(document).ready(function(){
  $(".dropdown").on("hide.bs.dropdown", function(){
    $(".btn").text("圖示");
  });
  $(".dropdown").on("show.bs.dropdown", function(){
    $(".btn").text("展開");
  });
});