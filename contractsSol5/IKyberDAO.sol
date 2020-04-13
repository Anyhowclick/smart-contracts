pragma solidity 0.5.11;


interface IKyberDAO {
    function EPOCH_PERIOD_SECONDS() external view returns(uint);
    function FIRST_EPOCH_START_TIMESTAMP() external view returns(uint);

    function vote(uint campID, uint option) external;

    function handleWithdrawal(address staker, uint penaltyAmount) external returns(bool);
    function shouldBurnRewardForEpoch(uint epoch) external view returns(bool);
    function getLatestNetworkFeeData() external view returns(uint feeInBps, uint expiryBlockNumber);
    function getLatestNetworkFeeDataWithCache() external returns(uint feeInBps, uint expiryBlockNumber);
    function getLatestBRRData() external
        returns(uint burnInBps, uint rewardInBps, uint rebateInBps, uint epoch, uint expiryBlockNumber);
}
