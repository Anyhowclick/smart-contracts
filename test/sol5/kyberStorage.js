const KyberStorage = artifacts.require("KyberStorage.sol");
const MockReserve = artifacts.require("MockReserve.sol");

const Helper = require("../helper.js");
const nwHelper = require("./networkHelper.js");

const BN = web3.utils.BN;
const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

let MAX_APPROVED_PROXIES = new BN(2);
let network;
let admin;
let operator;
let kyberStorage;
contract('KyberStorage', function(accounts) {

    before("init constructor", async ()=>{
        network= accounts[1];
        admin = accounts[2];
        operator = accounts[3];
        kyberStorage = await KyberStorage.new(network);
    });

    describe("test adding / removing proxy.", async() => {
        let proxy1 = accounts[9];
        let proxy2 = accounts[8];
        let proxy3 = accounts[7];
        let tempStorage;

        beforeEach("create storage", async() => {
            tempStorage= await KyberStorage.new(network);
        });

        it("test can add max two proxies", async() => {
            await tempStorage.addKyberProxy(proxy1, MAX_APPROVED_PROXIES, {from: network});
            await tempStorage.addKyberProxy(proxy2, MAX_APPROVED_PROXIES, {from: network});

            await expectRevert(
                tempStorage.addKyberProxy(proxy3, MAX_APPROVED_PROXIES, {from: network}),
                "Max proxy"
            );
        });

        it("test only admin can add proxies", async() => {
            await expectRevert(
                tempStorage.addKyberProxy(proxy1, MAX_APPROVED_PROXIES, {from: accounts[0]}),
                "Only network"
            );
        });
    });

    describe("test adding reserve.", async() => {
        let reserve;
        let tempStorage;

        before("deploy and setup 1 mock reserve", async() => {
            //init 1 mock reserve
            let result = await nwHelper.setupReserves(network, [], 1,0,0,0, accounts, admin, operator);
            reserveInstances = result.reserveInstances;
            numReserves = result.numAddedReserves * 1;
            for (const value of Object.values(reserveInstances)) {
                reserve = value;
            }
        });


        describe("test cases where reserve has never been added", async() => {
            before("init storage", async() => {
                tempStorage = await KyberStorage.new(network);
            });

            it("should revert for zero reserve id", async() => {
                let zeroReserveId = "0x0";
                await expectRevert(
                    tempStorage.addReserve(reserve.address, zeroReserveId, {from: network}),
                    "reserveId = 0"
                );
            });

            it("test add reserve successful", async() => {
                await tempStorage.addReserve(reserve.address, reserve.reserveId, {from: network});
            });
        });


        describe("test cases for an already added reserve", async() => {
            before("init storage and add reserve", async() => {
                tempStorage = await KyberStorage.new(network);
                await tempStorage.addReserve(reserve.address, reserve.reserveId, {from: network});
            });

            it("should revert for adding an existing reserve", async() => {
                await expectRevert(
                    tempStorage.addReserve(reserve.address, reserve.reserveId, {from: network}),
                    "reserve has id"
                );
            });

            it("should revert for a new reserve with an already taken reserve id", async() => {
                let newReserve = await MockReserve.new();
                await expectRevert(
                    tempStorage.addReserve(newReserve.address, reserve.reserveId, {from: network}),
                    "reserveId taken"
                );
            });

            it("should be able to re-add a reserve after its removal", async() => {
                await tempStorage.removeReserve(reserve.address, new BN(0), {from: network});
                await tempStorage.addReserve(reserve.address, reserve.reserveId, {from: network});
            });
        });
    });
    
});