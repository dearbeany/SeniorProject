const Web3 = require("web3")

App = {
  web3Provider: null,
  contracts: {},

  init: function () {
    $.getJSON('../real-estate.json', function (data) {
      var apartment = $('#apartment');
      var template = $('#template');

      for (i = 0; i < 4; i++) {
        template.find('img').attr('src', data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.address').text(data[i].address);
        template.find('.type').text(data[i].type);
        template.find('.area').text(data[i].area);
        template.find('.price').text(data[i].price);

        apartment.append(template.html());
      }
      var villa = $('#villa');
      for (i = 4; i < 8; i++) {
        template.find('img').attr('src', data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.address').text(data[i].address);
        template.find('.type').text(data[i].type);
        template.find('.area').text(data[i].area);
        template.find('.price').text(data[i].price);

        villa.append(template.html());
      }
      var house = $('#house');
      for (i = 8; i < 12; i++) {
        template.find('img').attr('src', data[i].picture);
        template.find('.id').text(data[i].id);
        template.find('.address').text(data[i].address);
        template.find('.type').text(data[i].type);
        template.find('.area').text(data[i].area);
        template.find('.price').text(data[i].price);

        house.append(template.html());
      }
    });
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function () {
    $.getJSON('RealEstate.json', function (data) {
      App.contracts.RealEstate = TruffleContract(data);
      App.contracts.RealEstate.setProvider(App.web3Provider);
      App.listenToEvents();
    });
  },

  //4개의 데이터를 변수로 받아옴
  buyRealEstate: function () {
    var id = $('#id').val();
    var price = $('#price').val();
    var name = $('#name').val();
    var phone = $('#phone').val();
    /* 콘솔로 데이터 전달 확인
    console.log(id);
    console.log(price);
    console.log(name);
    console.log(age);
    */

    //web3.eth.getAccounts(function(error, accounts) {
    ethereum.enable().then(function (accounts) { //메타마스크 버전 변경 문제
//      if(error) {
//        console.log(error);
//      }

      var account = accounts[0]; //여러 계정 중 첫 번째 계정을 선택해서 account에 담음
        //컨트랙의 매물구입함수 데이터 넘김
      App.contracts.RealEstate.deployed().then(function(instance) {
        var nameUtf8Encoded = utf8.encode(name); //매입자이름 한글에 대비하여 인코딩시킴
        return instance.buyRealEstate(id, web3.toHex(nameUtf8Encoded), phone, { from: account, value: price }); //value: 매입가를 함수로 보냄
      }).then(function() {
        //모달 창 필드 empty 리셋시킴
        $('#name').val('');
        $('#age').val('');  
        $('#buyModal').modal('hide');
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  
  loadRealEstates: function () {
    App.contracts.RealEstate.deployed().then(function(instance) {
      return instance.getAllBuyers.call();
    }).then(function(buyers) {
      //팔린 경우 이미지 변경
      for(i = 0; i < buyers.length; i++) {
        
        console.log(buyers.length);
        if(buyers[i] !== '0x0000000000000000000000000000000000000000') { //배열에 빈 주소가 없을 경우(매물이 팔린 경우)
          var imgType = $('.panel-realEstate').eq(i).find('img').attr('src').substr(7); //현재 ui의 템플릿 10개 있음. 판매된 매물의 img이름만 슬라이싱하여 가져옴 (ex. apratement.jpg)

          switch(imgType) {
            case 'apartment.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/apartment_sold.jpg')
              break;
            case 'townhouse.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/townhouse_sold.jpg')
              break;
            case 'house.jpg':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/house_sold.jpg')
              break;   
          }
        
        $('.panel-realEstate').eq(i).find('.btn-buy').text('Sold Out').attr('disabled', true);
        $('.panel-realEstate').eq(i).find('.btn-buyerInfo').removeAttr('style'); //매각 후 매입자 정보 버튼 보이도록함
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    })
  },

  listenToEvents: function () {
    App.contracts.RealEstate.deployed().then(function(instance) {
      instance.LogBuyRealEstate({}, { fromBlock: 0, toBlock: 'latest'}).watch(function(error, event) {
        if(!error) {
          $('#events').append('<p>' + event.args._buyer + ' 계정에서 ' + event.args._id + ' 번 매물을 매입했습니다.' + '</p>');
        } else {
          console.log(error);
        }
        App.loadRealEstates();
      })
    })
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });

  $('#buyModal').on('show.bs.modal', function (e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
    var price = web3.toWei(parseFloat($(e.relatedTarget).parent().find('.price').text() || 0), "ether");

    $(e.currentTarget).find('#id').val(id);
    $(e.currentTarget).find('#price').val(price);
  })

  //매입자 정보 버튼 클릭 시 모달 안에 매입자 정보 보여줌
  $('#buyerInfoModal').on('show.bs.modal', function (e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
    
    App.contracts.RealEstate.deployed().then(function(instance) {
      return instance.getBuyerInfo.call(id);
    }).then(function(buyerInfo) {

      $(e.currentTarget).find('#buyerAddress').text(buyerInfo[0]); //계정주소
      $(e.currentTarget).find('#buyerName').text(web3.toUtf8(buyerInfo[1])); //매입자 이름
      $(e.currentTarget).find('#buyerPhone').text("0" + buyerInfo[2]); //매입자 연락처

      
    }).catch(function(err) {
      console.log(err.message);
    })
  });
});