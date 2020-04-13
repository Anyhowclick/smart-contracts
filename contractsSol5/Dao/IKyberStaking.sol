pragma solidity 0.5.11;


interface IKyberStaking {
    function EPOCH_PERIOD_SECONDS() external view returns(uint);
    function FIRST_EPOCH_START_TIMESTAMP() external view returns(uint);
    function initAndReturnStakerDataForCurrentEpoch(address staker)
        external returns(uint _stake, uint _delegatedStake, address _delegatedAddress);
    function getStakerDataForPastEpoch(address staker, uint epoch)
        external view returns(uint _stake, uint _delegatedStake, address _delegatedAddress);
}
