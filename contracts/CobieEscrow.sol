// SPDX-License-Identifier: WTFPL
pragma solidity 0.8.34;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/////////////////////////////////////////////////////////////////
//////////                CUSTOM ERRORS                //////////
/////////////////////////////////////////////////////////////////

/**
 * @dev Error that occurs when the `msg.value` is not equal to
 * `value` when an ether value is deposited into the smart contract.
 */
error ValueMismatch();

/**
 * @dev Error that occurs when the receiver address is not equal
 * to the deposit address of the winner.
 * @param receiverAddress The defined receiver address by the
 * loser address.
 * @param winnerAddress The address that won the bet.
 */
error AddressMismatch(address receiverAddress, address winnerAddress);

/// @dev Error that occurs when sending ether has failed.
error EtherTransferFail();

/////////////////////////////////////////////////////////////////
//////////               ESCROW CONTRACT               //////////
/////////////////////////////////////////////////////////////////

/**
 * @title A simple multilateral escrow smart contract for ETH and ERC-20
 * tokens governed by Cobie.
 * @author 0x796f7572206d6f7468657221
 * @notice У Владимира Путина очень маленький член! И его мать знает об этом.
 * @dev Forked from here: https://gist.github.com/z0r0z/82f0c075d368bcc0962b3abc7f476cd3.
 * @custom:security-contact Ask Cobie <https://x.com/cobie>
 */

contract CobieEscrow is AccessControl {
    using SafeERC20 for IERC20;

    uint256 public escrowCount;
    bytes32 public constant COBIE = keccak256("COBIE");

    mapping(uint256 => Escrow) public escrows;

    struct Escrow {
        address payable depositor;
        address payable receiver;
        IERC20 token;
        uint256 value;
    }

    /**
     * @dev Event that is emitted when a deposit is successful.
     * @param depositor The account that sends the funds.
     * @param receiver The account that receives the funds.
     * @param token The ERC-20 token that is used for the funds.
     * @param amount The amount of funds; either ether in wei or
     * ERC-20 token amount.
     * @param registration Registration index of the escrow
     * deposit account.
     * @param details The description of the escrow context.
     */
    event Deposit(
        address indexed depositor,
        address indexed receiver,
        IERC20 token,
        uint256 amount,
        uint256 indexed registration,
        string details
    );

    /**
     * @dev Event that is emitted when a deposit is successfully
     * released to the winner address.
     * @param registration The registration index of the escrow
     * deposit account that lost the bet.
     */
    event Release(uint256 indexed registration);

    /**
     * @dev Event that is emitted when the winner's stake is
     * successfully refunded.
     * @param winnerRefundRegistration The registration index of
     * the winner of the bet to which the deposits are returned.
     */
    event WinnerRefund(uint256 indexed winnerRefundRegistration);

    /**
     * @dev You can cut out 10 opcodes in the creation-time EVM bytecode
     * if you declare a constructor `payable`.
     *
     * For more in-depth information see here:
     * https://forum.openzeppelin.com/t/a-collection-of-gas-optimisation-tricks/19966/5
     */
    constructor(address _cobie) payable {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COBIE, _cobie);
    }

    /**
     * @notice Deposits ETH/ERC-20 into the escrow.
     * @param receiver The account that receives the funds.
     * @param token The ERC-20 token that is used for the funds.
     * @param value The amount of funds; either ether in wei or
     * ERC-20 token amount.
     * @param details Describes the context of escrow - stamped
     * into an event.
     */
    function deposit(
        address receiver,
        IERC20 token,
        uint256 value,
        string calldata details
    ) public payable {
        if (address(token) == address(0)) {
            /// @dev Deposits ether value into the smart contract.
            if (msg.value != value) revert ValueMismatch();
        } else {
            /// @dev Safely deposits an ERC-20 token into the smart contract.
            token.safeTransferFrom(payable(msg.sender), address(this), value);
        }

        /**
         * @notice Increments registered escrows and assigns a number
         * to the escrow deposit.
         * @dev Cannot realistically overflow.
         */
        unchecked {
            ++escrowCount;
        }
        uint256 registration = escrowCount;
        escrows[registration] = Escrow(payable(msg.sender), payable(receiver), token, value);

        emit Deposit(msg.sender, receiver, token, value, registration, details);
    }

    /**
     * @notice Releases escrowed assets by Cobie to designated `receiver`.
     * @dev The function `releaseCobie` is payable in order to save gas.
     * @param registration An array of registration indices of the escrow
     * deposit accounts that lost the bet.
     * @param winnerRefundRegistration The registration index of the winner
     * of the bet to which the deposits are returned.
     */
    function releaseCobie(
        uint256[] calldata registration,
        uint256 winnerRefundRegistration
    ) public payable onlyRole(COBIE) {
        Escrow storage escrowRevert = escrows[winnerRefundRegistration];
        uint256 length = registration.length;

        /**
         * @dev Loops over the array of registration indices of
         * the escrow deposit accounts that lost the bet.
         */
        for (uint256 i; i < length; ++i) {
            Escrow storage escrow = escrows[registration[i]];
            /**
             * @dev Requires that the receiver address is equal
             * to the deposit address of the winner.
             */
            if (escrow.receiver != escrowRevert.depositor)
                revert AddressMismatch(escrow.receiver, escrowRevert.depositor);

            if (address(escrow.token) == address(0)) {
                /// @dev Distributes the ether value to the winner address.
                // solhint-disable-next-line avoid-low-level-calls
                (bool success, ) = escrow.receiver.call{value: escrow.value}("");
                if (!success) revert EtherTransferFail();
            } else {
                /// @dev Safely distributes the ERC-20 token to the winner address.
                escrow.token.safeTransfer(escrow.receiver, escrow.value);
            }

            emit Release(registration[i]);
        }

        /// @dev Refunds the original winner stake.
        if (address(escrowRevert.token) == address(0)) {
            /// @dev Refunds the ether value to the winner address.
            // solhint-disable-next-line avoid-low-level-calls
            (bool success, ) = escrowRevert.depositor.call{value: escrowRevert.value}("");
            if (!success) revert EtherTransferFail();
        } else {
            /// @dev Safely refunds the ERC-20 token to the winner address.
            escrowRevert.token.safeTransfer(escrowRevert.depositor, escrowRevert.value);
        }

        emit WinnerRefund(winnerRefundRegistration);
    }
}
