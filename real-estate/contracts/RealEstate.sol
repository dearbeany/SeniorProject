// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract RealEstate {
    struct Buyer {
        address buyerAddress;
        string name;
        string email;
    }

    mapping(uint256 => Buyer) public buyerInfo; //매입자 정보를 불러오는 함수
    address public owner;
    address[10] public buyers; //매물이 10개이므로 살 수 있는 사람도 10개로 고정

    // 몇번 계정에서 매입을 했다는 기록 로그 보여주기
    event LogBuyRealEstate(address _buyer, uint256 _id);

    constructor() public {
        owner = msg.sender;
    }

    function buyRealEstate(
        uint256 _id,
        string memory _name,
        string memory _email
    ) public payable {
        //매개변수=매입자 정보
        require(_id >= 0 && _id <= 9); //유효성 체크. 매개변수로 받은 매물의 아이디 0~9 사이
        buyers[_id] = msg.sender; //msg.sender가 현재 이 함수를 사용하고 있는 계정
        buyerInfo[_id] = Buyer(msg.sender, _name, _email); //매입자 정보를 struct에 저장

        address(uint160(owner)).transfer(msg.value);
        emit LogBuyRealEstate(msg.sender, _id);
    }

    function getBuyerInfo(uint256 _id)
        public
        view
        returns (
            address,
            string memory,
            string memory
        )
    {
        Buyer memory buyer = buyerInfo[_id];
        return (buyer.buyerAddress, buyer.name, buyer.email);
    } // read only

    function getAllBuyers() public view returns (address[10] memory) {
        return buyers;
    }
}