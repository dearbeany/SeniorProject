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

  //4?????? ???????????? ????????? ?????????
  buyRealEstate: function () {
    var id = $('#id').val();
    var price = $('#price').val();
    var name = $('#name').val();
    var phone = $('#phone').val();
    /* ????????? ????????? ?????? ??????
    console.log(id);
    console.log(price);
    console.log(name);
    console.log(age);
    */

    //web3.eth.getAccounts(function(error, accounts) {
    ethereum.enable().then(function (accounts) { //??????????????? ?????? ?????? ??????
//      if(error) {
//        console.log(error);
//      }

      var account = accounts[0]; //?????? ?????? ??? ??? ?????? ????????? ???????????? account??? ??????
        //???????????? ?????????????????? ????????? ??????
      App.contracts.RealEstate.deployed().then(function(instance) {
        var nameUtf8Encoded = utf8.encode(name); //??????????????? ????????? ???????????? ???????????????
        return instance.buyRealEstate(id, web3.toHex(nameUtf8Encoded), phone, { from: account, value: price }); //value: ???????????? ????????? ??????
      }).then(function() {
        //?????? ??? ?????? empty ????????????
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
      //?????? ?????? ????????? ??????
      for(i = 0; i < buyers.length; i++) {
        
        if(buyers[i] !== '0x0000000000000000000000000000000000000000') { //????????? ??? ????????? ?????? ??????(????????? ?????? ??????)
          var imgType = $('.panel-realEstate').eq(i).find('img').attr('src').substr(8,2); //?????? ui??? ????????? 10??? ??????. ????????? ????????? img????????? ?????????????????? ????????? (ex. apratement.jpg)

          switch(imgType) {
            case '00':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/a00_sold.png')
              break;
            case '01':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/a01_sold.png')
              break;
            case '02':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/a02_sold.png')
              break;
            case '03':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/a03_sold.png')
              break;
            case '04':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/v04_sold.png')
              break;     
            case '05':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/v05_sold.png')
              break;    
            case '06':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/v06_sold.png')
              break;
            case '07':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/v07_sold.png')
              break;  
            case '08':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/h08_sold.png')
              break;
            case '09':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/h09_sold.png')
              break;
            case '10':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/h10_sold.png')
              break;
            case '11':
              $('.panel-realEstate').eq(i).find('img').attr('src', 'images/h11_sold.png')
              break;  
          }
        
        $('.panel-realEstate').eq(i).find('.btn-buy').text('Sold Out').attr('disabled', true);
        $('.panel-realEstate').eq(i).find('.btn-buyerInfo').removeAttr('style'); //?????? ??? ????????? ?????? ?????? ???????????????
        }
      }
    }).catch(function (err) {
      console.log(err.message);
    })
  },

  listenToEvents: function () {
    var idx = 0;
    App.contracts.RealEstate.deployed().then(function (instance) {
      instance.LogBuyRealEstate({}, { fromBlock: 0, toBlock: 'latest' }).watch(function (error, event) {
        if (!error) {
          idx++;
          $('#events').append('<p>' + '[ No.' + idx + ' ] ' + event.args._buyer + ' ???????????? ' + event.args._id + ' ??? ????????? ??????????????????.' + '</p>');
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

  //????????? ?????? ?????? ?????? ??? ?????? ?????? ????????? ?????? ?????????
  $('#buyerInfoModal').on('show.bs.modal', function (e) {
    var id = $(e.relatedTarget).parent().find('.id').text();
    
    App.contracts.RealEstate.deployed().then(function(instance) {
      return instance.getBuyerInfo.call(id);
    }).then(function(buyerInfo) {

      $(e.currentTarget).find('#buyerAddress').text(buyerInfo[0]); //????????????
      $(e.currentTarget).find('#buyerName').text(web3.toUtf8(buyerInfo[1])); //????????? ??????
      $(e.currentTarget).find('#buyerPhone').text("0" + buyerInfo[2]); //????????? ?????????

      
    }).catch(function(err) {
      console.log(err.message);
    })
  });
});